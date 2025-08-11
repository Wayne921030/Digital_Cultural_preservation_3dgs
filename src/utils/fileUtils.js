// src/utils/fileUtils.js
import { FILE_TYPES, SUPPORTED_FORMATS } from "../constants/index.js";

// ---- filename helpers ----
export function getFileExtension(filename) {
  if (!filename) return "";
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase(); // "splat"
  return ext;
}
export function getDotExtension(filename) {
  const ext = getFileExtension(filename);
  return ext ? `.${ext}` : "";
}

export function isSupportedFile(filename) {
  if (!filename) return false;
  const ext = getFileExtension(filename);   // "splat"
  const dot = `.${ext}`;                    // ".splat"
  return SUPPORTED_FORMATS.includes(ext) || SUPPORTED_FORMATS.includes(dot);
}

// ---- size formatting ----
export function formatFileSize(value, opts = {}) {
  if (!Number.isFinite(value)) return "";
  let bytes;

  switch ((opts.unit || "").toLowerCase()) {
    case "bytes": bytes = value; break;
    case "kb":    bytes = value * 1024; break;
    case "mb":    bytes = value * 1024 * 1024; break;
    default:
      // your models.json sometimes lists MB numbers; treat small numbers as MB
      bytes = value < 1000 ? value * 1024 * 1024 : value;
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  const d = i <= 1 ? 0 : 1;
  return `${bytes.toFixed(d)} ${units[i]}`;
}
export const formatBytes = (b) => formatFileSize(b, { unit: "bytes" });
export const formatMB    = (mb) => `${Number(mb).toFixed(mb < 10 ? 1 : 1)} MB`;

// ---- file reading helper (used by UI) ----
export async function readFileAsArrayBuffer(src) {
  if (!src) throw new Error("readFileAsArrayBuffer: no input");
  if (typeof src.arrayBuffer === "function") return await src.arrayBuffer(); // Blob/File/Response
  if (typeof src === "string") {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
    return await res.arrayBuffer();
  }
  return await new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(src);
    } catch (e) { reject(e); }
  });
}

// ---- her UI expects this signature: (scene, deviceResolutions) ----
export function getBestFileType(scene, deviceResolutions) {
  if (!scene || !Array.isArray(scene.file_types) || scene.file_types.length === 0) return null;

  // for each file type, find the best resolution given the device prefs
  const processed = scene.file_types.map((ft) => {
    const best = findBestResolution(ft?.resolutions || [], deviceResolutions);
    return best ? { ...ft, bestResolution: best.resolution, hasRecommendedResolution: best.isRecommended } : null;
  }).filter(Boolean);

  if (!processed.length) return null;

  // first try ones that hit a recommended resolution
  const withRec = processed.filter((ft) => ft.hasRecommendedResolution);
  const pickFrom = withRec.length ? withRec : processed;

  const best = findBestFileTypeByPriority(pickFrom);
  return best ? { bestFileType: best, bestResolution: best.bestResolution } : null;
}

function findBestResolution(resolutions, prefs) {
  if (!Array.isArray(resolutions) || !resolutions.length) return null;
  if (Array.isArray(prefs) && prefs.length) {
    for (const r of prefs) {
      const hit = resolutions.find((x) => x?.resolution === r);
      if (hit) return { resolution: hit, isRecommended: true };
    }
  }
  return { resolution: resolutions[0], isRecommended: false };
}

function findBestFileTypeByPriority(fileTypes) {
  const order = [FILE_TYPES.SPLAT, FILE_TYPES.PLY]; // ".splat" > ".ply"
  for (const t of order) {
    const hit = fileTypes.find((ft) => ft?.type === t);
    if (hit) return hit;
  }
  return fileTypes[0] || null;
}

// (optional) category helper used by some UIs
export function getFileTypeCategory(filename) {
  const dot = getDotExtension(filename);
  switch (dot) {
    case FILE_TYPES.SPLAT: return "Gaussian Splat";
    case FILE_TYPES.PLY:   return "Point Cloud";
    case FILE_TYPES.OBJ:
    case FILE_TYPES.FBX:
    case FILE_TYPES.GLTF:
    case FILE_TYPES.GLB:   return "3D Model";
    default: return "Unknown";
  }
}
