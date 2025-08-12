import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Container,
  Button,
} from "@mui/material";
import { PlayArrow, ChevronLeft, ChevronRight } from "@mui/icons-material";
import TabBar from "./TabBar";
import { useAvailableModels } from "@hooks/useAvailableModels";

const SectionCard = ({ children, sx }) => (
  <Box
    sx={{
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      boxShadow: "0 8px 24px rgba(0,0,0,.06)",
      backgroundColor: "#fff",
      p: { xs: 2.25, sm: 2.5, md: 3 },
      mb: 3,
      ...sx,
    }}
  >
    {children}
  </Box>
);

const MediaPlaceholder = ({ label = "video / image" }) => (
  <Box
    sx={{
      height: { xs: 220, md: 260 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
      bgcolor: "#e5e5e5",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
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
        <PlayArrow sx={{ fontSize: 36 }} />
      </IconButton>
      <Typography variant="subtitle1" sx={{ mt: 1.5, color: "#6B5B47" }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

const Carousel = ({ items = [], onSelect }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = () => {
    const el = viewportRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 0;
    const end = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
    setAtStart(start);
    setAtEnd(end);
  };

  useEffect(() => {
    updateArrows();
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, []);

  const scrollByAmount = (dir) => {
    const el = viewportRef.current;
    if (!el) return;
    const delta = Math.floor(el.clientWidth * 0.9) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        aria-label="Previous"
        onClick={() => scrollByAmount("prev")}
        disabled={atStart}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: { xs: 6, md: -6 },
          zIndex: 1,
          bgcolor: "#0b1220",
          color: "#fff",
          opacity: atStart ? 0.35 : 0.9,
          "&:hover": { opacity: 1, bgcolor: "#0b1220" },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Box ref={viewportRef} sx={{ overflow: "hidden" }}>
        <Box
          ref={trackRef}
          sx={{ display: "flex", gap: 2, scrollBehavior: "smooth", py: 0.5 }}
        >
          {items.map((it, idx) => (
            <Box
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(it)}
              onKeyDown={(e) => e.key === "Enter" && onSelect?.(it)}
              sx={{
                flex: "0 0 260px",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,.06)",
                overflow: "hidden",
                bgcolor: "#fff",
                cursor: "pointer",
                outline: "none",
                "&:focus-visible": { boxShadow: "0 0 0 3px #cbd5e1" },
              }}
            >
              <Box
                component={it.thumb ? "img" : "div"}
                src={it.thumb || undefined}
                alt={it.label}
                sx={{
                width: "100%",
                height: 150,
                bgcolor: it.thumb ? "transparent" : "#e5e5e5",
                objectFit: "cover",
                }}
              />
              <Box sx={{ p: 1.25, textAlign: "center", fontWeight: 600 }}>
                {it.label}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <IconButton
        aria-label="Next"
        onClick={() => scrollByAmount("next")}
        disabled={atEnd}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: { xs: 6, md: -6 },
          zIndex: 1,
          bgcolor: "#0b1220",
          color: "#fff",
          opacity: atEnd ? 0.35 : 0.9,
          "&:hover": { opacity: 1, bgcolor: "#0b1220" },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

/* ---- helpers: map scene.category → stable location key & label ---- */
const normalizeLocationKey = (category) => {
  const s = (category || "").toString().trim().toLowerCase();
  if (!s) return null;
  if (s.includes("baosheng") || s.includes("保生")) return "baosheng";
  if (s.includes("chenghuang") || s.includes("城隍")) return "chenghuang";
  return null; // ignore unknown/other categories for the home slider
};
const labelForLocation = (key) =>
  key === "baosheng" ? "保生宮" : key === "chenghuang" ? "城隍廟" : key;

const HomePage = ({ currentPage, onTabChange }) => {
  // 1) fetch scenes from models.json
  const { scenes = [] } = useAvailableModels();

  // 2) build location cards (unique by category)
  const carouselItems = useMemo(() => {
    const groups = new Map();
    (scenes || []).forEach((s) => {
      const key = normalizeLocationKey(s?.category);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, { key, label: labelForLocation(key) });
    });
    return Array.from(groups.values());
  }, [scenes]);

  // 3) clicking should behave like TabBar → (event, value)
  const handleSelectLocation = (it) => {
    if (!it?.key) return;
    onTabChange?.(null, it.key); // IMPORTANT: match TabBar's onChange signature
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)" }}>
      {/* TabBar */}
      <TabBar currentPage={currentPage} onTabChange={onTabChange} />

      {/* Hero / Page Title */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #DCE4C9 0%, #F8F6F2 100%)",
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
                  sx={{ color: "#6B5B47", fontWeight: "bold", mb: 2 }}
                >
                  3D Culture Preservation
                </Typography>
                <Typography variant="h4" sx={{ color: "#6B5B47", mb: 4 }}>
                  數位文化遺產保護
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MediaPlaceholder label="Video for showcase" />
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
        {/* Background & Purpose / Motivation */}
        <SectionCard sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: "#6B5B47", fontWeight: 700, mb: 2 }}
          >
            專案背景與動機
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                以三維高斯點雲渲染(3D Gaussian Splatting)進行數位文化保存，是一種結合先進三維重建與神經渲染技術的創新方法。我們以寺廟建築為核心研究對象，透過高精度影像擷取與 3DGS 技術，將實地拍攝的照片轉換為細節豐富的三維場景，完整保留建築的紋理、結構與空間感。
                專案的首要目標，是建立可於網頁即時瀏覽的沉浸式三維模型，讓世界各地的人們能在虛擬空間中探索這些文化遺產。這不僅能突破地理限制，擴大文化資產的觸及範圍，也能為未來的研究、教育與修復工作提供精確的數位檔案。
                我們的工作證明了，將前沿的神經渲染技術應用於文化遺產保存，不僅能推動電腦圖學研究成果落地，更能在科技與人文之間架起橋樑，為歷史留下可被世代傳承的數位記憶。
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MediaPlaceholder label="Background video / image" />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Tech Detail + Model / Frame */}
        <SectionCard>
          <Typography
            variant="h5"
            sx={{ color: "#6B5B47", fontWeight: 700, mb: 2 }}
          >
            技術細節
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                本專案結合攝影測量 (Photogrammetry) 與神經渲染 (Neural Rendering)，打造高精度的文化遺產三維重建流程。
                整個過程首先從寺廟建築的系統化拍攝展開：透過不同視角與高度拍攝大量具重疊區域的照片，確保能完整覆蓋目標場景。 
                接著利用 COLMAP 進行 Structure from Motion (SfM) 以獲取每張影像的相機參數並生成稀疏三維點雲，為後續模型構建奠定精確的幾何基礎。 
                在核心的3D模型生成階段，我們採用了3D Gaussian Splatting, 3DGS技術。
                這項方法透過優化數百萬個三維高斯基元，精準地表現場景的幾何形狀與外觀。每個高斯基元使用位置、不透明度等參數呈現不同視角下的色彩變化。
                最後透過可微光柵化(Differentiable Rasterization)的反覆訓練逐步提升模型的真實感。
                不論是精緻的雕刻、建築紋理、歲月風化的表面，或是錯綜複雜的空間結構，甚至是自然光影效果都能被高度還原。
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MediaPlaceholder label="GIF / short demo" />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Slide Selection (carousel based on location) */}
        <SectionCard sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography variant="h5" sx={{ color: "#6B5B47", fontWeight: 700 }}>
              場景選擇
            </Typography>
          </Box>

          <Carousel items={carouselItems} onSelect={handleSelectLocation} />
        </SectionCard>
      </Container>
    </Box>
  );
};

export default HomePage;
