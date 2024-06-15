/// <reference lib="webworker" />

// @ts-expect-error
import moduleFactory from "../../dist/chafa.js";

(() => {
  const self = /** @type {DedicatedWorkerGlobalScope} */ (
    /** @type {unknown} */ (globalThis.self)
  );

  /** @type {Promise<ChafaModule>} */
  const modulePromise = moduleFactory();

  self.addEventListener("message", async (event) => {
    const module = await modulePromise;
    const port = event.ports[0];
    const obj = event.data[0]?.split(".").reduce(
      /** @type {(prev: any, curr: string) => any} */
      (prev, curr) => prev?.[curr],
      module,
    );
    if (Object.hasOwn(obj, "values")) {
      port.postMessage(
        Object.entries(obj).reduce(
          /** @type {(dict: Record<string, any>, entry: [string, any]) => Record<string, any>} */
          (dict, [key, { value }]) => {
            if (value != null) dict[key] = value;
            return dict;
          },
          {},
        )
      );
    } else if (typeof obj === "function") {
      obj(
        ...(event.data[1] ?? []),
        /** @type {(args: any[]) => void} */
        (...args) => port.postMessage(args),
      );
    } else {
      port.postMessage(obj);
    }
  });
})();
