import React from "react";
import BaseIntroPage from "./BaseIntroPage";
import { baoshengConfig, baoshengSceneFilter, baoshengStyles } from "../../constants/introConfigs/baoshengConfig";

const TempleIntroPage = ({ onBackToHome, onSelectScene, scenes, currentPage, onTabChange }) => {
  return (
    <BaseIntroPage
      onBackToHome={onBackToHome}
      onSelectScene={onSelectScene}
      scenes={scenes}
      locationConfig={baoshengConfig}
      sceneFilter={baoshengSceneFilter}
      customStyles={baoshengStyles}
      currentPage={currentPage}
      onTabChange={onTabChange}
    />
  );
};

export default TempleIntroPage; 