import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { isSupportedFile } from "../utils/fileUtils";

/**
 * 3D Viewer Core Logic Hook
 */
export const useViewer = (settings, selectedResolution, sceneSelected) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(settings);

  // Load model function
  const loadModel = useCallback(
    async (viewer, settings, resolution) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isMountedRef.current) return;

        const alphaThreshold = Math.round((settings.alphaThreshold / 10) * 255);

        if (!isSupportedFile(resolution.filename)) {
          throw new Error("Unsupported file type");
        }

        const modelUrl = `https://dr4wh7nh38tn3.cloudfront.net/models/${resolution.filename}`;

        await viewer.addSplatScene(modelUrl, {
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
          setError(`Failed to load model: ${err.message}`);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [settings, selectedResolution]
  );

  // Initialize viewer
  const initializeViewer = useCallback(async () => {
    if (!viewerRef.current || !sceneSelected) return;

    viewerRef.current.innerHTML = "";
    try {
      setIsLoading(true);
      setError(null);

      // Create viewer with optimal settings
      const viewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, -1, -0.6],
        initialCameraPosition: [-1, -4, 6],
        initialCameraLookAt: [0, 4, 0],
        rootElement: viewerRef.current,
        showLoadingUI: true,
        antialiased: settings.antialiased || false,
        useWorker: true  // COI service worker enables this
      });

      viewerInstanceRef.current = viewer;
      currentSettingsRef.current = settings;

      if (sceneSelected && selectedResolution) {
        await loadModel(viewer, settings, selectedResolution);
      }
    } catch (err) {
      console.error("Error initializing viewer:", err);
      setError(`Viewer initialization failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [settings, selectedResolution, sceneSelected]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (sceneSelected) {
      initializeViewer();
    }
  }, [sceneSelected, initializeViewer]);

  useEffect(() => {
    if (viewerInstanceRef.current) {
      const settingsChanged =
        currentSettingsRef.current.alphaThreshold !== settings.alphaThreshold ||
        currentSettingsRef.current.antialiased !== settings.antialiased;

      if (settingsChanged) {
        currentSettingsRef.current = settings;
        initializeViewer();
      }
    }
  }, [settings, initializeViewer]);

  const resetCamera = useCallback(() => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.camera.position.set(-1, -4, 6);
      viewerInstanceRef.current.controls.target.set(0, 4, 0);
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