# Deployment On EasyPanel

## Target Services

Deploy three services:

- Frontend: `mymizan.shop`
- Backend API: `api.mymizan.shop`
- PostgreSQL: existing EasyPanel database

Google Sheets webhook is external through Google Apps Script.

## Repository Layout

Final repo:

```text
frontend/
backend/
sheets/
docs/
README.md
```

Each app should have its own Dockerfile.

## Frontend Service

Build:

- Dockerfile in `frontend/`.
- Expose port `3000`.
- Set domain `mymizan.shop`.

Environment:

```env
NEXT_PUBLIC_SITE_URL=https://mymizan.shop
NEXT_PUBLIC_API_URL=https://api.mymizan.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_ENABLE_PIXELS=true
```

## Backend Service

Build:

- Dockerfile in `backend/`.
- Expose internal port `80`.
- Set domain `api.mymizan.shop`.

Environment:

```env
APP_ENV=production
API_BASE_URL=https://api.mymizan.shop
FRONTEND_ORIGIN=https://mymizan.shop
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
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

Important:

- The user shared an internal Postgres URL with credentials. Do not commit it.
- Put the real URL only in EasyPanel environment variables.
- The database name for this project is `mymizan`.
- The final `DATABASE_URL` in EasyPanel must point to the `mymizan` database and use the SQLAlchemy driver prefix expected by the backend, for example `postgresql+psycopg://.../mymizan`.

## Database Migration

Backend startup must:

1. Load settings.
2. Connect to database.
3. Run Alembic migrations if enabled.
4. Start API.

If migration fails, container should fail so the deployment does not silently run with a broken schema.

## CORS

Production:

- Allow `https://mymizan.shop`.

Development:

- Allow `http://localhost:3000`.

## Health Checks

Backend:

- `GET /health` returns `{ "ok": true }`.

Frontend:

- Default Next.js route `/`.

## Google Sheets Setup

1. Create Google Sheet.
2. Create tabs from CSV templates.
3. Open Extensions > Apps Script.
4. Paste `sheets/google-apps-script-webhook.js`.
5. Add script property `MYMIZAN_WEBHOOK_SECRET`.
6. Deploy as web app.
7. Put the web app URL in backend `ORDER_WEBHOOK_URL`.
8. Put the same secret in backend `ORDER_WEBHOOK_SECRET`.

## Post-Deploy Verification

Checklist:

- Frontend loads in Arabic RTL.
- Product page add-to-cart opens drawer.
- Checkout accepts valid Saudi mobile only.
- Upsell appears after form submit.
- Order reaches backend DB.
- Order row appears in Google Sheet.
- Thank-you page shows order number.
- Pixels fire in browser only when env IDs exist.
- CAPI calls log success or failure without breaking checkout.
- Meta/TikTok/Snap test tools show dedup ids.

## Rollback Notes

- Keep migrations backward-safe where possible.
- Never delete columns in same release that removes code usage.
- Keep `CAPI_ENABLED=false` as emergency switch.
- Keep `NEXT_PUBLIC_ENABLE_PIXELS=false` as frontend pixel switch.
