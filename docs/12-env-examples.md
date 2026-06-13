# Environment Examples

The final implementation must create these files:

- `frontend/.env.example`
- `backend/.env.example`

## Frontend `.env.example`

```env
NEXT_PUBLIC_SITE_URL=https://mymizan.shop
NEXT_PUBLIC_API_URL=https://api.mymizan.shop

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

NEXT_PUBLIC_ENABLE_PIXELS=true
```

## Backend `.env.example`

```env
APP_ENV=production
API_BASE_URL=https://api.mymizan.shop
FRONTEND_ORIGIN=https://mymizan.shop

DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
RUN_MIGRATIONS_ON_STARTUP=true

ORDER_WEBHOOK_URL=
ORDER_WEBHOOK_SECRET=

# MaxMind GeoIP2 Precision (Insights) - for IP fraud/geo blocking
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
MAXMIND_ENABLED=true
GEO_ALLOWED_COUNTRIES=["SA"]
GEO_BLOCK_VPN=true
GEO_BLOCK_HIGH_RISK=true
GEO_RISK_SCORE_THRESHOLD=50.0
WHITELISTED_PHONES=["055000000"]

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

## EasyPanel Notes

Use real values only in EasyPanel env settings.

The user provided an internal Postgres URL format like:

```text
postgres://USER:PASSWORD@HOST:5432/DBNAME?sslmode=disable
```

For SQLAlchemy with psycopg, convert to:

```text
postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
```

If SSL mode is needed, configure it explicitly after confirming EasyPanel/Postgres requirements.
