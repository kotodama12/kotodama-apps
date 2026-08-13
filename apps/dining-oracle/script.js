const realisticStyles = document.createElement("link");
realisticStyles.rel = "stylesheet";
realisticStyles.href = "realistic.css";
document.head.appendChild(realisticStyles);
const compactStyles = document.createElement("link");
compactStyles.rel = "stylesheet";
compactStyles.href = "compact.css";
document.head.appendChild(compactStyles);
const effectStyles = document.createElement("link");
effectStyles.rel = "stylesheet";
effectStyles.href = "effects.css";
document.head.appendChild(effectStyles);
const kitchenStyles = document.createElement("link");
kitchenStyles.rel = "stylesheet";
kitchenStyles.href = "kitchen.css";
document.head.appendChild(kitchenStyles);
const fireStyles = document.createElement("link");
fireStyles.rel = "stylesheet";
fireStyles.href = "fire.css";
document.head.appendChild(fireStyles);
const fireV2Styles = document.createElement("link");
fireV2Styles.rel = "stylesheet";
fireV2Styles.href = "fire-v2.css";
document.head.appendChild(fireV2Styles);
const fireV3Styles = document.createElement("link");
fireV3Styles.rel = "stylesheet";
fireV3Styles.href = "fire-v3.css";
document.head.appendChild(fireV3Styles);

const RESTAURANT_CATEGORIES = [
  "寿司・回転寿司", "海鮮・刺身", "蕎麦", "うどん",
  "天ぷら", "うなぎ", "とんかつ", "丼もの",
  "焼き鳥", "しゃぶしゃぶ・すき焼き", "おでん", "定食・食堂",
  "ラーメン", "焼肉", "ステーキ", "ハンバーグ",
  "オムライス・洋食", "カレー", "パスタ", "ピザ",
  "グラタン・ドリア", "ハンバーガー", "中華料理", "餃子・点心",
  "韓国料理", "インド・ネパール料理", "タイ料理", "ベトナム料理",
  "お好み焼き・もんじゃ", "串カツ", "ファミレス", "ビュッフェ"
];

const categoryGrid = document.getElementById("categoryGrid");
const customCategoryForm = document.getElementById("customCategoryForm");
const customCategoryInput = document.getElementById("customCategoryInput");
const customCategoryMessage = document.getElementById("customCategoryMessage");
const selectionCount = document.getElementById("selectionCount");
const toggleAllButton = document.getElementById("toggleAll");
const drawButton = document.getElementById("drawButton");
const mapButton = document.getElementById("mapButton");
const retryButton = document.getElementById("retryButton");
const festivalMap = document.getElementById("festivalMap");
const resultText = document.getElementById("resultText");
const resultHint = document.getElementById("resultHint");
const stalls = document.getElementById("stalls");
const CUSTOM_STORAGE_KEY = "nightMarketCustomCategories";
const EFFECT_STORAGE_KEY = "restaurantGachaEffect";
let customCategories = loadCustomCategories();

function setupEffectSwitcher() {
  const drawSection = document.querySelector(".draw-section");
  const title = drawSection.querySelector(".draw-title");
  const switcher = document.createElement("div");
  switcher.className = "effect-switcher";
  switcher.innerHTML = `<button type="button" data-effect="stalls">🏮 夏祭りの屋台</button><button type="button" data-effect="pot">✦ 魔法の鍋</button>`;
  title.after(switcher);

  const potScene = document.createElement("div");
  potScene.className = "pot-scene";
  potScene.id = "potScene";
  potScene.innerHTML = `<div class="pot-moon"></div><div class="pot-vines"></div><div class="pot-fireflies"><i></i><i></i><i></i><i></i><i></i></div><div class="pot-result" aria-live="assertive"><small>THE CAULDRON SAYS...</small><strong id="potResultText">？？？</strong><span id="potResultHint">鍋に聞いてみよう</span></div><button class="magic-pot" id="magicPot" type="button"><i class="pot-spoon"></i><i class="pot-rim"></i><i class="pot-brew"></i><i class="pot-body">✦</i><i class="pot-fire"></i><i class="fire-smoke"><b></b><b></b><b></b></i><span>鍋をタッチ</span></button></div>`;
  festivalMap.after(potScene);

  const savedEffect = localStorage.getItem(EFFECT_STORAGE_KEY) === "pot" ? "pot" : "stalls";
  setEffect(savedEffect);
  switcher.addEventListener("click", event => {
    const button = event.target.closest("button[data-effect]");
    if (button) setEffect(button.dataset.effect);
  });
  document.getElementById("magicPot").addEventListener("click", drawRestaurant);
}

