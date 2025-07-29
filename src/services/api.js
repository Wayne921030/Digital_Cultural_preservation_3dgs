// API service for remote model loading

import { API_BASE_URL } from "../constants";

// IndexedDB utilities
const DB_NAME = "modelCacheDB";
const STORE_NAME = "models";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = function (event) {
      resolve(event.target.result);
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getModelFromDB(modelPath) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(modelPath);
    req.onsuccess = function (e) {
      resolve(e.target.result || null);
    };
    req.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

async function saveModelToDB(modelPath, arrayBuffer) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(arrayBuffer, modelPath);
    req.onsuccess = function () {
      resolve();
    };
    req.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

/**
 * Fetch model data from remote server, prefer IndexedDB cache first
 * @param {string} modelPath - Path to the model file
 * @returns {Promise<ArrayBuffer>} - Model data as ArrayBuffer
 */
export const fetchModelFromRemote = async (modelPath) => {
  // 1. Try to get from IndexedDB first
  const cached = await getModelFromDB(modelPath);
  if (cached) {
    console.log("Model found in IndexedDB:", modelPath);
    return cached;
  }
  // 2. If not found, fetch from remote
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${modelPath}`, {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    // 3. Save to IndexedDB
    console.log("Saving model to IndexedDB:", modelPath);
    await saveModelToDB(modelPath, arrayBuffer);
    return arrayBuffer;
  } catch (error) {
    console.error("Error fetching model from remote:", error);
    throw error;
  }
};

/**
 * Get available models list from remote server
 * @returns {Promise<Array>} - List of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const models = await response.json();
    return models;
  } catch (error) {
    console.error("Error fetching available models:", error);
    throw error;
  }
};

// Fetch available models from server
export const fetchAvailableModels = async () => {
  try {
    console.log(
      "Fetching available models from:",
      `${API_BASE_URL}/api/models`
    );
    const response = await fetch(`${API_BASE_URL}/api/models`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    console.log("Response content-type:", contentType);

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If not JSON, try to parse as text first
      const text = await response.text();
      console.log("Raw response text:", text);
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.warn(
          "Failed to parse response as JSON, treating as plain text"
        );
        // If it's not JSON, split by newlines or commas to get file list
        data = text.split(/[\n,]/).filter((item) => item.trim().length > 0);
      }
    }

    return data;
  } catch (error) {
    console.error("Error fetching available models:", error);
    throw error;
  }
};

// Check if a specific model file exists
export const checkModelExists = async (modelFile) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${modelFile}`, {
      method: "HEAD",
    });
    return response.ok;
  } catch (error) {
    console.error(`Error checking model ${modelFile}:`, error);
    return false;
  }
};
