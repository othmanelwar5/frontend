# Checkout, Orders, And Google Sheets

## Checkout Objective

The checkout must maximize completion and delivery confirmation:

- COD only.
- Two fields only: name and phone.
- Fast validation.
- Clear order summary.
- Trust and scarcity inside popup.
- Post-submit upsell before final thank-you.

## Checkout Modal Copy

Title:

`أكملي طلبك بالدفع عند الاستلام`

Support line:

`اكتب اسمك ورقم جوالك، وفريقنا بيتواصل معك لتأكيد الطلب قبل الشحن.`

Trust bullets:

- `بدون دفع الآن`
- `تأكيد قبل الشحن`
- `توصيل لكل السعودية`

CTA:

`تأكيد الطلب الآن`

Validation errors:

- Name: `اكتب الاسم بشكل صحيح.`
- Phone: `اكتب رقم جوال سعودي صحيح يبدأ بـ 05 أو +9665.`

## Upsell Modal

After valid form submit:

- Show relevant product for 10-15 seconds.
- Price: `99 SAR`.
- This is the only discounted product placement.

Copy:

`عرض خاص قبل تأكيد الطلب`

`أضف هذا المنتج لطلبك الآن بسعر 99 ريال فقط. العرض يظهر مرة واحدة قبل إرسال الطلب.`

Buttons:

- Accept: `أضفه لطلبي بـ 99 ريال`
- Decline: `لا شكرا، أكملي طلبي`

Countdown:

- 10 to 15 seconds.
- Do not block decline button.

## Final Order Submission

After upsell accept/decline, frontend sends one final `POST /orders`.

Payload fields:

```json
{
  "customer": {
    "name": "سارة محمد",
    "phone": "+9665XXXXXXXX"
  },
  "items": [
    {
      "product_id": "sleep-tea",
      "quantity": 3,
      "offer_price_sar": 349,
      "is_upsell": false
    },
    {
      "product_id": "probiotic-fiber-gummies",
      "quantity": 1,
      "offer_price_sar": 99,
      "is_upsell": true
    }
  ],
  "totals": {
    "subtotal_sar": 448,
    "total_sar": 448,
    "currency": "SAR"
  },
  "payment_method": "cod",
  "event_ids": {
    "initiate_checkout": "checkout_x",
    "purchase": "purchase_pending_or_order_id"
  },
  "attribution": {
    "landing_page_url": "https://mymizan.shop/products/sleep-tea",
    "referrer": "",
    "utm_source": "tiktok",
    "utm_campaign": "sleep_ugc_01",
    "fbp": "",
    "fbc": "",
    "ttp": "",
    "ttclid": ""
  }
}
```

Backend recalculates all totals and generates final purchase event id if needed.

## Google Sheet Workbook

Create a Google Sheet with these tabs:

- `Orders`
- `Items`
- `EventLogs`
- `Products`

CSV templates are in:

- `docs/sheets/orders_template.csv`
- `docs/sheets/items_template.csv`
- `docs/sheets/event_logs_template.csv`
- `docs/sheets/products_template.csv`

## Apps Script Webhook

Create `sheets/google-apps-script-webhook.js` in the final repo.

Behavior:

- Accept POST JSON.
- Verify `X-Mymizan-Secret`.
- Append order row to `Orders`.
- Append each item to `Items`.
- Return JSON success.

Required script properties:

- `MYMIZAN_WEBHOOK_SECRET`

Secret transport:

- Preferred for Apps Script reliability: backend appends `?secret=ORDER_WEBHOOK_SECRET` to the webhook URL or includes `secret` in the JSON payload.
- If using another webhook provider, send `X-Mymizan-Secret` header.
- Apps Script web apps do not reliably expose custom request headers to `doPost`, so do not depend only on headers there.

Deployment:

- Deploy as web app.
- Execute as owner.
- Access: Anyone with link, because backend secret validates requests.

## Delivery Confirmation Notes

Store these operational fields:

- confirmation_status.
- confirmation_attempts.
- courier_status.
- notes.

These can be updated manually in Google Sheet.

## Thank You Page Copy

Title:

`تم استلام طلبك بنجاح`

Body:

`طلبك وصلنا، وفريق ميزاني بيتواصل معك قريبا لتأكيد التفاصيل قبل الشحن. الرجاء الرد على الاتصال أو رسالة واتساب حتى ما يتأخر الطلب.`

Order summary:

- order number.
- products.
- total.
- payment method: `الدفع عند الاستلام`.

CTA:

`تواصلي معنا على واتساب`
