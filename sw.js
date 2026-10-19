const CACHE_NAME = 'kantin-ku-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pages/promo.html',
  '/pages/manajemen.html',
  '/pages/banner.html',
  '/pages/profil.html'
];

// 1. Install Service Worker & Cache Aset Dasar Secara Aman
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Membuka cache dan menyimpan aset utama');
      // Menggunakan Promise.allSettled atau loop agar jika ada 1 file gagal, tidak merusak instalasi keseluruhan
      return Promise.all(
        ASSETS_TO_CACHE.map(path => {
          return cache.add(path).catch(err => {
            console.warn('Gagal mencache aset:', path, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// 2. Activate Service Worker & Bersihkan Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Strategy: Cache First, fallback to Network
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});