function setEffect(effect) {
  document.body.dataset.effect = effect;
  localStorage.setItem(EFFECT_STORAGE_KEY, effect);
  document.querySelectorAll(".effect-switcher button").forEach(button => button.classList.toggle("active", button.dataset.effect === effect));
  const drawHeading = document.querySelector(".draw-title h2");
  const drawGuide = document.querySelector(".draw-title > p");
  if (effect === "pot") {
    drawHeading.textContent = "鍋をかき混ぜる";
    drawGuide.textContent = "鍋またはボタンをタップ";
    drawButton.textContent = "✦ 魔法の鍋をかき混ぜる";
  } else {
    drawHeading.textContent = "明かりを灯す";
    drawGuide.textContent = "屋台またはボタンをタップ";
    drawButton.textContent = "屋台の明かりを灯す";
  }
}

function loadCustomCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(item => typeof item === "string") : [];
  } catch (error) {
    return [];
  }
}

function saveCustomCategories() {
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customCategories));
}

function renderCategories(selectedValues = null) {
  const isChecked = category => selectedValues === null || selectedValues.has(category) ? "checked" : "";
  const defaultChips = RESTAURANT_CATEGORIES.map((category, index) => `
    <div class="category-chip">
      <input type="checkbox" id="category-${index}" value="${category}" ${isChecked(category)}>
      <label for="category-${index}">${category}</label>
    </div>
  `).join("");
  const customChips = customCategories.map((category, index) => `
    <div class="category-chip custom">
      <input type="checkbox" id="custom-category-${index}" value="${escapeHtml(category)}" ${isChecked(category)}>
      <label for="custom-category-${index}">${escapeHtml(category)}</label>
      <button class="delete-category" type="button" data-custom-index="${index}" aria-label="${escapeHtml(category)}を削除">×</button>
    </div>
  `).join("");
  categoryGrid.innerHTML = defaultChips + customChips;
  updateSelectionCount();
}

function escapeHtml(text) {
  const element = document.createElement("span");
  element.textContent = text;
  return element.innerHTML;
}

function getSelectedCategories() {
  return [...categoryGrid.querySelectorAll("input:checked")].map(input => input.value);
}

function updateSelectionCount() {
  const selected = getSelectedCategories().length;
  const total = RESTAURANT_CATEGORIES.length + customCategories.length;
  selectionCount.textContent = `${selected} / ${total} ジャンルを候補に設定中`;
  toggleAllButton.textContent = selected === total ? "すべて外す" : "すべて選ぶ";
  drawButton.disabled = selected === 0;
  mapButton.disabled = selected === 0;
  const magicPot = document.getElementById("magicPot");
  if (magicPot) magicPot.disabled = selected === 0;
  drawButton.textContent = selected === 0 ? "候補を1つ以上選んでください" : document.body.dataset.effect === "pot" ? "✦ 魔法の鍋をかき混ぜる" : "屋台の明かりを灯す";
  if (!festivalMap.classList.contains("drawing") && !festivalMap.classList.contains("revealed")) {
    renderStalls(getSelectedCategories());
  }
}

function toggleAll() {
  const total = RESTAURANT_CATEGORIES.length + customCategories.length;
  const shouldSelect = getSelectedCategories().length !== total;
  categoryGrid.querySelectorAll("input").forEach(input => { input.checked = shouldSelect; });
  updateSelectionCount();
}

function addCustomCategory(event) {
  event.preventDefault();
  const category = customCategoryInput.value.trim().replace(/\s+/g, " ");
  const allCategories = [...RESTAURANT_CATEGORIES, ...customCategories];

  if (!category) {
    customCategoryMessage.textContent = "追加する候補を入力してください。";
    customCategoryInput.focus();
    return;
  }
  if (allCategories.some(item => item.toLowerCase() === category.toLowerCase())) {
    customCategoryMessage.textContent = "その候補はすでに登録されています。";
    customCategoryInput.select();
    return;
  }

  const selectedValues = new Set(getSelectedCategories());
  selectedValues.add(category);
  customCategories.push(category);
  saveCustomCategories();
  renderCategories(selectedValues);
  customCategoryInput.value = "";
  customCategoryMessage.textContent = `「${category}」を候補に追加しました。`;
  customCategoryInput.focus();
}

function handleCategoryGridClick(event) {
  const deleteButton = event.target.closest(".delete-category");
  if (!deleteButton) return;
  const index = Number(deleteButton.dataset.customIndex);
  const deletedCategory = customCategories[index];
  const selectedValues = new Set(getSelectedCategories());
  customCategories.splice(index, 1);
  saveCustomCategories();
  renderCategories(selectedValues);
  customCategoryMessage.textContent = `「${deletedCategory}」を削除しました。`;
}

