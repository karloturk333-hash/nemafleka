// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output, deployed on Vercel (auto-detected). Zero JS except client islands.
export default defineConfig({
  site: 'https://nemafleka.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = new Date().toISOString();
        return { ...item, lastmod };
      },
    }),
  ],
  build: { inlineStylesheets: 'always' },
});
