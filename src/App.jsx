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

function App() {
  // Use custom Hook to manage settings
  const { 
    settings, 
    isAutoRotating, 
    selectedDevice, 
    selectedScene,
    selectedFileType,
    selectedResolution,
    deviceSelected,
    sceneSelected,
    updateSettings, 
    toggleAutoRotate, 
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
          />
        ) : (
          <>
            <Controls 
              settings={settings}
              onSettingsChange={updateSettings}
              onResetCamera={() => resetCameraRef.current?.()}
              onToggleAutoRotate={toggleAutoRotate}
              isAutoRotating={isAutoRotating}
              selectedScene={selectedScene}
              selectedResolution={selectedResolution}
              selectedDevice={selectedDevice}
              onResetSceneSelection={resetSceneSelection}
            />
            <Suspense fallback={<div>Loading Viewer...</div>}>
              <Viewer 
                settings={settings}
                onResetCamera={resetCameraRef}
                isAutoRotating={isAutoRotating}
                selectedResolution={selectedResolution}
                sceneSelected={sceneSelected}
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