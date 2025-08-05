import React, { useRef, Suspense, lazy } from 'react'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from './theme'
import Header from './components/Header'
import Controls from './components/Controls'
const Viewer = lazy(() => import('./components/Viewer'))
import DeviceSelector from './components/DeviceSelector'
import SceneSelector from './components/SceneSelector'
import LoadingScreen from './components/LoadingScreen'
import { useAppSettings, useAvailableModels } from './hooks'
import { readFileAsArrayBuffer } from './utils/fileUtils'

function App() {
  // Use custom Hook to manage settings
  const { 
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
    resetSceneSelection
  } = useAppSettings()

  // Use custom Hook to check available models
  const { 
    scenes, 
    deviceConfigs, 
    isLoading: modelsLoading, 
    error: modelsError,
    refreshModels
  } = useAvailableModels()
  
  const handleUploadSplat = async (file) => {
    if (!file) return;
    
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await readFileAsArrayBuffer(file);
      
      // Create dummy scene metadata for local upload
      const sceneObj = { scene_name: file.name };
      const fileTypeObj = { type: 'local', name: 'Local Upload' };
      const resolution = {
        filename: file.name,
        size: file.size,
        arrayBuffer,
      };
      updateSceneSelection(sceneObj, fileTypeObj, resolution);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
    }
  };

  const resetCameraRef = useRef(null)
  const viewerRef = useRef(null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 1400,
          margin: '0 auto',
          padding: 2,
        }}
      >
        <Header />
        
        {modelsLoading ? (
          <LoadingScreen isLoading={modelsLoading} error={modelsError} onRetry={refreshModels} />
        ) : !deviceSelected ? (
          <DeviceSelector 
            deviceConfigs={deviceConfigs}
            onDeviceSelect={updateSelectedDevice}
            selectedDevice={selectedDevice}
          />
        ) : !sceneSelected ? (
          <SceneSelector 
            scenes={scenes}
            selectedDevice={selectedDevice}
            onSceneSelect={updateSceneSelection}
            onBackToDeviceSelection={resetDeviceSelection}
            selectedScene={selectedScene}
            onUploadSplat={handleUploadSplat}
          />
        ) : (
          <>
            <Controls 
              onResetCamera={() => resetCameraRef.current?.()}
              onToggleAutoRotate={toggleAutoRotate}
              onToggleSwingRotate={toggleSwingRotate}
              isAutoRotating={isAutoRotating}
              isSwingRotating={isSwingRotating}
              selectedScene={selectedScene}
              selectedResolution={selectedResolution}
              selectedDevice={selectedDevice}
              onResetSceneSelection={resetSceneSelection}
            />
            <Suspense fallback={<div>Loading Viewer...</div>}>
              <Viewer 
                onResetCamera={resetCameraRef}
                isAutoRotating={isAutoRotating}
                isSwingRotating={isSwingRotating}
                selectedResolution={selectedResolution}
                sceneSelected={sceneSelected}
                selectedScene={selectedScene}
                ref={viewerRef}
                
              />
            </Suspense>
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App 