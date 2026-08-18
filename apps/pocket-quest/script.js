/* ========================================
   Pocket Quest
   Kotodama Apps
======================================== */

const STORAGE_KEY = "pocketQuestCustomQuests";

// ========================================
// クエスト作成用
// ========================================

function createQuest(text, icon, minutes, place, energy) {
  return {
    text,
    icon,
    minutes,
    places: [place],
    energies: [energy],
    isCustom: false
  };
}

const q = createQuest;

// ========================================
// 最初から入っているクエスト
// 全108種類
// ========================================

const defaultQuests = [
  // =====================================
  // 自宅・元気少なめ
  // =====================================

  q("コップ1杯の水をゆっくり飲もう。", "💧", 5, "home", "low"),
  q("目を閉じて深呼吸を5回しよう。", "🍃", 5, "home", "low"),
  q("枕やクッションの位置を整えよう。", "🛏️", 5, "home", "low"),

  q("好きな曲を1曲だけ聴こう。", "🎧", 10, "home", "low"),
  q("スマホの不要な写真を10枚だけ消そう。", "📱", 10, "home", "low"),
  q("明日やることを1つだけメモしよう。", "📝", 10, "home", "low"),

  q("温かい飲み物を用意してゆっくり休もう。", "☕", 30, "home", "low"),
  q("照明を少し落として静かな時間を過ごそう。", "🌙", 30, "home", "low"),
  q("好きな動画を1本だけ見て休憩しよう。", "📺", 30, "home", "low"),

  q("布団やソファで体をしっかり休ませよう。", "🛋️", 60, "home", "low"),
  q("音楽を流しながら何もしない時間を楽しもう。", "🎵", 60, "home", "low"),
  q("スマホから離れてゆっくり過ごそう。", "🌿", 60, "home", "low"),

  // =====================================
  // 自宅・元気普通
  // =====================================

  q("床に落ちている物を5つだけ戻そう。", "🧺", 5, "home", "normal"),
  q("冷蔵庫の期限が近い物を1つ確認しよう。", "🥕", 5, "home", "normal"),
  q("今日よかったことを1つだけ書こう。", "✏️", 5, "home", "normal"),

  q("洗面台をサッと拭こう。", "✨", 10, "home", "normal"),
  q("財布の不要なレシートを整理しよう。", "👛", 10, "home", "normal"),
  q("使っていないアプリを1つ削除しよう。", "📲", 10, "home", "normal"),

  q("部屋の一角だけ片づけよう。", "🧹", 30, "home", "normal"),
  q("気になっていた記事を1つ読もう。", "📖", 30, "home", "normal"),
  q("普段触らない場所を1か所掃除しよう。", "🧽", 30, "home", "normal"),

  q("読みかけの本をゆっくり読もう。", "📚", 60, "home", "normal"),
  q("翌日が楽になるように作り置きをしよう。", "🍳", 60, "home", "normal"),
  q("部屋の配置を少しだけ見直してみよう。", "🏠", 60, "home", "normal"),

  // =====================================
  // 自宅・元気あり
  // =====================================

  q("スクワットを10回しよう。", "🔥", 5, "home", "high"),
  q("窓を開けて部屋の空気を入れ替えよう。", "🌬️", 5, "home", "high"),
  q("音楽をかけて体を軽く動かそう。", "🎶", 5, "home", "high"),

  q("腕立て伏せにできる回数だけ挑戦しよう。", "💪", 10, "home", "high"),
  q("机の上を一気に片づけよう。", "⚡", 10, "home", "high"),
  q("全身をゆっくりストレッチしよう。", "🤸", 10, "home", "high"),

  q("家の周りを軽く散歩しよう。", "👟", 30, "home", "high"),
  q("後回しにしていた家事を1つ終わらせよう。", "⚔️", 30, "home", "high"),
  q("不要な物を5つ選んで整理しよう。", "📦", 30, "home", "high"),

  q("部屋をいつもより丁寧に掃除しよう。", "🧹", 60, "home", "high"),
  q("興味のあることを集中して学ぼう。", "📘", 60, "home", "high"),
  q("少し手の込んだ料理を作ってみよう。", "🍲", 60, "home", "high"),

  // =====================================
  // 外出先・元気少なめ
  // =====================================

  q("空を見上げて雲の形を1つ探そう。", "☁️", 5, "outside", "low"),
  q("近くにある緑を1つ見つけよう。", "🌿", 5, "outside", "low"),
  q("ベンチや静かな場所で休もう。", "🪑", 5, "outside", "low"),

  q("飲み物を買ってゆっくり水分補給しよう。", "🥤", 10, "outside", "low"),
  q("スマホをしまって周りの音を聞こう。", "🐦", 10, "outside", "low"),
  q("目に入った景色をぼんやり眺めよう。", "🌄", 10, "outside", "low"),

  q("静かなカフェや休憩場所を探そう。", "☕", 30, "outside", "low"),
  q("日陰のある場所でのんびり過ごそう。", "🌳", 30, "outside", "low"),
  q("好きな音楽を聴きながら休憩しよう。", "🎧", 30, "outside", "low"),

  q("落ち着ける場所でしっかり体を休めよう。", "🍂", 60, "outside", "low"),
  q("景色のよい場所を探してのんびりしよう。", "🏞️", 60, "outside", "low"),
  q("近くの図書館や静かな施設で過ごそう。", "📚", 60, "outside", "low"),

  // =====================================
  // 外出先・元気普通
  // =====================================

  q("気になった景色を1枚だけ撮影しよう。", "📷", 5, "outside", "normal"),
  q("近くで季節を感じられる物を探そう。", "🍁", 5, "outside", "normal"),
  q("現在地の周辺を地図で確認してみよう。", "🗺️", 5, "outside", "normal"),

  q("いつも通らない道を少し歩いてみよう。", "🧭", 10, "outside", "normal"),
  q("近くにある小さなお店を探そう。", "🏮", 10, "outside", "normal"),
  q("気になる看板や建物を1つ見つけよう。", "🏡", 10, "outside", "normal"),

  q("目的地まで少しだけ遠回りしよう。", "🚶", 30, "outside", "normal"),
  q("近くの公園をゆっくり散歩しよう。", "🌲", 30, "outside", "normal"),
  q("入ったことのないお店をのぞいてみよう。", "🛍️", 30, "outside", "normal"),

  q("行ったことのない場所を1つ訪ねよう。", "🧭", 60, "outside", "normal"),
  q("近くの観光スポットを1つ探検しよう。", "🏯", 60, "outside", "normal"),
  q("知らない街をのんびり歩いてみよう。", "🚉", 60, "outside", "normal"),

  // =====================================
  // 外出先・元気あり
  // =====================================

  q("次の角まで少し速歩きしよう。", "🥾", 5, "outside", "high"),
  q("階段を見つけたら歩いて登ろう。", "⛰️", 5, "outside", "high"),
  q("背筋を伸ばして大きな歩幅で歩こう。", "🚶", 5, "outside", "high"),

  q("行ったことのない道へ入ってみよう。", "🗺️", 10, "outside", "high"),
  q("少し離れた店まで歩いてみよう。", "👟", 10, "outside", "high"),
  q("景色のよい場所まで足を伸ばそう。", "🌄", 10, "outside", "high"),

  q("知らない道を30分だけ冒険しよう。", "🧭", 30, "outside", "high"),
  q("近くの公園まで歩いて体を動かそう。", "🏃", 30, "outside", "high"),
  q("坂道や階段のあるコースを歩こう。", "⛰️", 30, "outside", "high"),

  q("知らない駅や街を探索しよう。", "🚉", 60, "outside", "high"),
  q("少し遠い目的地まで歩いてみよう。", "🏕️", 60, "outside", "high"),
  q("自然の多い場所まで足を伸ばそう。", "🌲", 60, "outside", "high"),

  // =====================================
  // 職場・学校・元気少なめ
  // =====================================

  q("机の不要な物を1つだけ片づけよう。", "🗃️", 5, "work", "low"),
  q("肩を回してゆっくり深呼吸しよう。", "🌬️", 5, "work", "low"),
  q("次にやることを1つだけメモしよう。", "📌", 5, "work", "low"),

  q("温かい飲み物を飲んで休憩しよう。", "🍵", 10, "work", "low"),
  q("遠くを眺めて目を休めよう。", "🌄", 10, "work", "low"),
  q("席を離れて少しだけ歩こう。", "🚶", 10, "work", "low"),

  q("静かな場所で頭を休ませよう。", "🍂", 30, "work", "low"),
  q("音楽を聴きながらゆっくり休もう。", "🎧", 30, "work", "low"),
  q("疲れていることをメモして頭から出そう。", "📝", 30, "work", "low"),

  q("無理に作業を増やさずゆっくり休憩しよう。", "🪑", 60, "work", "low"),
  q("簡単な作業だけを選んでゆっくり進めよう。", "🐢", 60, "work", "low"),
  q("今後の予定を無理のない範囲で整理しよう。", "📅", 60, "work", "low"),

  // =====================================
  // 職場・学校・元気普通
  // =====================================

  q("未読メールを3件だけ確認しよう。", "✉️", 5, "work", "normal"),
  q("デスクトップのファイルを3つ整理しよう。", "💻", 5, "work", "normal"),
  q("今日終わらせたいことを1つ決めよう。", "🎯", 5, "work", "normal"),

  q("メモや書類を10分だけ整理しよう。", "📂", 10, "work", "normal"),
  q("短い返信を1件だけ返そう。", "💬", 10, "work", "normal"),
  q("不要なファイルを5つだけ削除しよう。", "🗑️", 10, "work", "normal"),

  q("今取り組んでいる内容を整理しよう。", "🧩", 30, "work", "normal"),
  q("気になっていた資料を1つ読もう。", "📑", 30, "work", "normal"),
  q("今週の予定を確認して整理しよう。", "📅", 30, "work", "normal"),

  q("今後役立ちそうな知識を学ぼう。", "📘", 60, "work", "normal"),
  q("作業手順を分かりやすくまとめよう。", "📜", 60, "work", "normal"),
  q("たまっている小さな作業を順番に片づけよう。", "🧹", 60, "work", "normal"),

  // =====================================
  // 職場・学校・元気あり
  // =====================================

  q("一番面倒な小さな作業を1つ終わらせよう。", "⚡", 5, "work", "high"),
  q("今の作業のゴールを決めよう。", "🏁", 5, "work", "high"),
  q("最優先の作業を1つ選ぼう。", "🎯", 5, "work", "high"),

  q("10分間だけ集中して作業しよう。", "🔥", 10, "work", "high"),
  q("誰かが困っていないか確認しよう。", "🤝", 10, "work", "high"),
  q("後回しにしていた連絡を1件済ませよう。", "📨", 10, "work", "high"),

  q("後回しにしていた作業を進めよう。", "🛠️", 30, "work", "high"),
  q("集中できる環境を整えよう。", "🛡️", 30, "work", "high"),
  q("難しい作業に30分だけ挑戦しよう。", "⚔️", 30, "work", "high"),

  q("重要な作業を集中して進めよう。", "🏆", 60, "work", "high"),
  q("次の自分が迷わないように作業記録をまとめよう。", "📜", 60, "work", "high"),
  q("新しい知識や技術を集中して学ぼう。", "🚀", 60, "work", "high")
];
// ========================================
// 場所や元気を問わない共通クエスト
// ========================================

