import React, { Suspense } from "react";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { DEVICE_CONFIGS } from "../constants";
import Viewer from "./Viewer.jsx";

const ViewerPage = ({
  onNavigateToScenes,
  onResetCamera,
  onToggleAutoRotate,
  isAutoRotating,
  selectedScene,
  selectedResolution,
  selectedDevice,
  viewerRef,
  resetCameraRef,
}) => {
  const orbit = selectedScene?.orbit || "frontFocus";
  const isTopDown360 = orbit === "topDown360";
  const isFrontFocus = orbit === "frontFocus";
  const deviceConfig = DEVICE_CONFIGS[selectedDevice];

  return (
    <Box
      sx={{
        background: "#F8F6F2",
        minHeight: "calc(100vh - 64px)",
        width: "100vw",
        maxWidth: "100vw",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid rgba(139, 115, 85, 0.1)",
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={onNavigateToScenes}
                sx={{ color: "#6B5B47" }}
              >
                上一頁
              </Button>
            </Box>
          </Box>

          {/* Control Area */}
          {selectedScene && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B5B47", fontSize: "0.8rem" }}
                >
                  {selectedScene?.scene_name?.replace(/_/g, " ") || "Unknown"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B5B47", opacity: 0.8 }}>
                  {deviceConfig?.label || "Unknown"} • {orbit}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                onClick={onResetCamera}
                sx={{ backgroundColor: "#8B7355", "&:hover": { backgroundColor: "#6B5B47" } }}
              >
                Reset Camera
              </Button>

              {isTopDown360 && (
                <Button
                  variant={isAutoRotating ? "contained" : "outlined"}
                  size="small"
                  onClick={onToggleAutoRotate}
                  sx={{
                    backgroundColor: isAutoRotating ? "#8B7355" : "transparent",
                    borderColor: "#8B7355",
                    color: isAutoRotating ? "white" : "#8B7355",
                    "&:hover": {
                      backgroundColor: isAutoRotating
                        ? "#6B5B47"
                        : "rgba(139, 115, 85, 0.1)",
                    },
                  }}
                >
                  {isAutoRotating ? "Stop 360°" : "Start 360°"}
                </Button>
              )}

              {isFrontFocus && (
                <Button
                  variant={isAutoRotating ? "contained" : "outlined"}
                  size="small"
                  onClick={onToggleAutoRotate}
                  sx={{
                    backgroundColor: isAutoRotating ? "#8B7355" : "transparent",
                    borderColor: "#8B7355",
                    color: isAutoRotating ? "white" : "#8B7355",
                    "&:hover": {
                      backgroundColor: isAutoRotating
                        ? "#6B5B47"
                        : "rgba(139, 115, 85, 0.1)",
                    },
                  }}
                >
                  {isAutoRotating ? "Stop Swing" : "Start Swing"}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Viewer area */}
      <Box sx={{ width: "100vw", height: "calc(100vh - 200px)" }}>
        <Suspense fallback={<div>Loading Viewer...</div>}>
          <Viewer
            onResetCamera={(resetCameraFn) => {
              if (resetCameraRef && typeof resetCameraRef === 'object') {
                resetCameraRef.current = resetCameraFn;
              }
            }}
            isAutoRotating={isAutoRotating}
            selectedResolution={selectedResolution}
            selectedScene={selectedScene}
            orbit={orbit}
            ref={viewerRef}
          />
        </Suspense>
      </Box>
    </Box>
  );
};

export default ViewerPage;
