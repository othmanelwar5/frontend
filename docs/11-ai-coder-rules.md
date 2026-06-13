# AI Coder Rules

## Build Principles

- Follow the docs in this folder as the source of truth.
- Build implementation, not more plans.
- Keep the storefront Arabic-first and RTL.
- Do not expose secrets in frontend or committed files.
- Do not make medical cure claims.
- Prioritize conversion speed, trust, and mobile UX.

## Code Quality

Frontend:

- TypeScript strict mode.
- Reusable components.
- Product data centralized.
- Server components by default.
- Client components only where interactivity is required.
- Tailwind classes should be readable and consistent.

Backend:

- Pydantic validation on all request bodies.
- Server-side price recalculation.
- Alembic migrations.
- Structured services for orders, Sheets, and CAPI.
- Outgoing integrations logged.
- CAPI failures should not break customer checkout.

## Security Rules

- Never commit actual `DATABASE_URL`, CAPI access tokens, Google webhook URLs, or secrets.
- `.env.example` only contains placeholders.
- Backend validates all totals and phone numbers.
- CORS production origin must be limited to `https://mymizan.shop`.
- Hash customer identifiers server-side before CAPI.

## CRO Rules

- Every product page must have repeated CTAs.
- Cart must open after add-to-cart.
- Cart must show cross-sells.
- Checkout has only name and phone.
- Upsell appears after valid form submission, before final order creation.
- Thank-you page must improve confirmation rate.

## Claim Rules

Use:

- `يدعم`
- `يساعد`
- `ضمن روتين يومي`
- `قد تختلف النتائج من شخص لآخر`

Avoid:

- `يعالج`
- `يقضي على`
- `مضمون`
- `بديل للطبيب`
- disease cure or prevention claims.

## Testing Expectations

Frontend:

- Add unit tests for phone normalization and cart totals if test setup exists.
- Manually test mobile product page, cart, checkout, upsell, thank-you.

Backend:

- Test phone validation.
- Test price recalculation rejects tampering.
- Test order creation.
- Test webhook payload creation.
- Test hashing helpers.

## Done Definition

The build is done only when:

- `frontend/` runs locally.
- `backend/` runs locally.
- Docker builds for both.
- `.env.example` exists for both.
- Product pages exist for all 3 products.
- Cart drawer and checkout popup work.
- Upsell flow works.
- Backend stores order in Postgres.
- Backend sends order to Sheets webhook.
- CAPI service code exists for Meta/TikTok/Snap with env-controlled enablement.
- Docs remain in repo.
