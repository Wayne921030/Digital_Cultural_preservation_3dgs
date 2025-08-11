import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import {
  PlayArrow,
  Search,
} from "@mui/icons-material";

const HomePage = ({
  onNavigateToTemple,
  onNavigateToScenes,
}) => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleTabChange = (event, newValue) => {
    setCurrentPage(newValue);
    if (newValue === "scenes") {
      onNavigateToScenes();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          py: 2,
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Tabs
                value={currentPage}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    color: "#6B5B47",
                    "&.Mui-selected": {
                      color: "#6B5B47",
                      fontWeight: "bold",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#8B7355",
                  },
                }}
              >
                <Tab label="首頁" value="home" />
                <Tab label="所有場景" value="scenes" />
              </Tabs>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Search sx={{ color: "#6B5B47", cursor: "pointer" }} />
            </Box>
          </Box>
        </Container>
      </Box>

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
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onNavigateToTemple}
                    sx={{
                      mr: 2,
                      backgroundColor: "#8B7355",
                      "&:hover": { backgroundColor: "#6B5B47" },
                    }}
                  >
                    探索保生宮
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onNavigateToScenes}
                    sx={{
                      borderColor: "#8B7355",
                      color: "#8B7355",
                      "&:hover": {
                        borderColor: "#6B5B47",
                        backgroundColor: "rgba(139, 115, 85, 0.04)",
                      },
                    }}
                  >
                    查看所有場景
                  </Button>
                </Box>
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
