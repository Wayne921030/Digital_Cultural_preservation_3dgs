import React, { useState } from 'react'
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, Popover, Chip } from '@mui/material'
import { Info, CheckCircle, Error, CloudOff } from '@mui/icons-material'

function InfoPanel({ serverStatus, error }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const instructions = [
    'Use mouse to rotate, scroll to zoom, right-click to pan',
    'Adjust settings to customize the visualization',
    'Use camera controls to reset view or enable auto-rotation'
  ]

  const getServerStatusIcon = () => {
    switch (serverStatus) {
      case 'connected':
        return <CheckCircle color="success" sx={{ fontSize: 16 }} />
      case 'error':
        return <Error color="error" sx={{ fontSize: 16 }} />
      case 'checking':
        return <CloudOff color="warning" sx={{ fontSize: 16 }} />
      default:
        return <CloudOff color="warning" sx={{ fontSize: 16 }} />
    }
  }

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'connected':
        return 'Server Connected'
      case 'error':
        return 'Server Error'
      case 'checking':
        return 'Checking Server'
      default:
        return 'Server Unknown'
    }
  }

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'connected':
        return 'success'
      case 'error':
        return 'error'
      case 'checking':
        return 'warning'
      default:
        return 'warning'
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
          width: 40,
          height: 40,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Info sx={{ fontSize: 24 }} />
      </IconButton>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            maxWidth: 380,
            marginTop: 1,
          }
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            padding: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, color: 'text.primary' }}>
            Instructions
          </Typography>
          
          Server Status
          <Chip
            icon={getServerStatusIcon()}
            label={getServerStatusText()}
            color={getServerStatusColor()}
            size="small"
            sx={{ marginBottom: 2 }}
          />
          
          {error && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ marginBottom: 2, padding: 1, backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: 1 }}
            >
              {error}
            </Typography>
          )}
          
          <List>
            {instructions.map((instruction, index) => (
              <ListItem key={index} sx={{ paddingLeft: 0 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Info color="primary" sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={instruction} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
    </>
  )
}

export default InfoPanel 