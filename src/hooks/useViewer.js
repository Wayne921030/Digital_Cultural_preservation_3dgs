import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { isSupportedFile } from "../utils/fileUtils";
import * as THREE from "three";

/**
 * 3D Viewer Core Logic Hook
 */
const controlConfigs = {
  base: {
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    enablePan: true,
    enableZoom: true,
  },
  topDown360: {
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enablePan: true,
    enableZoom: true,
  },
  frontFocus: {
    minPolarAngle: THREE.MathUtils.degToRad(80),
    maxPolarAngle: THREE.MathUtils.degToRad(120),
    minAzimuthAngle: THREE.MathUtils.degToRad(-20),
    maxAzimuthAngle: THREE.MathUtils.degToRad(20),
    enablePan: true,
    enableZoom: true,
  },
};

function applyControlConfig(controls, configName) {
  const cfg = controlConfigs[configName] || controlConfigs.base;
  controls.minPolarAngle = cfg.minPolarAngle;
  controls.maxPolarAngle = cfg.maxPolarAngle;
  controls.minAzimuthAngle = cfg.minAzimuthAngle ?? controls.minAzimuthAngle;
  controls.maxAzimuthAngle = cfg.maxAzimuthAngle ?? controls.maxAzimuthAngle;
  controls.enablePan = cfg.enablePan ?? controls.enablePan;
  controls.enableZoom = cfg.enableZoom ?? controls.enableZoom;
}

export const useViewer = (
  filename,
  arrayBuffer,
  sceneSelected,
  orbit = "frontFocus"
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSceneRef = useRef(null);
  // Load model function
  const loadModel = useCallback(
    async (viewer, filename) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isMountedRef.current) return;

        // Check if the file is supported
        if (!isSupportedFile(filename)) {
          throw new Error("Unsupported file type");
        }

        try {
          console.log(`Attempting to load: ${filename}`);

          if (arrayBuffer) {
            // Local upload - create a temporary file URL
            const tempUrl = `/temp/${filename}`;

            // Mock the fetch for this URL to return our ArrayBuffer
            const originalFetch = window.fetch;
            window.fetch = async (url, options) => {
              if (url === tempUrl) {
                return new Response(arrayBuffer, {
                  status: 200,
                  headers: { "Content-Type": "application/octet-stream" },
                });
              }
              return originalFetch(url, options);
            };

            try {
              await viewer.addSplatScene(tempUrl, {
                showLoadingUI: false,
                position: [0, 0, 0],
              });
            } finally {
              // Restore original fetch
              window.fetch = originalFetch;
            }
          } else {
            // Remote file - use URL
            await viewer.addSplatScene(`/models/${filename}`, {
              showLoadingUI: false,
              position: [0, 0, 0],
            });
          }
          console.log(`Successfully loaded: ${filename}`);
        } catch (loadError) {
          console.error(`Failed to load model: ${filename}`, loadError);
          throw new Error(
            `Failed to load model: ${filename}. Please check if the server is running and the model file exists.`
          );
        }

        if (!isMountedRef.current) return;
        viewer.start();
      } catch (err) {
        console.error("Error loading model:", err);
        if (isMountedRef.current) {
          setError(err.message);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [filename, arrayBuffer]
  );

  // Initialize viewer
  const initializeViewer = useCallback(async () => {
    if (!viewerRef.current || !sceneSelected) return;

    viewerRef.current.innerHTML = "";
    try {
      setIsLoading(true);
      setError(null);

      // Create new viewer
      const viewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, -1, 0],
        initialCameraPosition: [0, 0, 6],
        initialCameraLookAt: [0, 0, 0],
        rootElement: viewerRef.current,
        showLoadingUI: false,
        antialiased: true,
      });

      viewerInstanceRef.current = viewer;

      const controls = viewer.controls;
      if (controls) {
        applyControlConfig(controls, orbit);
      }

      // Load model if scene is selected
      if (sceneSelected && filename) {
        await loadModel(viewer, filename);
      }
    } catch (err) {
      console.error("Error initializing viewer:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filename, sceneSelected, orbit]);

  // Initialize effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Scene selection effect
  useEffect(() => {
    if (filename && filename !== currentSceneRef.current) {
      currentSceneRef.current = filename;
      initializeViewer();
    }
  }, [filename]);

  // Reset camera
  const resetCamera = useCallback(() => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.camera.position.set(0, 0, 8);
      viewerInstanceRef.current.controls.target.set(0, 0, 0);
    }
  }, []);

  return {
    isLoading,
    error,
    viewerRef,
    viewerInstanceRef,
    resetCamera,
  };
};
