import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Container,
  Button,
} from "@mui/material";
import {
  PlayArrow,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import TabBar from "./TabBar";

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

      <Box
        ref={viewportRef}
        sx={{
          overflow: "hidden",
        }}
      >
        <Box
          ref={trackRef}
          sx={{
            display: "flex",
            gap: 2,
            scrollBehavior: "smooth",
            py: 0.5,
          }}
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
              <Box sx={{ height: 150, bgcolor: "#e5e5e5" }} />
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

const HomePage = ({ currentPage, onTabChange }) => {
  const carouselItems = [
    { label: "Location A" },
    { label: "Location B" },
    { label: "Location C" },
    { label: "Location D" },
    { label: "Location E" },
    { label: "Location F" },
  ];

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
                <Typography
                  variant="h5"
                  sx={{ color: "#8B7355", mb: 2, fontStyle: "italic" }}
                >
                  Culture preservation-related
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
                （此處為說明文字區塊）我們致力於文化遺產的數位保存，透過影像擷取、
                重建與視覺化，記錄珍貴的文化資產，並讓更多人能以互動方式接觸與理解。
                這段文字可以替換成你的專案背景、動機與目標說明。
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MediaPlaceholder label="Background video / image" />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Tech Detail + Model / Frame */}
        <SectionCard>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h5"
                sx={{ color: "#6B5B47", fontWeight: 700, mb: 2 }}
              >
                技術細節
              </Typography>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                （此處為技術說明）可放置拍攝流程、相機/鏡頭配置、COLMAP /
                SfM / MVS、3D Gaussian Splatting 與瀏覽器端渲染等技術細節與流程概述。
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h6"
                sx={{ color: "#6B5B47", fontWeight: 700, mb: 1 }}
              >
                Model / Frame
              </Typography>
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
            <Typography
              variant="h5"
              sx={{ color: "#6B5B47", fontWeight: 700 }}
            >
              場景選擇
            </Typography>
          </Box>

          <Carousel
            items={carouselItems}
            onSelect={(it) => {
              // Hook this up however you like (e.g., navigate to Scenes tab)
              // onTabChange?.("scenes")
              console.log("Selected:", it.label);
            }}
          />
        </SectionCard>
      </Container>
    </Box>
  );
};

export default HomePage;