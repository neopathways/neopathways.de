import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import astroTypesafeAPI from 'astro-typesafe-api';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import markdownIntegration from "@astropub/md";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind(), astroTypesafeAPI(), mdx(), markdownIntegration()],
  output: "server",
  devToolbar: {
    enabled: false
  },
  site: "https://neopathways.de",
  server: {
    port: 4321,
    open: "/"
  },
  adapter: node({
    mode: "standalone"
  })
});