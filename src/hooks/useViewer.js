import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { isSupportedFile } from "../utils/fileUtils";
import { modelURL } from "../config";

/** Orbit / control presets */
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

// Ensure camera points at content after load
function frameScene(viewer) {
  if (!viewer) return;
  if (typeof viewer.frameAll === "function") viewer.frameAll();
  else if (typeof viewer.fitCameraToScene === "function") viewer.fitCameraToScene();
  else viewer.controls?.update?.();
}

// Hard cleanup to avoid leaks/lag on nav-away
function teardownViewer(viewerRefObj, rootEl) {
  const v = viewerRefObj.current;
  if (!v) return;
  try {
    v.stop?.();                 // stop render loop
    v.clearScenes?.();          // remove scenes
    v.dispose?.();              // free GL buffers/textures
    v.renderer?.dispose?.();    // extra safety
    const gl = v.gl || v.renderer?.getContext?.();
    gl?.getExtension?.("WEBGL_lose_context")?.loseContext?.();
  } catch {/* no-op */}
  viewerRefObj.current = null;
  if (rootEl) rootEl.innerHTML = ""; // drop canvas
}

export const useViewer = (settings, selectedResolution, sceneSelected) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(settings);

  // Load model into an existing viewer
  const loadModel = useCallback(async (viewer, _settings, resolution) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!isMountedRef.current) return;
      if (!resolution?.filename || !isSupportedFile(resolution.filename)) {
        throw new Error("Unsupported or missing model filename");
      }
      const url = modelURL(resolution.filename);
      await viewer.addSplatScene(url, {
        showLoadingUI: false,
        position: [0, 0, 0],
      });
      viewer.start?.();
      viewer.render?.();
      frameScene(viewer);
      console.info("Viewer: model added and framed", resolution.filename);
    } catch (err) {
      console.error("Error loading model:", err);
      setError(err.message || "Failed to load model");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create/initialize a viewer
  const initializeViewer = useCallback(async () => {
    if (!viewerRef.current || !sceneSelected) return;

    // Tear down any previous instance to avoid double loops & VRAM leaks
    teardownViewer(viewerInstanceRef, viewerRef.current);

    const orbitPreset = sceneSelected?.orbit || "frontFocus";
    const cam = sceneSelected?.camera || {};
    const cameraUp = Array.isArray(cam.up) ? cam.up : [0, -1, -0.6];
    const initialCameraPosition = Array.isArray(cam.position) ? cam.position : [-1, -4, 6];
    const initialCameraLookAt = Array.isArray(cam.target) ? cam.target : [0, 4, 0];

    try {
      setIsLoading(true);
      setError(null);

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp,
        initialCameraPosition,
        initialCameraLookAt,
        rootElement: viewerRef.current,
        showLoadingUI: false,
        antialiased: !!settings.antialiased,
        useWorker: true,
      });

      viewer.start?.(); // ensure loop is running
      applyControlConfig(viewer.controls, orbitPreset);

      viewerInstanceRef.current = viewer;
      currentSettingsRef.current = settings;
      if (typeof window !== "undefined") window.__viewer = viewer; // debug helper

      if (selectedResolution) await loadModel(viewer, settings, selectedResolution);
    } catch (err) {
      console.error("Error initializing viewer:", err);
      setError(err.message || "Failed to initialize viewer");
    } finally {
      setIsLoading(false);
    }
  }, [settings, selectedResolution, sceneSelected, loadModel]);

  // Mount/unmount lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      teardownViewer(viewerInstanceRef, viewerRef.current);
    };
  }, []);

  // Init on scene change
  useEffect(() => {
    if (sceneSelected) initializeViewer();
  }, [sceneSelected, initializeViewer]);

  // Settings changes: avoid full re-init unless AA toggled
  useEffect(() => {
    const prev = currentSettingsRef.current || {};
    const changedAlpha = prev.alphaThreshold !== settings.alphaThreshold;
    const changedAA = prev.antialiased !== settings.antialiased;

    if (!viewerInstanceRef.current) {
      currentSettingsRef.current = settings;
      return;
    }

    // Antialiasing is a constructor-time option → rebuild viewer
    if (changedAA) {
      currentSettingsRef.current = settings;
      initializeViewer();
      return;
    }

    // For other runtime-tunable settings, reload the model only
    if (changedAlpha && sceneSelected && selectedResolution) {
      currentSettingsRef.current = settings;
      // Light reload: clear then add scene again (if API available)
      viewerInstanceRef.current.clearScenes?.();
      loadModel(viewerInstanceRef.current, settings, selectedResolution);
    }
  }, [settings, selectedResolution, sceneSelected, initializeViewer, loadModel]);

  // Public camera reset
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