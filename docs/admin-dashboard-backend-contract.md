# Admin Dashboard Backend Contract

The frontend admin page is available at `/admin/`. It expects the backend API base from `MYMIZAN_API_URL` / `NEXT_PUBLIC_API_URL` and authenticates every admin request with HTTP Basic Auth.

## Required Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-long-random-password
DATABASE_URL=postgres://user:password@host:5432/mymizan
ORDER_WEBHOOK_URL=https://script.google.com/macros/s/...

MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
MAXMIND_GEOIP_DB_PATH=/app/data/GeoLite2-City.mmdb
MAXMIND_ASN_DB_PATH=/app/data/GeoLite2-ASN.mmdb
MAXMIND_ANONYMOUS_IP_DB_PATH=/app/data/GeoIP2-Anonymous-IP.mmdb
VPN_DETECTION_API_KEY=
VPN_DETECTION_API_URL=
TRUSTED_PROXY_IPS=
```

## Traffic Counting Rule

Only store or count an analytics event with `valid_for_metrics = true` when all of these are true:

- The real client IP resolves to `SA` using MaxMind GeoIP.
- MaxMind Anonymous IP does not flag the IP as VPN, proxy, Tor, relay, or hosting.
- The secondary VPN detection provider also returns a clean result.
- The request is not internal traffic, a known bot, or a test event.

Rejected events can still be stored with `valid_for_metrics = false` and `rejected_reason` for diagnostics, but dashboard KPIs must only use valid events.

## Storefront Event Endpoint

`POST /events`

The storefront sends:

```json
{
  "event_name": "click",
  "session_id": "sess_...",
  "occurred_at": "2026-07-05T10:00:00.000Z",
  "path": "/products/d3-k2-gummies/",
  "url": "https://mymizan.shop/products/d3-k2-gummies/",
  "referrer": "https://example.com",
  "user_agent": "browser user agent",
  "product_slug": "d3-k2-gummies",
  "properties": {
    "utm_source": "snap",
    "label": "Add to cart"
  }
}
```

Respond with `{ "success": true }`. The backend should enrich the event with IP, geo, VPN, ASN, and validation fields before inserting into `analytics_events`.

## Admin Endpoints

All admin endpoints require HTTP Basic Auth using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

`GET /admin/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`

Return:

```json
{
  "metrics": {
    "valid_clicks": 1200,
    "page_views": 2400,
    "product_views": 1800,
    "checkout_opens": 180,
    "orders": 72,
    "revenue": 25128,
    "aov": 349,
    "conversion_rate": 0.06,
    "valid_sessions": 950,
    "rejected_non_ksa": 44,
    "rejected_vpn": 18,
    "rejected_bot": 9
  },
  "series": [
    { "date": "2026-07-05", "valid_clicks": 220, "orders": 12, "revenue": 4188 }
  ],
  "products": [
    { "product_slug": "sleep-tea", "name": "Sleep Tea", "valid_clicks": 420, "orders": 24, "revenue": 8376, "conversion_rate": 0.057 }
  ],
  "funnel": {
    "page_views": 2400,
    "product_views": 1800,
    "valid_clicks": 1200,
    "checkout_opens": 180,
    "orders": 72
  }
}
```

`GET /admin/orders?from=YYYY-MM-DD&to=YYYY-MM-DD&status=&search=&limit=100`

Return `{ "orders": [...] }`.

`GET /admin/orders/:id`

Return `{ "order": { ... } }` with `items`, customer fields, totals, status, source/UTM fields, and traffic validation fields when available.
