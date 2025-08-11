import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Divider,
  Container,
  Paper,
  Avatar,
} from "@mui/material";
import {
  LocationOn,
  ArrowBack,
  PlayArrow,
  ViewInAr,
} from "@mui/icons-material";
import ImageCarousel from "../ImageCarousel";
import TabBar from "../TabBar";

const BaseIntroPage = ({ 
  onBackToHome, 
  onSelectScene, 
  scenes,
  // Configuration props for different locations
  locationConfig,
  // Optional custom filtering function for scenes
  sceneFilter,
  // Optional custom styling
  customStyles = {},
  // Tab navigation props
  currentPage,
  onTabChange
}) => {
  const [selectedScene, setSelectedScene] = useState(null);

  // Default configuration structure
  const defaultConfig = {
    name: "Location Name",
    subtitle: "Location Subtitle",
    description: "Location description...",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
    ],
    history: "Historical information...",
    location: "Location details...",
    visitingHours: "Visiting hours...",
    contact: "Contact information...",
    website: "Website...",
    address: "Full address...",
    heroImage: "/img/default-hero.jpg",
    photoCredit: "Photo credit information...",
    storyTitle: "關於這個地方的故事",
    storyContent: [
      "Story paragraph 1...",
      "Story paragraph 2...",
      "Story paragraph 3...",
    ],
    sceneSelectionTitle: "選擇 3D 場景體驗",
    defaultScenes: [
      {
        id: "SceneA",
        name: "場景 A",
        description: "場景 A 的描述",
        image: "/img/scene-a.jpg",
        features: ["高解析度建模", "真實材質渲染", "互動式導覽"],
      },
      {
        id: "SceneB",
        name: "場景 B", 
        description: "場景 B 的描述",
        image: "/img/scene-b.jpg",
        features: ["室內光線模擬", "細節雕刻展示", "360度環視"],
      },
      {
        id: "SceneC",
        name: "場景 C",
        description: "場景 C 的描述", 
        image: "/img/scene-c.jpg",
        features: ["空拍視角", "建築全景", "環境氛圍"],
      },
    ]
  };

  // Merge default config with provided config
  const config = { ...defaultConfig, ...locationConfig };

  // Filter scenes based on provided filter function or default logic
  const filteredScenes = scenes && scenes.length > 0 
    ? (sceneFilter ? sceneFilter(scenes) : scenes.filter(scene => {
        // Default filtering logic - can be overridden by sceneFilter prop
        const category = scene.category?.toLowerCase();
        const sceneName = (scene.scene_name || scene.name || "").toLowerCase();
        
        return category === "temple" || 
               category === "baosheng" || 
               category === "保生宮" ||
               sceneName.includes("temple") ||
               sceneName.includes("baosheng") ||
               sceneName.includes("保生") ||
               sceneName.includes("宮");
      }))
    : [];

  const sceneConfigs = filteredScenes.length > 0 ? filteredScenes : config.defaultScenes;

  const handleSceneSelect = (scene) => {
    setSelectedScene(scene);
  };

  const handleContinue = () => {
    if (selectedScene) {
      onSelectScene(selectedScene);
    }
  };

  // Default styles that can be overridden
  const defaultStyles = {
    background: "linear-gradient(180deg, #DCE4C9 0%, #F8F6F2 100%)",
    primaryColor: "#6B5B47",
    secondaryColor: "#8B7355",
    textColor: "#2F2F2F",
    cardHoverColor: "rgba(139, 115, 85, 0.1)",
  };

  const styles = { ...defaultStyles, ...customStyles };

  return (
    <Box
      sx={{
        // background: "linear-gradient(180deg, #DCE4C9 0%, #F8F6F2 100%)",
        background: styles.background,
        minHeight: "calc(100vh - 64px)",
      }}
    >

      {/* TabBar */}
      {currentPage && onTabChange && (
        <TabBar currentPage={currentPage} onTabChange={onTabChange} />
      )}

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: styles.primaryColor,
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              mb: 2,
            }}
          >
            {config.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              color: styles.secondaryColor, 
              fontStyle: "italic", 
              mb: 4,
              fontWeight: 500,
            }}
          >
            {config.subtitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.3rem",
              lineHeight: 1.8,
              maxWidth: 900,
              margin: "0 auto",
              color: styles.textColor,
              mb: 4,
            }}
          >
            {config.description}
          </Typography>
          
          {/* Address */}
          {config.address && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
              <LocationOn sx={{ color: styles.secondaryColor, mr: 1, fontSize: "1.5rem" }} />
              <Typography
                variant="h6"
                sx={{
                  color: styles.primaryColor,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {config.address}
              </Typography>
            </Box>
          )}
          
          {/* Hero Image */}
          <ImageCarousel 
            images={config.heroImages || [config.heroImage]}
            height={450}
            autoPlayInterval={5000}
          />
          
          {/* Photo Credit */}
          {config.photoCredit && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 1,
                color: styles.secondaryColor,
                fontStyle: "italic",
                fontSize: "0.875rem",
              }}
            >
              {config.photoCredit}
            </Typography>
          )}
        </Box>

        {/* Story Section */}
        {config.storyContent && config.storyContent.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Divider 
              sx={{ 
                mb: 4, 
                borderColor: styles.secondaryColor, 
                borderWidth: 2,
                opacity: 0.6 
              }} 
            />
            
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: styles.primaryColor,
                fontWeight: "bold",
                textAlign: "center",
                mb: 4,
              }}
            >
              {config.storyTitle}
            </Typography>
            
            {config.storyContent.map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 2,
                  color: styles.textColor,
                  textAlign: "justify",
                  mb: 3,
                }}
              >
                {paragraph}
              </Typography>
            ))}
            
            <Divider 
              sx={{ 
                mt: 4, 
                borderColor: styles.secondaryColor, 
                borderWidth: 2,
                opacity: 0.6 
              }} 
            />
          </Box>
        )}

        {/* 3D 場景選擇區域 */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              color: styles.primaryColor,
              fontWeight: "bold",
              textAlign: "center",
              mb: 6,
            }}
          >
            {config.sceneSelectionTitle}
          </Typography>
          
          <Grid container spacing={4}>
            {sceneConfigs.map((scene) => {
              // Handle both actual scene data and fallback hardcoded data
              const sceneId = scene.id || scene.scene_name;
              const sceneName = scene.name || scene.scene_name;
              const sceneDescription = scene.description || "體驗3D場景";
              const sceneImage = scene.image || "/img/Main_entrance.png";
              const sceneFeatures = scene.features || ["高解析度建模", "真實材質渲染", "互動式導覽"];
              
              return (
                <Grid size={{ xs: 12, md: 4 }} key={sceneId}>
                  <Card
                    elevation={selectedScene?.id === sceneId || selectedScene?.scene_name === sceneId ? 8 : 4}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: selectedScene?.id === sceneId || selectedScene?.scene_name === sceneId ? "translateY(-8px)" : "none",
                      border: selectedScene?.id === sceneId || selectedScene?.scene_name === sceneId ? `3px solid ${styles.secondaryColor}` : "2px solid transparent",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 8,
                      },
                    }}
                    onClick={() => handleSceneSelect(scene)}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={sceneImage}
                      alt={sceneName}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ bgcolor: styles.secondaryColor, mr: 2 }}>
                          <ViewInAr sx={{ color: "white" }} />
                        </Avatar>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            color: styles.primaryColor,
                            fontWeight: "bold",
                          }}
                        >
                          {sceneName}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: styles.textColor,
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {sceneDescription}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        {sceneFeatures.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{
                              mr: 1,
                              mb: 1,
                              borderColor: styles.secondaryColor,
                              color: styles.secondaryColor,
                              "&:hover": {
                                backgroundColor: styles.cardHoverColor,
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              disabled={!selectedScene}
              onClick={handleContinue}
              startIcon={<PlayArrow />}
              sx={{
                backgroundColor: styles.secondaryColor,
                fontSize: "1.2rem",
                px: 6,
                py: 2,
                borderRadius: 3,
                "&:hover": { 
                  backgroundColor: styles.primaryColor,
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
                "&:disabled": { 
                  backgroundColor: "#ccc",
                  transform: "none",
                  boxShadow: 1,
                },
                transition: "all 0.3s ease",
              }}
            >
              {selectedScene
                ? `開始體驗 ${selectedScene.name || selectedScene.scene_name}`
                : "請選擇一個場景"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BaseIntroPage; 