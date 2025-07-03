const CACHE_NAME = 'scheda-dnd-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/js/main.js',
  '/js/ui.js',
  '/js/storage.js',
  // Aggiungi qui altri file importanti come l'immagine del personaggio
  '/img/valenor.jpg' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Restituisci dalla cache
        }
        return fetch(event.request); // Altrimenti, scarica da internet
      }
    )
  );
});