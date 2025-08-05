import { useState, useCallback } from "react";

/**
 * Application settings management Hook
 */
export const useAppSettings = () => {
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isSwingRotating, setIsSwingRotating] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [deviceSelected, setDeviceSelected] = useState(false);
  const [sceneSelected, setSceneSelected] = useState(false);

  const toggleAutoRotate = useCallback(() => {
    // For topDown360 orbit, toggle 360° rotation
    setIsAutoRotating((prev) => {
      const newState = !prev;
      if (newState) {
        setIsSwingRotating(false);
      }
      return newState;
    });
  }, []);

  const toggleSwingRotate = useCallback(() => {
    // For frontFocus orbit, toggle swing mode
    setIsSwingRotating((prev) => {
      const newState = !prev;
      if (newState) {
        setIsAutoRotating(false);
      }
      return newState;
    });
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
    isAutoRotating,
    isSwingRotating,
    selectedDevice,
    selectedScene,
    selectedFileType,
    selectedResolution,
    deviceSelected,
    sceneSelected,
    toggleAutoRotate,
    toggleSwingRotate,
    updateSelectedDevice,
    updateSceneSelection,
    resetDeviceSelection,
    resetSceneSelection,
  };
};
