/* eslint-disable import/no-extraneous-dependencies */
const esbuild = require("esbuild");
const { readFile, writeFile, mkdir } = require("fs").promises;
const { minify } = require("html-minifier-terser");
const inlineImage = require("esbuild-plugin-inline-image");

(async () => {
  await mkdir("./dist");

  const script = await esbuild.build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["esnext"],
    write: false,
    outdir: "./dist",
    plugins: [inlineImage()]
  }).catch(() => process.exit(1));

  await writeFile(script.outputFiles[0].path, script.outputFiles[0].contents)

  const html = await readFile("src/index.html", "utf8");

  const minifyOptions = {
    collapseWhitespace: true,
    keepClosingSlash: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
  };

  await writeFile(
    "dist/index.html",
    `${await minify(
      html,
      minifyOptions
    )}<script>${script.outputFiles[1].text}</script>`
  );

})();
