import { useState, useCallback, useRef, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { modelURL } from "../config";

// ---- orbit presets (unchanged) ----
const controlConfigs = {
  base: { minPolarAngle: 0, maxPolarAngle: Math.PI, enablePan: true, enableZoom: true },
  topDown360: { minPolarAngle: 0, maxPolarAngle: Math.PI / 2, minAzimuthAngle: -Infinity, maxAzimuthAngle: Infinity, enablePan: true, enableZoom: true },
  frontFocus: { minPolarAngle: Math.PI / 4, maxPolarAngle: (3 * Math.PI) / 4, minAzimuthAngle: -Math.PI / 3, maxAzimuthAngle: Math.PI / 3, enablePan: true, enableZoom: true },
};

function applyControlConfig(controls, presetName) {
  const cfg = controlConfigs[presetName] || controlConfigs.base;
  if (!controls) return;
  if (cfg.minPolarAngle != null) controls.minPolarAngle = cfg.minPolarAngle;
  if (cfg.maxPolarAngle != null) controls.maxPolarAngle = cfg.maxPolarAngle;
  if (cfg.minAzimuthAngle != null) controls.minAzimuthAngle = cfg.minAzimuthAngle;
  if (cfg.maxAzimuthAngle != null) controls.maxAzimuthAngle = cfg.maxAzimuthAngle;
  if (cfg.enablePan != null) controls.enablePan = cfg.enablePan;
  if (cfg.enableZoom != null) controls.enableZoom = cfg.enableZoom;
}

function frameScene(viewer) {
  if (!viewer) return;
  if (typeof viewer.frameAll === "function") viewer.frameAll();
  else if (typeof viewer.fitCameraToScene === "function") viewer.fitCameraToScene();
  else viewer.controls?.update?.();
}

// ---- load cancellation token ----
let _tokenSeq = 0;

export const useViewer = (settings, selectedResolution, sceneSelected /*, selectedScene? */) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const currentSettingsRef = useRef(settings);
  const loadTokenRef = useRef(0);

  // idempotent teardown (no manual DOM removals)
  const teardownViewer = useCallback(() => {
    loadTokenRef.current = ++_tokenSeq; // cancel in-flight loads
    const v = viewerInstanceRef.current;
    if (!v) return;
    try {
      v.stop?.();
      // rAF to avoid racing React unmount removing canvas
      requestAnimationFrame(() => v.dispose?.());
    } catch {}
    viewerInstanceRef.current = null;
  }, []);

  // ---- load a model into an existing viewer ----
  const loadModel = useCallback(async (viewer, setts, resolution) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = loadTokenRef.current;

      if (!resolution?.filename) throw new Error("Missing model filename");

      const url = modelURL(resolution.filename);
      await viewer.addSplatScene(url, {
        showLoadingUI: false,
        position: [0, 0, 0],
        // settings: alpha threshold (0..255)
        splatAlphaRemovalThreshold: Math.max(0, Math.min(255, Number(setts?.alphaThreshold ?? 128))),
      });

      // cancelled while awaiting?
      if (token !== loadTokenRef.current || viewerInstanceRef.current !== viewer) return;

      viewer.start?.();
      viewer.render?.();
      frameScene(viewer);
      if (typeof window !== "undefined") window.__viewer = viewer;
      console.info("Viewer: model added and framed", resolution.filename);
    } catch (err) {
      const msg = String(err?.message || err || "");
      if (msg.includes("Scene disposed") || msg.includes("removeChild")) return; // benign races
      console.error("Error loading model:", err);
      setError(msg || "Failed to load model");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- create & init viewer ----
  const initializeViewer = useCallback(async () => {
    if (!viewerRef.current || !sceneSelected) return;

    teardownViewer();

    const orbitPreset = sceneSelected?.orbit || "frontFocus";
    const cam = sceneSelected?.camera || {};
    const cameraUp = Array.isArray(cam.up) ? cam.up : [0, -1, -0.6];
    const initialCameraPosition = Array.isArray(cam.position) ? cam.position : [-1, -4, 6];
    const initialCameraLookAt = Array.isArray(cam.target) ? cam.target : [0, 4, 0];

    try {
      setIsLoading(true);
      setError(null);

      const useWorkerFlag = typeof crossOriginIsolated !== "undefined" ? crossOriginIsolated : true;

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp,
        initialCameraPosition,
        initialCameraLookAt,
        rootElement: viewerRef.current,
        showLoadingUI: false,
        antialiased: !!settings?.antialiased,   // AA respected
        useWorker: useWorkerFlag,                // works in dev even if COI not ready
      });

      viewer.start?.();
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
  }, [settings, selectedResolution, sceneSelected, loadModel, teardownViewer]);

  // mount/unmount
  useEffect(() => {
    return () => teardownViewer();
  }, [teardownViewer]);

  // init when scene changes
  useEffect(() => { if (sceneSelected) initializeViewer(); }, [sceneSelected, initializeViewer]);

  // settings changes (AA rebuild, alpha live reload)
  useEffect(() => {
    const prev = currentSettingsRef.current || {};
    const changedAlpha = prev.alphaThreshold !== settings?.alphaThreshold;
    const changedAA    = !!prev.antialiased !== !!settings?.antialiased;

    if (!viewerInstanceRef.current) {
      currentSettingsRef.current = settings;
      return;
    }

    // AA requires full rebuild (constructor option)
    if (changedAA) {
      currentSettingsRef.current = settings;
      initializeViewer();
      return;
    }

    // Alpha: light reload of the same scene (no DOM tearing)
    if (changedAlpha && sceneSelected && selectedResolution) {
      currentSettingsRef.current = settings;
      // If library gains a runtime setter we can call it instead of reload
      viewerInstanceRef.current.clearScenes?.();
      loadModel(viewerInstanceRef.current, settings, selectedResolution);
    }
  }, [settings, selectedResolution, sceneSelected, initializeViewer, loadModel]);

  const resetCamera = useCallback(() => {
    const v = viewerInstanceRef.current;
    if (!v) return;
    const cam = sceneSelected?.camera || {};
    const pos = Array.isArray(cam.position) ? cam.position : [-1, -4, 6];
    const tgt = Array.isArray(cam.target) ? cam.target : [0, 4, 0];
    v.camera.position.set(...pos);
    v.controls.target.set(...tgt);
    v.controls.update?.();
  }, [sceneSelected]);

  return { isLoading, error, viewerRef, viewerInstanceRef, resetCamera };
};
