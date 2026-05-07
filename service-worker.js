const CACHE_NAME = '20y-pulse-v9.6';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});

self.addEventListener('push', event => {
  const data = event.data? event.data.json() : {};
  const title = data.title || '20Y PULSE';
  const options = {
    body: data.body || 'Nueva orden de ejecución lista',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || '20y-general',
    requireInteraction: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});