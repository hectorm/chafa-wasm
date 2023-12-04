const fileSignatures = {
  "png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "jpeg": [0xff, 0xd8, 0xff],
  "webp": [0x52, 0x49, 0x46, 0x46],
};

Module["decodeImage"] = (image, callback) => {
  if (globalThis.ArrayBuffer && image instanceof ArrayBuffer) {
    try {
      let imageData;

      if (!imageData && image.byteLength >= fileSignatures.png.length) {
        const signature = new Uint8ClampedArray(image, 0, fileSignatures.png.length);
        if (signature.every((b, i) => b === fileSignatures.png[i])) {
          imageData = Module["_decode_png"](image);
        }
      }

      if (!imageData && image.byteLength >= fileSignatures.jpeg.length) {
        const signature = new Uint8ClampedArray(image, 0, fileSignatures.jpeg.length);
        if (signature.every((b, i) => b === fileSignatures.jpeg[i])) {
          imageData = Module["_decode_jpeg"](image);
        }
      }

      if (!imageData && image.byteLength >= fileSignatures.webp.length) {
        const signature = new Uint8ClampedArray(image, 0, fileSignatures.webp.length);
        if (signature.every((b, i) => b === fileSignatures.webp[i])) {
          imageData = Module["_decode_webp"](image);
        }
      }

      if (imageData?.width > 0 && imageData?.height > 0) {
        callback(null, imageData);
        return;
      }

      callback(new Error("Failed to decode image"), null);
      return;
    } catch (error) {
      callback(error, null);
      return;
    }
  } else if (
    ("width" in image && typeof image.width === "number") &&
    ("height" in image && typeof image.height === "number") &&
    ("data" in image && image.data instanceof Uint8ClampedArray)
  ) {
    callback(null, image);
    return;
  }

  callback(new Error("Unsupported image type"), null);
};

