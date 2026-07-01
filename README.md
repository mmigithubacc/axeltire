# Axel Tires — website

Modern marketing site for **Axel Tires**, a wholesale + retail tire shop in
Edmonton, AB. Built with [Astro](https://astro.build) and
[Tailwind CSS v4](https://tailwindcss.com).

The site is static (zero client framework, minimal JS) so it loads fast and
hosts anywhere — Netlify, Vercel, Cloudflare Pages, or any static host.

## Pages

| Route       | Purpose                                                        |
| ----------- | ------------------------------------------------------------- |
| `/`         | Home — hero, size finder, featured live stock, brand marquee, the Axel promise, dealer CTA |
| `/shop`     | Shop tires — filterable product grid with all-in pricing      |
| `/book`     | Book install — booking flow + email fallback                  |
| `/dealers`  | Dealer application form + "what happens next"                 |
| `/about`    | Company story and values                                      |
| `/contact`  | Contact form, hours, and details                             |
| `/faq`      | FAQ + warranty                                                |

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # build the static site to ./dist
npm run preview  # preview the production build locally
```

## Editing content

All business copy lives in two files so the site can be updated without
touching layout code:

- **`src/data/site.ts`** — name, contact, hours, nav, value props, brands,
  dealer stats, footer links.
- **`src/data/products.ts`** — tire inventory (brand, model, size, all-in
  price, stock level). In production this would come from the live inventory
  system; here it is a typed list that drives the shop and featured sections.

The brand logo at `src/components/Logo.astro` is a CSS/SVG approximation —
drop the official asset into `public/images/` and swap it in when ready.

## Notes on interactivity

The booking, dealer, and contact forms currently compose a prefilled email
(matching the "we email `hello@axeltire.ca` with your details" flow) since
there is no backend yet. Wire them to a form handler or the live ordering /
Stripe backend when that lands.

## Design tokens

Colors and fonts are defined in `src/styles/global.css` under `@theme`
(brand red, charcoal `ink`, cream footer, Barlow Condensed display, Inter
body, JetBrains Mono for meta text).
