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

// Device type configurations for different performance levels
export const DEVICE_CONFIGS = {
  smartphone: {
    name: "Smartphone",
    description: "Optimized for mobile devices with limited GPU",
    quality: "low",
    features: ["Low resolution", "Fast loading", "Battery optimized"],
    recommendedResolutions: ["low"],
  },
  laptopWeak: {
    name: "Laptop (Weak GPU)",
    description: "For laptops with integrated graphics",
    quality: "medium",
    features: [
      "Medium resolution",
      "Balanced performance",
      "Integrated GPU optimized",
    ],
    recommendedResolutions: ["low", "medium"],
  },
  laptopStrong: {
    name: "Laptop (Strong GPU)",
    description: "For laptops with dedicated graphics cards",
    quality: "high",
    features: [
      "High resolution",
      "Good performance",
      "Dedicated GPU optimized",
    ],
    recommendedResolutions: ["medium", "high"],
  },
  desktopStrong: {
    name: "Desktop (Strong GPU)",
    description: "For high-end desktop systems",
    quality: "ultra",
    features: [
      "Ultra high resolution",
      "Maximum quality",
      "High-end GPU optimized",
    ],
    recommendedResolutions: ["high", "full"],
  },
};

// Resolution quality mapping
export const RESOLUTION_QUALITY = {
  low: {
    name: "Low",
    description: "Fast loading, optimized for mobile",
    icon: "📱",
  },
  medium: {
    name: "Medium",
    description: "Balanced quality and performance",
    icon: "💻",
  },
  high: {
    name: "High",
    description: "High quality for strong GPUs",
    icon: "🖥️",
  },
  full: {
    name: "Full",
    description: "Maximum quality",
    icon: "🚀",
  },
};
