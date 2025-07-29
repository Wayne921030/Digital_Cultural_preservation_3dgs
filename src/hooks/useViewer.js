import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

/**
 * 3D Viewer Core Logic Hook
 */
export const useViewer = (
  settings,
  selectedModel,
  modelSelected,
  modelConfigs
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking");
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(settings);

  // Load model function
  const loadModel = useCallback(
    async (viewer, settings, modelType) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isMountedRef.current) return;
        setServerStatus("connected");

        const alphaThreshold = Math.round((settings.alphaThreshold / 10) * 255);
        const modelConfig = modelConfigs[modelType];

        if (!modelConfig) {
          throw new Error(`Unknown model type: ${modelType}`);
        }

        console.log(`Loading ${modelConfig.name} model...`);

        // Try to load primary file first
        let modelUrl = `/models/${modelConfig.primaryFile}`;
        let loaded = false;

        try {
          console.log(`Attempting to load: ${modelUrl}`);
          await viewer.addSplatScene(modelUrl, {
            splatAlphaRemovalThreshold: alphaThreshold,
            showLoadingUI: false,
            position: [0, 1, 0],
            rotation: [0, 0, 0, 1],
          });
          loaded = true;
          console.log(`Successfully loaded: ${modelConfig.primaryFile}`);
        } catch (primaryError) {
          console.warn(
            `Failed to load primary file: ${modelConfig.primaryFile}`,
            primaryError
          );

          // Try fallback file if available
          if (modelConfig.fallbackFile) {
            modelUrl = `/models/${modelConfig.fallbackFile}`;
            console.log(`Attempting fallback: ${modelUrl}`);

            try {
              await viewer.addSplatScene(modelUrl, {
                splatAlphaRemovalThreshold: alphaThreshold,
                showLoadingUI: false,
                position: [0, 1, 0],
                rotation: [0, 0, 0, 1],
              });
              loaded = true;
              console.log(
                `Successfully loaded fallback: ${modelConfig.fallbackFile}`
              );
            } catch (fallbackError) {
              console.error(
                `Failed to load both primary and fallback files:`,
                fallbackError
              );
              throw new Error(
                `Failed to load model. Tried ${modelConfig.primaryFile} and ${modelConfig.fallbackFile}. Please check if the server is running and the model files exist.`
              );
            }
          } else {
            // No fallback available
            throw new Error(
              `Failed to load model: ${modelConfig.primaryFile}. Please check if the server is running and the model file exists.`
            );
          }
        }

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
    },
    [modelConfigs]
  );

  // Initialize viewer
  const initializeViewer = useCallback(() => {
    if (!viewerRef.current || !modelSelected) return;

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

    loadModel(viewer, settings, selectedModel);
  }, [settings, selectedModel, modelSelected, loadModel]);

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

    if (modelSelected) {
      initializeViewer();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [modelSelected]);

  // Settings change effect
  useEffect(() => {
    if (viewerInstanceRef.current && !isLoading && modelSelected) {
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
        loadModel(viewer, settings, selectedModel);
      }
    }
  }, [settings, isLoading, modelSelected, selectedModel, loadModel]);

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
