# Design System

## Visual Direction

Premium Saudi wellness brand:

- Calm, trustworthy, warm, not clinical.
- Looks owned and curated, not marketplace-like.
- Mobile-first for TikTok/Snapchat traffic.
- High contrast CTAs and readable Arabic typography.

## Colors

Use this palette:

- Primary green: `#17463A`
- Deep green hover: `#10352C`
- Cream background: `#FFF9F0`
- Sand secondary: `#F4E9D8`
- Warm gold/accent: `#C98F6A`
- Charcoal text: `#1F2421`
- Muted text: `#68756D`
- Success green: `#2F7D57`
- Warning amber: `#B7791F`
- White: `#FFFFFF`

Rationale:

- Green signals wellness, authority, and natural care.
- Cream and sand make the brand warmer and more premium for KSA.
- Gold adds high-price/premium cues without looking loud.

## Typography

Preferred Arabic font:

- `IBM Plex Sans Arabic`

Fallback:

- `Tajawal`
- system sans-serif

Use Google Fonts or local font loading through Next.js font optimization if practical.

Logo text:

- Arabic `ميزاني` in bold.
- English `mymizan` smaller, uppercase/lowercase as `mymizan`, letter-spaced.

## Logo Header Spec

Brand lockup:

- Circle: primary green.
- Inside: `M` in cream, bold.
- Next to it:
  - `ميزاني` in primary green.
  - `mymizan` below in muted/accent small text.

## Layout

Max widths:

- Main content: `max-w-7xl`.
- Long copy: `max-w-3xl`.
- Product landing hero: two-column from `lg`.

Spacing:

- Mobile sections: `py-10` to `py-14`.
- Desktop sections: `py-16` to `py-24`.

Cards:

- Rounded corners: `rounded-3xl`.
- Shadows: soft green/gold shadows.
- Borders: primary with low opacity.

## Components

Required reusable components:

- `Header`
- `Footer`
- `AnnouncementBar`
- `ProductCard`
- `OfferSelector`
- `TrustBadges`
- `ReviewCard`
- `FAQAccordion`
- `CartDrawer`
- `CheckoutModal`
- `UpsellModal`
- `SectionHeader`
- `ImagePlaceholder`
- `StickyMobileCTA`

## Buttons

Primary:

- Background: primary green.
- Text: cream or white.
- Rounded full.
- Bold.

Secondary:

- White/cream background.
- Primary border.
- Primary text.

Accent:

- Warm gold background for selected offer badges only.

## Icons

Use `lucide-react` for simple icons:

- ShoppingCart
- Star
- ShieldCheck
- Truck
- Phone
- MessageCircle
- PackageCheck
- Sparkles
- Leaf
- Moon
- Bone

## Imagery

Until final images are provided:

- Use branded placeholders that look intentional.
- Product box/gummy/tea mockups are acceptable.
- Avoid random stock photos that make the brand look generic.

Create placeholders with CSS gradients if image assets are missing:

- Green packaging for D3/K2 with gold accent.
- Deep night/green packaging for sleep tea.
- Cream/green packaging for probiotic fiber.

## Motion

Use minimal motion:

- Cart drawer slide.
- Modal fade/scale.
- Offer selection state.
- Sticky CTA.

Use `framer-motion` only if it does not add unnecessary complexity. CSS transitions are enough.

## Accessibility

- RTL HTML: `<html lang="ar-SA" dir="rtl">`
- Buttons have accessible labels.
- Dialogs trap focus.
- Form errors are visible and announced.
- Color contrast must be readable.

## Responsive Rules

Mobile:

- Header compact.
- Menu may collapse into drawer.
- Product cards single column.
- Sticky CTA enabled.

Tablet:

- Product grid 2 columns where useful.

Desktop:

- Product grid 3 columns.
- Alternating content sections.
- Cart drawer max width around `420px`.
