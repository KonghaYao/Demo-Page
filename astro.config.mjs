import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), tailwind()],
  output: 'hybrid',
  experimental: {
    hybridOutput: true
  },
  adapter: netlify()
});