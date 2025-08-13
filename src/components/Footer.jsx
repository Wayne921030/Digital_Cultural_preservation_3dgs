import React from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import { ContactSupport, Info } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(139, 115, 85, 0.1)",
        py: 6,
        backgroundColor: 'background.default',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: { xl: "1400px" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1,
            color: 'primary.main'
          }}
        >
          <ContactSupport sx={{ fontSize: 30, color: 'primary.main' }} />
          Contact
        </Typography>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#6B5B47", mb: 2, fontWeight: "bold" }}
            >
              聯絡資訊
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", mb: 1, color: "#2F2F2F" }}
            >
              電話: +886-4-1234-5678
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", mb: 1, color: "#2F2F2F" }}
            >
              信箱: info@baoshengtemple.org.tw
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", color: "#2F2F2F" }}
            >
              地址: 台灣中部地區
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
