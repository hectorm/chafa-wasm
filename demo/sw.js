const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  main: "main-cache-v" + CACHE_VERSION,
};

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const expectedCacheNames = Object.values(CURRENT_CACHES);
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !self.origin.startsWith("https://")) {
    return;
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(CURRENT_CACHES.main);
      const cacheResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then((fetchResponse) => {
        if (fetchResponse.status >= 200 && fetchResponse.status <= 299) {
          cache.put(event.request, fetchResponse.clone());
        }
        return fetchResponse;
      });
      return cacheResponse ?? fetchPromise;
    })()
  );
});
