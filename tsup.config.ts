import { spawnSync } from 'node:child_process';
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  target: "es3",
  format: ["cjs"],
  async onSuccess() {
    spawnSync('bun build:zip', {
      shell: true,
      stdio: 'inherit'
    });
  },
  dts: false,
  outExtension() {
    return {
      js: ".js",
    };
  },
});
