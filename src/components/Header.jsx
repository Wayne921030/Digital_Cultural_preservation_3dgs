import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Link,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Language } from '@mui/icons-material';

function Header() {
  const [language, setLanguage] = useState('zh');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Box sx={{ 
      backgroundColor: 'primary.dark',
      color: 'white',
      py: 2,
      px: 3,
      boxShadow: '0 2px 8px rgba(107, 91, 71, 0.25)'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 'bold',
            color: '#FFFFFF'
          }}>
            3D Culture Preservation
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Language sx={{ fontSize: 16 }} />
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  sx={{ 
                    color: 'white',
                    '& .MuiSelect-icon': { color: 'white' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                  }}
                >
                  <MenuItem value="zh">中文</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Header; 