Module["imageToCanvas"] = (image, partialConfig, callback) => {
  Module["decodeImage"](image, (error, imageData) => {
    if (error != null || imageData == null) {
      callback(error, { "canvas": null, "config": null });
      return;
    }

    partialConfig = partialConfig ?? {};

    if (typeof partialConfig !== "object") {
      callback(new Error("Configuration must be an object"), { "canvas": null, "config": null });
      return;
    }

    const config = {};

    config["fontRatio"] = partialConfig["fontRatio"] != null
      ? typeof partialConfig["fontRatio"] !== "number"
        ? Number.parseFloat(partialConfig["fontRatio"])
        : partialConfig["fontRatio"]
      : 0.5;

    if (Number.isNaN(config["fontRatio"]) || config["fontRatio"] < 0) {
      callback(new Error("Font ratio must be at least 0"), { "canvas": null, "config": null });
      return;
    }

    if (partialConfig["width"] == null && partialConfig["height"] == null) {
      if (imageData.width > imageData.height) {
        /** @type {number} */
        config["width"] = 80;
        config["height"] = Math.round((imageData.height / imageData.width) * (config["width"] * config["fontRatio"]));
      } else {
        config["height"] = 25;
        config["width"] = Math.round((imageData.width / imageData.height) * (config["height"] / config["fontRatio"]));
      }
    } else if (partialConfig["width"] != null && partialConfig["height"] == null) {
      config["width"] = typeof partialConfig["width"] !== "number"
        ? Number.parseInt(partialConfig["width"], 10)
        : partialConfig["width"] | 0;
      config["height"] = Math.round((imageData.height / imageData.width) * (config["width"] * config["fontRatio"]));
    } else if (partialConfig["width"] == null && partialConfig["height"] != null) {
      config["height"] = typeof partialConfig["height"] !== "number"
        ? Number.parseInt(partialConfig["height"], 10)
        : partialConfig["height"] | 0;
      config["width"] = Math.round((imageData.width / imageData.height) * (config["height"] / config["fontRatio"]));
    } else if (partialConfig["width"] != null && partialConfig["height"] != null) {
      config["width"] = typeof partialConfig["width"] !== "number"
        ? Number.parseInt(partialConfig["width"], 10)
        : partialConfig["width"] | 0;
      config["height"] = typeof partialConfig["height"] !== "number"
        ? Number.parseInt(partialConfig["height"], 10)
        : partialConfig["height"] | 0;
    }

    if (Number.isNaN(config["width"]) || config["width"] < 1) {
      callback(new Error("Width must be at least 1"), { "canvas": null, "config": null });
      return;
    }

    if (Number.isNaN(config["height"]) || config["height"] < 1) {
      callback(new Error("Height must be at least 1"), { "canvas": null, "config": null });
      return;
    }

    config["colors"] = partialConfig["colors"] != null
      ? Module["ChafaCanvasMode"][partialConfig["colors"]]?.value ??
        Module["ChafaCanvasMode"].values[partialConfig["colors"]]?.value
      : Module["ChafaCanvasMode"]["CHAFA_CANVAS_MODE_TRUECOLOR"].value;

    if (config["colors"] == null) {
      callback(new Error("Invalid color mode"), { "canvas": null, "config": null });
      return;
    }

    config["colorExtractor"] = partialConfig["colorExtractor"] != null
      ? Module["ChafaColorExtractor"][partialConfig["colorExtractor"]]?.value ??
        Module["ChafaColorExtractor"].values[partialConfig["colorExtractor"]]?.value
      : Module["ChafaColorExtractor"]["CHAFA_COLOR_EXTRACTOR_AVERAGE"].value;

    if (config["colorExtractor"] == null) {
      callback(new Error("Invalid color extractor"), { "canvas": null, "config": null });
      return;
    }

    config["colorSpace"] = partialConfig["colorSpace"] != null
      ? Module["ChafaColorSpace"][partialConfig["colorSpace"]]?.value ??
        Module["ChafaColorSpace"].values[partialConfig["colorSpace"]]?.value
      : Module["ChafaColorSpace"]["CHAFA_COLOR_SPACE_RGB"].value;

    if (config["colorSpace"] == null) {
      callback(new Error("Invalid color space"), { "canvas": null, "config": null });
      return;
    }

    config["symbols"] = partialConfig["symbols"] != null
      ? String(partialConfig["symbols"])
      : config["colors"] === Module["ChafaCanvasMode"]["CHAFA_CANVAS_MODE_FGBG"].value
        ? "block+border+space-wide"
        : "block+border+space-wide-inverted";

    if (!config["symbols"]) {
      callback(new Error("Symbol map cannot be empty"), { "canvas": null, "config": null });
      return;
    }

    config["fill"] = partialConfig["fill"] != null
      ? String(partialConfig["fill"])
      : "none";

    config["fg"] = partialConfig["fg"] != null
      ? typeof partialConfig["fg"] !== "number"
        ? String(partialConfig["fg"]).startsWith("#")
          ? Number.parseInt(partialConfig["fg"].slice(1), 16)
          : Number.parseInt(partialConfig["fg"], 10)
        : partialConfig["fg"] | 0
      : 0xffffff;

    if (Number.isNaN(config["fg"]) || config["fg"] < 0 || config["fg"] > 0xffffff) {
      callback(new Error("Foreground color must be between 0 and 0xffffff"), { "canvas": null, "config": null });
      return;
    }

    config["bg"] = partialConfig["bg"] != null
      ? typeof partialConfig["bg"] !== "number"
        ? String(partialConfig["bg"]).startsWith("#")
          ? Number.parseInt(partialConfig["bg"].slice(1), 16)
          : Number.parseInt(partialConfig["bg"], 10)
        : partialConfig["bg"] | 0
      : 0x000000;

    if (Number.isNaN(config["bg"]) || config["bg"] < 0 || config["bg"] > 0xffffff) {
      callback(new Error("Background color must be between 0 and 0xffffff"), { "canvas": null, "config": null });
      return;
    }

    config["fgOnly"] = partialConfig["fgOnly"] != null
      ? typeof partialConfig["fgOnly"] !== "boolean"
        ? ["true", "yes", "on"].includes(String(partialConfig["fgOnly"]).toLowerCase())
        : partialConfig["fgOnly"]
      : false;

    config["dither"] = partialConfig["dither"] != null
      ? Module["ChafaDitherMode"][partialConfig["dither"]]?.value ??
        Module["ChafaDitherMode"].values[partialConfig["dither"]]?.value
      : Module["ChafaDitherMode"]["CHAFA_DITHER_MODE_NONE"].value;

    if (config["dither"] == null) {
      callback(new Error("Invalid dither mode"), { "canvas": null, "config": null });
      return;
    }

    config["ditherGrainWidth"] = partialConfig["ditherGrainWidth"] != null
      ? typeof partialConfig["ditherGrainWidth"] !== "number"
        ? Number.parseInt(partialConfig["ditherGrainWidth"], 10)
        : partialConfig["ditherGrainWidth"] | 0
      : 4;

    if (![1, 2, 4, 8].includes(config["ditherGrainWidth"])) {
      callback(new Error("Grain width must be exactly 1, 2, 4 or 8"), { "canvas": null, "config": null });
      return;
    }

    config["ditherGrainHeight"] = partialConfig["ditherGrainHeight"] != null
      ? typeof partialConfig["ditherGrainHeight"] !== "number"
        ? Number.parseInt(partialConfig["ditherGrainHeight"], 10)
        : partialConfig["ditherGrainHeight"] | 0
      : config["ditherGrainWidth"];

    if (![1, 2, 4, 8].includes(config["ditherGrainHeight"])) {
      callback(new Error("Grain height must be exactly 1, 2, 4 or 8"), { "canvas": null, "config": null });
      return;
    }

    config["ditherIntensity"] = partialConfig["ditherIntensity"] != null
      ? typeof partialConfig["ditherIntensity"] !== "number"
        ? Number.parseFloat(partialConfig["ditherIntensity"])
        : partialConfig["ditherIntensity"]
      : 1.0;

    if (Number.isNaN(config["ditherIntensity"]) || config["ditherIntensity"] < 0) {
      callback(new Error("Dither intensity must be at least 0"), { "canvas": null, "config": null });
      return;
    }

    config["preprocess"] = partialConfig["preprocess"] != null
      ? typeof partialConfig["preprocess"] !== "boolean"
        ? ["true", "yes", "on"].includes(String(partialConfig["preprocess"]).toLowerCase())
        : partialConfig["preprocess"]
      : true;

    config["threshold"] = partialConfig["threshold"] != null
      ? typeof partialConfig["threshold"] !== "number"
        ? Number.parseFloat(partialConfig["threshold"])
        : partialConfig["threshold"]
      : 0.5;

    if (Number.isNaN(config["threshold"]) || config["threshold"] < 0 || config["threshold"] > 1) {
      callback(new Error("Transparency threshold must be between 0 and 1"), { "canvas": null, "config": null });
      return;
    }

    config["optimize"] = partialConfig["optimize"] != null
      ? typeof partialConfig["optimize"] !== "number"
        ? Number.parseInt(partialConfig["optimize"], 10)
        : partialConfig["optimize"] | 0
      : config["colors"] === Module["ChafaCanvasMode"]["CHAFA_CANVAS_MODE_FGBG"].value
        ? 0
        : 5;

    if (Number.isNaN(config["optimize"]) || config["optimize"] < 0 || config["optimize"] > 9) {
      callback(new Error("Optimization level must be between 0 and 9"), { "canvas": null, "config": null });
      return;
    }

    config["work"] = partialConfig["work"] != null
      ? typeof partialConfig["work"] !== "number"
        ? Number.parseInt(partialConfig["work"], 10)
        : partialConfig["work"] | 0
      : 5;

    if (Number.isNaN(config["work"]) || config["work"] < 1 || config["work"] > 9) {
      callback(new Error("Work factor must be between 1 and 9"), { "canvas": null, "config": null });
      return;
    }

    Object.freeze(config);

    const optimizations = Module["ChafaOptimizations"]["CHAFA_OPTIMIZATION_NONE"].value
      | (config["optimize"] >= 1 ? Module["ChafaOptimizations"]["CHAFA_OPTIMIZATION_REUSE_ATTRIBUTES"].value : 0)
      | (config["optimize"] >= 6 ? Module["ChafaOptimizations"]["CHAFA_OPTIMIZATION_REPEAT_CELLS"].value : 0)
      | (config["optimize"] >= 7 ? Module["ChafaOptimizations"]["CHAFA_OPTIMIZATION_SKIP_CELLS"].value : 0);

    const workFactor = (config["work"] - 1) / 8;

    let pixelsPtr;
    let symbolMapPtr, symbolMapSelPtr;
    let fillSymbolMapPtr, fillSymbolMapSelPtr;
    let canvasConfigPtr, canvasPtr;
    try {
      // Allocate memory for the pixels
      const pixelsSize = imageData.data.length * imageData.data.BYTES_PER_ELEMENT;
      pixelsPtr = Module["_malloc"](pixelsSize);
      const pixelsHeap = new Uint8ClampedArray(Module["HEAPU8"].buffer, pixelsPtr, pixelsSize);
      pixelsHeap.set(imageData.data);

      // Allocate memory for the symbol map selectors
      const symbolMapSelLen = Module["lengthBytesUTF8"](config["symbols"]);
      symbolMapSelPtr = Module["_malloc"](symbolMapSelLen + 1);
      Module["stringToUTF8"](config["symbols"], symbolMapSelPtr, symbolMapSelLen + 1);

      // Create symbol map
      symbolMapPtr = Module["_chafa_symbol_map_new"]();
      Module["_chafa_symbol_map_apply_selectors"](symbolMapPtr, symbolMapSelPtr);

      // Allocate memory for the fill symbol map selectors
      const fillSymbolMapSelLen = Module["lengthBytesUTF8"](config["symbols"]);
      fillSymbolMapSelPtr = Module["_malloc"](fillSymbolMapSelLen + 1);
      Module["stringToUTF8"](config["fill"], fillSymbolMapSelPtr, fillSymbolMapSelLen + 1);

      // Create fill symbol map
      fillSymbolMapPtr = Module["_chafa_symbol_map_new"]();
      Module["_chafa_symbol_map_apply_selectors"](fillSymbolMapPtr, fillSymbolMapSelPtr);

      // Specify canvas configuration
      canvasConfigPtr = Module["_chafa_canvas_config_new"]();
      Module["_chafa_canvas_config_set_geometry"](canvasConfigPtr, config["width"], config["height"]);
      Module["_chafa_canvas_config_set_passthrough"](canvasConfigPtr, Module["ChafaPassthrough"]["CHAFA_PASSTHROUGH_NONE"].value);
      Module["_chafa_canvas_config_set_pixel_mode"](canvasConfigPtr, Module["ChafaPixelMode"]["CHAFA_PIXEL_MODE_SYMBOLS"].value);
      Module["_chafa_canvas_config_set_symbol_map"](canvasConfigPtr, symbolMapPtr);
      Module["_chafa_canvas_config_set_fill_symbol_map"](canvasConfigPtr, fillSymbolMapPtr);
      Module["_chafa_canvas_config_set_canvas_mode"](canvasConfigPtr, config["colors"]);
      Module["_chafa_canvas_config_set_color_extractor"](canvasConfigPtr, config["colorExtractor"]);
      Module["_chafa_canvas_config_set_color_space"](canvasConfigPtr, config["colorSpace"]);
      Module["_chafa_canvas_config_set_fg_color"](canvasConfigPtr, config["fg"]);
      Module["_chafa_canvas_config_set_bg_color"](canvasConfigPtr, config["bg"]);
      Module["_chafa_canvas_config_set_fg_only_enabled"](canvasConfigPtr, config["fgOnly"]);
      Module["_chafa_canvas_config_set_dither_mode"](canvasConfigPtr, config["dither"]);
      Module["_chafa_canvas_config_set_dither_grain_size"](canvasConfigPtr, config["ditherGrainWidth"], config["ditherGrainHeight"]);
      Module["_chafa_canvas_config_set_dither_intensity"](canvasConfigPtr, config["ditherIntensity"]);
      Module["_chafa_canvas_config_set_preprocessing_enabled"](canvasConfigPtr, config["preprocess"]);
      Module["_chafa_canvas_config_set_transparency_threshold"](canvasConfigPtr, config["threshold"]);
      Module["_chafa_canvas_config_set_optimizations"](canvasConfigPtr, optimizations);
      Module["_chafa_canvas_config_set_work_factor"](canvasConfigPtr, workFactor);

      // Create canvas
      canvasPtr = Module["_chafa_canvas_new"](canvasConfigPtr);

      // Draw pixels to the canvas
      Module["_chafa_canvas_draw_all_pixels"](
        canvasPtr,
        Module["ChafaPixelType"]["CHAFA_PIXEL_RGBA8_UNASSOCIATED"].value,
        pixelsPtr,
        imageData.width,
        imageData.height,
        imageData.width * 4
      );

      // Pass canvas to callback
      callback(null, { "canvas": canvasPtr, "config": config });
    } catch (error) {
      callback(error, { "canvas": null, "config": null });
    } finally {
      if (canvasPtr != null) Module["_chafa_canvas_unref"](canvasPtr);
      if (canvasConfigPtr != null) Module["_chafa_canvas_config_unref"](canvasConfigPtr);
      if (symbolMapPtr != null) Module["_chafa_symbol_map_unref"](symbolMapPtr);
      if (symbolMapSelPtr != null) Module["_free"](symbolMapSelPtr);
      if (fillSymbolMapPtr != null) Module["_chafa_symbol_map_unref"](fillSymbolMapPtr);
      if (fillSymbolMapSelPtr != null) Module["_free"](fillSymbolMapSelPtr);
      if (pixelsPtr != null) Module["_free"](pixelsPtr);
    }
  });
};