function renderStalls(candidates) {
  const columns = window.innerWidth <= 700 ? 4 : 8;
  const rows = Math.max(1, Math.ceil(candidates.length / columns));
  const height = window.innerWidth <= 700 ? 590 : 620;
  festivalMap.style.height = `${height}px`;
  const sidePadding = window.innerWidth <= 700 ? 9 : 6;
  const usableWidth = 100 - sidePadding * 2;
  stalls.innerHTML = candidates.map((name,index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const left = sidePadding + (usableWidth / Math.max(columns - 1, 1)) * column;
    const top = 70 + row * ((height - 140) / Math.max(rows - 1, 1));
    const angle = [-3,2,-2,3,-2,2,-3,3][column];
    return `<button class="stall compact-stall" type="button" data-name="${escapeHtml(name)}" style="left:${left}%;top:${top}px;--angle:${angle}deg"><i class="roof"></i><i class="counter"></i><i class="light"></i><i class="bulbs"></i><span class="sign">${escapeHtml(name)}</span></button>`;
  }).join("");
  return [...stalls.querySelectorAll(".stall")];
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function drawRestaurant() {
  const candidates = getSelectedCategories();
  if (document.body.dataset.effect === "pot") {
    drawPot(candidates);
    return;
  }
  if (candidates.length === 0 || festivalMap.classList.contains("drawing")) return;

  const result = candidates[Math.floor(Math.random() * candidates.length)];
  const stallElements = renderStalls(candidates);
  drawButton.disabled = true;
  mapButton.disabled = true;
  retryButton.hidden = true;
  festivalMap.classList.remove("revealed");
  festivalMap.classList.add("drawing");
  resultText.textContent = "？？？";
  let step = 0;
  const rounds = Math.max(18, stallElements.length + 8);
  const timer = window.setInterval(() => {
    stallElements.forEach(stall => stall.classList.remove("lit"));
    stallElements[step % stallElements.length].classList.add("lit");
    step += 1;
    if (step >= rounds) {
      window.clearInterval(timer);
      const winner = stallElements.find(stall => stall.dataset.name === result);
      stallElements.forEach(stall => stall.classList.remove("lit"));
      winner.classList.add("lit", "winner");
    resultText.textContent = result;
      resultHint.textContent = `今夜は「${result}」のお店へ行こう。`;
      festivalMap.classList.remove("drawing");
      festivalMap.classList.add("revealed");
    drawButton.hidden = true;
    retryButton.hidden = false;
    drawButton.disabled = false;
      mapButton.disabled = false;
    }
  }, 135);
}

function drawPot(candidates) {
  const potScene = document.getElementById("potScene");
  const magicPot = document.getElementById("magicPot");
  if (candidates.length === 0 || potScene.classList.contains("mixing")) return;
  drawButton.disabled = true;
  magicPot.disabled = true;
  retryButton.hidden = true;
  potScene.classList.remove("revealed");
  potScene.classList.add("mixing");
  document.getElementById("potResultText").textContent = "？？？";
  window.setTimeout(() => {
    const result = candidates[Math.floor(Math.random() * candidates.length)];
    document.getElementById("potResultText").textContent = result;
    document.getElementById("potResultHint").textContent = `今日は「${result}」のお店へ行こう。`;
    potScene.classList.remove("mixing");
    potScene.classList.add("revealed");
    drawButton.hidden = true;
    retryButton.hidden = false;
    drawButton.disabled = false;
    magicPot.disabled = false;
  }, 2400);
}

function retry() {
  festivalMap.classList.remove("revealed");
  drawButton.hidden = false;
  retryButton.hidden = true;
  resultText.textContent = "？？？";
  resultHint.textContent = "祭りの明かりに聞いてみよう";
  stalls.querySelectorAll(".stall").forEach(stall => stall.classList.remove("winner", "lit"));
  const potScene = document.getElementById("potScene");
  potScene.classList.remove("revealed");
  document.getElementById("potResultText").textContent = "？？？";
  document.getElementById("potResultHint").textContent = "鍋に聞いてみよう";
}

toggleAllButton.addEventListener("click", toggleAll);
categoryGrid.addEventListener("change", updateSelectionCount);
categoryGrid.addEventListener("click", handleCategoryGridClick);
customCategoryForm.addEventListener("submit", addCustomCategory);
drawButton.addEventListener("click", drawRestaurant);
mapButton.addEventListener("click", drawRestaurant);
stalls.addEventListener("click", drawRestaurant);
retryButton.addEventListener("click", retry);

setupEffectSwitcher();
renderCategories();
renderStalls(getSelectedCategories());
