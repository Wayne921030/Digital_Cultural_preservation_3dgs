import React, { useRef } from 'react'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from './theme'
import Header from './components/Header'
import Controls from './components/Controls'
import Viewer from './components/Viewer'
import { useAppSettings } from './hooks'

function App() {
  // Use custom Hook to manage settings
  const { settings, isAutoRotating, updateSettings, toggleAutoRotate } = useAppSettings()
  
  const resetCameraRef = useRef(null)
  const toggleAutoRotateRef = useRef(null)
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
        <Controls 
          settings={settings}
          onSettingsChange={updateSettings}
          onResetCamera={resetCameraRef}
          onToggleAutoRotate={toggleAutoRotate}
          isAutoRotating={isAutoRotating}
        />
        <Viewer 
          settings={settings}
          onResetCamera={resetCameraRef}
          onToggleAutoRotate={toggleAutoRotateRef}
          isAutoRotating={isAutoRotating}
          ref={viewerRef}
          onServerStatusChange={setServerStatus}
          onErrorChange={setError}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App 