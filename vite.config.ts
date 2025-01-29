import { spawnSync } from "node:child_process";
import path from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
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
      formats: ["cjs"],
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
