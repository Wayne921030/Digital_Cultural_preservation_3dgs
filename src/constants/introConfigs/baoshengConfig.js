// Configuration for Temple (Bao Sheng Temple) intro page

export const baoshengConfig = {
  name: "大崎保生宮",
  subtitle: "Daji Bao Sheng Temple",
  description:
    "保生宮是一座具有悠久歷史的道教宮廟，供奉保生大帝，是台灣重要的民間信仰中心之一。\n宮廟建築融合了傳統道教建築風格與現代設計理念，是當地重要的文化遺產。",
  address: "308新竹縣寶山鄉大雅一街88號",
  heroImage: "/img/baosheng.jpeg",
  heroImages: [
    "/img/baosheng/baosheng1.jpeg",
    "/img/baosheng/baosheng2.jpeg",
  ],
  photoCredit: "（寶山大崎保生宮一景｜照片來源：大崎文史工作室）",
  storyTitle: "關於保生宮的故事",
  storyContent: [
    "在新竹寶山的大崎村，保生宮守望這片土地已近兩個世紀。自清道光九年起，閩南與客家先民在此築廟奉祀保生大帝，廟埕成了村子的心臟：山歌在每個初二回響，收冬祭典與閹大雞比賽讓四季更迭有了熱鬧的秩序。保生宮承載的不只是信仰，更是一種彼此相認的方式、以及共享記憶的所在。",
    "隨時代向前、園區拓展，新竹科學園區的擴建為寶山帶來產業升級、就業機會與基礎建設的更新，讓在地與世界接軌。面對遷建的現實，我們選擇以科技與傳統並行──在保生大帝以擲筊允諾遷移後，啟動了 3D 重建與數位典藏計畫：在牆與瓦離開之前，盡力保存空間的神態與人情的溫度。",
    "透過高密度影像與三維重建，我們保存了屋脊的起伏、樑柱的紋理、木雕的刀痕，甚至午後斜陽在廟埕投下的陰影。從此，舊時的保生宮得以在雲端重生：無論你身在何處，都能走進那條通向正殿的動線，聽見想像中的鐘鼓聲，嗅見繚繞不散的香氣。拆遷不是句點，而是文化在新座落與數位時空中「雙棲」的開始；一邊迎向未來的產業動能，一邊守住來處的靈魂。",
  ],
  sceneSelectionTitle: "選擇 3D 場景體驗",
  defaultScenes: [
    {
      id: "SceneA",
      name: "主入口場景",
      description: "體驗保生宮莊嚴肅穆的主入口，感受傳統建築的宏偉氣勢",
      image: "/img/Main_entrance.png",
      features: ["高解析度建模", "真實材質渲染", "互動式導覽"],
    },
    {
      id: "SceneB", 
      name: "內部殿堂場景",
      description: "深入保生宮內部殿堂，探索精心設計的空間佈局和神聖氛圍",
      image: "/img/Interior.png",
      features: ["室內光線模擬", "細節雕刻展示", "360度環視"],
    },
    {
      id: "SceneC",
      name: "屋頂景觀場景", 
      description: "從空中俯瞰保生宮的壯麗景觀，欣賞建築的整體美學設計",
      image: "/img/Rooftop_Drone.png",
      features: ["空拍視角", "建築全景", "環境氛圍"],
    },
  ]
};

// Scene filter function for temple scenes
export const baoshengSceneFilter = (scenes) => {
  return scenes.filter(scene => {
    const category = scene.category?.toLowerCase();
    return category === "baosheng" || category === "保生宮"
  });
};

// Custom styles for temple theme
export const baoshengStyles = {
  primaryColor: "#6B5B47",
  secondaryColor: "#8B7355",
  textColor: "#2F2F2F",
  cardHoverColor: "rgba(139, 115, 85, 0.1)",
}; 