import React, { useRef, Suspense, lazy, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import Header from "./components/Header";
const HomePage = lazy(() => import("./components/HomePage"));
const TempleIntroPage = lazy(() => import("./components/TempleIntroPage"));
const ViewerPage = lazy(() => import("./components/ViewerPage"));
import DeviceSelector from "./components/DeviceSelector";
import SceneSelector from "./components/SceneSelector";
import LoadingScreen from "./components/LoadingScreen";
import { useAppSettings, useAvailableModels } from "./hooks";
import { readFileAsArrayBuffer } from "./utils/fileUtils";
import Footer from "./components/Footer";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home', 'temple', 'scenes', 'viewer'
  const [selectedSceneFromTemple, setSelectedSceneFromTemple] = useState(null);

  // Use custom Hook to manage settings
  const {
    isAutoRotating,
    isSwingRotating,
    selectedDevice,
    selectedScene,
    selectedResolution,
    sceneSelected,
    toggleAutoRotate,
    toggleSwingRotate,
    updateSelectedDevice,
    updateSceneSelection
  } = useAppSettings();

  // Use custom Hook to check available models
  const {
    scenes,
    deviceConfigs,
    isLoading: modelsLoading,
    error: modelsError,
    refreshModels,
  } = useAvailableModels();

  const handleUploadSplat = async (file) => {
    if (!file) return;

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await readFileAsArrayBuffer(file);

      // Create dummy scene metadata for local upload
      const sceneObj = { scene_name: file.name };
      const fileTypeObj = { type: "local", name: "Local Upload" };
      const resolution = {
        filename: file.name,
        size: file.size,
        arrayBuffer,
      };
      updateSceneSelection(sceneObj, fileTypeObj, resolution);
      setCurrentPage("viewer");
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read file. Please try again.");
    }
  };

  const resetCameraRef = useRef(null);
  const viewerRef = useRef(null);

  // Navigation
  const handleNavigateToTemple = () => {
    setCurrentPage("temple");
  };

  const handleNavigateToScenes = () => {
    setCurrentPage("scenes");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedSceneFromTemple(null);
  };

  const handleSceneSelectFromTemple = (scene) => {
    setSelectedSceneFromTemple(scene);
    setCurrentPage("device-selection");
  };

  const handleDeviceSelect = (device) => {
    updateSelectedDevice(device);
    if (selectedSceneFromTemple) {
      // 從保生宮介紹頁面來的流程
      updateSceneSelection(
        selectedSceneFromTemple,
        selectedSceneFromTemple.file_types[0],
        selectedSceneFromTemple.file_types[0].resolutions[0]
      );
      setCurrentPage("viewer");
    } else {
      // 從場景選擇器來的流程
      setCurrentPage("scene-selection");
    }
  };

  const handleSceneSelectFromSelector = (scene, fileType, resolution) => {
    updateSceneSelection(scene, fileType, resolution);
    setCurrentPage("viewer");
  };

  const handleDeviceSelectFromScene = (device) => {
    updateSelectedDevice(device);
    // Stay on the same page (scenes) but now with device selected
  };

  // render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Suspense fallback={<div>Loading Home Page...</div>}>
            <HomePage
              onNavigateToTemple={handleNavigateToTemple}
              onNavigateToScenes={handleNavigateToScenes}
            />
          </Suspense>
        );

      case "temple":
        return (
          <Suspense fallback={<div>Loading Temple Intro...</div>}>
            <TempleIntroPage
              onBackToHome={handleBackToHome}
              onSelectScene={handleSceneSelectFromTemple}
              scenes={scenes}
            />
          </Suspense>
        );

      case "scenes":
        return (
          <SceneSelector
            scenes={scenes}
            selectedDevice={selectedDevice}
            onSceneSelect={handleSceneSelectFromSelector}
            onDeviceSelect={handleDeviceSelectFromScene}
            onBackToHome={handleBackToHome}
            selectedScene={selectedScene}
            onUploadSplat={handleUploadSplat}
          />
        );

      case "device-selection":
        return (
          <DeviceSelector
            deviceConfigs={deviceConfigs}
            onDeviceSelect={handleDeviceSelect}
            selectedDevice={selectedDevice}
          />
        );

      case "scene-selection":
        return (
          <SceneSelector
            scenes={scenes}
            selectedDevice={selectedDevice}
            onSceneSelect={handleSceneSelectFromSelector}
            selectedScene={selectedScene}
            onUploadSplat={handleUploadSplat}
          />
        );

      case "viewer":
        return (
          <Suspense fallback={<div>Loading Viewer Page...</div>}>
            <ViewerPage
              onNavigateToScenes={handleNavigateToScenes}
              onResetCamera={() => resetCameraRef.current?.()}
              onToggleAutoRotate={toggleAutoRotate}
              onToggleSwingRotate={toggleSwingRotate}
              isAutoRotating={isAutoRotating}
              isSwingRotating={isSwingRotating}
              selectedScene={selectedScene}
              selectedResolution={selectedResolution}
              selectedDevice={selectedDevice}
              viewerRef={viewerRef}
              resetCameraRef={resetCameraRef}
              sceneSelected={sceneSelected}
            />
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<div>Loading Home Page...</div>}>
            <HomePage
              onNavigateToTemple={handleNavigateToTemple}
              onNavigateToScenes={handleNavigateToScenes}
            />
          </Suspense>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Header/>
        <Box sx={{ flex: 1, width: "100%" }}>
          {modelsLoading ? (
            <LoadingScreen
              isLoading={modelsLoading}
              error={modelsError}
              onRetry={refreshModels}
            />
          ) : (
            renderCurrentPage()
          )}
        </Box>
        {currentPage !== "viewer" && <Footer />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
