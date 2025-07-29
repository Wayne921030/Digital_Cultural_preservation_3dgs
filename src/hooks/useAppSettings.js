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

  const updateSettings = useCallback((newSettings) => {
    console.log("App: Settings changed:", newSettings);
    setSettings(newSettings);
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  return {
    settings,
    isAutoRotating,
    updateSettings,
    toggleAutoRotate,
  };
};