function createUniversalQuest(text, icon, minutes) {
  return {
    text,
    icon,
    minutes,
    places: ["home", "outside", "work"],
    energies: ["low", "normal", "high"],
    isCustom: false
  };
}

const universalQuests = [
  // 5分クエスト
  createUniversalQuest(
    "水やお茶をゆっくり飲もう。",
    "💧",
    5
  ),
  createUniversalQuest(
    "深呼吸を5回して肩の力を抜こう。",
    "🍃",
    5
  ),
  createUniversalQuest(
    "スマホの不要な通知を3件消そう。",
    "📱",
    5
  ),
  createUniversalQuest(
    "今日よかったことを1つ思い出そう。",
    "🌟",
    5
  ),
  createUniversalQuest(
    "首と肩をゆっくり回そう。",
    "🧘",
    5
  ),
  createUniversalQuest(
    "次にやることを1つだけ決めよう。",
    "🎯",
    5
  ),
  createUniversalQuest(
    "目を閉じて1分間だけ休もう。",
    "🌙",
    5
  ),
  createUniversalQuest(
    "スマホの不要な写真を5枚消そう。",
    "📷",
    5
  ),
  createUniversalQuest(
    "今日の日付と気分をメモしよう。",
    "✏️",
    5
  ),
  createUniversalQuest(
    "背筋を伸ばして姿勢を整えよう。",
    "🌱",
    5
  ),
  createUniversalQuest(
    "最近連絡していない人を1人思い出そう。",
    "💭",
    5
  ),
  createUniversalQuest(
    "今気になっていることを1つ書き出そう。",
    "📝",
    5
  ),
  createUniversalQuest(
    "スマホのホーム画面を少し整理しよう。",
    "📲",
    5
  ),
  createUniversalQuest(
    "周囲にある好きな色を3つ探そう。",
    "🎨",
    5
  ),
  createUniversalQuest(
    "今日一番大事なことを確認しよう。",
    "🧭",
    5
  ),
  createUniversalQuest(
    "遠くを見て目を休ませよう。",
    "🌄",
    5
  ),
  createUniversalQuest(
    "今の自分を褒められることを1つ探そう。",
    "🏅",
    5
  ),
  createUniversalQuest(
    "不要なブラウザのタブを3つ閉じよう。",
    "🖥️",
    5
  ),
  createUniversalQuest(
    "手を洗って気分を切り替えよう。",
    "🫧",
    5
  ),
  createUniversalQuest(
    "明日の自分へ短いメモを残そう。",
    "📜",
    5
  ),

  // 10分クエスト
  createUniversalQuest(
    "気になっていた記事を1つ読もう。",
    "📰",
    10
  ),
  createUniversalQuest(
    "写真フォルダを10分だけ整理しよう。",
    "🖼️",
    10
  ),
  createUniversalQuest(
    "好きな音楽を2曲だけ聴こう。",
    "🎧",
    10
  ),
  createUniversalQuest(
    "今日の予定を見直そう。",
    "📅",
    10
  ),
  createUniversalQuest(
    "短いストレッチをしよう。",
    "🤸",
    10
  ),
  createUniversalQuest(
    "気になっていたことを1つ調べよう。",
    "🔍",
    10
  ),
  createUniversalQuest(
    "英単語を3つだけ覚えよう。",
    "🔤",
    10
  ),
  createUniversalQuest(
    "メモ帳の不要なメモを整理しよう。",
    "📓",
    10
  ),
  createUniversalQuest(
    "これから楽しみなことを3つ書こう。",
    "✨",
    10
  ),
  createUniversalQuest(
    "誰かに感謝のメッセージを送ろう。",
    "💌",
    10
  ),
  createUniversalQuest(
    "今月やりたいことを1つ決めよう。",
    "🏁",
    10
  ),
  createUniversalQuest(
    "スマホを置いて静かに休憩しよう。",
    "🍵",
    10
  ),
  createUniversalQuest(
    "最近の出費を1つ確認しよう。",
    "🪙",
    10
  ),
  createUniversalQuest(
    "今日覚えたことを1つメモしよう。",
    "💡",
    10
  ),
  createUniversalQuest(
    "次の休日にしたいことを考えよう。",
    "🏕️",
    10
  ),

  // 30分クエスト
  createUniversalQuest(
    "読みかけの本や漫画を読み進めよう。",
    "📚",
    30
  ),
  createUniversalQuest(
    "興味のある動画を1本だけ見よう。",
    "🎬",
    30
  ),
  createUniversalQuest(
    "今後やってみたいことを5つ書こう。",
    "🗺️",
    30
  ),
  createUniversalQuest(
    "スマホのデータを整理しよう。",
    "📱",
    30
  ),
  createUniversalQuest(
    "新しい知識を1つ学ぼう。",
    "🧠",
    30
  ),
  createUniversalQuest(
    "最近の生活をゆっくり振り返ろう。",
    "🪞",
    30
  ),
  createUniversalQuest(
    "好きな音楽を聴きながら休もう。",
    "🎵",
    30
  ),
  createUniversalQuest(
    "今月の目標を見直そう。",
    "🎯",
    30
  ),
  createUniversalQuest(
    "行ってみたい場所を3つ探そう。",
    "🧭",
    30
  ),
  createUniversalQuest(
    "気になっていた小さな用事を片づけよう。",
    "⚔️",
    30
  ),

  // 60分クエスト
  createUniversalQuest(
    "興味のある分野を集中して学ぼう。",
    "📘",
    60
  ),
  createUniversalQuest(
    "今後の予定や目標を整理しよう。",
    "🗓️",
    60
  ),
  createUniversalQuest(
    "読みたかった本をゆっくり読もう。",
    "📖",
    60
  ),
  createUniversalQuest(
    "新しい趣味について調べてみよう。",
    "🔭",
    60
  ),
  createUniversalQuest(
    "自分の成長を振り返って記録しよう。",
    "🌳",
    60
  ),
  createUniversalQuest(
    "後回しにしていた作業に挑戦しよう。",
    "🛠️",
    60
  ),
  createUniversalQuest(
    "これから作りたいものを考えよう。",
    "💡",
    60
  ),
  createUniversalQuest(
    "スマホやパソコンの中を整理しよう。",
    "💻",
    60
  )
];

