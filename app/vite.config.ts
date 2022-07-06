import { defineConfig } from "vite";
import path from "path";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      api: path.resolve("./src/api"),
      auth: path.resolve("./src/auth"),
      theme: path.resolve("./src/theme"),
    },
  },
});
