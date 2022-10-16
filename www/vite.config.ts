import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: resolve("./src/components"),
      db: resolve("./src/db"),
      hooks: resolve("./src/hooks"),
      pages: resolve("./src/pages"),
      theme: resolve("./src/theme"),
      util: resolve("./src/util"),
    },
  },
});
