// Configuration for Chenghuang Temple intro page

export const chenghuangConfig = {
  name: "新竹都城隍廟",
  subtitle: "Hsinchu Chenghuang Temple",
  description:
    "新竹都城隍廟始建於清乾隆年間，是新竹市最具代表性、也是台灣歷史悠久且重要的廟宇之一。\n城隍廟的建築結合傳統閩南建築風格，不僅展現精湛的工藝特色，亦承載著深厚的文化底蘊，是當地的信仰中心及珍貴的文化遺產。",
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
    "在新竹的老城區，城隍廟擁有超過兩百年的歷史，建於清乾隆年間。其興建由淡水同知曾日瑛奏請朝廷批准，並由地方仕紳集資完成，是一座具官廟背景的城隍廟。經過歲月的洗禮，城隍廟逐漸成為地方信仰的核心，每年中元節舉辦的城隍出巡活動，總能吸引眾多居民與遊客踴躍參與，展現廟宇在社區中的重要地位。",
    "除了其宗教功能，城隍廟也承載著豐富的文化與歷史價值，保存了大量傳統工藝及珍貴資訊，包括木雕、石刻、匾額書法以及富有特色的建築結構。其中，廟前的泉州石獅子更是令人矚目，其雕工細膩、生動逼真，採用青斗石打造，經歷數百年仍保有油亮光澤。這對石獅曾被選為郵票設計主題，成為城隍廟的標誌性象徵，同時也是新竹重要的文化資產。",
    "為了讓這座歷史建築得以永久保存，我們希望藉由先進的 3D 掃描與建模技術，精準記錄城隍廟的外觀、細節及空間結構，包括石獅子在內的多項精美工藝。透過建立可持久存取的數位模型，這項技術不僅能被運用於教育與學術研究，還可作為未來修復或重建時的可靠參考，確保這座承載深厚文化與歷史價值的資產得以世世代代流傳。",
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