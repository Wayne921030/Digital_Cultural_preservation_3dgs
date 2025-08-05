import React from 'react'
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
  Alert,
} from '@mui/material'
import { 
  ViewInAr as ViewInArIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import { RESOLUTION_QUALITY, DEVICE_CONFIGS } from '../constants'
import { formatFileSize, getBestFileType } from '../utils/fileUtils'

function SceneSelector({ scenes, selectedDevice, onSceneSelect, onBackToDeviceSelection, selectedScene, onUploadSplat }) {
  const [isDragOver, setIsDragOver] = React.useState(false);

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

  if (!scenes || scenes.length === 0) {
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
          No Scenes Available
        </Typography>
        <Typography variant="body1" sx={{ color: '#000000', textAlign: 'center', maxWidth: 500 }}>
          No 3D scenes were found on the server. Please check if the server is running and contains the required scene files.
        </Typography>
      </Paper>
    )
  }

  const deviceConfig = DEVICE_CONFIGS[selectedDevice]
  const recommendedResolutions = deviceConfig?.recommendedResolutions || []

  // Filter scenes and get the best file type and resolution for each scene
  const getScenesWithBestOptions = (scenes, deviceResolutions) => {
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
    <Paper 
      elevation={3}
      sx={{ 
        padding: 4, 
        marginBottom: 2,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        minHeight: '60vh',
        position: 'relative',
        border: isDragOver ? '3px dashed rgba(0, 0, 0, 0.4)' : '3px solid transparent',
        transition: 'all 0.3s ease',
        backgroundColor: isDragOver ?  'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.95)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography variant="h4" sx={{ marginBottom: 3, color: 'text.primary', textAlign: 'center' }}>
        Choose a Scene
      </Typography>

      <Alert severity="info" sx={{ marginBottom: 3 }}>
        <Typography variant="body2" sx={{ color: '#000000' }}>
          Showing scenes optimized for {deviceConfig?.name}. 
          Recommended resolution: {recommendedResolutions.map(r => RESOLUTION_QUALITY[r]?.name || r).join(', ')}
        </Typography>
      </Alert>

      <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
        {!isDragOver && (
          <Typography variant="body1" sx={{ color: '#000000', marginBottom: 2 }}>
            Click on a scene to view it with the best format and resolution for your device.
          </Typography>
        )}
        {isDragOver && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.primary', 
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
          <Typography variant="h6" sx={{ color: '#e74c3c', marginBottom: 2 }}>
            No Compatible Scenes
          </Typography>
          <Typography variant="body2" sx={{ color: '#000000', marginBottom: 3 }}>
            No scenes are available with resolutions compatible with your selected device ({deviceConfig?.name}).
          </Typography>
          <Button 
            variant="outlined" 
            onClick={onBackToDeviceSelection}
            startIcon={<ArrowBackIcon />}
          >
            Choose Different Device
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {scenesWithBestOptions.map((scene) => {
            const sceneImage = getSceneImage(scene.scene_name)
            return (
              <Grid size={{xs: 12, sm: 6, md: 3}} key={scene.scene_name}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    border: selectedScene?.scene_name === scene.scene_name ? '2px solid #5C95CFFF' : '2px solid transparent'
                  }}
                  onClick={() => onSceneSelect(scene, scene.bestFileType, scene.bestResolution)}
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
                        backgroundColor: 'primary.main',
                      }}
                    >
                      <ViewInArIcon sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                  )}
                  <CardContent sx={{ padding: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', marginRight: 2 }}>
                        <ViewInArIcon sx={{ color: 'white' }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: '#000000' }}>
                        {scene.scene_name.replace(/_/g, ' ')}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ marginY: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ color: '#000000' }}>
                        {scene.file_types.length} format{scene.file_types.length !== 1 ? 's' : ''} available
                      </Typography>
                      <Chip 
                        label={`${scene.bestResolution.resolution} • ${formatFileSize(scene.bestResolution.size)}`}
                        size="small"
                        color="primary"
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

      {/* Upload and Back buttons */}
      <Box sx={{ 
        marginTop: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBackToDeviceSelection}
        >
          Back to Device Selection
        </Button>
      </Box>
    </Paper>
  )
}

export default SceneSelector