import { useState, useEffect, useCallback } from "react";
import { MODEL_CONFIGS } from "../constants";

// Fetch available models from server
const fetchAvailableModels = async () => {
  try {
    const url = `/models/models.json?v=${Date.now()}`;
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
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelConfigs, setModelConfigs] = useState({});

  // Use the imported model configurations
  const desiredModels = MODEL_CONFIGS;

  // Check which models are available
  const checkAvailableModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all available models from server
      const serverResponse = await fetchAvailableModels();

      // Handle different response formats
      let serverModels = [];

      if (Array.isArray(serverResponse)) {
        // Check if it's an array of file objects (like the actual response)
        if (
          serverResponse.length > 0 &&
          typeof serverResponse[0] === "object" &&
          serverResponse[0].filename
        ) {
          // Use the file objects directly
          serverModels = serverResponse;
        } else {
          // Assume it's a simple array of filenames
          serverModels = serverResponse.map((filename) => ({
            filename,
            extension: filename.split(".").pop(),
          }));
        }
      } else if (serverResponse && typeof serverResponse === "object") {
        // If response is an object, try to extract models array
        if (Array.isArray(serverResponse.models)) {
          serverModels = serverResponse.models;
        } else if (Array.isArray(serverResponse.files)) {
          serverModels = serverResponse.files;
        } else {
          // If it's an object with file names as keys, convert to array
          serverModels = Object.keys(serverResponse).map((filename) => ({
            filename,
            extension: filename.split(".").pop(),
          }));
        }
      } else if (typeof serverResponse === "string") {
        // If response is a string, try to parse it
        try {
          const parsed = JSON.parse(serverResponse);
          if (Array.isArray(parsed)) {
            serverModels = parsed;
          } else {
            serverModels = Object.keys(parsed).map((filename) => ({
              filename,
              extension: filename.split(".").pop(),
            }));
          }
        } catch (parseError) {
          console.warn("Failed to parse server response as JSON:", parseError);
          serverModels = [];
        }
      }

      // Check which of our desired models are available
      const availableConfigs = {};

      for (const [key, config] of Object.entries(desiredModels)) {
        // Check if we have .splat files for this model
        const hasSplat = serverModels.some(
          (file) =>
            file.filename === config.splat && file.extension === ".splat"
        );

        // Check if we have .ply files for this model
        const hasPly = config.ply
          ? serverModels.some(
              (file) =>
                file.filename === config.ply && file.extension === ".ply"
            )
          : false;

        if (hasSplat || hasPly) {
          const splatDetails = hasSplat
            ? serverModels.find((file) => file.filename === config.splat)
            : null;
          const plyDetails = hasPly
            ? serverModels.find((file) => file.filename === config.ply)
            : null;

          availableConfigs[key] = {
            ...config,
            availableSplat: hasSplat,
            availablePly: hasPly,
            primaryFile: hasSplat ? config.splat : config.ply,
            fallbackFile: hasSplat && hasPly ? config.ply : null,
            splatDetails: splatDetails,
            plyDetails: plyDetails,
            // Add file size information
            primaryFileSize: hasSplat
              ? splatDetails?.size_mb
              : plyDetails?.size_mb,
            fallbackFileSize: hasSplat && hasPly ? plyDetails?.size_mb : null,
          };
        }
      }

      setAvailableModels(serverModels);
      setModelConfigs(availableConfigs);
    } catch (err) {
      console.error("Error checking available models:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    checkAvailableModels();
  }, [checkAvailableModels]);

  return {
    availableModels,
    modelConfigs,
    isLoading,
    error,
    refreshModels: checkAvailableModels,
  };
};
