/// <reference types="vitest" />
import { spawnSync } from "node:child_process";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid(),
    {
      name: "compile-css",
      writeBundle() {
        spawnSync("pnpm build:css", {
          shell: true,
          stdio: "ignore",
        });
      },
    },
    {
      name: "zip-code",
      writeBundle() {
        spawnSync("pnpm build:zip", {
          shell: true,
          stdio: "ignore",
        });
      },
    },
  ],
  test: {
    environment: "jsdom",
    globals: true,
  },
  build: {
    lib: {
      entry: "./src/index.tsx",
      fileName: "index",
      formats: ["es"],
    },
  },
});
