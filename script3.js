// 献立データ定義
const menuData = {
  yearRound: [
    "カレーライス",
    "牛丼",
    "豚丼",
    "カツ丼",
    "炊き込みご飯",
    "親子丼",
    "中華丼",
    "海鮮丼",
    "三色丼",
    "チャーハン",
    "オムライス",
    "ハヤシライス",
    "キーマカレー",
    "ドライカレー",
    "焼きうどん",
    "スパゲッティ",
    "そば",
    "焼きそば",
    "ハンバーグ",
    "豚の生姜焼き",
    "鶏生姜蒸し",
    "唐揚げ",
    "鶏をオーロラソースで炒めたあれ",
    "焼き魚系",
    "麻婆豆腐",
    "青椒肉絲",
    "水餃子",
    "餃子",
    "酢豚",
    "春巻き・焼売あげたのとか",
    "湯豆腐",
    "クリームシチュー",
    "ビーフシチュー",
    "大根炊いたの",
    "豚キムチ",
  ],
  spring: ["筍ごはん"],
  summer: ["冷やし中華", "冷しゃぶ", "そうめん", "おろしそば"],
  autumn: [
    "栗ご飯",
    "秋刀魚の塩焼き",
    "きのこの炊き込みご飯",
    "さつまいもの味噌汁",
    "なめこの味噌汁",
  ],
  winter: [
    "煮込みラーメン",
    "おでん",
    "湯豆腐",
    "鍋",
    "豚汁",
    "肉じゃが",
    "肉豆腐",
    "もつ鍋",
    "グラタン",
  ],
  keepWarm: [
    "ハヤシライス",
    "カレーライス",
    "シチュー",
    "肉じゃが",
    "チャーハン",
    "オムライス",
    "三食丼",
    "豚丼",
  ],
  five: ["煮込みラーメン", "手巻き寿司", "すき焼き"],
  easyCook: ["焼きそば", "焼きうどん", "麻婆豆腐"],
};

// 季節ごとのメニュー
const getCurrentSeasonKey = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
};

// すべてのメニュー（年中メニュー + 季節のメニュー）
// 日本語 -> 英語の季節キー変換マップ
const seasonKeyMap = {
  春: "spring",
  夏: "summer",
  秋: "autumn",
  冬: "winter",
};

// メニュー一覧取得（年中 + 季節）
const yearRoundAndSeasonalMenus = [
  ...menuData.yearRound,
  ...(menuData[seasonKeyMap[getCurrentSeasonKey()]] || []),
];

// warmAndEasyMenus と allMenusList はそのまま利用する
const warmAndEasyMenus = Array.from(
  new Set([...menuData.keepWarm, ...menuData.easyCook])
);
const allMenusList = Array.from(
  new Set([
    ...yearRoundAndSeasonalMenus,
    ...menuData.keepWarm,
    ...menuData.easyCook,
  ])
);

// UI制御ヘルパー関数
function showSection(sectionIdToShow) {
  console.log(`showSection called for: ${sectionIdToShow}`);
  const sections = [
    "initialChoice",
    "conditionTypeChoice",
    "scheduleConditionChoice",
    "materialConditionChoice",
    "specifyIngredientsForm",
    "specifyDishForm",
  ];
  sections.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (id === sectionIdToShow) {
        element.classList.remove("hidden");
        console.log(`Showing: ${id}`);
      } else {
        element.classList.add("hidden");
      }
    } else {
      console.error(`Element with ID '${id}' not found in HTML.`);
    }
  });
}

function goBack(targetSectionId) {
  console.log(`goBack called for: ${targetSectionId}`);
  showSection(targetSectionId);
  displayResult("前の画面に戻りました。操作を選んでください。");
}

// 結果表示関数
function displayResult(message) {
  console.log(`displayResult called with message: "${message}"`);
  const resultElement = document.getElementById("resultText");
  if (resultElement) {
    resultElement.textContent = message;
  } else {
    console.error("Result display element with ID 'resultText' not found.");
  }
}

