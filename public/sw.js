const CACHE_NAME = 'namaz-timetable-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Static assets pre-cache failed (expected if dev paths differ)', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Catch the timings lookup from api.aladhan.com
  if (url.hostname.includes('api.aladhan.com')) {
    event.respondWith(
      // Network-First with Cache Fallback
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Offline fallback for NamazTimetable:', event.request.url);
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If completely offline and un-cached, fallback to standard fetch (which will throw)
            return Promise.reject(new Error('Offline: Timetable not cached yet'));
          });
        })
    );
  } else {
    // For other assets, Cache-First with Network Fallback
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).catch((err) => {
          console.warn('[Service Worker] Offline and resource not cached:', event.request.url);
          return null;
        });
      })
    );
  }
});
