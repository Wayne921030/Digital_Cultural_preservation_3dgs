import React from 'react'
import { 
  Paper, 
  Typography, 
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar
} from '@mui/material'
import { 
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  Computer as ComputerIcon
} from '@mui/icons-material'

function DeviceSelector({ deviceConfigs, onDeviceSelect, selectedDevice }) {
  if (!deviceConfigs || Object.keys(deviceConfigs).length === 0) {
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
          No Compatible Devices
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', textAlign: 'center', maxWidth: 500 }}>
          No compatible device configurations were found. Please check if the server is running and contains the required model files.
        </Typography>
      </Paper>
    )
  }

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

  return (
    <Paper 
      elevation={3}
      sx={{ 
        padding: 4, 
        marginBottom: 2,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        minHeight: '60vh'
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3, color: '#2c3e50', textAlign: 'center' }}>
        Choose Your Device
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4, color: '#7f8c8d', textAlign: 'center' }}>
        Click on your device type to get the best performance and quality recommendations.
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(deviceConfigs).map(([deviceKey, deviceConfig]) => {
          const IconComponent = iconMap[deviceKey] || ComputerIcon
          const deviceColor = colorMap[deviceKey] || '#666'
          
          return (
            <Grid size={{xs: 12, sm: 6, md: 3}} key={deviceKey} sx={{ display: 'flex' }}>
              <Card 
                elevation={2}
                sx={{ 
                  width: '100%',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  border: selectedDevice === deviceKey ? '2px solid #1976d2' : '2px solid transparent'
                }}
                onClick={() => onDeviceSelect(deviceKey)}
              >
                <CardContent sx={{ padding: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Avatar sx={{ bgcolor: deviceColor, marginRight: 2 }}>
                      <IconComponent />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                      {deviceConfig.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#7f8c8d', marginBottom: 2, minHeight: '40px' }}>
                    {deviceConfig.description}
                  </Typography>

                  <Divider sx={{ marginY: 2 }} />

                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" sx={{ color: '#34495e', marginBottom: 1 }}>
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {deviceConfig.features.map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.8rem' }}>
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Paper>
  )
}

export default DeviceSelector 