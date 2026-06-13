# Frontend Implementation

## Stack

Use:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Zustand for cart/checkout state.
- React Hook Form + Zod for checkout validation.
- `lucide-react` for icons.
- `next/script` for pixels and deferred third-party scripts.

Avoid:

- Heavy UI frameworks.
- Client-rendering the entire app unnecessarily.
- Uncontrolled global script tags.

## Folder Structure

Recommended:

```text
frontend/
  app/
    layout.tsx
    page.tsx
    about/page.tsx
    contact/page.tsx
    collections/page.tsx
    products/[slug]/page.tsx
    thank-you/page.tsx
    privacy/page.tsx
    terms/page.tsx
    shipping-returns/page.tsx
  components/
    layout/
    product/
    checkout/
    tracking/
    ui/
  data/
    products.ts
    copy.ts
  lib/
    api.ts
    events.ts
    phone.ts
    money.ts
  store/
    cart-store.ts
  public/
    placeholders/
  Dockerfile
  .env.example
```

## Environment Variables

Create `frontend/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://mymizan.shop
NEXT_PUBLIC_API_URL=https://api.mymizan.shop

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

NEXT_PUBLIC_ENABLE_PIXELS=true
```

Only expose public IDs in frontend env. Access tokens stay in backend env.

## Rendering

Use server components by default. Use client components only for:

- Cart drawer.
- Offer selector.
- Checkout modal.
- Upsell modal.
- Pixel event firing.
- Form validation.

Product pages can be statically generated from `data/products.ts`.

## Product Data Model

Create typed data:

```ts
export type OfferTier = {
  quantity: 1 | 2 | 3
  price: 199 | 279 | 349
  badge: string
}

export type Product = {
  id: string
  slug: string
  arabicName: string
  englishName: string
  category: 'bones-energy' | 'sleep' | 'digestion'
  headline: string
  subheading: string
  ingredients: string[]
  usage: string
  disclaimers: string[]
  crossSellIds: string[]
  checkoutUpsellProductId: string
}
```

## Cart Model

Cart item:

- `productId`
- `slug`
- `name`
- `quantity`
- `offerPrice`
- `unitOriginalPrice`
- `image`

Cart totals:

- subtotal.
- discount/savings.
- COD total.
- currency `SAR`.

## Checkout Flow

1. User selects offer on product page.
2. CTA adds item to Zustand cart.
3. Open cart drawer.
4. Cart displays cross-sell carousel.
5. Cart CTA opens checkout modal.
6. User enters name and KSA phone.
7. Validate locally.
8. Generate shared event ids for checkout and purchase deduplication.
9. Show 10-15 second upsell modal.
10. If accepted, add the relevant upsell product at `99 SAR`.
11. Send one final `POST /orders` after upsell accept/decline with the final cart.
12. Redirect to `/thank-you?orderId=...`.

Required implementation rule:

- Do not create a draft or pending order before the upsell in this version.
- The first backend order write happens only once, after the upsell decision.
- The backend generates or confirms the final purchase event id and returns the order number.

## Phone Validation

Accept:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `9665XXXXXXXX`
- `+9665XXXXXXXX`

Normalize:

- Display/storage normalized phone: `+9665XXXXXXXX`
- Digits for hashing in backend:
  - Meta/Snap: `9665XXXXXXXX`
  - TikTok: store E.164 available as `+9665XXXXXXXX`; hash according to final backend helper spec.

Frontend should not hash PII for server APIs. Backend does CAPI hashing.

## Pixel Loading

Use `next/script`.

Strategy:

- Pixel bootstrap scripts: `afterInteractive`.
- Non-critical optional scripts: `lazyOnload`.
- Do not block render.

Create `components/tracking/PixelScripts.tsx`.

Only load if:

- `NEXT_PUBLIC_ENABLE_PIXELS === "true"`
- relevant pixel ID exists.

## Browser Events

Create `lib/events.ts` helpers:

- `generateEventId(prefix: string): string`
- `trackViewContent(product)`
- `trackAddToCart(cartItem, eventId)`
- `trackInitiateCheckout(cart, eventId)`
- `trackPurchase(order, eventId)`

Dedup:

- The same `eventId` sent to browser pixel must be sent to backend with the order/event payload.
- Use one event id per event type/action, not one global id for all actions.

Suggested event IDs:

- `vc_${uuid}` for ViewContent.
- `atc_${uuid}` for AddToCart.
- `ic_${uuid}` for InitiateCheckout.
- `purchase_${orderId}` for Purchase.

## Browser Pixel Event Mapping

Meta:

- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Purchase`

Use fourth parameter:

```js
fbq('track', 'Purchase', { value, currency: 'SAR' }, { eventID: eventId })
```

TikTok:

- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `CompletePayment`

Use `event_id` in options if supported by current pixel API; otherwise use documented event payload pattern in implementation.

Snap:

- `VIEW_CONTENT`
- `ADD_CART`
- `START_CHECKOUT`
- `PURCHASE`

Pass explicit `client_dedup_id` matching server CAPI `event_id`.

## API Client

Create `lib/api.ts`:

- `createOrder(payload)`
- Include headers:
  - `Content-Type: application/json`
  - optional `X-Client-Event-Id`

Send browser context:

- `eventId`
- `pageUrl`
- `referrer`
- `fbp`
- `fbc`
- `_ttp`
- `ttclid`
- Snap click params if present.

Read cookies client-side where allowed.

## SEO And Metadata

Set Arabic metadata:

- Home title: `ميزاني | روتينك اليومي للتوازن`
- Description: `منتجات عناية يومية مختارة لدعم الطاقة، النوم، وراحة الهضم داخل السعودية مع الدفع عند الاستلام.`

Product pages need per-product metadata and Open Graph.

## Performance

- Optimize images with Next Image.
- Use static pages where possible.
- Defer pixels.
- Keep JS bundle small.
- Avoid heavy animation libraries unless needed.
- Use responsive image sizes.

## Required Page Completion

Do not stop after one product page. The final frontend must include:

- `/`: complete home page that presents the brand and prominently links to all 3 products.
- `/collections`: collection page listing all 3 products.
- `/products/d3-k2-gummies`: unique D3/K2 landing page.
- `/products/sleep-tea`: unique sleep tea landing page.
- `/products/probiotic-fiber-gummies`: unique probiotic/fiber landing page.
- `/about`: about us page.
- `/contact`: contact page.
- `/thank-you`: order confirmation page.
- `/privacy`, `/terms`, `/shipping-returns`: support/legal pages.

Each product page must have unique copy, pain section, ingredient mechanism, offer selector, social proof, FAQ, safety/disclaimer block, repeated CTAs, and cart-opening add-to-cart behavior.

## Docker

Use standalone output:

`next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
}

export default nextConfig
```

Dockerfile should follow official multi-stage style:

- install dependencies from lockfile.
- build.
- copy `.next/standalone` and `.next/static`.
- run `node server.js`.