// 献立選択ロジック
function getRandomElement(array) {
  if (!array || array.length === 0) {
    console.warn("getRandomElement called with an empty or null array.");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// 初期選択処理
function handleInitialChoice(choice) {
  console.log(`handleInitialChoice called with: ${choice}`);
  if (choice === "random") {
    const randomMenu = getRandomElement(yearRoundAndSeasonalMenus);
    displayResult(`おすすめ献立: ${randomMenu}`);
  } else if (choice === "conditional") {
    showSection("conditionTypeChoice");
  } else {
    console.warn(`Unexpected choice: ${choice}`);
  }
}

// 予定または材料による選択
function handleConditionType(type) {
  console.log(`handleConditionType called with type: ${type}`);
  if (type === "schedule") {
    showSection("scheduleConditionChoice");
  } else if (type === "material") {
    showSection("materialConditionChoice");
  } else {
    console.warn(`Unexpected condition type: ${type}`);
  }
}

function handleMaterialReflectMethod(method) {
  console.log(`handleMaterialReflectMethod called with method: ${method}`);
  if (method === "specifyIngredients") {
    showSection("specifyIngredientsForm");
  } else if (method === "specifyDish") {
    showSection("specifyDishForm");
  } else {
    console.warn(`Unexpected material reflect method: ${method}`);
  }
}

// イベントリスナーの設定（DOMContentLoaded内で設定）
document.addEventListener("DOMContentLoaded", () => {
  const randomButton = document.getElementById("randomButton");
  const conditionalButton = document.getElementById("conditionalButton");

  if (randomButton) {
    randomButton.addEventListener("click", () => handleInitialChoice("random"));
  }
  if (conditionalButton) {
    conditionalButton.addEventListener("click", () =>
      handleInitialChoice("conditional")
    );
  }

  // 初期状態で季節表示
  const seasonDisplay = document.getElementById("seasonDisplay");
  if (seasonDisplay) {
    seasonDisplay.textContent = `現在の季節：${getCurrentSeasonKey()}`;
  }

  // 初期選択画面の表示
  showSection("initialChoice");
});

// 予定条件による選択
function selectBySchedule(scheduleType) {
  let result = "";
  if (scheduleType === "allTogether") {
    const menu = getRandomElement(menuData.five);
    result = `全員揃う日のおすすめ献立：${menu}`;
  } else if (scheduleType === "differentTimes") {
    const menu = getRandomElement(menuData.keepWarm);
    result = `帰宅バラバラな日のおすすめ献立：${menu}`;
  } else if (scheduleType === "nightPractice") {
    const combined = [...menuData.keepWarm, ...menuData.easyCook];
    const unique = Array.from(new Set(combined));
    const menu = getRandomElement(unique);
    result = `夜練がある日のおすすめ献立：${menu}`;
  } else {
    result = "不明なスケジュールタイプです。";
  }
  displayResult(result);
}

// 材料指定によるAI提案（ChatGPTリンクへ遷移）
function suggestByIngredients() {
  const ingredients = document.getElementById("ingredientsInput").value.trim();
  if (!ingredients) {
    displayResult("材料を入力してください。");
    return;
  }

  const prompt = `以下の材料を使った夕食の献立を考えてください：${ingredients}`;
  const chatUrl = `https://chat.openai.com/?prompt=${encodeURIComponent(
    prompt
  )}`;

  window.open(chatUrl, "_blank"); // 新しいタブでChatGPTを開く
  displayResult("ChatGPTに移動して提案を取得します。");
}

// 一品指定によるAI提案（ChatGPTリンクへ遷移）
function suggestByDish() {
  const dish = document.getElementById("dishInput").value.trim();
  if (!dish) {
    displayResult("一品名を入力してください。");
    return;
  }

  const prompt = `以下の料理に合う献立を考えてください：${dish}`;
  const chatUrl = `https://chat.openai.com/?prompt=${encodeURIComponent(
    prompt
  )}`;

  window.open(chatUrl, "_blank");
  displayResult("ChatGPTに移動して提案を取得します。");
}
