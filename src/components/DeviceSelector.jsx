import React from 'react'
import { 
  Typography, 
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Container,
  Button
} from '@mui/material'
import { 
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  Computer as ComputerIcon,
  ArrowBack
} from '@mui/icons-material'

function DeviceSelector({ deviceConfigs, onDeviceSelect, selectedDevice }) {

  if (!deviceConfigs || Object.keys(deviceConfigs).length === 0) {
    return (
      <Box sx={{ 
        background: '#F8F6F2',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* Main Navigation Bar */}
        <Box sx={{ 
          borderBottom: '1px solid rgba(139, 115, 85, 0.1)',
          py: 2
        }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Button 
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                  sx={{ color: '#6B5B47' }}
                >
                  返回首頁
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Title */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              color: '#6B5B47', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              無相容設備
            </Typography>
            <Typography variant="h5" sx={{ color: '#6B5B47', fontStyle: 'italic', mb: 3 }}>
              No Compatible Devices
            </Typography>
            <Typography variant="body1" sx={{ 
              fontSize: '1.2rem', 
              lineHeight: 1.8,
              maxWidth: 800,
              margin: '0 auto',
              color: '#2F2F2F'
            }}>
              未找到相容的設備配置。請檢查伺服器是否正在運行並包含所需的模型檔案。
            </Typography>
          </Box>

          {/* Error Message */}
          <Box sx={{ 
            p: 6,
            backgroundColor: 'white',
            borderRadius: 0,
            boxShadow: '0 2px 8px rgba(139, 115, 85, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              marginBottom: 3, 
              color: '#6B5B47',
              fontWeight: 'bold'
            }}>
              請檢查伺服器狀態
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#6B5B47', 
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              無法載入設備配置。請確保：
            </Typography>
            <Box sx={{ mt: 3, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
              <Typography variant="body1" sx={{ 
                color: '#2F2F2F', 
                mb: 2,
                fontSize: '1rem'
              }}>
                • 伺服器正在運行
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#2F2F2F', 
                mb: 2,
                fontSize: '1rem'
              }}>
                • 包含所需的模型檔案
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#2F2F2F',
                fontSize: '1rem'
              }}>
                • 網路連線正常
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }

  const iconMap = {
    smartphone: PhoneIcon,
    laptopWeak: LaptopIcon,
    laptopStrong: LaptopIcon,
    desktopStrong: ComputerIcon
  }

  const colorMap = {
    smartphone: '#8B7355',
    laptopWeak: '#D4C4A8',
    laptopStrong: '#6B5B47',
    desktopStrong: '#F8F6F2'
  }

  return (
    <Box sx={{ 
      background: '#F8F6F2',
      minHeight: 'calc(100vh - 64px)'
    }}>

      {/* Main Navigation Bar */}
      <Box sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(139, 115, 85, 0.1)',
        py: 2
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Button 
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                sx={{ color: '#6B5B47' }}
              >
                返回首頁
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            color: '#6B5B47', 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            選擇您的設備
          </Typography>
          <Typography variant="h5" sx={{ color: '#6B5B47', fontStyle: 'italic', mb: 3 }}>
            Choose Your Device
          </Typography>
          <Typography variant="body1" sx={{ 
            fontSize: '1.2rem', 
            lineHeight: 1.8,
            maxWidth: 800,
            margin: '0 auto',
            color: '#2F2F2F'
          }}>
            請選擇您的設備類型，我們將為您提供最佳的效能和品質建議。
          </Typography>
        </Box>

        {/* Device Selection */}
        <Box sx={{ 
          p: 4,
          backgroundColor: 'white',
          borderRadius: 0,
          boxShadow: '0 2px 8px rgba(139, 115, 85, 0.1)'
        }}>
          <Grid container spacing={3}>
            {Object.entries(deviceConfigs).map(([deviceKey, deviceConfig]) => {
              const IconComponent = iconMap[deviceKey] || ComputerIcon
              const deviceColor = colorMap[deviceKey] || '#8B7355'
              
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
                      border: selectedDevice === deviceKey ? '2px solid #8B7355' : '2px solid transparent'
                    }}
                    onClick={() => onDeviceSelect(deviceKey)}
                  >
                    <CardContent sx={{ 
                      padding: { xs: 2, sm: 3 }, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column' 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: deviceColor, 
                          marginRight: 2,
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 }
                        }}>
                          <IconComponent sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ 
                          color: '#6B5B47',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          {deviceConfig.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ 
                        color: '#6B5B47', 
                        marginBottom: 2, 
                        minHeight: '40px',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}>
                        {deviceConfig.description}
                      </Typography>

                      <Divider sx={{ marginY: 2 }} />

                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#6B5B47', 
                          marginBottom: 1,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}>
                          Features:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {deviceConfig.features.map((feature, index) => (
                            <Typography key={index} variant="body2" sx={{ 
                              color: '#6B5B47', 
                              fontSize: { xs: '0.7rem', sm: '0.8rem' }
                            }}>
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
        </Box>
      </Container>
    </Box>
  )
}

export default DeviceSelector 