# Studio — Art Portfolio & E-commerce

A clean, editorial-style portfolio + storefront for a working painter and draftsman.
Built with Vite, React, TypeScript, Tailwind, Supabase, and Stripe Elements.

## Stack

- **React 18 + Vite + TypeScript** — fast dev, typed everywhere.
- **Tailwind CSS** — custom design tokens for the editorial palette and type system.
- **Supabase (`art_portfolio` project)** — `artworks`, `orders`, `order_items`, `contact_submissions`.
- **Stripe Elements** — single-page checkout, styled to match the site.
- **React Router** — `/`, `/gallery`, `/works/:slug`, `/about`, `/contact`, `/cart`, `/checkout`.

## Design system

- Paper `#f5f2ed` background, ink `#0e0d0b` foreground, muted stone grays.
- **Cormorant Garamond** (light) for headlines and prices; **DM Mono** uppercase
  for labels, navigation, and metadata.
- Hairline `0.5px` rules in place of heavy borders.
- 3-column gallery grid; cards are ~80% image, with title, medium, dimensions,
  price, and an availability badge.
- Sold works stay visible (desaturated + SOLD badge) instead of being removed.
- Mobile collapses to a stacked layout with a slide-in drawer; cart count
  is rendered in mono.

## Getting started

```bash
npm install
cp .env.example .env       # fill in Stripe key when ready
npm run dev
```

Open http://localhost:5173.

The `art_portfolio` Supabase URL and anon key are set in `.env.example` —
copy them to `.env` to point at the live database. The gallery is seeded
with placeholder works for first-load development.

## Stripe

Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env` and implement a server endpoint
that returns a `clientSecret` for a `PaymentIntent`:

```
POST /api/create-payment-intent
body: { items: [{ artwork_id, quantity }] }
=>  { clientSecret }
```

`Checkout.tsx` will mount Stripe Elements as soon as the secret is provided.
Until then, the page renders a styled placeholder and routes shoppers to
the contact form for direct-invoice purchase.

## Schema

See migration `init_portfolio_schema` (applied to project `audihiewqxnhyavpqabw`):

- `artworks` — public-readable catalog.
- `contact_submissions` — public-insert (general + per-artwork inquiries).
- `orders` / `order_items` — RLS locked; written from a Stripe webhook backend.
