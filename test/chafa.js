#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { promisify } from "node:util";
import { argv, exit, stdout } from "node:process";

/** @type {ChafaFactory} */
// @ts-expect-error
const Chafa = (await import("../dist/chafa.js")).default;

const chafa = await Chafa();
const imageToAnsi = promisify(chafa.imageToAnsi);

const path = argv[2];
if (!path) exit(1);

const image = await fs.readFile(path);
const { ansi } = await imageToAnsi(image.buffer, {
  height: Math.min(stdout?.rows - 1 || 25, 50),
});

stdout.write(ansi);
stdout.write("\n");
