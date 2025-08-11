// src/constants/index.js

// ---------- file types ----------
export const FILE_TYPES = {
  SPLAT: ".splat",
  PLY: ".ply",
  OBJ: ".obj",
  FBX: ".fbx",
  GLTF: ".gltf",
  GLB: ".glb",
};

// Some places check with or without the dot
export const SUPPORTED_FORMATS = [
  FILE_TYPES.SPLAT, FILE_TYPES.PLY, // ".splat", ".ply"
  "splat", "ply",                   // "splat", "ply"
];

// ---------- resolutions ----------
export const RESOLUTION_ORDER = ["low", "medium", "high", "full"];

// For UI display / sorting. Her code imports RESOLUTION_QUALITY.
export const RESOLUTION_QUALITY = {
  low:    { key: "low",    label: "low",    order: 0 },
  medium: { key: "medium", label: "medium", order: 1 },
  high:   { key: "high",   label: "high",   order: 2 },
  full:   { key: "full",   label: "full",   order: 3 },
};

// Optional helper if any component wants a pretty label
export const RESOLUTION_LABELS = {
  low: "low",
  medium: "medium",
  high: "high",
  full: "full",
};

// ---------- device → preferred resolutions ----------
// (highest first so Desktop will pick full when available)
export const DEVICE_CONFIGS = {
  smartphone: {
    label: "Smartphone",
    recommendedResolutions: ["low"],
  },
  laptopWeak: {
    label: "Laptop (Integrated GPU)",
    recommendedResolutions: ["medium", "low"],
  },
  laptopStrong: {
    label: "Laptop (dGPU)",
    recommendedResolutions: ["high", "medium"],
  },
  desktopStrong: {
    label: "Desktop / Workstation",
    recommendedResolutions: ["full", "high", "medium"],
  },
};
