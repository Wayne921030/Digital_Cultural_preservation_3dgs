import React from "react";
import BaseIntroPage from "./BaseIntroPage";
import { templeConfig, templeSceneFilter, templeStyles } from "../../constants/introConfigs/templeConfig";

const TempleIntroPage = ({ onBackToHome, onSelectScene, scenes, currentPage, onTabChange }) => {
  return (
    <BaseIntroPage
      onBackToHome={onBackToHome}
      onSelectScene={onSelectScene}
      scenes={scenes}
      locationConfig={templeConfig}
      sceneFilter={templeSceneFilter}
      customStyles={templeStyles}
      currentPage={currentPage}
      onTabChange={onTabChange}
    />
  );
};

export default TempleIntroPage; 