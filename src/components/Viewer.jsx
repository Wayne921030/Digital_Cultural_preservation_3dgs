import React, { forwardRef } from 'react'
import { Paper, Box, Typography, CircularProgress } from '@mui/material'
import { useViewer, useAutoRotate } from '../hooks'

const Viewer = forwardRef(({ 
  settings, 
  onResetCamera, 
  isAutoRotating,
  selectedResolution, 
  sceneSelected
}, ref) => {
  
  // Use custom Hooks to manage core logic
  const { isLoading, error, viewerRef, viewerInstanceRef, resetCamera } = useViewer(
    settings, 
    selectedResolution, 
    sceneSelected
  )
  
  // Use auto-rotation Hook
  useAutoRotate(viewerInstanceRef.current, isAutoRotating)

  // Set up reset camera callback
  React.useEffect(() => {
    if (onResetCamera && resetCamera && viewerInstanceRef.current) {
      onResetCamera.current = resetCamera
    }
  }, [onResetCamera, resetCamera, viewerInstanceRef.current])

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: 600,
        marginBottom: 2,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        ref={viewerRef}
        sx={{
          width: '100%',
          height: '100%',
          background: '#f8f9fa',
          position: 'relative',
          overflow: 'hidden',
        }}
      />
      
      {/* Info Panel positioned on top of the viewer */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 20,
        }}
      >
      </Box>
      
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <CircularProgress 
            size={40} 
            sx={{ marginBottom: 2, color: 'primary.main' }} 
          />
          <Typography variant="body2" color="text.secondary">
            Loading 3D model...
          </Typography>
        </Box>
      )}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}
    </Paper>
  )
})

export default Viewer 