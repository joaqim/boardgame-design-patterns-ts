/* eslint-disable import/no-extraneous-dependencies */
const esbuild = require("esbuild");

const results = esbuild.buildSync({
  entryPoints: ["src/index.ts"],
  outdir: "lib",
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  format: "esm",
  target: ["esnext"],
});

if (results.errors.length + results.warnings.length > 0) {
  // eslint-disable-next-line no-console
  console.log(...results);
}
