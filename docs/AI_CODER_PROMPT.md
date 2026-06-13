# Prompt For AI Coder

You are building the full `ميزاني / mymizan` DTC ecommerce store and backend from this repository. Treat the `docs/` folder as the source of truth and read every file before coding.

Critical scope rule: this is a multi-product branded DTC store, not a single-product funnel. Do not stop after one landing page. Build the complete site and all three product landing pages before calling the project done.

Required docs to read first:

- `docs/00-project-architecture.md`
- `docs/01-brand-positioning-icp.md`
- `docs/02-site-architecture-ux.md`
- `docs/03-copywriting-cro-arabic.md`
- `docs/04-product-pages-offers.md`
- `docs/05-design-system.md`
- `docs/06-frontend-implementation.md`
- `docs/07-backend-implementation.md`
- `docs/08-tracking-pixels-capi.md`
- `docs/09-checkout-orders-sheets.md`
- `docs/10-deployment-easypanel.md`
- `docs/11-ai-coder-rules.md`
- `docs/12-env-examples.md`
- `docs/13-scientific-proof-authority.md`

## Deliverables

Build a production-ready repo with:

- `frontend/`: Next.js App Router, React, TypeScript, Tailwind, Arabic RTL storefront.
- `backend/`: Python FastAPI, PostgreSQL, SQLAlchemy 2, Alembic, order API, Google Sheets forwarding, Meta/TikTok/Snap CAPI.
- `sheets/google-apps-script-webhook.js`: standalone Google Apps Script webhook for Sheets.
- `frontend/.env.example` and `backend/.env.example`.
- Dockerfile for frontend and backend.
- Optional local `docker-compose.yml` if useful.
- Alembic migrations that run automatically on backend startup when `RUN_MIGRATIONS_ON_STARTUP=true`.
- Responsive pages: Home, About Us, Contact Us, Collection, 3 product pages, Thank You, Privacy, Terms, Shipping/Returns.

Required frontend routes:

- `/`
- `/collections`
- `/products/d3-k2-gummies`
- `/products/sleep-tea`
- `/products/probiotic-fiber-gummies`
- `/about`
- `/contact`
- `/thank-you`
- `/privacy`
- `/terms`
- `/shipping-returns`

## Brand And Market

- Brand Arabic: `ميزاني`.
- Brand English: `mymizan`.
- Store domain: `https://mymizan.shop`.
- API domain: `https://api.mymizan.shop`.
- Target market: Saudi Arabia, Arabic RTL, mobile-first women-focused DTC wellness.
- Store must feel like a premium owned brand, not a dropshipping marketplace.
- Use placeholder images where product, hero, collection, UGC, or ingredient visuals are needed.

Header requirement:

- Right side brand mark.
- `M` inside a circle using the primary brand color.
- Beside it Arabic text `ميزاني`.
- Under Arabic text, small English `mymizan`.
- Then menu links and cart.

Design direction:

- Premium wellness, trustworthy, warm, Saudi-appropriate.
- Use palette and component rules from `docs/05-design-system.md`.
- Desktop sections should alternate text/image layout.
- Mobile must be fast and conversion-focused.

## Products And Offers

Products:

- `d3-k2-gummies`: `حلوى فيتامين D3 و K2`
- `sleep-tea`: `شاي الأشواغاندا والمغنيسيوم`
- `probiotic-fiber-gummies`: `حلوى البروبيوتيك والألياف`

Every product uses the same offer ladder:

- 1 piece: `199 SAR`
- 2 pieces: `279 SAR`
- 3 pieces: `349 SAR`

Default selected offer on product pages should be 3 pieces to increase AOV, while still letting customers choose.

Upsell:

- Only after valid checkout form submit.
- Show for 10-15 seconds.
- Relevant cross-product offer at `99 SAR`.
- This is the only discounted placement.

## Frontend Conversion Flow

Implement:

- Product landing cards with headline, subtitle, stars, scarcity/trust copy, offer selector, CTA.
- CTA adds selected offer to cart and opens cart drawer immediately.
- Cart drawer shows selected items, savings copy, trust badges, and cross-sells.
- Cart checkout button opens checkout popup.
- Checkout popup includes order summary, social proof, scarcity, COD trust, and only two form fields: name and Saudi phone.
- Phone validation accepts `05XXXXXXXX`, `5XXXXXXXX`, `9665XXXXXXXX`, `+9665XXXXXXXX` and normalizes to `+9665XXXXXXXX`.
- After valid form submit, show upsell modal.
- After upsell accept/decline, send one final `POST /orders`.
- Redirect to Thank You page with order number and confirmation/delivery instructions.

Do not create a pending order before upsell in this first production version.

