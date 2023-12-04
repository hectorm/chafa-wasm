# Chafa WebAssembly module

Have you ever wanted to convert an image into a much less efficient and lower quality text representation? No? Well, with this module you can.

With this [Chafa](https://hpjansson.org/chafa/) port to WebAssembly you can convert an image into various text formats like ANSI escape codes, HTML or `console.log` arguments in Node.js, Deno, Bun and web browsers.

<p align="center">

![](./assets/preview.webp)

</p>

This module uses [Emscripten/Embind](https://emscripten.org) to expose low-level bindings of [libchafa](https://hpjansson.org/chafa/ref/) and also includes a higher-level API for the most common scenarios, see the [`docs/`](docs/README.md) directory for details.

If you just want to play with the parameters interactively, a demo application is also available [here](https://hectorm.github.io/chafa-wasm/).

## Usage

### Installation

```sh
npm install chafa-wasm
```

### Example code

```js
import { promises as fs } from "node:fs";
import { promisify } from "node:util";
import { stdout } from "node:process";
import Chafa from "chafa-wasm";

const chafa = await Chafa();
const imageToAnsi = promisify(chafa.imageToAnsi);

const image = await fs.readFile("./example.png");
const { ansi } = await imageToAnsi(image.buffer, {
  width: 80,
  fontRatio: 0.5,
  colors: 0,
  colorExtractor: 0,
  colorSpace: 0,
  symbols: "block+border+space-wide-inverted",
  fill: "none",
  fg: 0xffffff,
  bg: 0x000000,
  fgOnly: false,
  dither: 0,
  ditherGrainWidth: 4,
  ditherGrainHeight: 4,
  ditherIntensity: 1,
  preprocess: true,
  threshold: 0.5,
  optimize: 5,
  work: 5,
});

stdout.write(ansi);
```
