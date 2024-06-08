/**
 * A factory function that returns a promise that resolves to a ChafaModule object.
 */
interface ChafaFactory {
  (moduleArg?: { [x: string | number | symbol]: any }): Promise<ChafaModule>;
}

/**
 * An object that contains the Chafa WebAssembly module API.
 */
interface ChafaModule {
  /**
   * Decodes a PNG, JPEG or WebP image into an ImageDataLike object.
   * If an already decoded image is specified, it will be left as is.
   */
  decodeImage: {
    (
      image: ArrayBuffer | ImageDataLike,
      callback: Callback<ImageDataLike>
    ): void;
  };

  /**
   * Converts an image into a Chafa canvas pointer.
   */
  imageToCanvas: {
    (
      image: ArrayBuffer | ImageDataLike,
      config: PartialChafaConfig,
      callback: Callback<{ canvas: number; config: ReadonlyChafaConfig | null }>
    ): void;
  };

  /**
   * Converts an image into a matrix of characters.
   */
  imageToMatrix: {
    (
      image: ArrayBuffer | ImageDataLike,
      config: PartialChafaConfig,
      callback: Callback<{ matrix: number[][][]; config: ReadonlyChafaConfig | null }>
    ): void;
  };

  /**
   * Converts an image into an ANSI string.
   */
  imageToAnsi: {
    (
      image: ArrayBuffer | ImageDataLike,
      config: PartialChafaConfig,
      callback: Callback<{ ansi: string; config: ReadonlyChafaConfig | null }>
    ): void;
  };

  /**
   * Converts an image into an HTML string.
   */
  imageToHtml: {
    (
      image: ArrayBuffer | ImageDataLike,
      config: PartialChafaConfig,
      callback: Callback<{ html: string; config: ReadonlyChafaConfig | null }>
    ): void;
  };

  /**
   * Converts an image into an array of `console.log` arguments.
   */
  imageToConsoleLogArgs: {
    (
      image: ArrayBuffer | ImageDataLike,
      config: PartialChafaConfig,
      callback: Callback<{ args: string[]; config: ReadonlyChafaConfig | null }>
    ): void;
  };

  [x: string | number | symbol]: any;
}

/**
 * An object that holds the output configuration.
 * Supports most of the options of the Chafa command-line utility, see its documentation for details.
 * @see https://hpjansson.org/chafa/man/
 */
type ChafaConfig = {
  format: number | string,
  width: number;
  height: number;
  fontRatio: number;
  colors: number | string;
  colorExtractor: number | string;
  colorSpace: number | string;
  symbols: string;
  fill: string;
  fg: number;
  bg: number;
  fgOnly: boolean;
  dither: number | string;
  ditherGrainWidth: number;
  ditherGrainHeight: number;
  ditherIntensity: number;
  preprocess: boolean;
  threshold: number;
  optimize: number;
  work: number;
};

type PartialChafaConfig = {
  [P in keyof ChafaConfig]?: ChafaConfig[P] | string;
};

type ReadonlyChafaConfig = {
  readonly [P in keyof ChafaConfig]: ChafaConfig[P];
};

type ImageDataLike = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  [x: string | number | symbol]: any;
};

type Callback<T> = (error: unknown, data: T) => void;

declare module "chafa-wasm" {
  const factory: ChafaFactory;
  export default factory;
}