defaultQuests.push(...universalQuests);

// ========================================
// HTML要素
// ========================================

const timeChoices = document.getElementById("timeChoices");
const placeChoices = document.getElementById("placeChoices");
const energyChoices = document.getElementById("energyChoices");

const findQuestButton = document.getElementById("findQuestButton");
const retryButton = document.getElementById("retryButton");
const completeButton = document.getElementById("completeButton");

const questResult = document.getElementById("questResult");
const questIcon = document.getElementById("questIcon");
const questText = document.getElementById("questText");
const questInfo = document.getElementById("questInfo");

const resultActions = document.getElementById("resultActions");
const completeMessage = document.getElementById("completeMessage");

const customQuestForm = document.getElementById("customQuestForm");
const customQuestText = document.getElementById("customQuestText");
const customQuestTime = document.getElementById("customQuestTime");
const customQuestPlace = document.getElementById("customQuestPlace");
const customQuestEnergy = document.getElementById("customQuestEnergy");
const customQuestMessage =
  document.getElementById("customQuestMessage");
const customQuestList = document.getElementById("customQuestList");
const customQuestCount =
  document.getElementById("customQuestCount");

// 最近表示したクエストを記録
let recentQuestTexts = [];

// 自分で登録したクエスト
let customQuests = loadCustomQuests();

