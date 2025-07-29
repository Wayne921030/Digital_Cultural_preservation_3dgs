import React from 'react'
import { Box, Typography } from '@mui/material'

function Header() {
  return (
    <Box
      component="header"
      sx={{
        textAlign: 'center',
        marginBottom: 4,
        color: '#FFFFFF',
      }}
    >
      <Typography variant="h1" sx={{ marginBottom: 1, color: '#FFFFFF' }}>
        Digital Cultural Preservation 3DGS
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9, color: '#FFFFFF' }}>
        Interactive 3D visualization of Gaussian Splatting results
      </Typography>
    </Box>
  )
}

export default Header 