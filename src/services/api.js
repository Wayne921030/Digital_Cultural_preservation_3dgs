// API service for remote model loading

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Fetch model data from remote server
 * @param {string} modelPath - Path to the model file
 * @returns {Promise<ArrayBuffer>} - Model data as ArrayBuffer
 */
export const fetchModelFromRemote = async (modelPath) => {
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