The Home Page must prominently feature and link to all three products. Each product page must use product-specific copy, not duplicated generic sections with only the name changed.

## Backend Requirements

- Database name: `mymizan`.
- Use `DATABASE_URL` from env as source of truth.
- Do not commit real database credentials.
- Backend must recalculate all prices server-side from trusted product config.
- Reject tampered totals or invalid product IDs.
- Store orders, items, event ids, attribution fields, integration statuses, and customer phone normalized as E.164/digits.
- If DB write fails, order fails.
- If Google Sheets or CAPI fails after DB write, order still succeeds and failures are logged.
- Add `GET /health`.
- Add `POST /orders`.
- Add event/CAPI service modules as described in docs.

## Google Sheets

Use CSV templates in `docs/sheets/` for tab columns:

- `Orders`
- `Items`
- `EventLogs`
- `Products`

Create `sheets/google-apps-script-webhook.js`:

- Accept POST JSON from backend.
- Verify shared secret using query/body secret because Apps Script custom headers can be unreliable.
- Append order and item rows.
- Return JSON.

## Pixels And CAPI

Implement browser pixels deferred for speed:

- Meta Pixel
- TikTok Pixel
- Snapchat Pixel

Implement backend CAPI:

- Meta Conversions API.
- TikTok Events API endpoint `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`.
- Snapchat Conversions API using current Snap v3 docs and mappings in `docs/08-tracking-pixels-capi.md`.

Deduplication:

- Meta: browser `eventID` must match server `event_id`; event names must match.
- TikTok: browser/server `event_id` must match; use `CompletePayment` for purchase.
- Snap: browser `client_dedup_id` must match CAPI `event_id`; for purchase also map Pixel `transaction_id` to CAPI `custom_data.order_id`.

Hashing:

- Web pixels do not need hashing.
- Backend CAPI hashes PII server-side.
- Meta phone hash input: digits only `9665XXXXXXXX`.
- Snap phone hash input: digits only `9665XXXXXXXX`.
- TikTok phone hash input: E.164 with plus `+9665XXXXXXXX`.
- Use SHA-256 lowercase hex.
- Never expose CAPI tokens in frontend.

Capture and send attribution:

- landing URL, referrer, UTM fields.
- `fbp`, `fbc`.
- `_ttp`, `ttclid`.
- Snap click id parameters if present.
- user agent and backend client IP.

## Claims, Authority, And CRO

Do not make medical cure claims. Use support language only:

- `يدعم`
- `يساعد`
- `ضمن روتين يومي`
- `قد تختلف النتائج من شخص لآخر`

Avoid:

- `يعالج`
- `يقضي على`
- `مضمون`
- disease prevention/cure promises.

Build authority with:

- Ingredient education.
- Safety disclaimers.
- FAQ.
- COD and confirmation before shipping.
- WhatsApp support.
- Saudi-style reviews and UGC placeholders.
- Clear usage and warnings.
- No fake certifications. Do not claim SFDA/GMP/lab-tested/doctor-recommended unless real proof is supplied.

## Env And Deployment

Create `.env.example` files exactly as described in `docs/12-env-examples.md`.

EasyPanel production:

- Frontend domain: `mymizan.shop`.
- Backend domain: `api.mymizan.shop`.
- PostgreSQL is already installed.
- Put real `DATABASE_URL`, pixel ids, CAPI tokens, and webhook secrets only in EasyPanel env settings.

Docker:

- `frontend/Dockerfile` exposes `3000`.
- `backend/Dockerfile` exposes `80`.
- Backend starts Uvicorn and runs Alembic migrations on startup if enabled.

## Implementation Priorities

1. Build complete frontend pages and conversion flow.
2. Build backend order creation, DB models, migrations, and trusted price validation.
3. Add Google Sheets webhook forwarding and Apps Script file.
4. Add browser pixels and backend CAPI with env-controlled enablement.
5. Add Docker/EasyPanel readiness.
6. Verify locally.

## Done Definition

The project is done only when:

- `frontend/` runs locally.
- `backend/` runs locally.
- Docker builds for both apps.
- All required pages exist and are responsive RTL.
- All 3 product pages work.
- Home page features all 3 products and links to each product page.
- Collection page lists all 3 products.
- About, Contact, Thank You, Privacy, Terms, and Shipping/Returns pages exist.
- Add-to-cart opens cart drawer.
- Cart cross-sells work.
- Checkout modal validates Saudi phone correctly.
- Upsell modal works before final order creation.
- Backend stores order in Postgres.
- Backend recalculates totals and rejects tampering.
- Order forwards to Google Sheets webhook.
- Meta/TikTok/Snap browser pixels and backend CAPI code exist with dedup ids.
- `.env.example` files contain placeholders only.
- No real secrets are committed.
