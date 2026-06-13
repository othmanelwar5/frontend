# Tracking, Web Pixels, And CAPI

## Goals

Implement browser pixels and server-side Conversions API for:

- Meta.
- TikTok.
- Snapchat.

Requirements:

- Web pixels deferred for speed.
- CAPI tokens only in backend.
- Deduplication correct.
- Phone hashing server-side.
- Purchase event sent after order creation.
- Events include value, currency, contents, page URL, user agent, IP where supported.

## Event Names

### Meta

- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Purchase`

### TikTok

- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `CompletePayment`

TikTok server endpoint:

- `POST https://business-api.tiktok.com/open_api/v1.3/pixel/track/`
- Send access token in the request as required by the current TikTok Business API client/docs.
- Payload root includes `pixel_code`, `event`, `event_id`, `timestamp`, `context`, and `properties`.

### Snapchat

- `PAGE_VIEW`
- `VIEW_CONTENT`
- `ADD_CART`
- `START_CHECKOUT`
- `PURCHASE`

If a platform changes event naming, prefer the latest official standard event names, but keep browser and server names identical for deduplication.

## Dedup Rules

### Meta

Official rule:

- Browser `eventID` must match server `event_id`.
- Browser event name must match server `event_name`.
- Dedup window is 48 hours.
- For browser call, `eventID` is passed as the fourth argument:

```js
fbq('track', 'Purchase', { value: 349, currency: 'SAR' }, { eventID: 'purchase_MYM-123' })
```

### TikTok

Official/SDK guidance:

- `event_id` identifies a unique event.
- Required when sending overlapping events from Pixel and Events API.
- Use same `event_id` for browser/server copies of same event.
- For purchase, map browser `CompletePayment` to server `CompletePayment`.
- Browser TikTok Pixel calls must pass the same `event_id` used by backend Events API.
- Use order number based ids for `CompletePayment`, for example `purchase_MYM-20260606-0001`.

### Snapchat

Official rule:

- Pixel SDK `client_dedup_id` must match CAPI `event_id`.
- For purchase, use transaction/order id consistently too.
- If `client_dedup_id` is not explicitly passed, Snap Pixel auto-generates one that server cannot know. Always pass it manually.

For purchase:

- Pixel: pass `client_dedup_id` and `transaction_id`.
- CAPI: pass top-level `event_id` and `custom_data.order_id`.

## Event ID Strategy

Generate UUID-based ids:

- `viewcontent_${uuid}`
- `addtocart_${uuid}`
- `checkout_${uuid}`
- `purchase_${orderNumber}`

Store event ids in order record:

```json
{
  "view_content": "viewcontent_x",
  "add_to_cart": "addtocart_x",
  "initiate_checkout": "checkout_x",
  "purchase": "purchase_MYM-20260606-0001"
}
```

## Phone Normalization And Hashing

Frontend accepts KSA phone and sends normalized `+9665XXXXXXXX`.

Backend creates:

- `phone_e164`: `+9665XXXXXXXX`
- `phone_digits`: `9665XXXXXXXX`

Hash with SHA-256 lowercase hex.

Meta:

- Hash input: `9665XXXXXXXX`.
- Required for phone customer matching.

Snap:

- Hash input: `9665XXXXXXXX`.
- Remove plus and all non-numeric characters before hashing.

TikTok:

- TikTok Events API match key guidance expects phone in E.164 format before hashing.
- Hash input: `+9665XXXXXXXX`.
- SHA-256 lowercase hex.
- Do not send raw phone to TikTok from backend.
- Add a code comment in the hashing helper explaining that TikTok phone hashing uses E.164 including `+`, while Meta/Snap use digits only.

## Meta CAPI Payload

Endpoint:

`https://graph.facebook.com/vXX.X/{META_PIXEL_ID}/events?access_token={META_ACCESS_TOKEN}`

