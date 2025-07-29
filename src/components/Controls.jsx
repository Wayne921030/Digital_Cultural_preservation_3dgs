import React from 'react'
import { 
  Paper, 
  Typography, 
  Slider, 
  Button, 
  Grid, 
  Box,
  FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  Collapse,
  IconButton
} from '@mui/material'
import { Refresh as RefreshIcon, ExpandMore } from '@mui/icons-material'

function Controls({ settings, onSettingsChange, onResetCamera, onToggleAutoRotate, isAutoRotating, selectedModel, onModelChange, onResetModelSelection, modelConfigs }) {
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [alphaValue, setAlphaValue] = React.useState(settings.alphaThreshold)
  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value }
    onSettingsChange(newSettings)
  }
  // Keep alphaValue in sync if settings.alphaThreshold changes from outside
  React.useEffect(() => {
    setAlphaValue(settings.alphaThreshold)
  }, [settings.alphaThreshold])

  const currentModel = modelConfigs[selectedModel]

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
          Current Model: {currentModel?.primaryFile || 'Unknown'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.9 }}>
          Selected Device: {currentModel?.name || 'Unknown'}
        </Typography>
        {currentModel && (
          <>
            <Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.8, fontSize: '0.8rem' }}>
              {currentModel.availableSplat ? 'Using .splat format' : 'Using .ply format'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.7, fontSize: '0.7rem' }}>
              File Size: {currentModel.primaryFileSize?.toFixed(1)} MB
            </Typography>
          </>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Advanced Settings
        </Typography>
        <IconButton
          onClick={() => setShowAdvanced((prev) => !prev)}
          aria-label="expand advanced settings"
          size="small"
          sx={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <ExpandMore />
        </IconButton>
      </Box>
      <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Typography variant="body2" sx={{ color: 'text.primary', width: 200, flexShrink: 0 }}>
                   Alpha Removal Threshold: {Math.round((settings.alphaThreshold / 10) * 255)}
                 </Typography>
                 <Slider
                   value={alphaValue}
                   onChange={(e, value) => setAlphaValue(value)}
                   onChangeCommitted={(e, value) => handleSettingChange('alphaThreshold', value)}
                   min={0}
                   max={10}
                   step={0.1}
                   valueLabelDisplay="auto"
                   sx={{ flex: 1, minWidth: 200 }}
                 />
               </Box>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.antialiased || false}
                    onChange={(e) => handleSettingChange('antialiased', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Antialiasing: {settings.antialiased ? 'Enabled' : 'Disabled'}
                  </Typography>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={onResetCamera}
          sx={{ minWidth: 150 }}
        >
          Reset Camera
        </Button>
        <Button 
          variant={isAutoRotating ? "contained" : "outlined"}
          onClick={onToggleAutoRotate}
          sx={{ minWidth: 150 }}
        >
          {isAutoRotating ? 'Stop Auto-Rotate' : 'Toggle Auto-Rotate'}
        </Button>
        <Button 
          variant="outlined"
          onClick={onResetModelSelection}
          startIcon={<RefreshIcon />}
          sx={{ minWidth: 150 }}
        >
          Change Model
        </Button>
      </Box>
    </Paper>
  )
}

export default Controls 