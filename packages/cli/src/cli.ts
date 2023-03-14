#!/usr/bin/env node

import cac from "cac";
import * as path from "path";
import * as esbuild from "esbuild";
import { VERSION } from "./constants";
import * as fs from "node:fs/promises";
import chalk from "chalk";

const cli = cac("arx");
cli
  .command("dev <component-file>", "runns a dev server")
  .option("--skip-clean", "name of bundle file")

  // .option("-r, --recursive", "Remove recursively")
  .action(async (dir, options) => {
    const { skipClean } = options;
    // console.log("dir is ", dir, options);
    if (!skipClean) {
      cleanDir();
    }

    const inputFilePath = dir;

    const outputFilePath = path.join("dist", "bundle.js");

    const ctx = await esbuild.context({
      bundle: true,
      minify: false,
      sourcemap: true,
      entryPoints: [inputFilePath],
      outfile: outputFilePath,
    });
    let { host, port } = await ctx.serve();

    // console.log("server is ", host, port);

    console.log(`dev server running on http://${host}:${port} `);
  });

cli
  .command(
    "build <component-file> --outName ",
    "builds a production version to be deployed into khoros"
  )
  .option("--out-name", "name of bundle file")
  .option("--skip-clean", "name of bundle file")
  .action(async (dir, options) => {
    console.log("dir is ", options);
    const { outName, skipClean } = options;

    // clean current dist
    if (!skipClean) {
      cleanDir();
    }

    const inputFilePath = dir;

    const outputFilePath = path.join("dist", `${outName.split(".")[0]}.js`);

    const res = await esbuild.build({
      bundle: true,
      minify: true,
      entryPoints: [inputFilePath],
      outfile: outputFilePath,
    });

    const builtJSContent = fs.readFile(path.resolve(outputFilePath), {
      encoding: "utf-8",
    });

    console.log(chalk.blue(`build generated at ${outputFilePath}`));

    console.log("\n");

    const assetsUrl = `<community-url>/t5/bizapps/page/tab/community%3Astudio%3Acommunity-style%3Amisc?style=asset`;
    console.log(
      chalk.blue(`Upload generated bundle to khoros assets at \n ${assetsUrl}`)
    );

    // console.log("build done dude", (await builtJSContent).length);

    // console.log("server is ", host, port);
  });
cli.help();
cli.version(VERSION);

cli.parse();

async function cleanDir() {
  fs.readdir(path.resolve(path.join("dist"))).then((currentFiles) => {
    currentFiles.forEach((eachFilePath) => {
      fs.unlink(path.join("dist", eachFilePath));
    });
    // console.log("types ", typeof currentFiles, Array.isArray(currentFiles));
  });
}
