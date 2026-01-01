const CACHE_NAME = 'solo-leveling-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/quests.html',
    '/habits.html',
    '/rewards.html',
    '/awakening.html',
    '/style.css',
    '/app.js',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network First, then Cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Return cached response if fetch fails
                return caches.match(event.request)
                    .then((cached) => {
                        if (cached) {
                            return cached;
                        }
                        // Return offline page if exists
                        return new Response(
                            '<h1>Offline Mode</h1><p>App is running in offline mode. Your data is safely stored locally.</p>',
                            { headers: { 'Content-Type': 'text/html' } }
                        );
                    });
            })
    );
});

// Handle background sync (future enhancement)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Data sync logic here
            Promise.resolve()
        );
    }
});

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Time to level up!',
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'solo-leveling',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('Solo Leveling', options)
    );
});

console.log('Service Worker loaded');