Payload:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1780730000,
      "event_id": "purchase_MYM-20260606-0001",
      "action_source": "website",
      "event_source_url": "https://mymizan.shop/thank-you",
      "user_data": {
        "ph": ["<sha256_phone>"],
        "client_ip_address": "<ip>",
        "client_user_agent": "<ua>",
        "fbp": "<fbp>",
        "fbc": "<fbc>"
      },
      "custom_data": {
        "currency": "SAR",
        "value": 349,
        "content_type": "product",
        "contents": [
          { "id": "d3-k2-gummies", "quantity": 3, "item_price": 349 }
        ]
      }
    }
  ]
}
```

If `META_TEST_EVENT_CODE` exists in test mode, include it.

## TikTok Events API Payload

Endpoint:

`https://business-api.tiktok.com/open_api/v1.3/pixel/track/`

Payload shape should include:

```json
{
  "pixel_code": "<TIKTOK_PIXEL_ID>",
  "event": "CompletePayment",
  "event_id": "purchase_MYM-20260606-0001",
  "timestamp": "2026-06-06T08:30:00Z",
  "context": {
    "ip": "<ip>",
    "user_agent": "<ua>",
    "page": {
      "url": "https://mymizan.shop/thank-you",
      "referrer": "https://mymizan.shop/products/sleep-tea"
    },
    "user": {
      "phone_number": "<sha256_phone>",
      "ttp": "<_ttp>",
      "ttclid": "<ttclid>"
    }
  },
  "properties": {
    "currency": "SAR",
    "value": 349,
    "contents": [
      {
        "content_id": "sleep-tea",
        "content_type": "product",
        "content_name": "شاي الأشواغاندا والمغنيسيوم",
        "quantity": 3,
        "price": 349
      }
    ]
  }
}
```

For TikTok, `<sha256_phone>` is the SHA-256 hash of `+9665XXXXXXXX`.

## Snap CAPI Payload

Use current Snap Conversions API v3 endpoint/version from Snap docs during implementation, but keep these field mappings:

- Pixel SDK `client_dedup_id` matches CAPI top-level `event_id`.
- Pixel SDK `transaction_id` matches CAPI `custom_data.order_id`.
- Phone hash input removes `+` and all non-numeric characters, so KSA becomes `9665XXXXXXXX`.

Payload should include:

```json
{
  "data": [
    {
      "event_name": "PURCHASE",
      "event_time": 1780730000,
      "event_id": "purchase_MYM-20260606-0001",
      "action_source": "WEB",
      "event_source_url": "https://mymizan.shop/thank-you",
      "user_data": {
        "ph": ["<sha256_phone>"],
        "client_ip_address": "<ip>",
        "client_user_agent": "<ua>"
      },
      "custom_data": {
        "currency": "SAR",
        "value": "349",
        "order_id": "MYM-20260606-0001",
        "contents": [
          {
            "id": "probiotic-fiber-gummies",
            "quantity": "3",
            "item_price": "349",
            "brand": "mymizan"
          }
        ]
      }
    }
  ]
}
```

## Browser Context Capture

Frontend should capture and send to backend:

- current URL.
- referrer.
- UTM parameters.
- `fbp` and `fbc` cookies.
- `_ttp` cookie.
- `ttclid` query param.
- Snap click id params if present.
- user agent.

Backend adds:

- client IP from request headers, respecting proxy headers if EasyPanel provides them.

## Deferred Script Loading

Use Next.js `Script`:

- Pixel bootstraps: `strategy="afterInteractive"`.
- Optional non-critical tags: `strategy="lazyOnload"`.

Do not place raw scripts in `<head>` that block rendering.

## Testing Checklist

- Pixels disabled if env IDs missing.
- Test order creates DB record without CAPI tokens.
- Test mode sends Meta test event code.
- Event ids match browser/server payloads.
- Phone hashes are lowercase SHA-256.
- Purchase value equals backend-calculated order total.
- CAPI failures do not block customer thank-you page, but are logged.
