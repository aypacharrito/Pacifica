import Stripe from "stripe";
import { ensureSchema, getSql } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!key || !secret || !signature) return new Response("Webhook is not configured", { status: 503 });
  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return new Response("Invalid signature", { status: 400 }); }

  await ensureSchema();
  const sql = getSql();
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id || session.metadata?.clerk_user_id;
    if (userId) await sql`INSERT INTO memberships (clerk_user_id,email,stripe_customer_id,stripe_subscription_id,status,updated_at) VALUES (${userId},${session.customer_details?.email || ''},${String(session.customer || '')},${String(session.subscription || '')},${session.payment_status === 'paid' ? 'active' : 'pending'},now()) ON CONFLICT (clerk_user_id) DO UPDATE SET email=EXCLUDED.email,stripe_customer_id=EXCLUDED.stripe_customer_id,stripe_subscription_id=EXCLUDED.stripe_subscription_id,status=EXCLUDED.status,updated_at=now()`;
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
    const parentSubscription = invoice.parent?.type === "subscription_details" ? invoice.parent.subscription_details?.subscription : null;
    const rawSubscription = parentSubscription || invoice.subscription;
    const subscriptionId = typeof rawSubscription === "string" ? rawSubscription : rawSubscription?.id;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.metadata.billing_plan === "50_plus_12x3999") {
        const invoices = await stripe.invoices.list({ subscription: subscriptionId, status: "paid", limit: 100 });
        const paidInstallments = invoices.data.filter(item => item.billing_reason === "subscription_create" || item.billing_reason === "subscription_cycle").length;
        if (paidInstallments >= 12) await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.clerk_user_id;
    if (userId) await sql`UPDATE memberships SET status=${subscription.status},stripe_customer_id=${String(subscription.customer)},stripe_subscription_id=${subscription.id},updated_at=now() WHERE clerk_user_id=${userId}`;
  }
  return new Response("ok");
}
