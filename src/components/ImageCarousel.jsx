import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const ImageCarousel = ({ images, height = 450, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        if (currentIndex === images.length - 1) {
          // 到達最後一張時，直接跳回第一張（無動畫）
          setCurrentIndex(0);
          setTimeout(() => setIsTransitioning(false), 100);
        } else {
          // 正常滑動到下一張
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setTimeout(() => setIsTransitioning(false), 600);
        }
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, isTransitioning, currentIndex]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (currentIndex === 0) {
      // 從第一張跳到最後一張（無動畫）
      setCurrentIndex(images.length - 1);
      setTimeout(() => setIsTransitioning(false), 100);
    } else {
      // 正常滑動到上一張
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (currentIndex === images.length - 1) {
      // 從最後一張跳到第一張（無動畫）
      setCurrentIndex(0);
      setTimeout(() => setIsTransitioning(false), 100);
    } else {
      // 正常滑動到下一張
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          component="img"
          src={images[0]}
          alt="Hero"
          sx={{
            width: "100%",
            height: height,
            objectFit: "cover",
          }}
        />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: height,
          overflow: "hidden",
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Image ${index + 1}`}
            sx={{
              width: "100%",
              height: height,
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0,
            }}
          />
        ))}
      </Box>
      
      {/* Navigation buttons */}
      <IconButton
        onClick={handlePrevious}
        disabled={isTransitioning}
        sx={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          "&:disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
          zIndex: 2,
        }}
      >
        <ChevronLeft />
      </IconButton>
      
      <IconButton
        onClick={handleNext}
        disabled={isTransitioning}
        sx={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          "&:disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
          zIndex: 2,
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* Dots indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 2,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: index === currentIndex 
                ? "rgba(255, 255, 255, 0.9)" 
                : "rgba(255, 255, 255, 0.4)",
              cursor: isTransitioning ? "default" : "pointer",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: isTransitioning 
                  ? "rgba(255, 255, 255, 0.4)" 
                  : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ImageCarousel; 