// Cache name
const CACHE_NAME = 'twina-skincare-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/images/logo.png',
  '/images/background-image.png',
  '/images/lanaige.png',
  '/images/snailmucin.png',
  '/images/paulaschoice.png',
  '/images/cetaphil.png',
  '/images/moisturesurge.png',
  '/images/ordinary.png',
];

// Install service worker
self.addEventListener('install', function(event) {
  // Perform installation steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch cached data
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request
        const fetchRequest = event.request.clone();
        // Make network request
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response
            const responseToCache = response.clone();
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

// Activate service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Delete outdated caches
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
