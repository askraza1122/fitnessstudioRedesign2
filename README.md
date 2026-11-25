# Fitness Studio — Website (Phase 1 + Phase 2 LMS)

Next.js 15 (App Router) + Tailwind CSS + TypeScript. Phase 2 adds the LMS:
accounts, course lectures, manual enrollment/unlock and an admin panel —
see **[PHASE2.md](./PHASE2.md)** for the full Phase 2 guide (env vars,
deploy steps, manual unlock flow, verification results).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serves the production build on port 3000
```

## Deploy with Docker (Coolify)

```bash
docker build -t fitness-studio .
docker run -p 3000:3000 fitness-studio
```

Coolify: create a new app from the GitHub repo, set the port to **3000**.
The Dockerfile uses `node:20-alpine`, `npm ci`, `npm run build`, `npm start`
(standalone output, port 3000).

## Geo-pricing (courses only)

Course prices change by visitor region:

- **Saudi Arabia (SA)** — flat **200 SAR** per course, no tiers.
- **United Arab Emirates (AE)** — flat **200 AED** per course, no tiers.
- **Everywhere else (default)** — PKR tiers: One-to-One Rs 15,000 ·
  Group of 5 Rs 5,000 per head · Home-based trainer Rs 30,000.

How it works: `middleware.ts` reads the `fs-region` cookie; if missing, it
resolves the visitor's country from the request IP via
`http://ip-api.com/json/{ip}?fields=countryCode` (2s timeout, 24h in-memory
cache, any failure → PKR). The header also has a manual currency switcher
(PKR / SAR / AED) that overrides the cookie. The shop always stays in PKR.

Every course is **4 weeks** long. Enrollment opens a WhatsApp message to
+92 324 4696424 with the course, duration and chosen price prefilled.

## Shop (Phase 1)

4 products with real prices and discount badges. Cart is stored in
`localStorage`. Checkout is Cash on Delivery: the form (name, phone, address,
city) opens a WhatsApp order message to +92 324 4696424.

## Content sources

- Real logo: `public/logo.png` (fitnessstudiopk.com).
- CEO portrait + training photos: `public/training/` (old site + WhatsApp export).
- WhatsApp export media (66 photos, 5 videos used): `public/media/`, `public/videos/`.
- AI-generated program images (prenatal, weight loss, pre-marriage, PCOS):
  `public/training/ai-*.jpg` — labelled "Illustrative image (AI-generated)" on
  the site. Senior Citizen Yoga uses a stock meditation photo from the old site.
- Testimonial quotes are copied verbatim from fitnessstudiopk.com.

## Structure

- `app/` — Home, About, Programs (+ 6 detail pages), Shop (+ product pages),
  Cart, Achievements, MoU Partners, Media, Contact
- `components/` — Header (nav + currency switcher), Footer, PriceBlock,
  PricingContext, CartContext
- `lib/` — `data.ts` (programs, products, testimonials, media lists),
  `geo.ts` (region resolution)
- `middleware.ts` — region detection + cookie
