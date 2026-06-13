# Backend Implementation

## Stack

Use:

- Python 3.12+.
- FastAPI.
- Uvicorn.
- Pydantic v2 / pydantic-settings.
- SQLAlchemy 2.0.
- Alembic.
- PostgreSQL.
- HTTPX for outgoing webhooks and CAPI.
- Tenacity for retrying transient outgoing requests.

## Folder Structure

```text
backend/
  app/
    __init__.py
    main.py
    core/
      config.py
      security.py
      logging.py
    db/
      base.py
      session.py
      migrations.py
    models/
      order.py
      event_log.py
    schemas/
      order.py
      tracking.py
    services/
      orders.py
      sheets.py
      capi_meta.py
      capi_tiktok.py
      capi_snap.py
      hashing.py
      phone.py
    api/
      routes/
        health.py
        orders.py
        events.py
  alembic/
  alembic.ini
  requirements.txt
  Dockerfile
  .env.example
```

## Environment Variables

Create `backend/.env.example`:

```env
APP_ENV=production
API_BASE_URL=https://api.mymizan.shop
FRONTEND_ORIGIN=https://mymizan.shop

DATABASE_URL=postgresql+psycopg://mymizan:CHANGE_ME@mymizan_database:5432/mymizan
RUN_MIGRATIONS_ON_STARTUP=true

ORDER_WEBHOOK_URL=
ORDER_WEBHOOK_SECRET=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=

SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=

CAPI_ENABLED=true
CAPI_TEST_MODE=false
```

Do not commit real credentials. The user provided a database URL containing a password; keep it out of committed docs and examples except as a local EasyPanel secret.

## Database

Database name: `mymizan`.

Implementation decision:

- Use `DATABASE_URL` from env as the source of truth.
- The production EasyPanel/Postgres database must match the final env value.
- Do not commit the real URL or password. The URL belongs only in EasyPanel environment variables.

## Migration On Startup

Use FastAPI lifespan:

- On startup, if `RUN_MIGRATIONS_ON_STARTUP=true`, run Alembic `upgrade head`.
- Fail fast if migrations fail.
- Log migration start and finish.

Do not use `Base.metadata.create_all()` as the primary migration strategy except in early local prototypes. Alembic is required.

## CORS

Allow:

- `https://mymizan.shop`
- local dev origins.

Do not use `allow_origins=["*"]` with credentials in production.

## Order Schema

Order fields:

- `id`: UUID.
- `order_number`: human-readable unique string, e.g. `MYM-20260606-0001`.
- `customer_name`.
- `phone_e164`: `+9665XXXXXXXX`.
- `phone_digits`: `9665XXXXXXXX`.
- `items`: JSON array.
- `subtotal_sar`.
- `discount_sar`.
- `total_sar`.
- `currency`: `SAR`.
- `payment_method`: `cod`.
- `status`: `new`, `sent_to_sheet`, `sheet_failed`, `confirmed`, `cancelled`.
- `upsell_offered_product_id`.
- `upsell_accepted`: boolean.
- `event_id_purchase`.
- `event_ids`: JSON object for browser/server dedup.
- `landing_page_url`.
- `referrer`.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- `fbp`, `fbc`.
- `ttp`, `ttclid`.
- `snap_click_id` if available.
- `client_ip`.
- `user_agent`.
- `raw_payload`: JSON for debugging.
- `created_at`, `updated_at`.

Order item fields:

- `product_id`.
- `product_name_ar`.
- `slug`.
- `quantity`.
- `offer_price_sar`.
- `unit_original_price_sar`.
- `is_upsell`.

## Event Log Schema

Store outgoing CAPI/webhook events:

- `id`.
- `order_id`.
- `platform`: `meta`, `tiktok`, `snap`, `sheet`.
- `event_name`.
- `event_id`.
- `request_payload`: JSON.
- `response_status`.
- `response_body`.
- `success`.
- `created_at`.

## POST /orders

Input:

- customer name.
- normalized phone from frontend.
- cart items.
- totals.
- upsell data.
- event ids.
- attribution data.
- page URL/referrer.

Backend must:

1. Validate KSA phone again.
2. Recalculate totals server-side from trusted product/offer config.
3. Reject mismatched totals.
4. Create order in DB.
5. Send order to Google Sheet webhook.
6. Send CAPI purchase/lead events if enabled.
7. Return order number and thank-you data.

Never trust frontend prices.

## Product/Price Source Of Truth

Backend should define the same product IDs and offer prices:

- `d3-k2-gummies`
- `sleep-tea`
- `probiotic-fiber-gummies`

Prices:

- 1: 199
- 2: 279
- 3: 349
- upsell: 99

Validate:

- Normal item quantity must be 1, 2, or 3.
- Upsell item quantity should be 1.
- Upsell item price must be 99 and only allowed if submitted from post-checkout upsell flow.

## Phone Helpers

Backend accepts:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `9665XXXXXXXX`
- `+9665XXXXXXXX`

Store:

- `phone_e164 = +9665XXXXXXXX`
- `phone_digits = 9665XXXXXXXX`

Reject:

- landlines.
- non-KSA.
- less/more digits.
- repeated fake numbers if obvious, e.g. `0500000000`, if desired.

## Hashing Helpers

Create `services/hashing.py`:

- lowercase/trim string.
- normalize phone.
- sha256 hex lower-case.

For Meta:

- phone hash input: digits with country code and no plus, e.g. `9665XXXXXXXX`.

For Snap:

- phone hash input: digits with country code and no plus, e.g. `9665XXXXXXXX`.

For TikTok:

- Keep both normalized E.164 `+9665XXXXXXXX` and digits.
- Verify against current TikTok Events API docs during implementation.
- If docs require hashed phone in E.164, hash `+9665XXXXXXXX`; if examples specify no plus, hash digits.
- Document the chosen final behavior in code comments with source link.

## Google Sheets Webhook

Use `ORDER_WEBHOOK_URL`.

Send JSON:

- order fields.
- item breakdown.
- attribution.
- timestamps.
- shared secret header `X-Mymizan-Secret`.

Retry:

- 3 attempts with exponential backoff.
- If fails, keep order in DB with `sheet_failed`.

## Security

- Validate request size.
- Use CORS restrictions.
- Do not expose CAPI tokens to frontend.
- Log enough for debugging, but avoid printing full tokens.
- Store raw phone only as needed for order operations; hash for CAPI.

## Docker

Backend Dockerfile:

- Install requirements.
- Run `fastapi run app/main.py --port 80` or `uvicorn app.main:app --host 0.0.0.0 --port 80`.
- Expose 80.

Use healthcheck if EasyPanel supports it:

- `/health`.
