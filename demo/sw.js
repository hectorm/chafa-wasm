/// <reference lib="webworker" />

(() => {
  const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

  const cacheVersion = 1;
  const currentCaches = { app: `app-cache-v${cacheVersion}` };

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const cacheNames = await globalThis.caches.keys();
        const expectedCacheNames = Object.values(currentCaches);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
              return globalThis.caches.delete(cacheName);
            }
          }),
        );
      })(),
    );
  });

  self.addEventListener("fetch", (event) => {
    const methods = ["GET", "HEAD"];
    const prefixes = [self.location.origin, "https://cdnjs.cloudflare.com/"];
    if (methods.some((s) => event.request.method === s) && prefixes.some((s) => event.request.url.startsWith(s))) {
      event.respondWith(
        (async () => {
          const cache = await globalThis.caches.open(currentCaches.app);
          const cacheResponse = await cache.match(event.request);
          const fetchPromise = fetch(event.request).then((fetchResponse) => {
            if (fetchResponse.status >= 200 && fetchResponse.status <= 299) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
          return cacheResponse ?? fetchPromise;
        })(),
      );
    }
  });
})();
