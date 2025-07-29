import { useState, useCallback } from "react";

/**
 * Application settings management Hook
 */
export const useAppSettings = () => {
  const [settings, setSettings] = useState({
    alphaThreshold: 5,
    antialiased: false,
  });
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("smartphone");
  const [modelSelected, setModelSelected] = useState(false);

  const updateSettings = useCallback((newSettings) => {
    console.log("App: Settings changed:", newSettings);
    setSettings(newSettings);
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const updateSelectedModel = useCallback((model, confirmed = false) => {
    console.log("App: Model changed:", model);
    setSelectedModel(model);
    if (confirmed) {
      setModelSelected(true);
    }
  }, []);

  const resetModelSelection = useCallback(() => {
    setModelSelected(false);
  }, []);

  return {
    settings,
    isAutoRotating,
    selectedModel,
    modelSelected,
    updateSettings,
    toggleAutoRotate,
    updateSelectedModel,
    resetModelSelection,
  };
};