Module["imageToMatrix"] = (image, partialConfig, callback) => {
  Module["imageToCanvas"](image, partialConfig, (error, { canvas, config }) => {
    if (error != null || canvas == null || config == null) {
      callback(error, { "matrix": null, "config": null });
      return;
    }

    const matrix = Array(config["height"]);
    for (let y = 0; y < config["height"]; y++) {
      matrix[y] = Array(config["width"]);

      for (let x = 0; x < config["width"]; x++) {
        let fgPtr, bgPtr;
        try {
          const char = Module["_chafa_canvas_get_char_at"](canvas, x, y);

          let fg, bg;
          if (config["colors"] === Module["ChafaCanvasMode"]["CHAFA_CANVAS_MODE_FGBG"].value) {
            fg = config["fg"];
            bg = -1;
          } else {
            fgPtr = Module["_malloc"](4);
            bgPtr = Module["_malloc"](4);
            Module["_chafa_canvas_get_colors_at"](canvas, x, y, fgPtr, bgPtr);
            fg = Module["getValue"](fgPtr, "i32");
            bg = Module["getValue"](bgPtr, "i32");
          }

          matrix[y][x] = [char, fg, bg];
        } catch (error) {
          callback(error, { "matrix": null, "config": null });
          return;
        } finally {
          if (fgPtr != null) Module["_free"](fgPtr);
          if (bgPtr != null) Module["_free"](bgPtr);
        }
      }
    }

    callback(null, { "matrix": matrix, "config": config });
  });
};

