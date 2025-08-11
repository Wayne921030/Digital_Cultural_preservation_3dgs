import { useMemo, useState } from "react";
import { useAvailableModels } from "../hooks/useAvailableModels.js";
import { DEVICE_CONFIGS } from "../constants/index.js";
import { useViewer } from "../hooks/useViewer";
import React, { forwardRef, useCallback } from "react";


const ORDER = ["low","medium","high","full"];

function pickResolution(scene, deviceKey) {
  if (!scene?.file_types?.length) return null;
  const ft = scene.file_types.find(t => t.type === ".splat") ?? scene.file_types[0];
  const prefs = DEVICE_CONFIGS[deviceKey]?.recommendedResolutions ?? ORDER;
  for (const r of prefs) {
    const hit = ft.resolutions?.find(x => x.resolution === r);
    if (hit) return hit;
  }
  for (const r of ORDER) {
    const hit = ft.resolutions?.find(x => x.resolution === r);
    if (hit) return hit;
  }
  return null;
}

export default forwardRef(function Viewer(props, outerRef) {
  const { settings, selectedResolution, sceneSelected } = props;

  const { viewerRef, resetCamera, isLoading, error } =
    useViewer(settings, selectedResolution, sceneSelected);

  // merge our internal ref with the parent ref (so both get the node)
  const setRefs = useCallback((node) => {
    viewerRef.current = node;
    if (typeof outerRef === "function") outerRef(node);
    else if (outerRef && typeof outerRef === "object") outerRef.current = node;
  }, [viewerRef, outerRef]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* header / controls … */}
      <div id="viewer-root" ref={setRefs} style={{ height: "100%", width: "100%" }} />
      {isLoading && <div style={{ padding: 16 }}>Loading scene catalogue…</div>}
      {error && <div style={{ padding: 16, color: "crimson" }}>{String(error)}</div>}
    </div>
  );
});