# Product Pages And Offer System

## Shared Product Page Layout

Each product page is a landing page, not a simple product detail page.

Required sections:

1. Announcement bar.
2. Header.
3. Hero with product image, star rating, headline, subheading, trust badges.
4. Offer selector: 1, 2, 3 pieces.
5. Sticky/mobile CTA.
6. Pain section.
7. Mechanism and ingredients.
8. Alternating image/text sections.
9. How to use.
10. Social proof and UGC placeholders.
11. Comparison or "why this routine" section.
12. Safety and disclaimers.
13. FAQ.
14. Final CTA.
15. Footer.

Desktop layout pattern:

- Alternate text right/image left, then image right/text left.
- Keep RTL alignment and Arabic visual hierarchy.

Mobile:

- Image first in hero, CTA visible without excessive scrolling.
- Sticky bottom CTA with selected offer price.

## Offer Selector

Options for every product:

- 1 piece: `199 SAR`
- 2 pieces: `279 SAR`
- 3 pieces: `349 SAR`

Badges:

- 1 piece: `للتجربة`
- 2 pieces: `اختيار ذكي`
- 3 pieces: `الأكثر توفيرا`

Show savings:

- 2 pieces saves `119 SAR` vs buying separately.
- 3 pieces saves `248 SAR` vs buying separately.

Default selected offer:

- 3 pieces on product pages, because max AOV.
- Make it visually recommended but let users choose.

CTA behavior:

When CTA clicked:

1. Add chosen product and offer to cart.
2. Fire `AddToCart` browser pixel event with shared `event_id`.
3. Open cart drawer immediately.
4. Show cross-sell carousel in cart.

## Product Data

### D3/K2 Gummies

Slug: `d3-k2-gummies`

Arabic name:

`حلوى فيتامين D3 و K2`

Short benefit:

`لدعم فيتامين د وصحة العظام ضمن روتين يومي.`

Hero headline:

`دعم يومي للطاقة وصحة العظام بطعم أسهل من الحبوب`

Hero subheading:

`حلوى D3 و K2 مصممة لروتين يومي مريح، خصوصا لمن ينسى الكبسولات أو يقضي وقتا قليلا تحت الشمس.`

Pain bullets:

- `تحسين روتين فيتامين د يكون أصعب لما المنتج غير مريح.`
- `كثير منا ينسى الحبوب اليومية.`
- `الجسم يحتاج روتين ثابت، مو حماس يومين فقط.`

Ingredient education:

- Vitamin D3: supports vitamin D levels, immune and bone wellness.
- Vitamin K2: commonly paired with D3 in bone-support formulas.

Proof block:

`D3 و K2 من التركيبات المعروفة في مكملات دعم العظام. ميزاني يقدمها بشكل حلوى يومية سهلة، مع تنبيه واضح أن المنتج ليس بديلا عن التحليل أو العلاج الطبي.`

Best cross-sells:

- Sleep tea: routine balance night.
- Probiotic/fiber: daily comfort.

Upsell after checkout:

- Sleep tea at `99 SAR`.

### Sleep Tea

Slug: `sleep-tea`

Arabic name:

`شاي الأشواغاندا والمغنيسيوم`

Short benefit:

`لروتين مسائي أهدأ قبل النوم.`

Hero headline:

`روتين مسائي أهدأ لنوم أريح`

Hero subheading:

`مزيج الأشواغاندا والمغنيسيوم يساعدك تبطئ إيقاع اليوم وتدخل النوم بروتين ألطف.`

Pain bullets:

- `الجسم يكون متعب، لكن العقل لسه مشغول.`
- `السهر والجوال يخربون الإيقاع.`
- `تحتاجين إشارة يومية تقول لجسمك: وقت الهدوء.`

Ingredient education:

- Magnesium: supports normal muscle and nervous system function.
- Ashwagandha: adaptogenic herb used in stress-support routines.
- Warm tea ritual: helps create a consistent wind-down habit.

Proof block:

`الفكرة ليست وعدا بنوم فوري، بل بناء طقس مسائي ثابت بمكونات معروفة في روتين الاسترخاء.`

Best cross-sells:

- Probiotic/fiber: comfort after dinner.
- D3/K2: morning wellness routine.

Upsell after checkout:

- Probiotic/fiber gummies at `99 SAR`.

### Probiotic/Fiber Gummies

Slug: `probiotic-fiber-gummies`

Arabic name:

`حلوى البروبيوتيك والألياف`

Short benefit:

`لدعم الهضم وتقليل الإحساس بالثقل بعد الأكل.`

Hero headline:

`راحة أخف بعد الأكل وروتين هضم أبسط`

Hero subheading:

`حلوى البروبيوتيك والألياف تساعدك تضيفين دعما يوميا للهضم بطريقة سهلة ولذيذة.`

Pain bullets:

- `بعد بعض الوجبات تحس بثقل أو انتفاخ.`
- `الألياف مهمة، لكن الالتزام فيها مو دائما سهل.`
- `روتين الهضم يحتاج دعم يومي بسيط.`

Ingredient education:

- Probiotics: support beneficial bacteria balance.
- Fiber: supports digestive regularity and satiety.

Proof block:

`البروبيوتيك والألياف من أكثر المكونات استخداما في منتجات دعم الهضم. ميزاني يجعلها أسهل كحلوى يومية ضمن نمط حياة متوازن.`

Best cross-sells:

- Sleep tea: evening comfort.
- D3/K2: daily wellness.

Upsell after checkout:

- Sleep tea at `99 SAR`.

## Image Requirements

Create placeholder images during build:

- Home hero trio mockup.
- Collection cards: one image per product.
- Product pages: 3-4 images per product.
- UGC/video placeholders.
- Ingredient icons.

Placeholder style:

- Premium pack renders or clean abstract boxes.
- Neutral cream background.
- Brand green and warm gold accents.
- Arabic label visible when possible.

Do not block implementation waiting for final images. Use generated placeholders in `frontend/public/placeholders/`.

## FAQ Per Product

Shared:

- `هل الدفع عند الاستلام متاح؟`
- `متى يوصل الطلب؟`
- `هل المنتج مناسب للجميع؟`
- `كيف أستخدمه؟`
- `هل يغني عن الطبيب أو التحاليل؟`

Product-specific answers must repeat safety disclaimer.

## Sticky CTA

Desktop:

- Hero CTA plus repeated CTA after key proof sections.

Mobile:

- Sticky bottom bar:
  - selected offer.
  - price.
  - CTA `أضف للسلة`.

The sticky bar should not cover checkout fields.
