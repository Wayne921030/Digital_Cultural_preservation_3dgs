import { useEffect, useMemo, useState } from "react";
import { MODELS_INDEX } from "../config";
import { DEVICE_CONFIGS } from "../constants";

export function useAvailableModels() {
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchModels() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${MODELS_INDEX}?v=${Date.now()}`, { mode: "cors" });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : JSON.parse(await res.text());
      if (!data?.scenes) throw new Error("models.json missing 'scenes'");
      setServerResponse(data);
    } catch (e) {
      console.error("Error loading models.json:", e);
      setError(e.message || "Failed to load models index");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchModels(); }, []);

  const devices = useMemo(() => {
    const next = {};
    for (const [key, cfg] of Object.entries(DEVICE_CONFIGS)) {
      const prefs = cfg.recommendedResolutions?.length ? cfg.recommendedResolutions : ["low","medium","high","full"];
      const hasCompatible = serverResponse?.scenes?.some(scene =>
        scene?.file_types?.some(ft =>
          ft?.resolutions?.some(r => prefs.includes(r.resolution))
        )
      );
      next[key] = { ...cfg, available: !!hasCompatible };
    }
    return next;
  }, [serverResponse]);

  const refreshModels = () => fetchModels();

  return { serverResponse, devices, isLoading, error, refreshModels };
}
