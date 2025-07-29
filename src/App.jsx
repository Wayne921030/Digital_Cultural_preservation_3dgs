import React, { useRef, Suspense, lazy } from 'react'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from './theme'
import Header from './components/Header'
import Controls from './components/Controls'
const Viewer = lazy(() => import('./components/Viewer'))
import ModelSelector from './components/ModelSelector'
import LoadingScreen from './components/LoadingScreen'
import { useAppSettings, useAvailableModels } from './hooks'

function App() {
  // Use custom Hook to manage settings
  const { 
    settings, 
    isAutoRotating, 
    selectedModel, 
    modelSelected,
    updateSettings, 
    toggleAutoRotate, 
    updateSelectedModel,
    resetModelSelection
  } = useAppSettings()

  // Use custom Hook to check available models
  const { 
    modelConfigs, 
    isLoading: modelsLoading, 
    error: modelsError,
    refreshModels
  } = useAvailableModels()
  
  const resetCameraRef = useRef(null)
  const viewerRef = useRef(null)
  const [serverStatus, setServerStatus] = React.useState('checking')
  const [error, setError] = React.useState(null)

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
        ) : !modelSelected ? (
          <ModelSelector 
            onModelSelect={updateSelectedModel}
            selectedModel={selectedModel}
            modelConfigs={modelConfigs}
          />
        ) : (
          <>
            <Controls 
              settings={settings}
              onSettingsChange={updateSettings}
              onResetCamera={() => resetCameraRef.current?.()}
              onToggleAutoRotate={toggleAutoRotate}
              isAutoRotating={isAutoRotating}
              selectedModel={selectedModel}
              onModelChange={updateSelectedModel}
              onResetModelSelection={resetModelSelection}
              modelConfigs={modelConfigs}
            />
            <Suspense fallback={<div>Loading Viewer...</div>}>
              <Viewer 
                settings={settings}
                onResetCamera={resetCameraRef}
                onToggleAutoRotate={toggleAutoRotate}
                isAutoRotating={isAutoRotating}
                selectedModel={selectedModel}
                modelSelected={modelSelected}
                modelConfigs={modelConfigs}
                ref={viewerRef}
                onServerStatusChange={setServerStatus}
                onErrorChange={setError}
              />
            </Suspense>
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App 