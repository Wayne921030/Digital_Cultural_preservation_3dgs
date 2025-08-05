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

        // Check if the file is supported
        if (!isSupportedFile(resolution.filename)) {
          throw new Error("Unsupported file type");
        }

        // Construct the model URL - use CloudFront directly
        const modelUrl = `https://dr4wh7nh38tn3.cloudfront.net/models/${resolution.filename}`;
        
        console.log(`Attempting to load: ${modelUrl}`);

        await viewer.addSplatScene(modelUrl, {
          splatAlphaRemovalThreshold: alphaThreshold,
          showLoadingUI: false,
          position: [0, 1, 0],
          rotation: [0, 0, 0, 1],
        });

        console.log(`Successfully loaded: ${resolution.filename}`);

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

      console.log('Initializing viewer with useWorker: false for GitHub Pages compatibility');

      // Create new viewer - FORCE useWorker: false for GitHub Pages
      const viewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, -1, -0.6],
        initialCameraPosition: [-1, -4, 6],
        initialCameraLookAt: [0, 4, 0],
        rootElement: viewerRef.current,
        showLoadingUI: true,
        antialiased: settings.antialiased || false,
        useWorker: false  // FORCE FALSE - no SharedArrayBuffer needed
      });

      viewerInstanceRef.current = viewer;
      currentSettingsRef.current = settings;

      // Load model if scene is selected
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

  // Initialize effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Scene selection effect
  useEffect(() => {
    if (sceneSelected) {
      initializeViewer();
    }
  }, [sceneSelected, initializeViewer]);

  // Update viewer when settings change
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

  // Reset camera
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