import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({ imports: ["vue"], vueTemplate: true })],
  publicDir: false,
  build: {
    lib: {
      entry: "src/index.ts",
      name: "dominator",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          dominator: "dominator",
        },
      },
    },
  },
});
