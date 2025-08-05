import { useState, useEffect, useCallback } from "react";
import { DEVICE_CONFIGS } from "../constants";

// Fetch available models from server
const fetchAvailableModels = async () => {
  try {
    // This now correctly points to your CloudFront URL
    const assetsUrl = import.meta.env.VITE_ASSETS_URL;
    const url = `${assetsUrl}/models.json?v=${Date.now()}`; 
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If not JSON, try to parse as text first
      const text = await response.text();
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

export const useAvailableModels = () => {
  const [scenes, setScenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceConfigs, setDeviceConfigs] = useState({});

  // Use the imported device configurations
  const desiredDeviceConfigs = DEVICE_CONFIGS;

  // Check which models are available
  const checkAvailableModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all available models from server
      const serverResponse = await fetchAvailableModels();

      // Directly use the scenes array from your JSON file
      if (serverResponse && Array.isArray(serverResponse.scenes)) {
        setScenes(serverResponse.scenes);
        // Since scenes are available, assume all device configs are available for selection.
        setDeviceConfigs(desiredDeviceConfigs); 
      } else {
        // Handle case where the structure is not as expected
        console.warn("Unexpected server response format:", serverResponse);
        throw new Error("Could not parse the list of available scenes.");
      }
    } catch (err) {
      console.error("Error checking available models:", err);
      setError(err.message);
      setScenes([]);
      setDeviceConfigs({});
    } finally {
      setIsLoading(false);
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    checkAvailableModels();
  }, [checkAvailableModels]);

  return {
    scenes,
    deviceConfigs,
    isLoading,
    error,
    refreshModels: checkAvailableModels,
  };
};
