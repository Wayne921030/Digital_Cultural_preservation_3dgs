// Service Worker for model caching using IndexedDB

const CACHE_DB = "modelCacheDB";
const STORE = "models";
const DB_VERSION = 1;
const MAX_CACHE_SIZE = 3; // Maximum number of models to cache

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CACHE_DB, DB_VERSION);
    req.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = function (event) {
      resolve(event.target.result);
    };
    req.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getModelFromDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(key);
    req.onsuccess = (e) => resolve(e.target.result || null);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function getAllKeys() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAllKeys();
    req.onsuccess = (e) => resolve(e.target.result || []);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function deleteModelFromDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error);
  });
}

async function saveModelToDB(key, arrayBuffer) {
  const db = await openDB();
  return new Promise(async (resolve, reject) => {
    try {
      // Check if we need to remove oldest models
      const allKeys = await getAllKeys();

      if (allKeys.length >= MAX_CACHE_SIZE && !allKeys.includes(key)) {
        // Remove the random model
        const randomIndex = Math.floor(Math.random() * allKeys.length);
        const randomKey = allKeys[randomIndex];
        await deleteModelFromDB(randomKey);
        console.log("Removed random model from cache:", randomKey);
      }

      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const req = store.put(arrayBuffer, key);
      req.onsuccess = () => {
        console.log("Model saved to cache:", key);
        resolve();
      };
      req.onerror = (e) => reject(e.target.error);
    } catch (error) {
      reject(error);
    }
  });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/models/")) {
    const modelKey = url.pathname.replace("/models/", "");
    event.respondWith(
      (async () => {
        // 1. Try IndexedDB
        const cached = await getModelFromDB(modelKey);
        if (cached) {
          console.log("Model found in IndexedDB:", modelKey);
          return new Response(cached, {
            status: 200,
            headers: { "Content-Type": "application/octet-stream" },
          });
        }
        // 2. Fetch from network
        console.log(
          "Model not found in IndexedDB, fetching from network:",
          modelKey
        );
        const resp = await fetch(event.request);
        if (resp.ok) {
          const buf = await resp.arrayBuffer();
          if (!modelKey.endsWith(".json") && !modelKey.endsWith(".txt")) {
            await saveModelToDB(modelKey, buf);
          }
          return new Response(buf, {
            status: 200,
            headers: { "Content-Type": "application/octet-stream" },
          });
        }
        // 3. Fallback to network response
        return resp;
      })()
    );
  }
});
