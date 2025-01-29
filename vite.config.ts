import { spawnSync } from "node:child_process";
import path from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid(),
    {
      name: "zip-code",
      writeBundle() {
        spawnSync("bun build:zip", {
          shell: true,
          stdio: "inherit",
        });
      },
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.tsx"),
      fileName: "index",
      name: "kore",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: true,
    outDir: "dist",
  },
});
