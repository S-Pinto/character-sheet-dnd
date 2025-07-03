// NUOVO CONTENUTO PER sw.js

// 1. Aumentiamo la versione della cache. Ogni volta che modificherai i file
// dell'app, dovrai aumentare questo numero (es. v3, v4, ecc.)
const CACHE_NAME = 'scheda-dnd-cache-v4'; 

// Lista dei file fondamentali per far funzionare l'app offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './js/main.js',
  './js/ui.js',
  './js/storage.js',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/valenor.jpg'
];

// Evento 'install': si attiva quando il browser rileva questo nuovo service worker.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching new files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': si attiva dopo l'installazione, quando il nuovo service worker
// prende il controllo. È il momento perfetto per fare pulizia.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se troviamo una cache con un nome diverso da quello nuovo, la cancelliamo.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': intercetta tutte le richieste di rete.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Strategia "Cache First": cerca prima nella cache.
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Se trovato in cache, restituiscilo.
        }
        // Altrimenti, scaricalo da internet.
        return fetch(event.request);
      }
    )
  );
});