// Configuration for Chenghuang Temple intro page

export const chenghuangConfig = {
  name: "新竹城隍廟",
  subtitle: "Hsinchu Chenghuang Temple",
  description:
    "新竹城隍廟是台灣新竹市最著名的廟宇之一，建於清乾隆年間，是台灣歷史最悠久的城隍廟之一。廟宇建築融合了傳統閩南建築風格，是當地重要的文化遺產和信仰中心。",
  address: "300新竹市北區中山路75號",
  heroImage: "/img/chenghuang/chenghuang1.jpeg",
  heroImages: [
    "/img/chenghuang/chenghuang1.jpeg",
    "/img/chenghuang/chenghuang2.jpeg",
    "/img/chenghuang/chenghuang3.jpeg"
  ],
  photoCredit: "（新竹城隍廟一景｜照片來源：新竹市政府）",
  storyTitle: "關於城隍廟的故事",
  storyContent: [
    "....",
  ],
  sceneSelectionTitle: "選擇 3D 場景體驗",
  defaultScenes: [
    {
      id: "SceneA",
      name: "主入口場景",
      description: "體驗城隍廟莊嚴肅穆的主入口，感受傳統建築的宏偉氣勢",
      image: "/img/chenghuang/chenghuang1.jpeg",
      features: ["高解析度建模", "真實材質渲染", "互動式導覽"],
    },
    {
      id: "SceneB", 
      name: "內部殿堂場景",
      description: "深入城隍廟內部殿堂，探索精心設計的空間佈局和神聖氛圍",
      image: "/img/chenghuang/chenghuang2.jpeg",
      features: ["室內光線模擬", "細節雕刻展示", "360度環視"],
    },
    {
      id: "SceneC",
      name: "屋頂景觀場景", 
      description: "從空中俯瞰城隍廟的壯麗景觀，欣賞建築的整體美學設計",
      image: "/img/chenghuang/chenghuang3.jpeg",
      features: ["空拍視角", "建築全景", "環境氛圍"],
    },
  ]
};

// Scene filter function for chenghuang temple scenes
export const chenghuangSceneFilter = (scenes) => {
  return scenes.filter(scene => {
    const category = scene.category?.toLowerCase();
    const sceneName = (scene.scene_name || scene.name || "").toLowerCase();
    
    return category === "chenghuang" || 
           category === "城隍廟" || 
           sceneName.includes("chenghuang") ||
           sceneName.includes("城隍") ||
           sceneName.includes("廟");
  });
};

// Custom styles for chenghuang temple theme
export const chenghuangStyles = {
  primaryColor: "#6B5B47",
  secondaryColor: "#8B7355",
  textColor: "#2F2F2F",
  cardHoverColor: "rgba(139, 115, 85, 0.1)",
}; 