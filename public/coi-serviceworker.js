// COI Service Worker for GitHub Pages
// This adds the required COOP and COEP headers to enable SharedArrayBuffer

self.addEventListener("install", () => {
  console.log("COI Service Worker: Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("COI Service Worker: Activating...");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  console.log("COI Service Worker: Intercepting", url.pathname);
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't modify non-successful responses
        if (response.status === 0) {
          return response;
        }
        
        // Clone the response and add COOP/COEP headers
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        
        console.log("COI Service Worker: Added COOP/COEP headers to", url.pathname);
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      })
      .catch((error) => {
        console.error("COI Service Worker: Fetch error", error);
        return fetch(request);
      })
  );
});