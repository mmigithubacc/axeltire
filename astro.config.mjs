// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain before deploying (used for
// sitemap/canonical URLs and absolute Open Graph links).
export default defineConfig({
  site: 'https://www.axeltire.ca',
  // /book was retired (no installation service) — send any old links to shop.
  redirects: {
    '/book': '/shop',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
