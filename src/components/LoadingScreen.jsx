import React from 'react'
import { 
  Paper, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import { CloudDownload as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material'

function LoadingScreen({ isLoading, error, onRetry }) {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        padding: 4, 
        marginBottom: 2,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {isLoading ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60} 
            sx={{ marginBottom: 3, color: 'primary.main' }} 
          />
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 600, color: '#2c3e50' }}>
            Checking Available Models
          </Typography>
          <Typography variant="body1" sx={{ color: '#7f8c8d', maxWidth: 500 }}>
            Connecting to server and checking which 3D models are available for your device...
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <DownloadIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
          </Box>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Connection Error
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
          <Typography variant="body1" sx={{ color: '#7f8c8d', marginBottom: 3 }}>
            Unable to connect to the model server. Please check if the server is running at http://127.0.0.1:8000
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
              Make sure the server is running with: python -m http.server 8000
            </Typography>
            {onRetry && (
              <Button
                variant="contained"
                onClick={onRetry}
                startIcon={<RefreshIcon />}
                sx={{ marginTop: 2 }}
              >
                Retry Connection
              </Button>
            )}
          </Box>
        </Box>
      ) : null}
    </Paper>
  )
}

export default LoadingScreen 