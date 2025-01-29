import { $ } from "bun";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  target: "es3",
  format: ["cjs"],
  async onSuccess() {
    await $`rm extension.zip`;
    await $`zip -r extension.zip ./dist ./manifest.json`;
  },
  dts: false,
  outExtension() {
    return {
      js: ".js",
    };
  },
});
