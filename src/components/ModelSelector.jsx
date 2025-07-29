import React from 'react'
import { 
  Paper, 
  Typography, 
  Button, 
  Box,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { 
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  Computer as ComputerIcon,
  Speed as SpeedIcon
} from '@mui/icons-material'
import { MODEL_CONFIGS, MODEL_FILES } from '../constants'

function ModelSelector({ onModelSelect, selectedModel, modelConfigs }) {
  const iconMap = {
    smartphone: PhoneIcon,
    laptopWeak: LaptopIcon,
    laptopStrong: LaptopIcon,
    desktopStrong: ComputerIcon
  }

  const colorMap = {
    smartphone: '#4CAF50',
    laptopWeak: '#FF9800',
    laptopStrong: '#2196F3',
    desktopStrong: '#9C27B0'
  }

  // Merge MODEL_CONFIGS and MODEL_FILES to create the expected structure
  const allModelConfigs = Object.keys(MODEL_CONFIGS).reduce((acc, key) => {
    acc[key] = {
      ...MODEL_CONFIGS[key],
      splat: MODEL_FILES[key]?.splat || null,
      ply: MODEL_FILES[key]?.ply || null,
    }
    return acc
  }, {})

  // If no models are available at all, show a message
  if (!modelConfigs || Object.keys(modelConfigs).length === 0) {
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
        <Typography variant="h5" sx={{ marginBottom: 2, color: '#e74c3c' }}>
          No Models Available
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', textAlign: 'center', maxWidth: 500 }}>
          No compatible 3D models were found on the server. Please check if the server is running and contains the required model files.
        </Typography>
      </Paper>
    )
  }

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
        justifyContent: 'center'
      }}
    >
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 700, color: '#2c3e50' }}>
          Choose Your Device Type
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', maxWidth: 600, margin: '0 auto' }}>
          Select your device type to download the optimized 3D model for your hardware configuration
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {Object.entries(allModelConfigs).map(([key, config]) => {
          const IconComponent = iconMap[key]
          const color = colorMap[key]
          const isAvailable = modelConfigs[key]
          const availableConfig = modelConfigs[key]
          
          const fileInfo = isAvailable ? 
            (availableConfig.availableSplat ? 
              `Primary: ${availableConfig.splat} (${availableConfig.primaryFileSize?.toFixed(1)} MB)` : 
              `Available: ${availableConfig.ply} (${availableConfig.primaryFileSize?.toFixed(1)} MB)`) :
            'Not Available'
          
          return (
             <Grid size={{xs: 12, sm: 6, md: 3}} key={key}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  border: selectedModel === key ? `3px solid ${color}` : '2px solid transparent',
                  opacity: isAvailable ? 1 : 0.6,
                  '&:hover': {
                    transform: isAvailable ? 'translateY(-4px)' : 'none',
                    boxShadow: isAvailable ? '0 8px 25px rgba(0,0,0,0.15)' : 'none',
                    borderColor: isAvailable ? color : 'transparent',
                  },
                  ...(selectedModel === key && isAvailable && {
                    boxShadow: `0 8px 25px ${color}40`,
                  })
                }}
                onClick={() => isAvailable && onModelSelect(key)}
              >
                <CardContent sx={{ textAlign: 'center', padding: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    marginBottom: 2 
                  }}>
                    <IconComponent 
                      sx={{ 
                        fontSize: 48, 
                        color: isAvailable ? color : '#bdc3c7'
                      }} 
                    />
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    marginBottom: 1,
                    color: isAvailable ? (selectedModel === key ? color : 'text.primary') : '#bdc3c7'
                  }}>
                    {config.name}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: isAvailable ? 'text.secondary' : '#bdc3c7', 
                    marginBottom: 2,
                    minHeight: 40
                  }}>
                    {config.description}
                  </Typography>
                  
                  {/* File availability indicator */}
                  <Box sx={{ marginBottom: 2 }}>
                    <Chip
                      label={fileInfo}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        backgroundColor: isAvailable ? 
                          (availableConfig.availableSplat ? '#4CAF50' : '#FF9800') : 
                          '#e74c3c',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    {isAvailable && availableConfig.fallbackFile && (
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        marginTop: 0.5, 
                        color: 'text.secondary',
                        fontSize: '0.7rem'
                      }}>
                        Fallback: {availableConfig.fallbackFile} ({availableConfig.fallbackFileSize?.toFixed(1)} MB)
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {config.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          backgroundColor: isAvailable ? `${color}20` : '#ecf0f1',
                          color: isAvailable ? color : '#bdc3c7',
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {selectedModel && modelConfigs[selectedModel] && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => onModelSelect(selectedModel, true)}
            sx={{
              backgroundColor: colorMap[selectedModel],
              minWidth: 200,
              height: 56,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: colorMap[selectedModel],
                opacity: 0.9,
              }
            }}
            startIcon={<SpeedIcon />}
          >
            Load {modelConfigs[selectedModel].name} Model
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default ModelSelector 