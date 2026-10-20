const CACHE_NAME = 'kantin-ku-v4';
const ASSETS_TO_CACHE = [
    './index.html',
    './login.html',
    './manifest.json',
    './pages/promo.html',
    './pages/manajemen.html',
    './pages/banner.html',
    './pages/profil.html'
];

// 1. Install Service Worker & Cache Aset Dasar
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Membuka cache baru...');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('Sebagian aset gagal dicache saat install:', err);
            });
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

// 3. Fetch Strategy: Network First (Utamakan Jaringan, Fallback ke Cache)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Abaikan permintaan ke Firestore atau API eksternal lainnya
    if (url.origin !== self.location.origin || url.pathname.includes('firestore.googleapis.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Jika jaringan berhasil, simpan salinannya ke cache lalu kembalikan responsnya
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Jika offline atau jaringan gagal, ambil dari cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Jika halaman utama/navigate gagal dan tidak ada di cache, arahkan aman ke index atau login
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});