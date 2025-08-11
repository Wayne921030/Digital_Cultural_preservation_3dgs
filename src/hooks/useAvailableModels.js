import { useState, useEffect, useCallback } from "react";
import { DEVICE_CONFIGS } from "../constants";
import { MODELS_INDEX } from "../config";

// Fetch available models (tolerate text/plain JSON and CORS quirks)
const fetchAvailableModels = async () => {
  const url = `${MODELS_INDEX}?v=${Date.now()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    mode: "cors",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  return type.includes("application/json") ? res.json() : JSON.parse(await res.text());
};

export const useAvailableModels = () => {
  const [scenes, setScenes] = useState([]);
  const [deviceConfigs, setDeviceConfigs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const desiredDeviceConfigs = DEVICE_CONFIGS;

  const checkAvailableModels = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);

      const serverResponse = await fetchAvailableModels();

      if (serverResponse && Array.isArray(serverResponse.scenes)) {
        const availableScenes = serverResponse.scenes;
        setScenes(availableScenes);

        const availableDeviceConfigs = {};
        for (const [deviceKey, deviceConfig] of Object.entries(desiredDeviceConfigs)) {
          // Check if any scene has a file type/resolution compatible with this device
          let hasCompatibleFiles = false;
          for (const scene of availableScenes) {
            const fileTypes = scene?.file_types || [];
            for (const ft of fileTypes) {
              const resos = ft?.resolutions || [];
              const resoNames = resos.map(r => r.resolution);
              if (deviceConfig.supportedResolutions.some(r => resoNames.includes(r))) {
                hasCompatibleFiles = true;
                break;
              }
            }
            if (hasCompatibleFiles) break;
          }
          availableDeviceConfigs[deviceKey] = {
            ...deviceConfig,
            available: hasCompatibleFiles,
          };
        }
        setDeviceConfigs(availableDeviceConfigs);
      } else {
        setScenes([]);
        setDeviceConfigs({});
      }
    } catch (err) {
      console.error("Error checking available models:", err);
      setError(err.message || "Failed to fetch available models");
      setScenes([]);
      setDeviceConfigs({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { checkAvailableModels(); }, [checkAvailableModels]);

  return {
    scenes,
    deviceConfigs,
    isLoading,
    error,
    refreshModels: checkAvailableModels,
  };
};
