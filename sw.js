const CACHE_NAME = 'bizhar-pos-v1';

// لیستەیا ئەو فایل و لینکێن کو دڤێت بهێنە خەزنکرن بۆ کارکرنا بێی ئینتەرنێت
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// دابەزاندن و خەزنکرنا فایلان د کاشێ (Cache) دا
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// وەرگرتنا زانیاریان: ئەگەر ئینتەرنێت هەبوو ژ ئینتەرنێتێ بینە، ئەگەر نەبوو ژ کاشێ بینە
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // ئەگەر فایل د کاشێ دا هەبوو، وێ زڤڕینەڤە
            if (response) {
                return response;
            }
            // ئەگەر نەبوو، هەول بدە ژ ئینتەرنێتێ بینیت
            return fetch(event.request).catch(() => {
                console.log("Offline mode active. Serving from cache where possible.");
            });
        })
    );
});

// نویکرنەڤەیا کاشێ و ڕەشکرنا ڤێرژنێن کەڤن یێن سیستەمی
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
