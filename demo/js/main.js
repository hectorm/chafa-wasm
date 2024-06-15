/** @type {Worker} */
const chafaWorker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

/** @type {(name: string, args?: any[], transferables?: Transferable[]) => Promise<any>} */
const chafaWorkerExec = (name, args = [], transferables = []) => {
  const channel = new MessageChannel();
  chafaWorker.postMessage([name, args], [channel.port1, ...transferables]);
  return new Promise((resolve) => {
    channel.port2.onmessage = (event) => resolve(event.data);
  });
};

/** @type {(image: ImageDataLike, config: PartialChafaConfig) => Promise<{ ansi: string; config: ReadonlyChafaConfig }>} */
const chafaImageToAnsi = async (image, config = {}) => {
  const res = await chafaWorkerExec("imageToAnsi", [image, config]);
  if (res[0]) throw res[0];
  return res[1];
};

/** @type {(image: ImageDataLike, config: PartialChafaConfig) => Promise<{ html: string; config: ReadonlyChafaConfig }>} */
const chafaImageToHtml = async (image, config = {}) => {
  const res = await chafaWorkerExec("imageToHtml", [image, config]);
  if (res[0]) throw res[0];
  return res[1];
};

/** @type {(image: ImageDataLike, config: PartialChafaConfig) => Promise<{ args: string[]; config: ReadonlyChafaConfig }>} */
const chafaImageToConsoleLogArgs = async (image, config = {}) => {
  const res = await chafaWorkerExec("imageToConsoleLogArgs", [image, config]);
  if (res[0]) throw res[0];
  return res[1];
};

/** @type {(image: ArrayBuffer) => Promise<ImageDataLike>} */
const chafaDecodeImage = async (image) => {
  const res = await chafaWorkerExec("decodeImage", [image], [image]);
  if (res[0]) throw res[0];
  return res[1];
};

/** @type {Promise<Record<string, string[]>>} */
const chafaEnums = Promise.all(
  [
    ["colors", "ChafaCanvasMode", "CHAFA_CANVAS_MODE_"],
    ["colorExtractor", "ChafaColorExtractor", "CHAFA_COLOR_EXTRACTOR_"],
    ["colorSpace", "ChafaColorSpace", "CHAFA_COLOR_SPACE_"],
    ["dither", "ChafaDitherMode", "CHAFA_DITHER_MODE_"],
  ].map(async ([key, value, prefix]) => [key, await chafaWorkerExec(value), prefix])
).then((entry) => entry.reduce((acc, [key, value, prefix]) => {
  /** @type {Record<string, string[]>} */
  const newValue = {};
  for (const [k, v] of Object.entries(value)) {
    if (k.startsWith(prefix) && !k.endsWith("_MAX")) {
      newValue[k.slice(prefix.length)] = v;
    }
  }
  return { ...acc, [key]: newValue };
}, {}));

/** @type {string[]} */
const chafaSymbolClasses = [
  "all", "alnum", "alpha", "ascii", "block", "border", "braille",
  "diagonal", "digit", "dot", "extra", "geometric", "half", "hhalf",
  "inverted", "latin", "legacy", "narrow", "none", "quad", "sextant",
  "solid", "space", "stipple", "technical", "vhalf", "wedge", "wide",
];

/** @type {ImageDataLike} */
let image;

const $ansi = /** @type {HTMLIFrameElement} */ (document.querySelector("#ansi"));
const $settings = /** @type {HTMLFormElement} */ (document.querySelector("#settings"));

const $imageInput = /** @type {HTMLInputElement} */ (document.querySelector("#image-input"));
const $imageExamples = /** @type {HTMLUListElement} */ (document.querySelector("#image-examples"));

const $clipboardAnsi = /** @type {HTMLButtonElement} */ (document.querySelector("#clipboard-ansi"));
const $clipboardHtml = /** @type {HTMLButtonElement} */ (document.querySelector("#clipboard-html"));
const $clipboardWebConsole = /** @type {HTMLButtonElement} */ (document.querySelector("#clipboard-web-console"));

const $notificationToast = /** @type {HTMLDivElement} */ (document.querySelector("#notification-toast"));

