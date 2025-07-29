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
  FormControlLabel
} from '@mui/material'

function Controls({ settings, onSettingsChange, onResetCamera, onToggleAutoRotate, isAutoRotating }) {
  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value }
    onSettingsChange(newSettings)
  }

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
          Current Model: Rooftop_Drone_lod_25.splat
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: 'text.primary', fontWeight: 600 }}>
              Alpha Removal Threshold: {Math.round((settings.alphaThreshold / 10) * 255)}
            </FormLabel>
            <Slider
              value={settings.alphaThreshold}
              onChange={(e, value) => handleSettingChange('alphaThreshold', value)}
              min={0}
              max={10}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mt: 1 }}
            />
          </FormControl>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6, md: 3}}>
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
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Antialiasing: {settings.antialiased ? 'Enabled' : 'Disabled'}
                </Typography>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
      
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

      </Box>
    </Paper>
  )
}

export default Controls 