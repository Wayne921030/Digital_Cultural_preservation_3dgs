import { useMemo, useState } from "react";
import { useAvailableModels } from "@/hooks/useAvailableModels";
import { DEVICE_CONFIGS } from "@/constants";
import { useViewer } from "@/hooks/useViewer";

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

export default function Viewer() {
  const params = new URLSearchParams(location.search);
  const sceneId   = params.get("scene");              // e.g. Rooftop_Drone
  const deviceKey = params.get("device") || "smartphone";

  const { serverResponse, isLoading: loadingIndex } = useAvailableModels();

  const sceneSelected = useMemo(() => {
    return serverResponse?.scenes?.find(s => s.scene_name === sceneId) || null;
  }, [serverResponse, sceneId]);

  const selectedResolution = useMemo(() => {
    return pickResolution(sceneSelected, deviceKey);
  }, [sceneSelected, deviceKey]);

  // ---- settings UI state (AA + alpha) ----
  const [settings, setSettings] = useState({ antialiased: false, alphaThreshold: 128 });

  const { viewerRef, resetCamera } = useViewer(settings, selectedResolution, sceneSelected);

  if (loadingIndex || !sceneSelected || !selectedResolution) {
    return <div style={{ padding: 16 }}>Loading scene catalogue…</div>;
  }

  return (
    <div style={{ height: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <div style={{ padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}>
        <strong>{sceneSelected.scene_name}</strong>
        <span>•</span>
        <span>{deviceKey}</span>
        <button onClick={resetCamera}>Reset Camera</button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={!!settings.antialiased}
              onChange={(e) => setSettings(s => ({ ...s, antialiased: e.target.checked }))}
            />
            Antialiasing
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Alpha: {settings.alphaThreshold}
            <input
              type="range"
              min="0"
              max="255"
              value={settings.alphaThreshold}
              onChange={(e) => setSettings(s => ({ ...s, alphaThreshold: Number(e.target.value) }))}
              style={{ width: 180 }}
            />
          </label>
        </div>
      </div>

      <div id="viewer-root" ref={viewerRef} style={{ width: "100%", height: "100%", background: "#111" }} />
    </div>
  );
}
