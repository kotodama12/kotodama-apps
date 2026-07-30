// =========================
// 保存に使用する名前
// =========================

const STORAGE_KEY = "motoToreMeterItems";


// =========================
// HTML要素を取得
// =========================

const itemForm = document.getElementById("itemForm");
const itemNameInput = document.getElementById("itemName");
const purchasePriceInput = document.getElementById("purchasePrice");
const usageCountInput = document.getElementById("usageCount");

const saveMessage = document.getElementById("saveMessage");
const itemCount = document.getElementById("itemCount");
const emptyMessage = document.getElementById("emptyMessage");
const itemList = document.getElementById("itemList");


// =========================
// 保存された物を取得
// =========================

function getItems() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return [];
  }

  try {
    const items = JSON.parse(savedData);

    if (!Array.isArray(items)) {
      return [];
    }

    return items;
  } catch (error) {
    console.error("データの読み込みに失敗しました。", error);
    return [];
  }
}


// =========================
// データを保存
// =========================

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}


// =========================
// 重複しないIDを作成
// =========================

function createId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}


// =========================
// 金額を見やすく表示
// =========================

function formatMoney(amount) {
  return Math.round(amount).toLocaleString("ja-JP");
}


// =========================
// 1回あたりの金額を計算
// =========================

function calculateCostPerUse(item) {
  if (item.usageCount <= 0) {
    return null;
  }

  return item.purchasePrice / item.usageCount;
}


// =========================
// メーターの進み具合を計算
// =========================

function calculateMeterPercentage(item) {
  if (item.usageCount <= 1) {
    return 0;
  }

  const costPerUse = calculateCostPerUse(item);

  const percentage =
    (1 - costPerUse / item.purchasePrice) * 100;

  return Math.min(100, Math.max(0, percentage));
}


// =========================
// カードを作成
// =========================

function createItemCard(item) {
  const card = document.createElement("article");
  card.className = "item-card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "item-card-header";

  const itemName = document.createElement("h3");
  itemName.className = "item-name";
  itemName.textContent = item.itemName;

  const purchasePrice = document.createElement("p");
  purchasePrice.className = "purchase-price";
  purchasePrice.textContent =
    `購入金額：${formatMoney(item.purchasePrice)}円`;

  cardHeader.append(itemName, purchasePrice);


  // 1回あたりの金額
  const costArea = document.createElement("div");
  costArea.className = "cost-area";

  const costLabel = document.createElement("p");
  costLabel.className = "cost-label";
  costLabel.textContent = "現在の1回あたり";

  const costValue = document.createElement("p");
  costValue.className = "cost-value";

  const costPerUse = calculateCostPerUse(item);

  if (costPerUse === null) {
    costValue.textContent = "まだ使っていません";
  } else {
    const costNumber = document.createElement("span");
    costNumber.className = "cost-number";
    costNumber.textContent = formatMoney(costPerUse);

    const costUnit = document.createTextNode("円");

    costValue.append(costNumber, costUnit);
  }

  costArea.append(costLabel, costValue);


  // 使用回数とメーター
  const usageArea = document.createElement("div");
  usageArea.className = "usage-area";

  const usageHeading = document.createElement("div");
  usageHeading.className = "usage-heading";

  const usageLabel = document.createElement("p");
  usageLabel.textContent = "使用回数";

  const usageCount = document.createElement("p");
  usageCount.className = "usage-count";
  usageCount.textContent = `${item.usageCount}回`;

  usageHeading.append(usageLabel, usageCount);

  const meterTrack = document.createElement("div");
  meterTrack.className = "meter-track";

  const meterBar = document.createElement("div");
  meterBar.className = "meter-bar";
  meterBar.style.width =
    `${calculateMeterPercentage(item)}%`;

  meterTrack.appendChild(meterBar);
  usageArea.append(usageHeading, meterTrack);


  // ボタン
  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  const useButton = document.createElement("button");
  useButton.className = "use-button";
  useButton.type = "button";
  useButton.dataset.action = "use";
  useButton.dataset.id = item.id;
  useButton.textContent = "今日使った ＋1";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = item.id;
  deleteButton.textContent = "削除";

  cardActions.append(useButton, deleteButton);

  card.append(
    cardHeader,
    costArea,
    usageArea,
    cardActions
  );

  return card;
}


// =========================
// 一覧を表示
// =========================

function displayItems() {
  const items = getItems();

  itemList.innerHTML = "";
  itemCount.textContent = `${items.length}件`;

  if (items.length === 0) {
    emptyMessage.hidden = false;
    itemList.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  itemList.hidden = false;

  items.forEach(function (item) {
    const card = createItemCard(item);
    itemList.appendChild(card);
  });
}


// =========================
// 新しい物を登録
// =========================

itemForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const itemName = itemNameInput.value.trim();
  const purchasePrice = Number(purchasePriceInput.value);
  const usageCount = Number(usageCountInput.value);

  if (
    !itemName ||
    purchasePrice <= 0 ||
    usageCount < 0
  ) {
    return;
  }

  const items = getItems();

  const newItem = {
    id: createId(),
    itemName: itemName,
    purchasePrice: purchasePrice,
    usageCount: usageCount,
    createdAt: new Date().toISOString()
  };

  items.unshift(newItem);
  saveItems(items);

  itemForm.reset();
  usageCountInput.value = 0;

  displayItems();

  saveMessage.textContent = "登録しました。";

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


// =========================
// 使用回数を増やす・削除する
// =========================

itemList.addEventListener("click", function (event) {
  const clickedButton = event.target.closest("button");

  if (!clickedButton) {
    return;
  }

  const action = clickedButton.dataset.action;
  const itemId = clickedButton.dataset.id;

  if (!action || !itemId) {
    return;
  }

  const items = getItems();

  const selectedItem = items.find(function (item) {
    return item.id === itemId;
  });

  if (!selectedItem) {
    return;
  }


  // 今日使った
  if (action === "use") {
    const updatedItems = items.map(function (item) {
      if (item.id === itemId) {
        return {
          ...item,
          usageCount: item.usageCount + 1
        };
      }

      return item;
    });

    saveItems(updatedItems);
    displayItems();

    saveMessage.textContent =
      `「${selectedItem.itemName}」の使用回数を増やしました。`;
  }


  // 削除
  if (action === "delete") {
    const shouldDelete = window.confirm(
      `「${selectedItem.itemName}」を削除しますか？`
    );

    if (!shouldDelete) {
      return;
    }

    const updatedItems = items.filter(function (item) {
      return item.id !== itemId;
    });

    saveItems(updatedItems);
    displayItems();

    saveMessage.textContent =
      `「${selectedItem.itemName}」を削除しました。`;
  }

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


// =========================
// 最初の表示
// =========================

displayItems();