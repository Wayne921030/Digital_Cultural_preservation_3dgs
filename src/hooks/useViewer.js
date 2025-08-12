import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { isSupportedFile } from "../utils/fileUtils";
import { modelURL } from "../config";
import { useAutoRotate } from "./useAutoRotate";

// ✅ Single point of control for viewer defaults
const DEFAULT_SETTINGS = { antialiased: true, alphaThreshold: 0 };

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
    minPolarAngle: Math.PI * 4 / 9,
    maxPolarAngle: Math.PI * 1 / 2,
    minAzimuthAngle: -Math.PI / 9,
    maxAzimuthAngle: Math.PI / 9,
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

function frameScene(viewer) {
  if (!viewer) return;
  if (typeof viewer.frameAll === "function") viewer.frameAll();
  else if (typeof viewer.fitCameraToScene === "function") viewer.fitCameraToScene();
  else viewer.controls?.update?.();
}

// Cleanup that’s safe/idempotent (no direct DOM removals)
function teardownViewer(viewerRefObj) {
  const v = viewerRefObj.current;
  if (!v) return;
  try {
    v.stop?.();     // stop render loop (if exposed)
    v.dispose?.();  // dispose internals safely
  } catch {
    /* ignore best-effort errors */
  }
  viewerRefObj.current = null;
}

// Dev-only: silence the noisy “removeChild … not a child” unhandled rejection
if (import.meta?.env?.DEV && typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (e) => {
    const msg = String(e.reason?.message || e.reason || "");
    if (msg.includes("removeChild") && msg.includes("not a child")) e.preventDefault();
  });
}

export const useViewer = (
  settings = DEFAULT_SETTINGS,
  selectedResolution,
  selectedScene,
  isAutoRotating = false,
  orbit = "frontFocus"
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentSettingsRef = useRef(DEFAULT_SETTINGS);

  // Use the auto-rotate hook
  useAutoRotate(viewerInstanceRef.current, isAutoRotating, 360, orbit);

  // Load model into an existing viewer
  const loadModel = useCallback(
    async (viewer, setts, resolution) => {
      try {
        setIsLoading(true);
        setError(null);
        if (!isMountedRef.current) return;

        if (!resolution?.filename || !isSupportedFile(resolution.filename)) {
          throw new Error("Unsupported or missing model filename");
        }

        const url = modelURL(resolution.filename);

        await viewer.addSplatScene(url, {
          showLoadingUI: false, // only app loader
          position: [0, 0, 0],
          // respect the alpha threshold coming from settings/defaults
          splatAlphaRemovalThreshold: Number(setts?.alphaThreshold ?? DEFAULT_SETTINGS.alphaThreshold),
        });

        viewer.start?.();
        viewer.render?.();
        frameScene(viewer);

        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-underscore-dangle
          window.__viewer = viewer;
        }

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

  // Create/initialize a viewer
  const initializeViewer = useCallback(async () => {
    const safe = {
      antialiased: !!(settings?.antialiased ?? DEFAULT_SETTINGS.antialiased),
      alphaThreshold: Number(settings?.alphaThreshold ?? DEFAULT_SETTINGS.alphaThreshold),
    };

    if (!viewerRef.current || !selectedScene) return;

    teardownViewer(viewerInstanceRef);

    const orbitPreset = selectedScene?.orbit || "frontFocus";
    const cam = selectedScene?.camera || {};
    const cameraUp = Array.isArray(cam.up) ? cam.up : [0, -1, -0];
    const initialCameraPosition = Array.isArray(cam.position) ? cam.position : [0, 0, 6];
    const initialCameraLookAt = Array.isArray(cam.target) ? cam.target : [0, 0, 0];

    try {
      setIsLoading(true);
      setError(null);

      const useWorkerFlag =
        typeof crossOriginIsolated !== "undefined" ? crossOriginIsolated : true;

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp,
        initialCameraPosition,
        initialCameraLookAt,
        rootElement: viewerRef.current,
        showLoadingUI: false,
        antialiased: safe.antialiased,   // 👈 AA obeys default/settings
        useWorker: useWorkerFlag,        // dev-safe: falls back if COI not ready
      });

      viewer.start?.();
      applyControlConfig(viewer.controls, orbitPreset);

      viewerInstanceRef.current = viewer;
      currentSettingsRef.current = safe;

      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-underscore-dangle
        window.__viewer = viewer;
      }

      if (selectedResolution) {
        await loadModel(viewer, safe, selectedResolution);
      }
    } catch (err) {
      console.error("Error initializing viewer:", err);
      setError(err.message || "Failed to initialize viewer");
    } finally {
      setIsLoading(false);
    }
  }, [settings, selectedResolution, selectedScene, loadModel]);

  // Mount/unmount lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      teardownViewer(viewerInstanceRef);
    };
  }, []);

  // Init on scene change
  useEffect(() => {
    if (selectedScene) initializeViewer();
  }, [selectedScene, initializeViewer]);

  // Settings changes: avoid heavy re-init unless AA toggled
  useEffect(() => {
    const prev = currentSettingsRef.current || DEFAULT_SETTINGS;
    const next = {
      antialiased: !!(settings?.antialiased ?? DEFAULT_SETTINGS.antialiased),
      alphaThreshold: Number(settings?.alphaThreshold ?? DEFAULT_SETTINGS.alphaThreshold),
    };

    const changedAlpha =
      (prev.alphaThreshold ?? DEFAULT_SETTINGS.alphaThreshold) !==
      (next.alphaThreshold ?? DEFAULT_SETTINGS.alphaThreshold);

    const changedAA = !!prev.antialiased !== !!next.antialiased;

    if (!viewerInstanceRef.current) {
      currentSettingsRef.current = next;
      return;
    }

    if (changedAA) {
      currentSettingsRef.current = next;
      initializeViewer(); // rebuild (constructor option)
      return;
    }

    if (changedAlpha && selectedScene && selectedResolution) {
      currentSettingsRef.current = next;
      try {
        viewerInstanceRef.current.clearScenes?.();
      } catch { /* ignore */ }
      loadModel(viewerInstanceRef.current, next, selectedResolution);
    }
  }, [settings, selectedResolution, selectedScene, initializeViewer, loadModel]);

  // Public camera reset (use scene defaults if available)
  const resetCamera = useCallback(() => {
    if (!viewerInstanceRef.current) return;
    const cam = selectedScene?.camera || {};
    const pos = Array.isArray(cam.position) ? cam.position : [0, 0, 6];
    const tgt = Array.isArray(cam.target) ? cam.target : [0, 0, 0];
    viewerInstanceRef.current.camera.position.set(...pos);
    viewerInstanceRef.current.controls.target.set(...tgt);
    viewerInstanceRef.current.controls.update?.();
  }, [selectedScene]);

  return { isLoading, error, viewerRef, viewerInstanceRef, resetCamera };
};
