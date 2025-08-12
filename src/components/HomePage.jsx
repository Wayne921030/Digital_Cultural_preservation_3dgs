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
import { CDN } from "@/config";

/* ---------------- models CDN helper (same source as models.json) ---------------- */
const strip = (p = "") => String(p).replace(/^\/+/, "");
const modelsAsset = (p) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;              // already absolute
  return `${CDN.MODELS_BASE}/${strip(p)}`;            // prefix with MODELS_BASE
};

/* ---------------- Shared UI shells ---------------- */
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

const MediaPlaceholder = ({ label = "video / image", children }) => (
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
    {children ? (
      children
    ) : (
      <>
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
      </>
    )}
  </Box>
);

/* ---------------- Carousel ---------------- */
const Carousel = ({ items = [], onSelect }) => {
  const viewportRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = () => {
    const el = viewportRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth);
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
        <Box sx={{ display: "flex", gap: 2, scrollBehavior: "smooth", py: 0.5 }}>
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
              {it.thumb ? (
                <Box
                  component="img"
                  src={it.thumb}
                  alt={it.label}
                  sx={{ width: "100%", height: 150, objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ height: 150, bgcolor: "#e5e5e5" }} />
              )}
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

/* ---- map scene.category → stable location key & label ---- */
const normalizeLocationKey = (category) => {
  const s = (category || "").toString().trim().toLowerCase();
  if (!s) return null;
  if (s.includes("baosheng") || s.includes("保生")) return "baosheng";
  if (s.includes("chenghuang") || s.includes("城隍")) return "chenghuang";
  return null;
};
const labelForLocation = (key) =>
  key === "baosheng" ? "保生宮" : key === "chenghuang" ? "城隍廟" : key;

/* ---------------- Page ---------------- */
const HomePage = ({ currentPage, onTabChange }) => {
  const { scenes = [] } = useAvailableModels();

  // Build location cards and resolve thumbnails via *models* CDN
  const carouselItems = useMemo(() => {
    const groups = new Map();
    (scenes || []).forEach((s) => {
      const key = normalizeLocationKey(s?.category);
      if (!key) return;

      const rawThumb =
        s?.thumbnail ||
        s?.thumb ||
        s?.image ||
        s?.previewImage ||
        s?.preview_image ||
        s?.preview ||
        null;

      const thumb = modelsAsset(rawThumb);

      if (!groups.has(key)) {
        groups.set(key, { key, label: labelForLocation(key), thumb });
      } else if (!groups.get(key).thumb && thumb) {
        groups.get(key).thumb = thumb;
      }
    });
    return Array.from(groups.values());
  }, [scenes]);

  const handleSelectLocation = (it) => {
    if (!it?.key) return;
    onTabChange?.(null, it.key); // TabBar-style signature
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)" }}>
      <TabBar currentPage={currentPage} onTabChange={onTabChange} />

      {/* Hero with right-side background image (from models CDN) */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #DCE4C9 0%, #F8F6F2 100%)",
          position: "relative",
          overflow: "hidden",
          py: 4,
          minHeight: { md: 360 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: { xs: "100%", md: "62%" },
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `url(${modelsAsset("img/mainpage-bg.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
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
          <Typography variant="h5" sx={{ color: "#6B5B47", fontWeight: 700, mb: 2 }}>
            專案背景與動機
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                （原本長文，略）
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MediaPlaceholder>
                <Box
                  component="video"
                  src={modelsAsset("media/Main_entrance_full-video.mp4")}
                  controls
                  playsInline
                  crossOrigin="anonymous"           
                  autoPlay
                  muted
                  loop
                  sx={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"inherit", display:"block" }}
                />
              </MediaPlaceholder>
            </Grid>
          </Grid>
        </SectionCard>

        {/* Tech Detail */}
        <SectionCard>
          <Typography variant="h5" sx={{ color: "#6B5B47", fontWeight: 700, mb: 2 }}>
            技術細節
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                （原本長文，略）
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MediaPlaceholder>
                <Box
                  component="video"
                  src={modelsAsset("media/Foo_dog_full-video.mp4")}
                  controls
                  playsInline
                  crossOrigin="anonymous"
                  autoPlay 
                  muted 
                  loop
                  sx={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"inherit", display:"block" }}
                />
              </MediaPlaceholder>
            </Grid>
          </Grid>
        </SectionCard>

        {/* Slide Selection */}
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
