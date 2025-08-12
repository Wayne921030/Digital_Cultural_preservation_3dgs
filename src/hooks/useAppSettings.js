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
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [deviceSelected, setDeviceSelected] = useState(false);
  const [sceneSelected, setSceneSelected] = useState(false);

  const updateSettings = useCallback((newSettings) => {
    console.log("App: Settings changed:", newSettings);
    setSettings(newSettings);
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const updateSelectedDevice = useCallback((device) => {
    console.log("App: Device selected:", device);
    setSelectedDevice(device);
    setDeviceSelected(true);
    // Reset scene selection when device changes
    setSceneSelected(false);
    setSelectedScene(null);
    setSelectedFileType(null);
    setSelectedResolution(null);
  }, []);

  const updateSceneSelection = useCallback((scene, fileType, resolution) => {
    console.log("App: Scene selected:", { scene, fileType, resolution });
    setSelectedScene(scene);
    setSelectedFileType(fileType);
    setSelectedResolution(resolution);
    setSceneSelected(true);
  }, []);

  const resetDeviceSelection = useCallback(() => {
    setDeviceSelected(false);
    setSelectedDevice(null);
    setSceneSelected(false);
    setSelectedScene(null);
    setSelectedFileType(null);
    setSelectedResolution(null);
  }, []);

  const resetSceneSelection = useCallback(() => {
    setSceneSelected(false);
    setSelectedScene(null);
    setSelectedFileType(null);
    setSelectedResolution(null);
  }, []);

  return {
    settings,
    isAutoRotating,
    selectedDevice,
    selectedScene,
    selectedResolution,
    toggleAutoRotate,
    updateSelectedDevice,
    updateSceneSelection,
  };
};
