import { useState, useEffect, useCallback } from "react";
import { DEVICE_CONFIGS } from "../constants";

// Fetch available models from CloudFront directly
const fetchAvailableModels = async () => {
  try {
    // Use CloudFront URL directly - no environment variable needed
    const url = `https://dr4wh7nh38tn3.cloudfront.net/models.json?v=${Date.now()}`; 
    
    console.log('Fetching models from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',  // Explicitly set CORS mode
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    console.log('Response content-type:', contentType);

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If not JSON, try to parse as text first
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.warn("Failed to parse response as JSON:", parseError);
        throw new Error('Invalid JSON response from server');
      }
    }

    console.log('Successfully fetched models data:', data);
    return data;
  } catch (error) {
    console.error("Error fetching available models:", error);
    throw error;
  }
};

export const useAvailableModels = () => {
  const [scenes, setScenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceConfigs, setDeviceConfigs] = useState({});

  // Use the imported device configurations
  const desiredDeviceConfigs = DEVICE_CONFIGS;

  // Check which models are available
  const checkAvailableModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Checking available models...');

      // Fetch all available models from CloudFront
      const serverResponse = await fetchAvailableModels();

      // Directly use the scenes array from your JSON file
      if (serverResponse && Array.isArray(serverResponse.scenes)) {
        console.log(`Found ${serverResponse.scenes.length} scenes`);
        setScenes(serverResponse.scenes);
        // Since scenes are available, assume all device configs are available for selection.
        setDeviceConfigs(desiredDeviceConfigs); 
      } else {
        // Handle case where the structure is not as expected
        console.warn("Unexpected server response format:", serverResponse);
        throw new Error("Could not parse the list of available scenes.");
      }
    } catch (err) {
      console.error("Error checking available models:", err);
      setError(err.message);
      setScenes([]);
      setDeviceConfigs({});
    } finally {
      setIsLoading(false);
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    checkAvailableModels();
  }, [checkAvailableModels]);

  return {
    scenes,
    deviceConfigs,
    isLoading,
    error,
    refreshModels: checkAvailableModels,
  };
};