// Configuration for Chenghuang Temple intro page

export const chenghuangConfig = {
  name: "新竹都城隍廟",
  subtitle: "Hsinchu Chenghuang Temple",
  description:
    "新竹都城隍廟是台灣新竹市最著名的廟宇之一，建於清乾隆年間，是台灣歷史最悠久的城隍廟之一。廟宇建築融合了傳統閩南建築風格，是當地重要的文化遺產和信仰中心。",
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
    "在新竹的老城區，城隍廟已有兩百多年歷史。它建於清乾隆年間，由淡水同知曾日瑛上奏朝廷，並由地方仕紳集資興建，是一座具有官廟背景的城隍廟。隨著時間推進，城隍廟成為地方重要的信仰中心，每逢中元節出巡活動，都吸引大量居民與遊客參與。",
    "除了宗教功能，城隍廟也保存了大量傳統工藝與歷史資訊，包括木雕、石刻、匾額書法與建築結構。其中，廟前的泉州石獅子雕刻精細、造型生動，採用青斗石雕成，歷經數百年仍色澤油亮，曾被選為郵票主題，成為新竹城隍廟的象徵之一，也是重要的文化資產。",
    "我們希望透過 3D 掃描與建模技術，精確保存城隍廟的外觀、細節與空間結構，包含石獅子在內的各項裝飾與工藝，建立可長期存取的數位模型。這不但能在教育與研究中使用，也能在未來進行修復或重建時提供可靠的參考資料，確保這座文化資產得以長久保存。",
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
    return category === "chenghuang" || category === "城隍廟";
  });
};

// Custom styles for chenghuang temple theme
export const chenghuangStyles = {
  primaryColor: "#6B5B47",
  secondaryColor: "#8B7355",
  textColor: "#2F2F2F",
  cardHoverColor: "rgba(139, 115, 85, 0.1)",
}; 