// ========================================
// 選択ボタン
// ========================================

function setupChoiceButtons(choiceContainer) {
  const buttons =
    choiceContainer.querySelectorAll(".choice-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");
      completeMessage.hidden = true;
    });
  });
}

setupChoiceButtons(timeChoices);
setupChoiceButtons(placeChoices);
setupChoiceButtons(energyChoices);

// ========================================
// 選択中の値
// ========================================

function getSelectedValue(choiceContainer) {
  const selectedButton =
    choiceContainer.querySelector(".choice-button.selected");

  return selectedButton.dataset.value;
}

// ========================================
// 保存データの読み込み
// ========================================

function loadCustomQuests() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData;
  } catch (error) {
    console.error("クエストを読み込めませんでした。", error);
    return [];
  }
}

// ========================================
// 保存
// ========================================

function saveCustomQuests() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(customQuests)
    );
  } catch (error) {
    console.error("クエストを保存できませんでした。", error);
  }
}

// ========================================
// ID作成
// ========================================

function createQuestId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

// ========================================
// 自分のクエストを登録
// ========================================

function addCustomQuest(event) {
  event.preventDefault();

  const text = customQuestText.value.trim();

  if (!text) {
    showCustomMessage(
      "クエスト内容を入力してください。",
      true
    );

    return;
  }

  const selectedPlace = customQuestPlace.value;
  const selectedEnergy = customQuestEnergy.value;

  const places =
    selectedPlace === "anywhere"
      ? ["home", "outside", "work"]
      : [selectedPlace];

  const energies =
    selectedEnergy === "any"
      ? ["low", "normal", "high"]
      : [selectedEnergy];

  const newQuest = {
    id: createQuestId(),
    text,
    icon: "📜",
    minutes: Number(customQuestTime.value),
    places,
    energies,
    savedPlace: selectedPlace,
    savedEnergy: selectedEnergy,
    isCustom: true
  };

  customQuests.unshift(newQuest);

  saveCustomQuests();
  renderCustomQuests();

  customQuestForm.reset();
  customQuestTime.value = "10";
  customQuestEnergy.value = "normal";

  showCustomMessage(
    "新しいクエストを登録しました！",
    false
  );
}

