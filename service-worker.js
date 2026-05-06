const CACHE_NAME='20y-pulse-v9-leyenda';
const urlsToCache=[
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
     .then(cache=>cache.addAll(urlsToCache))
     .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch',event=>{
  event.respondWith(
    caches.match(event.request)
     .then(response=>response||fetch(event.request))
  );
});