import React, { forwardRef, useCallback } from "react";
import { useViewer } from "../hooks/useViewer";

export default forwardRef(function Viewer(props, outerRef) {
  const { settings, onResetCamera, isAutoRotating, selectedResolution, selectedScene, orbit } = props;

  const { viewerRef, resetCamera, isLoading, error } =
    useViewer(settings, selectedResolution, selectedScene, isAutoRotating, orbit);

  // Expose resetCamera function to parent through onResetCamera ref
  React.useEffect(() => {
    if (onResetCamera && typeof onResetCamera === 'function') {
      onResetCamera(resetCamera);
    }
  }, [onResetCamera, resetCamera]);

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