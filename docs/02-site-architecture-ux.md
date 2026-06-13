# Site Architecture And UX

## Routes

Frontend routes:

- `/`: home page.
- `/about`: about us.
- `/contact`: contact us.
- `/collections`: product collection.
- `/products/d3-k2-gummies`: D3/K2 gummies landing page.
- `/products/sleep-tea`: ashwagandha magnesium tea landing page.
- `/products/probiotic-fiber-gummies`: probiotic fiber gummies landing page.
- `/thank-you`: confirmation page after order submission.
- `/privacy`: privacy policy.
- `/terms`: terms and conditions.
- `/shipping-returns`: shipping, confirmation, replacement policy.

Backend routes:

- `GET /health`
- `POST /orders`
- `POST /events/meta`
- `POST /events/tiktok`
- `POST /events/snap`
- Optional admin-safe internal route: `GET /orders/{order_id}` only if protected by admin token.

## Header

Direction: RTL.

Layout:

- Right side: brand mark.
- Mark: `M` inside circle with primary brand color.
- Beside it: Arabic logo text `ميزاني`, below it small English `mymizan`.
- Menu links: الرئيسية، المنتجات، عن ميزاني، تواصل معنا.
- Cart button with item count.
- Sticky on mobile and desktop.

The user requested `M` in a circle and text logo. Use it exactly. Later this can be replaced by an SVG.

## Home Page Structure

Goal: position `ميزاني` as a premium Saudi wellness brand and guide visitors to the three product routines.

Sections:

1. Announcement bar:
   `الدفع عند الاستلام | تأكيد الطلب قبل الشحن | توصيل لكل مناطق السعودية خلال 2-5 أيام عمل`

2. Hero:
   - Headline: `روتينك اليومي للتوازن يبدأ من هنا`
   - Subheading: `منتجات عناية يومية مختارة لدعم الطاقة، النوم، وراحة الهضم. تجربة طلب سهلة، دفع عند الاستلام، وتأكيد قبل الشحن.`
   - CTA: `اختر روتينك`
   - Secondary CTA: `شاهدي المنتجات`
   - Hero visual: premium product trio mockup.

3. Trust strip:
   - الدفع عند الاستلام
   - تأكيد قبل الشحن
   - دعم واتساب
   - توصيل لكل السعودية
   - مكونات موضحة

4. Problem-solution:
   `لما يتلخبط نومك، طاقتك، أو هضمك... جسمك يطلب توازن.`
   Show three cards mapped to products.

5. Product routine grid:
   Three product cards with stars, benefit headline, short emotional hook, offer ladder, CTA.

6. Why Mymizan:
   Text right, image left. Explain curated ingredients, clear usage, COD, no exaggerated claims.

7. Ingredient education:
   Cards for D3/K2, magnesium, ashwagandha, probiotics, fiber.

8. Social proof:
   Saudi-style reviews, UGC placeholders, order counters with careful wording.

9. Bundle/AOV section:
   `ابدئي بمنتج واحد أو خذي روتين كامل بسعر أوفر.`
   Encourage 2 and 3 piece offers.

10. FAQ:
   COD, delivery time, who should consult doctor, how to use, return/replacement.

11. Final CTA:
   `اختر المنتج الأقرب لاحتياجك اليوم.`

## Collection Page

Goal: fast product comparison.

Sections:

- Header: `اختر روتين التوازن المناسب لك`
- Filter chips: الطاقة والعظام، النوم، الهضم.
- Three product cards.
- Comparison table without overloading.
- Trust and FAQ block.

Product card must include:

- Product image placeholder.
- Star rating: use `4.8/5` style with review count placeholder.
- Emotional headline.
- Ingredient line.
- Offer anchor: `ابتداء من 199 ريال`.
- Best-value badge on 3-piece ladder.
- CTA: `اختر العرض`.

## About Page

Goal: authority and brand trust.

Sections:

- Brand story: why balance matters.
- Saudi-first promise.
- Quality principles: ingredient clarity, sealed packaging, customer confirmation, COD.
- What we will never do: no exaggerated medical promises.
- Founder/brand team placeholder.
- Support CTA.

Copy angle:

`ميزاني انبنت على فكرة بسيطة: العناية اليومية ما لازم تكون معقدة. اخترنا منتجات سهلة تدخل في روتينك، مع معلومات واضحة وتجربة طلب مطمئنة.`

## Contact Page

Include:

- WhatsApp CTA.
- Phone placeholder.
- Email placeholder.
- Working hours.
- Order support form.
- FAQ mini block.

Copy:

`عندك سؤال قبل الطلب؟ تواصل معنا ونساعدك تختارين الأنسب لك.`

## Footer

Footer menus:

- المتجر: الرئيسية، المنتجات، العروض.
- ميزاني: عن ميزاني، تواصل معنا.
- الدعم: الشحن والاستبدال، سياسة الخصوصية، الشروط والأحكام.
- Social: TikTok, Snapchat, Instagram placeholders.
- Trust line: `الدفع عند الاستلام متاح داخل السعودية.`

## Cart Drawer

Cart opens from header and after every product CTA.

Content:

- Cart items.
- Selected offer summary.
- Savings callout if 2 or 3 pieces.
- Cross-sell carousel with the other two products.
- Trust badges.
- Sticky CTA: `إتمام الطلب - الدفع عند الاستلام`.

Cross-sell behavior:

- One-click add cross-sell at normal ladder or default 1 piece.
- If cart contains D3/K2, promote sleep tea and probiotic/fiber.
- If cart contains sleep tea, promote probiotic/fiber and D3/K2.
- If cart contains probiotic/fiber, promote sleep tea and D3/K2.

## Checkout Popup

Opened from cart CTA.

Fields:

- Name.
- Saudi phone number.

Validation:

- Name at least 2 words or minimum 3 Arabic/Latin letters.
- Phone must be a valid KSA mobile: accepts `05XXXXXXXX`, `5XXXXXXXX`, `9665XXXXXXXX`, `+9665XXXXXXXX`.
- Normalize internally to E.164 display format `+9665XXXXXXXX`.

Popup includes:

- Order summary.
- COD line.
- Scarcity line.
- Social proof line.
- Submit CTA: `تأكيد الطلب الآن`.

After valid submit:

1. Fire browser `InitiateCheckout` with a generated dedup id.
2. Show 10-15 second upsell modal.
3. If accepted, add relevant product at `99 SAR`.
4. Send one final `POST /orders` to backend with cart, upsell choice, attribution, and event ids.
5. Backend creates the order, stores it, forwards Sheets/CAPI, and returns order number.
6. Frontend fires browser `Purchase` with the backend order number event id, then redirects to `/thank-you`.

Do not create a pending order before the upsell unless the implementation also includes a complete abandoned-checkout recovery model. For this project, keep the first production version simple with one final order submission.

## Thank You Page

Goal: improve confirmation and delivery rate.

Sections:

- `تم استلام طلبك بنجاح`
- Order number.
- Summary.
- `فريقنا بيتواصل معك لتأكيد الطلب قبل الشحن.`
- Delivery expectations.
- WhatsApp support CTA.
- Reminder: answer confirmation call/message to avoid cancellation.
