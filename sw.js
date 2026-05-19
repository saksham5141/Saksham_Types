const CACHE_NAME = 'saksham-types-v7';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './site.webmanifest',
  './assets/app_logo.png',
  './assets/indian_mascot.png',
  './assets/indian_trophy.png',
  './assets/rajasthani_saree_bg.png',
  './assets/retro_gold_trophy.png',
  './assets/retro_keyboard_mascot.png'
];

// Install Event - Caches app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all files');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Cleans up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Intercepts requests and serves from cache or fetches and caches dynamically
self.addEventListener('fetch', (e) => {
  // Avoid intercepting non-GET requests or external extensions
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Dynamic caching for Google Fonts or external style sheets
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          // If it's a cross-origin font/style, we can still cache it if status is 200 or 0 (opaque)
          if (e.request.url.includes('fonts.gstatic.com') || e.request.url.includes('fonts.googleapis.com')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for html pages
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
