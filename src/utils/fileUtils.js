// src/utils/fileUtils.js - NEW, COMPLETE CONTENTS

import { FILE_TYPES, SUPPORTED_FORMATS } from "../constants/index.js";

export const isSupportedFile = (filename) => {
  if (!filename) return false;
  const extension = getFileExtension(filename);
  return SUPPORTED_FORMATS.includes(extension.toLowerCase());
};

export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.substring(filename.lastIndexOf("."));
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Finds the best file option for a given scene based on device capabilities.
 * @param {object} scene - The scene object from models.json.
 * @param {string[]} deviceResolutions - An array of recommended resolution names (e.g., ['low']).
 * @returns {object|null} - An object with { fileType, resolutionObject } or null.
 */
export const getBestFileOption = (scene, deviceResolutions) => {
  if (!scene || !Array.isArray(scene.file_types)) {
    return null;
  }

  const priorityOrder = [".splat", ".ply"];
  
  // First pass: Look for a perfect match (recommended resolution and priority file type)
  for (const fileTypeName of priorityOrder) {
    const fileType = scene.file_types.find(ft => ft.type === fileTypeName);
    if (fileType && Array.isArray(fileType.resolutions)) {
      for (const resName of deviceResolutions) {
        const resolutionObject = fileType.resolutions.find(r => r.resolution === resName);
        if (resolutionObject) {
          // Best case: Found a recommended resolution in a priority file type
          return { fileType, resolutionObject };
        }
      }
    }
  }

  // Second pass: If no perfect match, find the best available fallback
  for (const fileTypeName of priorityOrder) {
    const fileType = scene.file_types.find(ft => ft.type === fileTypeName);
    // Fallback to the very first resolution available for the priority file type
    if (fileType && Array.isArray(fileType.resolutions) && fileType.resolutions.length > 0) {
      return { fileType, resolutionObject: fileType.resolutions[0] };
    }
  }

  return null; // No compatible files found for this scene
};