import React from 'react'
import { 
  Paper, 
  Typography, 
  Button, 
  Box,
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { DEVICE_CONFIGS } from '../constants'
import { formatFileSize } from '../utils/fileUtils'

function Controls({ 
  onResetCamera, 
  onToggleAutoRotate, 
  onToggleSwingRotate,
  isAutoRotating, 
  isSwingRotating,
  selectedScene, 
  selectedResolution, 
  selectedDevice,
  onResetSceneSelection
}) {
  // Get orbit type from selected scene
  const orbit = selectedScene?.orbit || "frontFocus";
  const isTopDown360 = orbit === "topDown360";
  const isFrontFocus = orbit === "frontFocus";

  const deviceConfig = DEVICE_CONFIGS[selectedDevice]

  return (
    <Paper 
      elevation={3}
      sx={{ 
        padding: 3, 
        marginBottom: 2,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          marginBottom: 3,
          textAlign: 'center',
          padding: 2,
          background: 'linear-gradient(45deg, #57564F, #7A7A73)',
          color: '#FFFFFF',
          borderRadius: 2,
          boxShadow: '0 4px 15px rgba(87, 86, 79, 0.3)',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 1, color: '#FFFFFF' }}>
          Current Scene: {selectedScene?.scene_name?.replace(/_/g, ' ') || 'Unknown'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.9, marginBottom: 1 }}>
          Device: {deviceConfig?.name || 'Unknown'} • Orbit: {orbit}
        </Typography>
        {selectedResolution && (
          <>
            <Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.8, fontSize: '0.8rem' }}>
              File: {selectedResolution.filename} • Size: {formatFileSize(selectedResolution.size)}
            </Typography>
          </>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={onResetCamera}
          sx={{ minWidth: 150 }}
        >
          Reset Camera
        </Button>

        {isTopDown360 && (
          <Button 
            variant={isAutoRotating ? "contained" : "outlined"}
            onClick={onToggleAutoRotate}
            sx={{ minWidth: 150 }}
          >
            {isAutoRotating ? 'Stop 360° Rotate' : 'Start 360° Rotate'}
          </Button>
        )}

        {isFrontFocus && (
          <Button
            variant={isSwingRotating ? "contained" : "outlined"}
            onClick={onToggleSwingRotate}
            sx={{ minWidth: 150 }}
          >
            {isSwingRotating ? 'Stop Swing' : 'Start Swing'}
          </Button>
        )}

        <Button 
          variant="outlined"
          onClick={onResetSceneSelection}
          startIcon={<RefreshIcon />}
          sx={{ minWidth: 150 }}
        >
          Change Scene
        </Button>
      </Box>
    </Paper>
  )
}

export default Controls 