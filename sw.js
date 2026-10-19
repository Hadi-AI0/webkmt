/**
 * Service Worker for Performance Optimization
 * Implements caching strategies for different resource types
 */

const CACHE_NAME = 'webkemet-v1.0.0';
const STATIC_CACHE = 'webkemet-static-v1';
const DYNAMIC_CACHE = 'webkemet-dynamic-v1';
const IMAGE_CACHE = 'webkemet-images-v1';
const API_CACHE = 'webkemet-api-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/mini-apps-integrated.css',
  '/css/hero-enhanced.css',
  '/css/blog-dynamic.css',
  '/css/mobile-collapse.css',
  '/css/portfolio-enhanced.css',
  '/css/portfolio-modal-enhanced.css',
  '/js/portfolio-simple.js',
  '/js/modules/lazy-loader.js',
  '/js/modules/content-loader.js',
  '/js/modules/performance-monitor.js',
  '/assets/favicon.ico',
  '/assets/logo.svg'
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  // Cache first, then network
  CACHE_FIRST: 'cache-first',
  // Network first, then cache
  NETWORK_FIRST: 'network-first',
  // Fastest (cache and network race)
  FASTEST: 'fastest',
  // Network only
  NETWORK_ONLY: 'network-only',
  // Cache only
  CACHE_ONLY: 'cache-only'
};

// URL patterns and their cache strategies
const URL_PATTERNS = [
  {
    pattern: /\.(js|css)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  {
    pattern: /\.(png|jpg|jpeg|svg|webp|avif|gif|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: IMAGE_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: API_CACHE,
    maxAge: 5 * 60 * 1000 // 5 minutes
  },
  {
    pattern: /.*\.supabase\.co/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: IMAGE_CACHE,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  {
    pattern: /fonts\.(googleapis|gstatic)\.com/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  }
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
        return Promise.all(
          cacheNames
            .filter(cacheName => !validCaches.includes(cacheName))
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Find matching cache strategy
  const matchedPattern = URL_PATTERNS.find(pattern => pattern.pattern.test(request.url));
  
  if (matchedPattern) {
    event.respondWith(handleRequest(request, matchedPattern));
  } else {
    // Default strategy for unmatched requests
    event.respondWith(handleRequest(request, {
      strategy: CACHE_STRATEGIES.NETWORK_FIRST,
      cache: DYNAMIC_CACHE,
      maxAge: 60 * 60 * 1000 // 1 hour
    }));
  }
});

// Handle requests based on strategy
async function handleRequest(request, config) {
  const { strategy, cache: cacheName, maxAge } = config;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.FASTEST:
      return fastest(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, cacheName);
    
    default:
      return networkFirst(request, cacheName, maxAge);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      // Return cached version and update in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    
    // Fallback to cache if network fails
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return createErrorResponse(request);
  }
}

// Network first strategy
async function networkFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
    
  } catch (error) {
    console.warn('Network first failed, trying cache:', error.message);
    
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    
    // Return error response
    return createErrorResponse(request);
  }
}

// Fastest strategy (race between cache and network)
async function fastest(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  
  return new Promise((resolve, reject) => {
    let resolved = false;
    
    // Race between cache and network
    const resolveOnce = (response) => {
      if (!resolved) {
        resolved = true;
        resolve(response);
      }
    };
    
    // Try cache
    cache.match(request).then(cachedResponse => {
      if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
        resolveOnce(cachedResponse);
      }
    });
    
    // Try network
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        // Cache the response
        cache.put(request, networkResponse.clone());
        resolveOnce(networkResponse);
      }
    }).catch(error => {
      if (!resolved) {
        // If network fails and we haven't resolved with cache, try cache again
        cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            resolveOnce(cachedResponse);
          } else {
            reject(error);
          }
        });
      }
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      if (!resolved) {
        reject(new Error('Request timeout'));
      }
    }, 5000);
  });
}

// Cache only strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return createErrorResponse(request);
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.warn('Background cache update failed:', error);
  }
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseTime = new Date(dateHeader).getTime();
  return (Date.now() - responseTime) > maxAge;
}

// Create error response
function createErrorResponse(request) {
  const isImage = /\.(png|jpg|jpeg|svg|webp|avif|gif)$/i.test(request.url);
  const isAPI = request.url.includes('/api/');
  
  if (isImage) {
    // Return placeholder image
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Image unavailable</text></svg>',
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
  
  if (isAPI) {
    // Return error response for API
    return new Response(
      JSON.stringify({ error: 'Service unavailable', offline: true }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Return generic error
  return new Response(
    'Resource unavailable',
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    }
  );
}

// Message handling for cache management
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CACHE_RESOURCE':
      cacheResource(payload.url, payload.cacheName).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCache(payload.cacheName).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ success: true, size });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
  }
});

// Cache a specific resource
async function cacheResource(url, cacheName = DYNAMIC_CACHE) {
  const cache = await caches.open(cacheName);
  const response = await fetch(url);
  if (response.ok) {
    await cache.put(url, response);
  }
}

// Clear specific cache
async function clearCache(cacheName) {
  return await caches.delete(cacheName);
}

// Get total cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('dynamic') || cacheName.includes('api')) {
        await cleanupExpiredEntries(cacheName);
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}, 60 * 60 * 1000); // Every hour

// Clean up expired cache entries
async function cleanupExpiredEntries(cacheName) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response && isExpired(response, 24 * 60 * 60 * 1000)) { // 24 hours
      await cache.delete(request);
    }
  }
}

console.log('Service Worker loaded successfully');