// A name for our cache
const CACHE_NAME = 'stylesphere-cache-v1';

// The list of files we want to cache
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://placehold.co/600x400/d1d4ff/333333?text=Modern+Tee',
  'https://placehold.co/600x400/a2d2ff/333333?text=Classic+Jeans',
  'https://placehold.co/600x400/ffafcc/333333?text=Running+Shoes',
  'https://placehold.co/600x400/bde0fe/333333?text=Leather+Watch'
];

// --- EVENT LISTENERS ---

// 1. Install Event: fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the cache is opened and all our files are added to it.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: fired every time the browser tries to fetch a resource.
self.addEventListener('fetch', event => {
  event.respondWith(
    // We look for a matching request in our cache.
    caches.match(event.request)
      .then(response => {
        // If we find a match in the cache, we return it.
        if (response) {
          return response;
        }
        // If no match is found, we fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});

// 3. Push Event: fired when a push notification is received.
self.addEventListener('push', event => {
    // Parse the data from the push event, defaulting if none is provided.
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'StyleSphere';
    const options = {
        body: data.body || 'You have a new message.',
        icon: 'https://placehold.co/192x192/4a90e2/ffffff?text=PWA', // Icon for the notification
        badge: 'https://placehold.co/96x96/4a90e2/ffffff?text=PWA' // Badge for mobile devices
    };

    // Show the notification.
    event.waitUntil(self.registration.showNotification(title, options));
});
