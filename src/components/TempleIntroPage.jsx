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
} from "@mui/material";
import {
  LocationOn,
  Info,
  ArrowBack,
  PlayArrow,
} from "@mui/icons-material";

const TempleIntroPage = ({ onBackToHome, onSelectScene, scenes }) => {
  const [selectedScene, setSelectedScene] = useState(null);

  const templeInfo = {
    name: "保生宮",
    subtitle: "Bao Sheng Temple",
    description:
      "保生宮是一座具有悠久歷史的道教宮廟，供奉保生大帝，是台灣重要的民間信仰中心之一。宮廟建築融合了傳統道教建築風格與現代設計理念，是當地重要的文化遺產。",
    features: [
      "傳統道教建築風格",
      "精美的雕刻藝術",
      "豐富的歷史文化內涵",
      "寧靜祥和的參拜環境",
      "現代化的設施設備",
      "專業的導覽服務",
    ],
    history:
      "保生宮建於清朝年間，歷經多次重修，現今建築融合了傳統與現代的設計理念。宮廟最初由當地信眾集資興建，經過數代人的維護與擴建，現已成為當地重要的宗教文化中心。",
    location:
      "位於台灣中部地區，交通便利，環境優美。周邊有完善的停車設施和公共運輸系統。",
    visitingHours: "每日 06:00 - 18:00",
    contact: "+886-4-1234-5678",
    website: "www.baoshengtemple.org.tw",
  };

  const templeImages = [
    {
      src: "/img/Main_entrance.png",
      title: "主入口",
      description: "莊嚴肅穆的主入口，展現傳統建築之美",
    },
    {
      src: "/img/Interior.png",
      title: "內部殿堂",
      description: "精心設計的內部空間，營造神聖莊嚴的氛圍",
    },
    {
      src: "/img/Rooftop_Drone.png",
      title: "屋頂景觀",
      description: "從空中俯瞰保生宮的壯麗景觀",
    },
  ];

  const handleSceneSelect = (scene) => {
    setSelectedScene(scene);
  };

  const handleContinue = () => {
    if (selectedScene) {
      onSelectScene(selectedScene);
    }
  };



  return (
    <Box
      sx={{
        background: "#F8F6F2",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Navigation Bar */}
      <Box
        sx={{
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={onBackToHome}
                sx={{ color: "#6B5B47" }}
              >
                返回首頁
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Title */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: "#6B5B47",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {templeInfo.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#6B5B47", fontStyle: "italic", mb: 3 }}
          >
            {templeInfo.subtitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              maxWidth: 800,
              margin: "0 auto",
              color: "#2F2F2F",
            }}
          >
            {templeInfo.description}
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* 左側：宮廟介紹 */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* 特色亮點 */}
            <Box
              sx={{
                p: 4,
                mb: 4,
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "0 2px 8px rgba(139, 115, 85, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#6B5B47",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <Info sx={{ color: "#8B7355" }} /> 特色亮點
              </Typography>
              <Grid container spacing={1}>
                {templeInfo.features.map((feature, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Chip
                      label={feature}
                      variant="outlined"
                      sx={{
                        mb: 1,
                        borderColor: "#8B7355",
                        color: "#8B7355",
                        "&:hover": {
                          backgroundColor: "rgba(139, 115, 85, 0.1)",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 圖片展示 */}
            <Box
              sx={{
                p: 4,
                mb: 4,
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "0 2px 8px rgba(139, 115, 85, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#6B5B47",
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                宮廟景觀
              </Typography>
              <Grid container spacing={2}>
                {templeImages.map((image, index) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={index}>
                    <Card
                      sx={{
                        "&:hover": {
                          transform: "translateY(-5px)",
                          transition: "transform 0.3s ease",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={image.src}
                        alt={image.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontSize: "1rem", color: "#6B5B47" }}
                        >
                          {image.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.9rem", color: "#6B5B47" }}
                        >
                          {image.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 歷史沿革 */}
            <Box
              sx={{
                p: 4,
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "0 2px 8px rgba(139, 115, 85, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#6B5B47",
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                歷史沿革
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  textAlign: "justify",
                  fontSize: "1.1rem",
                  color: "#2F2F2F",
                }}
              >
                {templeInfo.history}
              </Typography>
            </Box>
          </Grid>

          {/* 右側：場景選擇 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 4,
                height: "fit-content",
                position: "sticky",
                top: 80,
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "0 2px 8px rgba(139, 115, 85, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#6B5B47",
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                選擇 3D 場景
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 3, color: "#6B5B47", fontSize: "1.1rem" }}
              >
                請選擇您想要查看的 3D 場景，我們將為您提供最佳的觀看體驗。
              </Typography>

              {/* 場景列表 */}
              <Box sx={{ mb: 4 }}>
                {scenes && scenes.length > 0 ? (
                  scenes.map((scene, index) => (
                    <Card
                      key={scene.scene_name}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        background:
                          selectedScene?.scene_name === scene.scene_name
                            ? "rgba(139, 115, 85, 0.1)"
                            : "rgba(255, 255, 255, 0.8)",
                        border:
                          selectedScene?.scene_name === scene.scene_name
                            ? 2
                            : 1,
                        borderColor:
                          selectedScene?.scene_name === scene.scene_name
                            ? "#8B7355"
                            : "rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          background: "rgba(139, 115, 85, 0.05)",
                          borderColor: "#8B7355",
                        },
                      }}
                      onClick={() => handleSceneSelect(scene)}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color:
                              selectedScene?.scene_name === scene.scene_name
                                ? "#6B5B47"
                                : "#2F2F2F",
                            fontWeight: "bold",
                          }}
                        >
                          {scene.scene_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B5B47" }}>
                          可用格式:{" "}
                          {scene.file_types.map((ft) => ft.type).join(", ")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B5B47" }}>
                          總文件數: {scene.count}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6B5B47" }}>
                      暫無可用場景
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* 繼續按鈕 */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!selectedScene}
                onClick={handleContinue}
                startIcon={<PlayArrow />}
                sx={{
                  backgroundColor: "#8B7355",
                  "&:hover": { backgroundColor: "#6B5B47" },
                  "&:disabled": { backgroundColor: "#ccc" },
                }}
              >
                {selectedScene
                  ? `查看 ${selectedScene.scene_name}`
                  : "請選擇場景"}
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* 實用資訊 */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#6B5B47", fontWeight: "bold" }}
              >
                實用資訊
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "#2F2F2F",
                  }}
                >
                  <LocationOn sx={{ fontSize: 16, mr: 1, color: "#8B7355" }} />
                  {templeInfo.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "#2F2F2F" }}>
                  開放時間: {templeInfo.visitingHours}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "#2F2F2F" }}>
                  聯絡電話: {templeInfo.contact}
                </Typography>
                <Typography variant="body2" sx={{ color: "#2F2F2F" }}>
                  網站: {templeInfo.website}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TempleIntroPage;
