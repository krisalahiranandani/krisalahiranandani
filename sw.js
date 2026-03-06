const CACHE_NAME = 'krisala-hiranandani-v2';
const OFFLINE_URL = '/offline.html';

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/offline.html',
    '/manifest.json'
];

const SILO_ASSETS = [
    '/everlyn.html',
    '/della.html',
    '/knowledge-hub.html',
    '/compare.html',
    '/neighborhood.html',
    '/masterplan.html',
    '/404.html'
];

// Install: Cache core assets + offline page
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...CORE_ASSETS, ...SILO_ASSETS]);
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first for HTML, Cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // HTML pages: Network-first with offline fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the latest HTML
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    // Try cache, then offline page
                    return caches.match(request).then((cached) => {
                        return cached || caches.match(OFFLINE_URL);
                    });
                })
        );
        return;
    }

    // Static assets: Cache-first with network fallback
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            });
        })
    );
});
