import moduleFactory from "../../dist/chafa.js";

const modulePromise = moduleFactory();

self.addEventListener("message", async (event) => {
  const module = await modulePromise;
  const port = event.ports[0];
  const obj = event.data[0]
    ?.split(".")
    .reduce((prev, curr) => prev?.[curr], module);
  if (Object.hasOwn(obj, "values")) {
    port.postMessage(
      Object.entries(obj).reduce((dict, [key, { value }]) => {
        if (value != null) dict[key] = value;
        return dict;
      }, {})
    );
  } else if (typeof obj === "function") {
    obj(...(event.data[1] ?? []), (...args) => {
      port.postMessage(args);
    });
  } else {
    port.postMessage(obj);
  }
});