// ========================================
// 登録メッセージ
// ========================================

function showCustomMessage(message, isError) {
  customQuestMessage.textContent = message;
  customQuestMessage.classList.toggle(
    "is-error",
    isError
  );

  window.setTimeout(() => {
    if (customQuestMessage.textContent === message) {
      customQuestMessage.textContent = "";
      customQuestMessage.classList.remove("is-error");
    }
  }, 3000);
}

// ========================================
// 自分のクエスト一覧
// ========================================

function renderCustomQuests() {
  customQuestList.innerHTML = "";
  customQuestCount.textContent =
    `${customQuests.length}件`;

  if (customQuests.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-quest-message";
    emptyMessage.textContent =
      "まだ自分のクエストは登録されていません。";

    customQuestList.appendChild(emptyMessage);

    return;
  }

  customQuests.forEach((quest) => {
    const item = document.createElement("div");
    item.className = "custom-quest-item";

    const icon = document.createElement("div");
    icon.className = "custom-quest-item-icon";
    icon.textContent = quest.icon;

    const content = document.createElement("div");
    content.className = "custom-quest-item-content";

    const text = document.createElement("p");
    text.className = "custom-quest-item-text";
    text.textContent = quest.text;

    const conditions = document.createElement("p");
    conditions.className =
      "custom-quest-item-conditions";
    conditions.textContent =
      createConditionsText(quest);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-quest-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute(
      "aria-label",
      `${quest.text}を削除`
    );

    deleteButton.addEventListener("click", () => {
      deleteCustomQuest(quest.id);
    });

    content.appendChild(text);
    content.appendChild(conditions);

    item.appendChild(icon);
    item.appendChild(content);
    item.appendChild(deleteButton);

    customQuestList.appendChild(item);
  });
}