/** @type {() => Promise<Record<string, any>>} */
const getConfig = async () => {
  /** @type {Record<string, any>} */
  const config = {};
  if (image == null) {
    const urlParams = new URLSearchParams(location.search);
    for (const [key, value] of urlParams.entries()) {
      config[key] = value;
    }
  } else {
    const targets = $settings.querySelectorAll("[name]");
    for (const target of targets) {
      if (target instanceof HTMLInputElement) {
        switch (target.type) {
          case "checkbox":
            config[target.name] = target.checked;
            break;
          default:
            config[target.name] = target.value;
        }
      } else if (target instanceof HTMLSelectElement) {
        config[target.name] = target.value;
      }
    }
  }
  return config;
};

/** @type {(config: Record<string, any>) => Promise<void>} */
const setConfig = async (config) => {
  for (const [key, value] of Object.entries(config)) {
    const target = $settings.querySelector(`[name='${key}']`);
    if (!target) continue;
    switch (key) {
      case "colors":
      case "colorExtractor":
      case "colorSpace":
      case "dither":
        if (target instanceof HTMLSelectElement) {
          target.innerHTML = "";
          const entries = Object.entries((await chafaEnums)[key]);
          for (const [k, v] of entries) {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = k;
            target.appendChild(option);
          }
          target.value = value;
        }
        break;
      case "ditherGrainWidth":
      case "ditherGrainHeight":
        if (target instanceof HTMLSelectElement) {
          target.innerHTML = "";
          for (const v of ["1", "2", "4", "8"]) {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            target.appendChild(option);
          }
          target.value = value;
        }
        break;
      case "symbols":
      case "fill":
        const datalist = target.nextElementSibling;
        if (target instanceof HTMLInputElement && datalist instanceof HTMLDataListElement) {
          datalist.innerHTML = "";
          for (const v of chafaSymbolClasses) {
            const option = document.createElement("option");
            option.value = v;
            option.dataset.suffix = v;
            datalist.appendChild(option);
          }
          target.value = value;
        }
        break;
      case "fg":
      case "bg":
        if (target instanceof HTMLInputElement) {
          target.value = `#${value.toString(16).padStart(6, "0")}`;
        }
        break;
      case "fgOnly":
      case "preprocess":
        if (target instanceof HTMLInputElement) {
          target.checked = value;
        }
        break;
      default:
        if (target instanceof HTMLInputElement) {
          target.value = value;
        }
    }
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
  const urlParams = new URLSearchParams(config);
  urlParams.delete("height");
  history.replaceState(config, "", `?${urlParams.toString()}`);
};

/** @type {(config?: Record<string, any>) => Promise<void>} */
const render = async (config) => {
  const tStart = performance.now();
  let html, updatedConfig;
  try {
    config ??= await getConfig();
    ({ html, config: updatedConfig } = await chafaImageToHtml(image, config));
  } catch (/** @type {any} */ error) {
    console.error(error);
    notify(error.message ?? error);
    return;
  }
  if ($ansi.contentWindow) {
    $ansi.contentWindow.document.body.innerHTML = html;
    $ansi.contentWindow.document.documentElement.style.color = `#${updatedConfig.fg.toString(16).padStart(6, "0")}`;
    $ansi.contentWindow.document.documentElement.style.background = `#${updatedConfig.bg.toString(16).padStart(6, "0")}`;
    $ansi.style.height = `${(updatedConfig.height + 2) * 14}px`;
  }
  await setConfig(updatedConfig);
  const tEnd = performance.now();
  console.debug(`Rendered in ${(tEnd - tStart) | 0} ms`);
};

/** @type {(message: string) => void} */
const notify = (() => {
  const $body = /** @type {HTMLDivElement} */ ($notificationToast.querySelector(".toast-body"));
  /** @type {ReturnType<typeof setTimeout>} */
  let timer;
  return (message) => {
    clearTimeout(timer);
    /// @ts-expect-error
    const bs = globalThis.bootstrap.Toast.getOrCreateInstance($notificationToast);
    $body.textContent = message;
    bs.show();
    timer = setTimeout(() => bs.hide(), 2000);
  };
})();

/** @type {(getText: () => Promise<string>) => Promise<boolean>} */
const copyToClipboard = async (getText) => {
  let copied = false;
  if (globalThis.ClipboardItem) {
    try {
      const item = new ClipboardItem({ "text/plain": getText() });
      await navigator.clipboard.write([item]);
      copied = true;
    } catch (_) {}
  }
  if (!copied) {
    try {
      await navigator.clipboard.writeText(await getText());
      copied = true;
    } catch (_) {}
  }
  return copied;
};

$ansi.srcdoc = `
  <!DOCTYPE html>
  <head>
    <style>
      @font-face {
        font-family: "Iosevka Fixed SS15";
        font-weight: 400;
        font-style: normal;
        font-display: block;
        src: local("Iosevka Fixed SS15"), url("./fonts/iosevka-fixed-ss15-regular-unhinted-v30.2.0.woff2") format("woff2");
      }
      :root, body {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0.5em;
        box-sizing: border-box;
      }
      body {
        font-family: "Iosevka Fixed SS15", "Iosevka Fixed", monospace;
        font-size: 14px;
        font-variant: none;
        line-height: 1;
        white-space: pre;
        letter-spacing: 0;
        word-spacing: 0;
        overflow-x: auto;
        overflow-y: hidden;
        contain: strict;
      }
    </style>
  </head>
  <body>&nbsp;</body>
`.replace(/^\s+|\s+$|\n/gm, "");

$settings.addEventListener("change", (() => {
  /** @type {ReturnType<typeof setTimeout>} */
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => render(), 100);
  };
})());

