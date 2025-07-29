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
