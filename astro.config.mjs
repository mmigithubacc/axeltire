// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Update `site` to the production domain before deploying (used for
// sitemap/canonical URLs and absolute Open Graph links).
export default defineConfig({
  site: 'https://www.axeltire.ca',
  vite: {
    plugins: [tailwindcss()],
  },
});
