#!/usr/bin/env node

import { argv, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { promises as fs } from "node:fs";
import { promisify } from "node:util";
import { Worker, isMainThread, parentPort } from "node:worker_threads";

if (isMainThread) {
  for (let i = 0; i < 6; i++) {
    const worker = new Worker(fileURLToPath(import.meta.url), {
      argv: argv.slice(2),
    });

    // Wait for the worker to be ready.
    await new Promise((resolve) => worker.once("message", resolve));

    worker.once("message", (result) => {
      console.info(result);
      worker.terminate();
    });

    worker.once("error", (error) => {
      console.error(error);
      worker.terminate();
      exit(1);
    });

    worker.postMessage({ i });

    // Wait for the worker to finish.
    await new Promise((resolve) => worker.once("exit", resolve));
  }
} else {
  /** @type {ChafaFactory} */
  // @ts-expect-error
  const Chafa = (await import("../dist/chafa.js")).default;

  const chafa = await Chafa();
  const decodeImage = promisify(chafa.decodeImage);
  const imageToCanvas = promisify(chafa.imageToCanvas);
  const imageToMatrix = promisify(chafa.imageToMatrix);
  const imageToAnsi = promisify(chafa.imageToAnsi);
  const imageToHtml = promisify(chafa.imageToHtml);
  const imageToConsoleLogArgs = promisify(chafa.imageToConsoleLogArgs);

  const path = argv[2];
  if (!path) exit(1);

  const image = await fs.readFile(path);
  /** @type {Array<[string, () => Promise<any>]>} */
  const functions = [
    ["decodeImage", () => decodeImage(image.buffer)],
    ["imageToCanvas", () => imageToCanvas(image.buffer, {})],
    ["imageToMatrix", () => imageToMatrix(image.buffer, {})],
    ["imageToAnsi", () => imageToAnsi(image.buffer, {})],
    ["imageToHtml", () => imageToHtml(image.buffer, {})],
    ["imageToConsoleLogArgs", () => imageToConsoleLogArgs(image.buffer, {})],
  ];

  parentPort?.on("message", async ({ i }) => {
    const [name, func] = functions[i];

    const iterations = 1000;
    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) await func();
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const fnTime = (totalTime / iterations).toFixed(10);
    const ops = ((1000 / totalTime) * iterations).toFixed(2);

    parentPort?.postMessage(
      `Execution time for ${name}:\n` +
        `  total: ${totalTime} ms, time: ${fnTime} ms, op/sec: ${ops}`
    );
  });

  parentPort?.postMessage("ready");
}
