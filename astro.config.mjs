// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output, deployed on Vercel (auto-detected). Zero JS except client islands.
export default defineConfig({
  site: 'https://nemafleka.com',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