Module["imageToAnsi"] = (image, partialConfig, callback) => {
  Module["imageToCanvas"](image, partialConfig, (error, { canvas, config }) => {
    if (error != null || canvas == null || config == null) {
      callback(error, { "ansi": null, "config": null });
      return;
    }

    let gstrPtr, charPtr;
    try {
      gstrPtr = Module["_chafa_canvas_print"](canvas, null);
      charPtr = Module["_g_string_free_and_steal"](gstrPtr);

      const ansi = Module["UTF8ToString"](charPtr);
      callback(null, { "ansi": ansi, "config": config });
    } catch (error) {
      callback(error, { "ansi": null, "config": null });
    } finally {
      if (gstrPtr != null) Module["_free"](gstrPtr);
      if (charPtr != null) Module["_free"](charPtr);
    }
  });
};

Module["imageToHtml"] = (image, partialConfig, callback) => {
  Module["imageToMatrix"](image, partialConfig, (error, { matrix, config }) => {
    if (error != null || matrix == null || config == null) {
      callback(error, { "html": null, "config": null });
      return;
    }

    let html = "";
    for (let y = 0; y < config["height"]; y++) {
      for (let x = 0; x < config["width"]; x++) {
        const [char, fg, bg] = matrix[y][x];
        if (char < 1) continue;
        const fgCss = fg > -1 ? `#${fg.toString(16).padStart(6, "0")}` : "transparent";
        const bgCss = bg > -1 ? `#${bg.toString(16).padStart(6, "0")}` : "transparent";
        html += `<span style="color:${fgCss};background:${bgCss}">&#${char};</span>`;
      }
      if (y < config["height"] - 1) {
        html += "\n";
      }
    }

    callback(null, { "html": html, "config": config });
  });
};

Module["imageToConsoleLogArgs"] = (image, partialConfig, callback) => {
  Module["imageToMatrix"](image, partialConfig, (error, { matrix, config }) => {
    if (error != null || matrix == null || config == null) {
      callback(error, { "args": null, "config": null });
      return;
    }

    const args = Array(config["width"] * config["height"] + 1);
    args[0] = "";

    for (let y = 0; y < config["height"]; y++) {
      for (let x = 0; x < config["width"]; x++) {
        const [char, fg, bg] = matrix[y][x];
        if (char < 1) continue;
        const fgCss = fg > -1 ? `#${fg.toString(16).padStart(6, "0")}` : "transparent";
        const bgCss = bg > -1 ? `#${bg.toString(16).padStart(6, "0")}` : "transparent";
        args[0] += `%c${char === 37 ? "%%" : String.fromCodePoint(char)}`;
        args[config["width"] * y + x + 1] = `color:${fgCss};background:${bgCss}`;
      }
      if (y < config["height"] - 1) {
        args[0] += "\n";
      }
    }

    callback(null, { "args": args, "config": config });
  });
};
