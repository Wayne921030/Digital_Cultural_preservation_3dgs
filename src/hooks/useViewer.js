import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { isSupportedFile } from "../utils/fileUtils";
import { modelURL } from "../config";

/**
 * Orbit / control presets (from 3dgs-frontend, merged)
 */
const controlConfigs = {
  base: { minPolarAngle: 0, maxPolarAngle: Math.PI, enablePan: true, enableZoom: true },
  topDown360: {
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enablePan: true,
    enableZoom: true,
  },
  frontFocus: {
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: (3 * Math.PI) / 4,
    minAzimuthAngle: -Math.PI / 3,
    maxAzimuthAngle: Math.PI / 3,
    enablePan: true,
    enableZoom: true,
  },
};

function applyControlConfig(controls, presetName) {
  const cfg = controlConfigs[presetName] || controlConfigs.base;
  if (!controls || !cfg) return;
  if (typeof cfg.minPolarAngle === "number") controls.minPolarAngle = cfg.minPolarAngle;
  if (typeof cfg.maxPolarAngle === "number") controls.maxPolarAngle = cfg.maxPolarAngle;
  if (typeof cfg.minAzimuthAngle === "number") controls.minAzimuthAngle = cfg.minAzimuthAngle;
  if (typeof cfg.maxAzimuthAngle === "number") controls.maxAzimuthAngle = cfg.maxAzimuthAngle;
  if (typeof cfg.enablePan === "boolean") controls.enablePan = cfg.enablePan;
  if (typeof cfg.enableZoom === "boolean") controls.enableZoom = cfg.enableZoom;
}

// Safety: ensure camera points at loaded content
function frameScene(viewer) {
  if (!viewer) return;
  if (typeof viewer.frameAll === "function") {
    viewer.frameAll();
  } else if (typeof viewer.fitCameraToScene === "function") {
    viewer.fitCameraToScene();
  } else {
    viewer.controls?.update?.();
  }
}

/**
 * 3D Viewer Core Logic Hook (production-safe)
 */
export const useViewer = (settings, selectedResolution, sceneSelected) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(settings);

  // Load model into an existing viewer
  const loadModel = useCallback(
    async (viewer, settings, resolution) => {
      try {
        setIsLoading(true);
        setError(null);
        if (!isMountedRef.current) return;

        if (!resolution?.filename || !isSupportedFile(resolution.filename)) {
          throw new Error("Unsupported or missing model filename");
        }

        const url = modelURL(resolution.filename);

        // Use library defaults for alpha threshold (safer across scenes)
        await viewer.addSplatScene(url, {
          showLoadingUI: true,
          position: [0, 0, 0],
        });

        frameScene(viewer);
        console.info("Viewer: model added and framed", resolution.filename);
      } catch (err) {
        console.error("Error loading model:", err);
        setError(err.message || "Failed to load model");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initialize viewer
  const initializeViewer = useCallback(async () => {
    if (!viewerRef.current || !sceneSelected) return;

    // Resolve camera + orbit from scene (fallback to defaults)
    const orbitPreset = sceneSelected?.orbit || "frontFocus";
    const cam = sceneSelected?.camera || {};
    const cameraUp = Array.isArray(cam.up) ? cam.up : [0, -1, -0.6];
    const initialCameraPosition = Array.isArray(cam.position) ? cam.position : [-1, -4, 6];
    const initialCameraLookAt = Array.isArray(cam.target) ? cam.target : [0, 4, 0];

    viewerRef.current.innerHTML = "";
    try {
      setIsLoading(true);
      setError(null);

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp,
        initialCameraPosition,
        initialCameraLookAt,
        rootElement: viewerRef.current,
        showLoadingUI: true,
        antialiased: !!settings.antialiased,
        useWorker: true, // enabled by COI service worker in index.html
      });

      applyControlConfig(viewer.controls, orbitPreset);

      viewerInstanceRef.current = viewer;
      currentSettingsRef.current = settings;

      if (selectedResolution) {
        await loadModel(viewer, settings, selectedResolution);
      }
    } catch (err) {
      console.error("Error initializing viewer:", err);
      setError(err.message || "Failed to initialize viewer");
    } finally {
      setIsLoading(false);
    }
  }, [settings, selectedResolution, sceneSelected, loadModel]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Re-init when scene changes
  useEffect(() => {
    if (sceneSelected) initializeViewer();
  }, [sceneSelected, initializeViewer]);

  // Re-init when antialias/alphaThreshold change
  useEffect(() => {
    if (!viewerInstanceRef.current) return;
    const prev = currentSettingsRef.current || {};
    const changed =
      prev.alphaThreshold !== settings.alphaThreshold ||
      prev.antialiased !== settings.antialiased;
    if (changed) {
      currentSettingsRef.current = settings;
      initializeViewer();
    }
  }, [settings, initializeViewer]);

  // Public camera reset (use scene defaults if available)
  const resetCamera = useCallback(() => {
    if (!viewerInstanceRef.current) return;
    const cam = sceneSelected?.camera || {};
    const pos = Array.isArray(cam.position) ? cam.position : [-1, -4, 6];
    const tgt = Array.isArray(cam.target) ? cam.target : [0, 4, 0];
    viewerInstanceRef.current.camera.position.set(...pos);
    viewerInstanceRef.current.controls.target.set(...tgt);
    viewerInstanceRef.current.controls.update?.();
  }, [sceneSelected]);

  return { isLoading, error, viewerRef, viewerInstanceRef, resetCamera };
};