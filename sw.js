const CACHE_NAME = 'kantin-ku-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/promo.html',
  '/pages/manajemen.html',
  '/manifest.json'
];

// 1. Install Service Worker & Cache Aset Dasar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Membuka cache dan menyimpan aset utama');
      return cache.addAll(ASSETS_TO_CACHE);
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
  // Lewati request Firestore atau API eksternal agar selalu mengambil data terbaru dari jaringan
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
          // Cache file yang berhasil diambil dari network (opsional untuk halaman/aset statis)
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Fallback offline bisa diarahkan ke halaman khusus jika diperlukan
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});