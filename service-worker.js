const CACHE_NAME = "rights-board-v37";

// Icon files expected by manifest.json:
// ./icons/icon-192.png
// ./icons/icon-512.png
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./assets/character/body/arms.png",
  "./assets/character/body/hands.png",
  "./assets/character/body/head.png",
  "./assets/character/body/shorts-legs.png",
  "./assets/character/backgrounds/summer.png",
  "./assets/character/backgrounds/spring.png",
  "./assets/character/backgrounds/autumn.png",
  "./assets/character/backgrounds/winter.png",
  "./assets/character/clothes/bottoms/cargoPants.png",
  "./assets/character/clothes/bottoms/default.png",
  "./assets/character/clothes/bottoms/jeans.png",
  "./assets/character/clothes/bottoms/shorts.png",
  "./assets/character/clothes/bottoms/slacks.png",
  "./assets/character/clothes/hoods/hoodieBlue-back.png",
  "./assets/character/clothes/hoods/hoodieBlue-front.png",
  "./assets/character/clothes/hoods/hoodieGreen-back.png",
  "./assets/character/clothes/hoods/hoodieGreen-front.png",
  "./assets/character/clothes/hoods/hoodieLine-back.png",
  "./assets/character/clothes/hoods/hoodieLine-front.png",
  "./assets/character/clothes/hoods/hoodiePocket-back.png",
  "./assets/character/clothes/hoods/hoodiePocket-front.png",
  "./assets/character/clothes/outers/jumperBlue.png",
  "./assets/character/clothes/outers/jumperPocket.png",
  "./assets/character/clothes/outers/jumperWarm.png",
  "./assets/character/clothes/outers/jumperZip.png",
  "./assets/character/clothes/outers/vestBlue.png",
  "./assets/character/clothes/outers/vestPocket.png",
  "./assets/character/clothes/outers/vestWarm.png",
  "./assets/character/clothes/outers/vestZip.png",
  "./assets/character/clothes/shoes/default.png",
  "./assets/character/clothes/shoes/dressShoes.png",
  "./assets/character/clothes/shoes/slippers.png",
  "./assets/character/clothes/shoes/sneakers.png",
  "./assets/character/clothes/tops/default.png",
  "./assets/character/clothes/tops/hoodieBlue.png",
  "./assets/character/clothes/tops/hoodieGreen.png",
  "./assets/character/clothes/tops/hoodieLine.png",
  "./assets/character/clothes/tops/hoodiePocket.png",
  "./assets/character/clothes/tops/tshirtBlue.png",
  "./assets/character/clothes/tops/tshirtGreen.png",
  "./assets/character/clothes/tops/tshirtStar.png",
  "./assets/character/clothes/tops/tshirtStripe.png",
  "./assets/character/clothes/tops-under-jumper/default.png",
  "./assets/character/clothes/tops-under-jumper/hoodieBlue.png",
  "./assets/character/clothes/tops-under-jumper/hoodieGreen.png",
  "./assets/character/clothes/tops-under-jumper/hoodieLine.png",
  "./assets/character/clothes/tops-under-jumper/hoodiePocket.png",
  "./assets/character/clothes/tops-under-jumper/tshirtBlue.png",
  "./assets/character/clothes/tops-under-jumper/tshirtGreen.png",
  "./assets/character/clothes/tops-under-jumper/tshirtStar.png",
  "./assets/character/clothes/tops-under-jumper/tshirtStripe.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
