import React from "react";
import BaseIntroPage from "./BaseIntroPage";
import { chenghuangConfig, chenghuangSceneFilter, chenghuangStyles } from "../../constants/introConfigs/chenghuangConfig";

const ChenghuangIntroPage = ({ onBackToHome, onSelectScene, scenes, currentPage, onTabChange }) => {
  return (
    <BaseIntroPage
      onBackToHome={onBackToHome}
      onSelectScene={onSelectScene}
      scenes={scenes}
      locationConfig={chenghuangConfig}
      sceneFilter={chenghuangSceneFilter}
      customStyles={chenghuangStyles}
      currentPage={currentPage}
      onTabChange={onTabChange}
    />
  );
};

export default ChenghuangIntroPage; 