import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import {
  PlayArrow,
  Search,
} from "@mui/icons-material";
import TabBar from "./TabBar";

const HomePage = ({
  currentPage,
  onTabChange,
}) => {

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >

      {/* TabBar */}
      <TabBar currentPage={currentPage} onTabChange={onTabChange} />

      {/* Page Title */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #D4C4A8 0%, #F8F6F2 100%)",
          py: 4,
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
          {/* Title and Video */}
          <Grid container spacing={8} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    color: "#6B5B47",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  3D Culture Preservation
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#8B7355",
                    mb: 2,
                    fontStyle: "italic",
                  }}
                >
                  Culture preservation-related
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#6B5B47",
                    mb: 4,
                  }}
                >
                  數位文化遺產保護
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <IconButton
                    size="large"
                    sx={{
                      backgroundColor: "rgba(139, 115, 85, 0.9)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(139, 115, 85, 1)" },
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ mt: 2, color: "#6B5B47" }}>
                    Video for showcase
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          py: 6,
          maxWidth: { xl: "1400px" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        }}
      >
        <Box>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: "#6B5B47", mb: 4, fontWeight: "bold" }}
          >
            More ...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
