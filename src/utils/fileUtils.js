// File utility functions for 3D GS Viewer

import { FILE_TYPES, SUPPORTED_FORMATS } from "../constants/index.js";

/**
 * Check if a file is a supported 3D format
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file is supported
 */
export const isSupportedFile = (filename) => {
  if (!filename) return false;

  const extension = getFileExtension(filename);
  return SUPPORTED_FORMATS.includes(extension.toLowerCase());
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - The file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.substring(filename.lastIndexOf("."));
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Create a file reader promise
 * @param {File} file - The file to read
 * @returns {Promise<ArrayBuffer>} - Promise that resolves with file data
 */
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} - True if file size is valid
 */
export const validateFileSize = (file, maxSizeMB = 100) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get file type category
 * @param {string} filename - The filename
 * @returns {string} - The file type category
 */
export const getFileTypeCategory = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();

  switch (extension) {
    case FILE_TYPES.SPLAT:
      return "Gaussian Splat";
    case FILE_TYPES.PLY:
      return "Point Cloud";
    case FILE_TYPES.OBJ:
    case FILE_TYPES.FBX:
    case FILE_TYPES.GLTF:
    case FILE_TYPES.GLB:
      return "3D Model";
    default:
      return "Unknown";
  }
};

// Get the best file type for the scene (prioritize .splat over .ply)
export const getBestFileType = (fileTypes) => {
  // First try to find .splat files
  const splatFileType = fileTypes.find((ft) => ft.type === ".splat");
  if (splatFileType && splatFileType.bestResolution) {
    return splatFileType;
  }
  // If no .splat, try .ply files
  const plyFileType = fileTypes.find((ft) => ft.type === ".ply");
  if (plyFileType && plyFileType.bestResolution) {
    return plyFileType;
  }
  // If neither found, return the first available
  return fileTypes.find((ft) => ft.bestResolution);
};
