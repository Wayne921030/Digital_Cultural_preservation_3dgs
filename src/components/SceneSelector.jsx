import React, { useState } from 'react'
import { 
  Paper, 
  Typography, 
  Button, 
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Divider,
  Container
} from '@mui/material'
import { 
  ViewInAr as ViewInArIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  Computer as ComputerIcon
} from '@mui/icons-material'
import { RESOLUTION_QUALITY, DEVICE_CONFIGS } from '../constants'
import { formatFileSize, getBestFileType } from '../utils/fileUtils'

function SceneSelector({ scenes, selectedDevice, onSceneSelect, onDeviceSelect, onBackToHome, selectedScene, onUploadSplat }) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  // Helper functions for device selection
  const getDeviceIcon = (deviceKey) => {
    const iconMap = {
      smartphone: PhoneIcon,
      laptopWeak: LaptopIcon,
      laptopStrong: LaptopIcon,
      desktopStrong: ComputerIcon
    };
    return iconMap[deviceKey] || ComputerIcon;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const splatFile = files.find(file => file.name.toLowerCase().endsWith('.splat'));
    
    if (splatFile) {
      onUploadSplat?.(splatFile);
    }
  };



  const handleDeviceSelect = (deviceKey) => {
    // Call the parent's device selection handler
    if (onDeviceSelect) {
      onDeviceSelect(deviceKey);
    }
  };

  if (!scenes || scenes.length === 0) {
    return (
      <Box sx={{ 
        background: '#F8F6F2',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* Navigation Bar */}
        <Box sx={{py: 2}}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Button 
                  startIcon={<ArrowBackIcon />}
                  onClick={onBackToHome}
                  sx={{ color: '#6B5B47' }}
                >
                  返回首頁
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <Typography variant="h5" sx={{ marginBottom: 2, color: '#6B5B47' }}>
              No Scenes Available
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5B47', textAlign: 'center', maxWidth: 500 }}>
              No 3D scenes were found on the server. Please check if the server is running and contains the required scene files.
            </Typography>
          </Paper>
        </Container>
      </Box>
    )
  }

  const deviceConfig = selectedDevice ? DEVICE_CONFIGS[selectedDevice] : null
  const recommendedResolutions = deviceConfig?.recommendedResolutions || []

  // Filter scenes and get the best file type and resolution for each scene
  const getScenesWithBestOptions = (scenes, deviceResolutions) => {
    // If no device is selected, show all scenes without filtering
    if (!deviceResolutions || deviceResolutions.length === 0) {
      return scenes.map(scene => ({
        ...scene,
        bestFileType: scene.file_types?.[0] || null,
        bestResolution: scene.file_types?.[0]?.resolutions?.[0] || null
      }));
    }

    return scenes.map(scene => {
      const bestOptions = getBestFileType(scene, deviceResolutions);
      if (!bestOptions) return null;
      
      return {
        ...scene,
        bestFileType: bestOptions.bestFileType,
        bestResolution: bestOptions.bestResolution
      };
    }).filter(scene => scene !== null);
  }

  const scenesWithBestOptions = getScenesWithBestOptions(scenes, recommendedResolutions)

  // Get scene preview image
  const getSceneImage = (sceneName) => {
    switch (sceneName) {
      case 'Rooftop_Drone':
        return 'Rooftop_Drone.png'
      case 'Foo_dog':
        return 'Foo_dog.png'
      case 'Main_entrance':
        return 'Main_entrance.png'
      case 'Interior':
        return 'Interior.png'
      default:
        return null
    }
  }

  return (
    <Box sx={{ 
      background: '#F8F6F2',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Navigation Bar */}
      <Box sx={{ py: 2}}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Button 
                startIcon={<ArrowBackIcon />}
                onClick={onBackToHome}
                sx={{ color: '#6B5B47' }}
              >
                返回首頁
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

              <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper 
          elevation={3}
          sx={{ 
            padding: 4, 
            marginBottom: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            minHeight: '60vh',
            position: 'relative',
            border: isDragOver ? '3px dashed rgba(139, 115, 85, 0.4)' : '3px solid transparent',
            transition: 'all 0.3s ease',
            backgroundColor: isDragOver ?  'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.95)',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Typography variant="h4" sx={{ marginBottom: 3, color: '#6B5B47', textAlign: 'center' }}>
            Choose a Scene
          </Typography>

          {/* Device Selection Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#6B5B47', mb: 2, fontWeight: 'bold' }}>
              選擇您的設備類型
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(DEVICE_CONFIGS).map(([deviceKey, deviceConfig]) => {
                const IconComponent = getDeviceIcon(deviceKey);
                
                return (
                  <Grid size={{xs: 12, sm: 6, md: 3}} key={deviceKey}>
                    <Card 
                      elevation={selectedDevice === deviceKey ? 4 : 1}
                      sx={{ 
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                        border: selectedDevice === deviceKey ? '2px solid #8B7355' : '1px solid rgba(139, 115, 85, 0.2)',
                        backgroundColor: selectedDevice === deviceKey ? 'rgba(139, 115, 85, 0.05)' : 'white'
                      }}
                      onClick={() => handleDeviceSelect(deviceKey)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ 
                            bgcolor: "#8B7355", 
                            mr: 1,
                            width: 24,
                            height: 24
                          }}>
                            <IconComponent sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ 
                            color: '#6B5B47',
                            fontWeight: selectedDevice === deviceKey ? 'bold' : 'normal'
                          }}>
                            {deviceConfig.label}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ 
                          color: '#6B5B47',
                          fontSize: '0.7rem',
                          lineHeight: 1.2
                        }}>
                          {deviceConfig.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            {!isDragOver && (
              <Typography variant="body1" sx={{ color: '#6B5B47', marginBottom: 2 }}>
                {selectedDevice ? 
                  `點擊場景以使用 ${deviceConfig?.label} 的最佳格式和解析度查看。` :
                  '請先選擇您的設備類型，然後點擊場景進行查看。'
                }
              </Typography>
            )}
            {isDragOver && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#6B5B47', 
                  textAlign: 'center',
                  mt: 4,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': {
                      opacity: 0.7
                    },
                    '50%': {
                      opacity: 1
                    },
                    '100%': {
                      opacity: 0.7
                    }
                  }
                }}
              >
                Drop your .splat file here to upload
              </Typography>
            )}
          </Box>

          {scenesWithBestOptions.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
              <Typography variant="h6" sx={{ color: '#6B5B47', marginBottom: 2 }}>
                No Compatible Scenes
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B5B47', marginBottom: 3 }}>
                No scenes are available with resolutions compatible with your selected device ({deviceConfig?.label}).
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {scenesWithBestOptions.map((scene) => {
                const sceneImage = getSceneImage(scene.scene_name)
                return (
                  <Grid size={{xs: 12, sm: 6, md: 3}} key={scene.scene_name}>
                    <Card 
                      elevation={selectedDevice ? 2 : 1}
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        cursor: selectedDevice ? 'pointer' : 'not-allowed',
                        opacity: selectedDevice ? 1 : 0.6,
                        '&:hover': {
                          transform: selectedDevice ? 'translateY(-4px)' : 'none',
                          boxShadow: selectedDevice ? 4 : 1,
                        },
                        border: selectedScene?.scene_name === scene.scene_name ? '2px solid #8B7355' : '2px solid transparent'
                      }}
                      onClick={() => selectedDevice ? onSceneSelect(scene, scene.bestFileType, scene.bestResolution) : null}
                    >
                      {sceneImage ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={`/img/${sceneImage}`}
                          alt={scene.scene_name.replace(/_/g, ' ')}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#8B7355',
                          }}
                        >
                          <ViewInArIcon sx={{ fontSize: 60, color: 'white' }} />
                        </Box>
                      )}
                      <CardContent sx={{ padding: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Avatar sx={{ bgcolor: '#8B7355', marginRight: 2 }}>
                            <ViewInArIcon sx={{ color: 'white' }} />
                          </Avatar>
                          <Typography variant="h6" sx={{ color: '#6B5B47' }}>
                            {scene.scene_name.replace(/_/g, ' ')}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ marginY: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <Typography variant="body2" sx={{ color: '#6B5B47' }}>
                            {scene.file_types.length} format{scene.file_types.length !== 1 ? 's' : ''} available
                          </Typography>
                          <Chip 
                            label={`${scene.bestResolution.resolution} • ${formatFileSize(scene.bestResolution.size)}`}
                            size="small"
                            sx={{
                              borderColor: '#8B7355',
                              color: '#8B7355',
                              '& .MuiChip-label': {
                                color: '#8B7355'
                              }
                            }}
                            variant="outlined"
                          />
                        </Box>

                        
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}

          {/* Upload section */}
          <Box sx={{ 
            marginTop: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#6B5B47', textAlign: 'center' }}>
              或者拖拽 .splat 檔案到此處進行上傳
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SceneSelector