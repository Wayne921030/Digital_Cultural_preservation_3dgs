// 3D GS Viewer Constants

export const VIEWER_CONFIG = {
  DEFAULT_CAMERA_POSITION: [0, 0, 5],
  DEFAULT_CAMERA_TARGET: [0, 0, 0],
  CAMERA_FOV: 60,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  RENDERER_ALPHA: true,
  RENDERER_ANTIALIAS: true,
};

export const CONTROLS_CONFIG = {
  ENABLE_DAMPING: true,
  DAMPING_FACTOR: 0.05,
  ENABLE_ZOOM: true,
  ENABLE_PAN: true,
  ENABLE_ROTATE: true,
  MAX_DISTANCE: 100,
  MIN_DISTANCE: 0.1,
};

export const FILE_TYPES = {
  SPLAT: ".splat",
  PLY: ".ply",
  OBJ: ".obj",
  FBX: ".fbx",
  GLTF: ".gltf",
  GLB: ".glb",
};

export const SUPPORTED_FORMATS = [
  FILE_TYPES.SPLAT,
  FILE_TYPES.PLY,
  FILE_TYPES.OBJ,
  FILE_TYPES.FBX,
  FILE_TYPES.GLTF,
  FILE_TYPES.GLB,
];

export const THEME = {
  PRIMARY_COLOR: "#1976d2",
  SECONDARY_COLOR: "#dc004e",
  BACKGROUND_COLOR: "#121212",
  SURFACE_COLOR: "#1e1e1e",
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#b3b3b3",
};

// Model configurations for different device types
export const MODEL_CONFIGS = {
  smartphone: {
    name: "Smartphone",
    modelFile: "Rooftop_Drone_lod_25.splat", // Low resolution for mobile
    description: "Optimized for mobile devices with limited GPU",
    quality: "low",
    features: ["Low resolution", "Fast loading", "Battery optimized"],
  },
  laptopWeak: {
    name: "Laptop (Weak GPU)",
    modelFile: "Rooftop_Drone_lod_50.splat", // Medium resolution for integrated graphics
    description: "For laptops with integrated graphics",
    quality: "medium",
    features: [
      "Medium resolution",
      "Balanced performance",
      "Integrated GPU optimized",
    ],
  },
  laptopStrong: {
    name: "Laptop (Strong GPU)",
    modelFile: "Rooftop_Drone_lod_75.splat", // High resolution for dedicated graphics
    description: "For laptops with dedicated graphics cards",
    quality: "high",
    features: [
      "High resolution",
      "Good performance",
      "Dedicated GPU optimized",
    ],
  },
  desktopStrong: {
    name: "Desktop (Strong GPU)",
    modelFile: "Rooftop_Drone_full.splat", // Full resolution for high-end systems
    description: "For high-end desktop systems",
    quality: "ultra",
    features: [
      "Ultra high resolution",
      "Maximum quality",
      "High-end GPU optimized",
    ],
  },
};

// Available model files mapping
export const MODEL_FILES = {
  smartphone: {
    splat: "Rooftop_Drone_lod_25.splat",
    ply: "Rooftop_Drone_lod_25.ply",
  },
  laptopWeak: {
    splat: "Rooftop_Drone_lod_50.splat",
    ply: "Rooftop_Drone_lod_50.ply",
  },
  laptopStrong: {
    splat: "Rooftop_Drone_lod_75.splat",
    ply: "Rooftop_Drone_lod_75.ply",
  },
  desktopStrong: {
    splat: "Rooftop_Drone_full.splat",
    ply: null, // No .ply version for full resolution
  },
};

// API configuration
export const API_BASE_URL = "http://127.0.0.1:8000";