// ========================================
// 条件を日本語で表示
// ========================================

function createConditionsText(quest) {
  const placeNames = {
    home: "自宅",
    outside: "外出先",
    work: "職場・学校",
    anywhere: "どこでも"
  };

  const energyNames = {
    low: "元気少なめ",
    normal: "元気普通",
    high: "元気あり",
    any: "どの元気でも"
  };

  const place =
    quest.savedPlace ||
    getSavedPlaceFromArray(quest.places);

  const energy =
    quest.savedEnergy ||
    getSavedEnergyFromArray(quest.energies);

  return `${quest.minutes}分・${placeNames[place]}・${energyNames[energy]}`;
}

function getSavedPlaceFromArray(places) {
  if (places.length === 3) {
    return "anywhere";
  }

  return places[0];
}

function getSavedEnergyFromArray(energies) {
  if (energies.length === 3) {
    return "any";
  }

  return energies[0];
}

// ========================================
// 自分のクエストを削除
// ========================================

function deleteCustomQuest(questId) {
  const targetQuest = customQuests.find((quest) => {
    return quest.id === questId;
  });

  if (!targetQuest) {
    return;
  }

  const shouldDelete = window.confirm(
    `「${targetQuest.text}」を削除しますか？`
  );

  if (!shouldDelete) {
    return;
  }

  customQuests = customQuests.filter((quest) => {
    return quest.id !== questId;
  });

  saveCustomQuests();
  renderCustomQuests();

  showCustomMessage(
    "クエストを削除しました。",
    false
  );
}

