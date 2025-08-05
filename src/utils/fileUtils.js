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

/**
 * Get the best file type and resolution for a scene
 * @param {Object} scene - The scene object
 * @param {Array} deviceResolutions - Recommended resolutions for the device
 * @returns {Object|null} - Object with bestFileType and bestResolution, or null if none found
 */
export const getBestFileType = (scene, deviceResolutions) => {
  if (!scene || !scene.file_types || scene.file_types.length === 0) {
    return null;
  }

  // Step 1: Process all file types and find their best resolutions
  const processedFileTypes = scene.file_types
    .map((fileType) => {
      if (!fileType.resolutions || fileType.resolutions.length === 0) {
        return null;
      }

      // Find the best resolution for this file type
      const bestResolution = findBestResolution(
        fileType.resolutions,
        deviceResolutions
      );

      return {
        ...fileType,
        bestResolution: bestResolution.resolution,
        hasRecommendedResolution: bestResolution.isRecommended,
      };
    })
    .filter((fileType) => fileType !== null);

  if (processedFileTypes.length === 0) {
    return null;
  }

  // Step 2: Separate file types by whether they have recommended resolutions
  const withRecommended = processedFileTypes.filter(
    (ft) => ft.hasRecommendedResolution
  );
  const withoutRecommended = processedFileTypes.filter(
    (ft) => !ft.hasRecommendedResolution
  );

  // Step 3: Try to find best file type with recommended resolution
  if (withRecommended.length > 0) {
    const bestWithRecommended = findBestFileTypeByPriority(withRecommended);
    if (bestWithRecommended) {
      return {
        bestFileType: bestWithRecommended,
        bestResolution: bestWithRecommended.bestResolution,
      };
    }
  }

  // Step 4: If no recommended resolutions, find best file type among all
  const bestOverall = findBestFileTypeByPriority(processedFileTypes);
  if (bestOverall) {
    return {
      bestFileType: bestOverall,
      bestResolution: bestOverall.bestResolution,
    };
  }

  return null;
};

// Helper function to find the best resolution for a file type
function findBestResolution(resolutions, deviceResolutions) {
  if (!deviceResolutions || deviceResolutions.length === 0) {
    return { resolutionObject: resolutions[0], isRecommended: false };
  }

  // Try to find a recommended resolution
  for (const recommended of deviceResolutions) {
    const found = resolutions.find((r) => r.resolution === recommended);
    if (found) {
      return { resolutionObject: found, isRecommended: true };
    }
  }

  // Fallback to first available resolution
  return { resolutionObject: resolutions[0], isRecommended: false };
}


// Helper function to find best file type by priority (splat > ply > others)
function findBestFileTypeByPriority(fileTypes) {
  const priorityOrder = [".splat", ".ply"];

  for (const priorityType of priorityOrder) {
    const found = fileTypes.find(ft => ft.type === priorityType && ft.bestResolution);
    if (found) {
      return found;
    }
  }
  
  // If no priority types found, return the first available that has a resolution
  return fileTypes.find(ft => ft.bestResolution) || null;
}
