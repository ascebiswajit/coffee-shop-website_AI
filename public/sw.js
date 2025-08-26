const CACHE_NAME = "brew-bean-v1.0.0"
const STATIC_CACHE_URLS = [
  "/",
  "/admin",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add other static assets
]

const DYNAMIC_CACHE_URLS = ["/api/", "https://wa.me/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[SW] Serving from cache:", request.url)
        return cachedResponse
      }

      console.log("[SW] Fetching from network:", request.url)
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Check if we should cache this response
          const shouldCache =
            STATIC_CACHE_URLS.some((url) => request.url.includes(url)) ||
            DYNAMIC_CACHE_URLS.some((url) => request.url.includes(url))

          if (shouldCache) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              console.log("[SW] Caching new resource:", request.url)
              cache.put(request, responseToCache)
            })
          }

          return response
        })
        .catch((error) => {
          console.error("[SW] Fetch failed:", error)

          // Return offline page for navigation requests
          if (request.destination === "document") {
            return caches.match("/offline.html")
          }

          // Return offline image for image requests
          if (request.destination === "image") {
            return caches.match("/icons/offline-image.png")
          }

          throw error
        })
    }),
  )
})

// Background sync for offline orders
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "background-order-sync") {
    event.waitUntil(syncOfflineOrders())
  }

  if (event.tag === "background-booking-sync") {
    event.waitUntil(syncOfflineBookings())
  }
})

// Push notification handler
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const options = {
    body: event.data ? event.data.text() : "New notification from Brew & Bean",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/icons/checkmark.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/xmark.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Brew & Bean", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Helper functions for background sync
async function syncOfflineOrders() {
  try {
    const cache = await caches.open("offline-orders")
    const requests = await cache.keys()

    for (const request of requests) {
      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.delete(request)
          console.log("[SW] Offline order synced successfully")
        }
      } catch (error) {
        console.error("[SW] Failed to sync offline order:", error)
      }
    }
  } catch (error) {
    console.error("[SW] Background sync failed:", error)
  }
}

async function syncOfflineBookings() {
  try {
    const cache = await caches.open("offline-bookings")
    const requests = await cache.keys()

    for (const request of requests) {
      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.delete(request)
          console.log("[SW] Offline booking synced successfully")
        }
      } catch (error) {
        console.error("[SW] Failed to sync offline booking:", error)
      }
    }
  } catch (error) {
    console.error("[SW] Background booking sync failed:", error)
  }
}
