# Pacifica Legal Insurance

Production Next.js application for Pacifica Legal Insurance.

## Vercel setup

1. Upload this project to the `pacificalegal/Pacifica` repository.
2. Add every value from `.env.example` in Vercel Project Settings → Environment Variables.
3. Set `NEXT_PUBLIC_APP_URL` to the final Vercel or custom-domain URL.
4. Create a live Stripe webhook at `/api/stripe/webhook` for `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted`.
5. Save its signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel.
6. Redeploy after environment variables are saved.

The checkout creates both $529.88 payment choices directly in Stripe, so no Stripe Price ID is required.

Never commit secret keys to GitHub.
