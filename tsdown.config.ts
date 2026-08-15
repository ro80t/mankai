import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  dts: true,
  format: ["esm", "cjs"],
  tsconfig: "tsconfig.json",
  clean: true,
  banner: {
    js: '/* @ts-self-types="./index.d.mts" */',
  },
});