// ========================================
// 条件に合うクエスト
// ========================================

function getMatchingQuests() {
  const selectedTime =
    Number(getSelectedValue(timeChoices));
  const selectedPlace =
    getSelectedValue(placeChoices);
  const selectedEnergy =
    getSelectedValue(energyChoices);

  const allQuests = [
    ...defaultQuests,
    ...customQuests
  ];

  return allQuests.filter((quest) => {
    const fitsTime =
      quest.minutes <= selectedTime;

    const fitsPlace =
      quest.places.includes(selectedPlace);

    const fitsEnergy =
      quest.energies.includes(selectedEnergy);

    return fitsTime && fitsPlace && fitsEnergy;
  });
}

// ========================================
// ランダムに決定
// ========================================

function chooseRandomQuest(matchingQuests) {
  const questsNotRecentlyShown =
    matchingQuests.filter((quest) => {
      return !recentQuestTexts.includes(quest.text);
    });

  const availableQuests =
    questsNotRecentlyShown.length > 0
      ? questsNotRecentlyShown
      : matchingQuests;

  const randomIndex = Math.floor(
    Math.random() * availableQuests.length
  );

  const selectedQuest =
    availableQuests[randomIndex];

  recentQuestTexts.push(selectedQuest.text);

  if (recentQuestTexts.length > 5) {
    recentQuestTexts.shift();
  }

  return selectedQuest;
}

// ========================================
// クエスト表示
// ========================================

function showQuest() {
  const matchingQuests = getMatchingQuests();

  if (matchingQuests.length === 0) {
    questIcon.textContent = "🍂";
    questText.textContent =
      "今の条件に合うクエストが見つかりませんでした。";
    questInfo.textContent =
      "別の条件を選ぶか、自分のクエストを登録してください。";

    resultActions.hidden = true;

    restartQuestAnimation();
    scrollToQuest();

    return;
  }

  const selectedQuest =
    chooseRandomQuest(matchingQuests);

  questIcon.textContent = selectedQuest.icon;
  questText.textContent = selectedQuest.text;

  const sourceText =
    selectedQuest.isCustom
      ? "・自分のクエスト"
      : "";

  questInfo.textContent =
    `目安時間：約${selectedQuest.minutes}分${sourceText}`;

  resultActions.hidden = false;
  completeMessage.hidden = true;

  restartQuestAnimation();
  scrollToQuest();
}

// ========================================
// 掲示板アニメーション
// ========================================

function restartQuestAnimation() {
  questResult.classList.remove("is-revealing");

  void questResult.offsetWidth;

  questResult.classList.add("is-revealing");
}

// ========================================
// 掲示板まで移動
// ========================================

function scrollToQuest() {
  window.setTimeout(() => {
    questResult.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 150);
}

// ========================================
// クエスト完了
// ========================================

function completeQuest() {
  completeMessage.hidden = false;
  resultActions.hidden = true;

  completeMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// ========================================
// イベント
// ========================================

findQuestButton.addEventListener("click", showQuest);
retryButton.addEventListener("click", showQuest);
completeButton.addEventListener("click", completeQuest);
customQuestForm.addEventListener("submit", addCustomQuest);

// ========================================
// 最初の表示
// ========================================

renderCustomQuests();