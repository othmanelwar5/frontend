# ميزاني / mymizan Implementation Docs

This folder is the build source of truth for a premium Arabic DTC store selling wellness supplement-style dropshipping products in Saudi Arabia.

The goal is not a generic catalog. Build a branded, high-trust, cash-on-delivery ecommerce experience that feels like `ميزاني` owns and curates its products, supports high AOV bundles, and converts cold Snapchat/TikTok traffic.

## Required Output

The AI coder must deliver:

- `frontend/`: Next.js App Router, TypeScript, Tailwind, responsive Arabic RTL storefront.
- `backend/`: Python FastAPI API, PostgreSQL persistence, server-side CAPI, Google Sheets webhook forwarding, Docker.
- `sheets/google-apps-script-webhook.js`: script to paste into Google Apps Script.
- `.env.example` files for frontend and backend.
- Dockerfiles and deployment notes for EasyPanel.
- Database migrations that run safely on backend startup.
- CSV sheet templates in `docs/sheets/`.

## Non-Negotiable Page Scope

This is not a single-product store. The implementation is incomplete unless all of these pages are built:

- Home page that positions the brand and links to all 3 products.
- Collection page listing all 3 products.
- Three separate product landing pages, one for each product.
- About Us page.
- Contact Us page.
- Thank You page.
- Privacy, Terms, and Shipping/Returns pages.

Each product page needs unique Arabic copy, offer selector, CRO sections, social proof, FAQ, safety notes, and conversion CTAs.

## Product Set

- `d3-k2-gummies`: حلوى فيتامين D3 و K2 لدعم فيتامين د وصحة العظام.
- `sleep-tea`: شاي الأشواغاندا والمغنيسيوم لروتين نوم أهدأ.
- `probiotic-fiber-gummies`: حلوى البروبيوتيك والألياف لدعم الهضم وتقليل الانزعاج بعد الأكل.

Important: avoid medical cure claims. Use support language, routines, comfort, and scientifically plausible ingredient education. Add clear supplement disclaimers.

## Pricing And Offers

Each product has the same offer ladder:

- 1 piece: `199 SAR`
- 2 pieces: `279 SAR`
- 3 pieces: `349 SAR`

Upsell-only price:

- Relevant product add-on after checkout form submit: `99 SAR`

Payment:

- Cash on delivery only.

## Recommended Reading Order

1. `01-brand-positioning-icp.md`
2. `02-site-architecture-ux.md`
3. `03-copywriting-cro-arabic.md`
4. `04-product-pages-offers.md`
5. `05-design-system.md`
6. `06-frontend-implementation.md`
7. `07-backend-implementation.md`
8. `08-tracking-pixels-capi.md`
9. `09-checkout-orders-sheets.md`
10. `10-deployment-easypanel.md`
11. `11-ai-coder-rules.md`
12. `12-env-examples.md`
13. `13-scientific-proof-authority.md`
14. `AI_CODER_PROMPT.md`

## Domains

- Storefront: `https://mymizan.shop`
- API: `https://api.mymizan.shop`

Use placeholders in committed files. Do not commit real database passwords, ad tokens, webhook secrets, or pixel access tokens.
