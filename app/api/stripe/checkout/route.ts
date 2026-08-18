import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ensureSchema, getSql, TERMS_VERSION } from "../../../../lib/db";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const form = await request.formData();
  const paymentOption = form.get("paymentOption");
  if (paymentOption !== "annual" && paymentOption !== "installments") return new Response("Select a payment option.", { status: 400 });
  if (form.get("termsAccepted") !== "yes" || form.get("billingConsent") !== "on" || form.get("termsVersion") !== TERMS_VERSION) return new Response("You must accept the current membership and payment terms.", { status: 400 });

  const user = await currentUser();
  const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user?.emailAddresses[0]?.emailAddress;
  if (!email) return new Response("Account email unavailable", { status: 400 });
  const key = process.env.STRIPE_SECRET_KEY;
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!key || !base) return new Response("Stripe environment variables are not configured", { status: 503 });

  await ensureSchema();
  const sql = getSql();
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const agent = h.get("user-agent") || null;
  await sql`INSERT INTO membership_acceptances (id,clerk_user_id,email,terms_version,ip_address,user_agent) VALUES (${crypto.randomUUID()},${userId},${email.toLowerCase()},${TERMS_VERSION},${ip},${agent})`;
  await sql`INSERT INTO memberships (clerk_user_id,email,status) VALUES (${userId},${email.toLowerCase()},'pending') ON CONFLICT (clerk_user_id) DO UPDATE SET email=EXCLUDED.email,updated_at=now()`;

  const stripe = new Stripe(key);
  const common = { client_reference_id: userId, customer_email: email, success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${base}/membership?payment=cancelled` };

  if (paymentOption === "annual") {
    const session = await stripe.checkout.sessions.create({
      ...common,
      mode: "payment",
      line_items: [{ price_data: { currency: "usd", unit_amount: 52988, product_data: { name: "Pacifica annual membership — paid in full" } }, quantity: 1 }],
      metadata: { clerk_user_id: userId, terms_version: TERMS_VERSION, billing_plan: "annual_52988" },
    });
    redirect(session.url!);
  }

  const session = await stripe.checkout.sessions.create({
    ...common,
    mode: "subscription",
    line_items: [
      { price_data: { currency: "usd", unit_amount: 3999, recurring: { interval: "month" }, product_data: { name: "Pacifica annual membership installment" } }, quantity: 1 },
      { price_data: { currency: "usd", unit_amount: 5000, product_data: { name: "Enrollment fee" } }, quantity: 1 },
    ],
    metadata: { clerk_user_id: userId, terms_version: TERMS_VERSION, billing_plan: "50_plus_12x3999" },
    subscription_data: { metadata: { clerk_user_id: userId, terms_version: TERMS_VERSION, billing_plan: "50_plus_12x3999" } },
  });
  redirect(session.url!);
}
