/// <reference types="vitest" />
import { defineConfig } from "vite";
import type { UserConfig as VitestUserConfigInterface } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

const vitestConfig: VitestUserConfigInterface = {
  test: {
    // vitest config, with helpful vitest typing :)
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
    open: true,
    include: ["./test/**/*.{test,spec}.ts"],
  },
};

const env = process.env.NODE_ENV;

console.log("env", env);

// https://vitejs.dev/config/
export default defineConfig({
  test: vitestConfig.test,
  plugins: [vue(), AutoImport({ imports: ["vue"], vueTemplate: true })],
  publicDir: env === "production" ? false : "./public",
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
