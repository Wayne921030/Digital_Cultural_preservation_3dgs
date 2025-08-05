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

      // Handle the new structure with scenes
      if (
        serverResponse &&
        serverResponse.success &&
        Array.isArray(serverResponse.scenes)
      ) {
        setScenes(serverResponse.scenes);

        // Process device configurations based on available scenes
        const availableDeviceConfigs = {};

        for (const [deviceKey, deviceConfig] of Object.entries(
          desiredDeviceConfigs
        )) {
          // Check if any scene has files that match the device's recommended resolutions
          const hasCompatibleFiles = serverResponse.scenes.some((scene) =>
            scene.file_types.some((fileType) =>
              fileType.resolutions.some((resolution) =>
                deviceConfig.recommendedResolutions.includes(
                  resolution.resolution
                )
              )
            )
          );

          if (hasCompatibleFiles) {
            availableDeviceConfigs[deviceKey] = {
              ...deviceConfig,
              available: true,
            };
          }
        }

        setDeviceConfigs(availableDeviceConfigs);
      } else {
        // Fallback for old structure or error
        console.warn("Unexpected server response format:", serverResponse);
        setScenes([]);
        setDeviceConfigs({});
      }
    } catch (err) {
      console.error("Error checking available models:", err);
      setError(err.message);
      setScenes([]);
      setDeviceConfigs({});
    } finally {
      setIsLoading(false);
    }
  }, []);

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
