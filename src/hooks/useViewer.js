import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * 3D Viewer Core Logic Hook
 */
export const useViewer = (settings) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking");
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(settings);

  // Load model function
  const loadModel = useCallback(async (viewer, settings) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isMountedRef.current) return;
      setServerStatus("connected");

      const alphaThreshold = Math.round((settings.alphaThreshold / 10) * 255);

      // Use the remote URL directly
      console.log("Loading model from remote server...");
      const remoteModelUrl = `${API_BASE_URL}/api/download/Rooftop_Drone_lod_25.splat`;

      await viewer.addSplatScene(remoteModelUrl, {
        splatAlphaRemovalThreshold: alphaThreshold,
        showLoadingUI: false,
        position: [0, 1, 0],
        rotation: [0, 0, 0, 1],
      });

      if (!isMountedRef.current) return;
      viewer.start();
    } catch (err) {
      console.error("Error loading model:", err);
      if (isMountedRef.current) {
        setError(
          err.message ||
            "Error loading the 3D model from remote server. Please check if the server is running and the model file exists."
        );
        setServerStatus("error");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Initialize viewer
  const initializeViewer = useCallback(() => {
    if (!viewerRef.current) return;

    viewerRef.current.innerHTML = "";

    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0, -1, -0.6],
      initialCameraPosition: [-1, -4, 6],
      initialCameraLookAt: [0, 4, 0],
      rootElement: viewerRef.current,
      showLoadingUI: true,
      antialiased: settings.antialiased || false,
    });

    viewerInstanceRef.current = viewer;
    currentSettingsRef.current = settings;

    loadModel(viewer, settings);
  }, [settings, loadModel]);

  // Reset camera
  const resetCamera = useCallback(() => {
    if (viewerInstanceRef.current && isMountedRef.current) {
      try {
        if (
          viewerInstanceRef.current.camera &&
          viewerInstanceRef.current.controls
        ) {
          viewerInstanceRef.current.camera.position.set(-1, -4, 6);
          viewerInstanceRef.current.controls.target.set(0, 4, 0);
          viewerInstanceRef.current.controls.update();
        }
      } catch (err) {
        console.warn("Error resetting camera:", err);
      }
    }
  }, []);

  // Initialize effect
  useEffect(() => {
    isMountedRef.current = true;
    initializeViewer();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Settings change effect
  useEffect(() => {
    if (viewerInstanceRef.current && !isLoading) {
      const settingsChanged =
        currentSettingsRef.current.alphaThreshold !== settings.alphaThreshold ||
        currentSettingsRef.current.antialiased !== settings.antialiased;

      if (settingsChanged) {
        console.log("Settings updated, reloading model:", settings);

        try {
          viewerInstanceRef.current.dispose();
        } catch (err) {
          console.warn("Error disposing viewer:", err);
        }

        if (viewerRef.current) {
          viewerRef.current.innerHTML = "";
        }

        const viewer = new GaussianSplats3D.Viewer({
          cameraUp: [0, -1, -0.6],
          initialCameraPosition: [-1, -4, 6],
          initialCameraLookAt: [0, 4, 0],
          rootElement: viewerRef.current,
          showLoadingUI: true,
          antialiased: settings.antialiased || false,
        });

        viewerInstanceRef.current = viewer;
        currentSettingsRef.current = settings;
        loadModel(viewer, settings);
      }
    }
  }, [settings, isLoading, loadModel]);

  return {
    // State
    isLoading,
    error,
    serverStatus,
    viewerRef,
    viewerInstanceRef,

    // Methods
    resetCamera,
  };
};
