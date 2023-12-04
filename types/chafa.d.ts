declare module "chafa-wasm" {
  const factory: ChafaFactory;
  export default factory;
}

/**
 * A factory function that returns a promise that resolves to a ChafaModule object.
 */
declare interface ChafaFactory {
  (moduleArg?: { [x: string | number | symbol]: any }): Promise<ChafaModule>;
}

/**
 * An object that contains the Chafa WebAssembly module API.
 */
declare interface ChafaModule {
  /**
   * Decodes a PNG, JPEG or WebP image into an ImageDataLike object.
   * If an already decoded image is specified, it will be left as is.
   */
  decodeImage: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      callback: {
        /** Success callback. */
        (error: null, image: ImageDataLike): void;
        /** Error callback. */
        (error: unknown, image: null): void;
      }
    ): void;
  };

  /**
   * Converts an image into a Chafa canvas pointer.
   */
  imageToCanvas: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      config: PartialChafaConfig,
      callback: {
        /** Success callback. */
        (
          error: null,
          data: { canvas: number; config: ReadonlyChafaConfig }
        ): void;
        /** Error callback. */
        (error: unknown, data: { canvas: null; config: null }): void;
      }
    ): void;
  };

  /**
   * Converts an image into a matrix of characters.
   */
  imageToMatrix: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      config: PartialChafaConfig,
      callback: {
        /** Success callback. */
        (
          error: null,
          data: { matrix: number[][][]; config: ReadonlyChafaConfig }
        ): void;
        /** Error callback. */
        (error: unknown, data: { matrix: null; config: null }): void;
      }
    ): void;
  };

  /**
   * Converts an image into an ANSI string.
   */
  imageToAnsi: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      config: PartialChafaConfig,
      callback: {
        /** Success callback. */
        (
          error: null,
          data: { ansi: string; config: ReadonlyChafaConfig }
        ): void;
        /** Error callback. */
        (error: unknown, data: { ansi: null; config: null }): void;
      }
    ): void;
  };

  /**
   * Converts an image into an HTML string.
   */
  imageToHtml: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      config: PartialChafaConfig,
      callback: {
        /** Success callback. */
        (
          error: null,
          data: { html: string; config: ReadonlyChafaConfig }
        ): void;
        /** Error callback. */
        (error: unknown, data: { html: null; config: null }): void;
      }
    ): void;
  };

  /**
   * Converts an image into an array of `console.log` arguments.
   */
  imageToConsoleLogArgs: {
    (
      image: ArrayBuffer | ImageData | ImageDataLike,
      config: PartialChafaConfig,
      callback: {
        /** Success callback. */
        (
          error: null,
          data: { args: string[]; config: ReadonlyChafaConfig }
        ): void;
        /** Error callback. */
        (error: unknown, data: { args: null; config: null }): void;
      }
    ): void;
  };

  [x: string | number | symbol]: any;
}

/**
 * An object that holds the output configuration.
 * Supports most of the options of the Chafa command-line utility, see its documentation for details.
 * @see https://hpjansson.org/chafa/man/
 */
declare type ChafaConfig = {
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

declare type PartialChafaConfig = {
  [P in keyof ChafaConfig]?: ChafaConfig[P] | string;
};

declare type ReadonlyChafaConfig = {
  readonly [P in keyof ChafaConfig]: ChafaConfig[P];
};

declare type ImageDataLike = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  [x: string | number | symbol]: any;
};