$settings.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    const nextSibling = event.target.nextElementSibling;
    if (nextSibling instanceof HTMLOutputElement) {
      const digits = event.target.step.split(".")?.[1]?.length ?? 0;
      const value = Number.parseFloat(event.target.value).toFixed(digits);
      nextSibling.value = value;
    } else if (nextSibling instanceof HTMLDataListElement) {
      if (event.target.value.match(/(^|[\s,+-])$/)) {
        const options = nextSibling.querySelectorAll("option");
        for (const option of options) {
          if (option.dataset.suffix) {
            option.value = event.target.value + option.dataset.suffix;
          }
        }
      }
    }
  }
});

$settings.addEventListener("submit", (event) => {
  event.preventDefault();
});

$settings.addEventListener("reset", (event) => {
  event.preventDefault();
  render({});
});

$imageInput.addEventListener("change", async (event) => {
  if (event.target instanceof HTMLInputElement && event.target.files?.length) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", async (event) => {
      try {
        if (event.target?.result instanceof ArrayBuffer) {
          image = await chafaDecodeImage(event.target.result);
          render();
        }
      } catch (/** @type {any} */ error) {
        console.error(error);
        notify(error.message ?? error);
      }
    });
    reader.readAsArrayBuffer(file);
  }
});

$imageExamples.addEventListener("click", async (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    event.stopPropagation();
    $imageInput.value = "";
    const config = await getConfig();
    const res = await fetch(event.target.href);
    const data = await res.arrayBuffer();
    try {
      image = await chafaDecodeImage(data);
      render(config);
    } catch (/** @type {any} */ error) {
      console.error(error);
      notify(error.message ?? error);
    }
  }
});

$clipboardAnsi.addEventListener("click", async () => {
  const copied = await copyToClipboard(async () => {
    const config = await getConfig();
    const { ansi } = await chafaImageToAnsi(image, config);
    return ansi;
  });
  if (copied) notify("Copied to clipboard");
  else notify("Failed to copy to clipboard");
});

$clipboardHtml.addEventListener("click", async () => {
  const copied = await copyToClipboard(async () => {
    const config = await getConfig();
    const { html } = await chafaImageToHtml(image, config);
    return html;
  });
  if (copied) notify("Copied to clipboard");
  else notify("Failed to copy to clipboard");
});

$clipboardWebConsole.addEventListener("click", async () => {
  const copied = await copyToClipboard(async () => {
    const config = await getConfig();
    const { args } = await chafaImageToConsoleLogArgs(image, config);
    return `console.log(${JSON.stringify(args).slice(1, -1)});`;
  });
  if (copied) notify("Copied to clipboard");
  else notify("Failed to copy to clipboard");
});

$imageExamples.querySelector("a")?.click();
