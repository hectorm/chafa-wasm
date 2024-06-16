/// <reference lib="webworker" />

(() => {
  const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

  const cacheVersion = 2;
  const currentCaches = { main: `main-cache-v${cacheVersion}` };

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        const expectedCacheNames = Object.values(currentCaches);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          }),
        );
      })(),
    );
  });

  self.addEventListener("fetch", (event) => {
    if (
      !self.location.origin.startsWith("https://") ||
      !event.request.url.startsWith(self.location.origin) ||
      !event.request.url.startsWith("https://cdnjs.cloudflare.com/") ||
      event.request.method !== "GET"
    ) {
      return;
    }
    event.respondWith(
      (async () => {
        const cache = await caches.open(currentCaches.main);
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
  });
})();
