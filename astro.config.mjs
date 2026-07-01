// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Pages stay static (fast + SEO); only the API routes under /api opt into
// on-demand rendering (they set `export const prerender = false`), which the
// Vercel adapter turns into serverless functions — used for Stripe payments.
export default defineConfig({
  site: 'https://www.axeltire.ca',
  output: 'static',
  adapter: vercel(),
  // /book was retired (no installation service) — send any old links to shop.
  redirects: {
    '/book': '/shop',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
