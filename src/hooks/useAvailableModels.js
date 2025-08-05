import { useState, useEffect, useCallback } from "react";
import { DEVICE_CONFIGS } from "../constants";

// Fetch available models from CloudFront
const fetchAvailableModels = async () => {
  try {
    const url = `https://dr4wh7nh38tn3.cloudfront.net/models.json?v=${Date.now()}`; 
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
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

  const checkAvailableModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const serverResponse = await fetchAvailableModels();

      if (serverResponse && Array.isArray(serverResponse.scenes)) {
        setScenes(serverResponse.scenes);
        setDeviceConfigs(DEVICE_CONFIGS); 
      } else {
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