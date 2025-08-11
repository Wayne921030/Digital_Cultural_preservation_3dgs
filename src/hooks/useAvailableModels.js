import { useState, useEffect, useCallback } from "react";
import { DEVICE_CONFIGS } from "../constants";
import { MODELS_INDEX } from "../config"; // if you didn’t add config.js, use your CloudFront URL directly

// Fetch + tolerant parse (works even if served as text/plain)
async function fetchAvailableModels() {
  const res = await fetch(`${MODELS_INDEX}?v=${Date.now()}`, {
    headers: { Accept: "application/json" },
    mode: "cors",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  return type.includes("application/json") ? res.json() : JSON.parse(await res.text());
}

export const useAvailableModels = () => {
  const [scenes, setScenes] = useState([]);
  const [deviceConfigs, setDeviceConfigs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAvailableModels = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);

      const serverResponse = await fetchAvailableModels();
      const scenesArr = Array.isArray(serverResponse?.scenes) ? serverResponse.scenes : [];
      setScenes(scenesArr);

      // Build availability per device (robust to missing fields)
      const nextDeviceConfigs = {};
      for (const [key, cfg] of Object.entries(DEVICE_CONFIGS)) {
        const rec = Array.isArray(cfg.recommendedResolutions)
          ? cfg.recommendedResolutions
          : ["low", "medium", "high", "full"]; // fallback

        const hasCompatibleFiles = scenesArr.some(scene =>
          Array.isArray(scene.file_types) &&
          scene.file_types.some(ft =>
            Array.isArray(ft.resolutions) &&
            ft.resolutions.some(r => rec.includes(r.resolution))
          )
        );

        nextDeviceConfigs[key] = { ...cfg, available: hasCompatibleFiles };
      }

      setDeviceConfigs(nextDeviceConfigs);
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

  return { scenes, deviceConfigs, isLoading, error, refreshModels: checkAvailableModels };
};
