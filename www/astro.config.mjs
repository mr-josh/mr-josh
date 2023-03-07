import { defineConfig } from "astro/config";
import { resolve } from "path";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        components: resolve("./src/components"),
        layouts: resolve("./src/layouts"),
        pages: resolve("./src/pages")
      }
    }
  },
  integrations: [tailwind(), react()]
});