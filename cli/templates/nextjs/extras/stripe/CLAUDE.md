# Project Instructions

## Billing

- `lib/billing.ts` — Typed billing helper functions (plan checks, subscription status)
- `app/dashboard/billing/page.tsx` — Billing page with plan display and upgrade flow (renders inside the dashboard shell from the better-auth extra)
- Stripe is integrated through the auth provider — do not import Stripe SDK directly in pages or components
- Mock plan IDs (`price_*_placeholder`) must be replaced with real Stripe price IDs before deploying
