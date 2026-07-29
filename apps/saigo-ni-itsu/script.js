// =========================
// 保存に使用する名前
// =========================

const STORAGE_KEY = "saigoNiItsuRecords";


// =========================
// HTML要素を取得
// =========================

const recordForm = document.getElementById("recordForm");
const taskNameInput = document.getElementById("taskName");
const lastDateInput = document.getElementById("lastDate");

const saveMessage = document.getElementById("saveMessage");
const recordCount = document.getElementById("recordCount");
const emptyMessage = document.getElementById("emptyMessage");
const recordList = document.getElementById("recordList");


// =========================
// 今日の日付を取得
// =========================

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// =========================
// 日付を安全に変換
// =========================

function createLocalDate(dateString) {
  const dateParts = dateString.split("-");

  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const day = Number(dateParts[2]);

  return new Date(year, month, day);
}


// =========================
// 前回からの日数を計算
// =========================

function calculateElapsedDays(dateString) {
  const lastDate = createLocalDate(dateString);
  const today = createLocalDate(getTodayString());

  const difference = today.getTime() - lastDate.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.max(0, Math.floor(difference / oneDay));
}


// =========================
// 日付を見やすく変換
// =========================

function formatDate(dateString) {
  const date = createLocalDate(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}


// =========================
// 保存された記録を取得
// =========================

function getRecords() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return [];
  }

  try {
    const records = JSON.parse(savedData);

    if (!Array.isArray(records)) {
      return [];
    }

    return records;
  } catch (error) {
    console.error("記録の読み込みに失敗しました。", error);
    return [];
  }
}


// =========================
// 記録を保存
// =========================

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
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
// 記録カードを作成
// =========================

function createRecordCard(record) {
  const elapsedDays = calculateElapsedDays(record.lastDate);

  const card = document.createElement("article");
  card.className = "record-card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "record-card-header";

  const recordName = document.createElement("h3");
  recordName.className = "record-name";
  recordName.textContent = record.taskName;

  const elapsedText = document.createElement("p");
  elapsedText.className = "elapsed-days";

  const elapsedNumber = document.createElement("span");
  elapsedNumber.className = "elapsed-number";
  elapsedNumber.textContent = elapsedDays;

  const elapsedUnit = document.createTextNode("日");

  elapsedText.append(elapsedNumber, elapsedUnit);
  cardHeader.append(recordName, elapsedText);

  const lastDateText = document.createElement("p");
  lastDateText.className = "last-date";

  if (elapsedDays === 0) {
    lastDateText.textContent = `今日しました・${formatDate(record.lastDate)}`;
  } else {
    lastDateText.textContent = `前回：${formatDate(record.lastDate)}`;
  }

  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  const doneButton = document.createElement("button");
  doneButton.className = "done-button";
  doneButton.type = "button";
  doneButton.dataset.action = "done";
  doneButton.dataset.id = record.id;
  doneButton.textContent = "今日やった";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = record.id;
  deleteButton.textContent = "削除";

  cardActions.append(doneButton, deleteButton);
  card.append(cardHeader, lastDateText, cardActions);

  return card;
}


// =========================
// 記録一覧を表示
// =========================

function displayRecords() {
  const records = getRecords();

  const sortedRecords = [...records].sort(function (recordA, recordB) {
    return (
      calculateElapsedDays(recordB.lastDate) -
      calculateElapsedDays(recordA.lastDate)
    );
  });

  recordList.innerHTML = "";
  recordCount.textContent = `${records.length}件`;

  if (records.length === 0) {
    emptyMessage.hidden = false;
    recordList.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  recordList.hidden = false;

  sortedRecords.forEach(function (record) {
    const card = createRecordCard(record);
    recordList.appendChild(card);
  });
}


// =========================
// 新しい記録を追加
// =========================

recordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = taskNameInput.value.trim();
  const lastDate = lastDateInput.value;

  if (!taskName || !lastDate) {
    return;
  }

  const records = getRecords();

  const newRecord = {
    id: createId(),
    taskName: taskName,
    lastDate: lastDate,
    createdAt: new Date().toISOString()
  };

  records.push(newRecord);
  saveRecords(records);

  recordForm.reset();
  lastDateInput.value = getTodayString();

  displayRecords();

  saveMessage.textContent = "記録しました。";

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


// =========================
// 「今日やった」と削除
// =========================

recordList.addEventListener("click", function (event) {
  const clickedButton = event.target.closest("button");

  if (!clickedButton) {
    return;
  }

  const action = clickedButton.dataset.action;
  const recordId = clickedButton.dataset.id;

  if (!action || !recordId) {
    return;
  }

  const records = getRecords();
  const selectedRecord = records.find(function (record) {
    return record.id === recordId;
  });

  if (!selectedRecord) {
    return;
  }

  if (action === "done") {
    const updatedRecords = records.map(function (record) {
      if (record.id === recordId) {
        return {
          ...record,
          lastDate: getTodayString()
        };
      }

      return record;
    });

    saveRecords(updatedRecords);
    displayRecords();

    saveMessage.textContent =
      `「${selectedRecord.taskName}」を今日の日付に更新しました。`;
  }

  if (action === "delete") {
    const shouldDelete = window.confirm(
      `「${selectedRecord.taskName}」を削除しますか？`
    );

    if (!shouldDelete) {
      return;
    }

    const updatedRecords = records.filter(function (record) {
      return record.id !== recordId;
    });

    saveRecords(updatedRecords);
    displayRecords();

    saveMessage.textContent =
      `「${selectedRecord.taskName}」を削除しました。`;
  }

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


// =========================
// 最初の設定
// =========================

const todayString = getTodayString();

lastDateInput.value = todayString;
lastDateInput.max = todayString;

displayRecords();