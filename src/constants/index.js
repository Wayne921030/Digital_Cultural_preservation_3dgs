// 3D GS Viewer Constants

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
