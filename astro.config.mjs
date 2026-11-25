import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

export default defineConfig({
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
      transformers: [
        {
          pre(node) {
            node.properties.tabindex = 0;
            node.properties.role = 'region';
            node.properties['aria-label'] = 'Code example';
          },
        },
      ],
    },
  },
  site: site.url,
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
