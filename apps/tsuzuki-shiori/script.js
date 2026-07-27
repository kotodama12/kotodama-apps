// =========================
// 保存に使用する名前
// =========================

const STORAGE_KEY = "tsuzukiShioriData";


// =========================
// HTML要素を取得
// =========================

const bookmarkForm = document.getElementById("bookmarkForm");

const currentTaskInput = document.getElementById("currentTask");
const nextActionInput = document.getElementById("nextAction");
const blockerInput = document.getElementById("blocker");
const relatedUrlInput = document.getElementById("relatedUrl");
const resumeDateInput = document.getElementById("resumeDate");

const emptyMessage = document.getElementById("emptyMessage");
const resumeContent = document.getElementById("resumeContent");

const resumeNextAction = document.getElementById("resumeNextAction");
const resumeCurrentTask = document.getElementById("resumeCurrentTask");
const resumeBlocker = document.getElementById("resumeBlocker");
const resumeUrl = document.getElementById("resumeUrl");
const resumeDate = document.getElementById("resumeDate");

const resumeBlockerRow = document.getElementById("resumeBlockerRow");
const resumeUrlRow = document.getElementById("resumeUrlRow");
const resumeDateRow = document.getElementById("resumeDateRow");

const completeButton = document.getElementById("completeButton");
const saveMessage = document.getElementById("saveMessage");


// =========================
// 保存されている栞を取得
// =========================

function getBookmark() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return null;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    console.error("栞の読み込みに失敗しました。", error);
    return null;
  }
}


// =========================
// 日付を見やすく変換
// =========================

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const dateParts = dateString.split("-");

  if (dateParts.length !== 3) {
    return dateString;
  }

  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);

  return `${year}年${month}月${day}日`;
}


// =========================
// 栞を画面に表示
// =========================

function displayBookmark() {
  const bookmark = getBookmark();

  if (!bookmark) {
    emptyMessage.hidden = false;
    resumeContent.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  resumeContent.hidden = false;

  resumeNextAction.textContent = bookmark.nextAction;
  resumeCurrentTask.textContent = bookmark.currentTask;

  if (bookmark.blocker) {
    resumeBlocker.textContent = bookmark.blocker;
    resumeBlockerRow.hidden = false;
  } else {
    resumeBlocker.textContent = "";
    resumeBlockerRow.hidden = true;
  }

  if (bookmark.relatedUrl) {
    resumeUrl.href = bookmark.relatedUrl;
    resumeUrl.textContent = bookmark.relatedUrl;
    resumeUrlRow.hidden = false;
  } else {
    resumeUrl.href = "#";
    resumeUrl.textContent = "";
    resumeUrlRow.hidden = true;
  }

  if (bookmark.resumeDate) {
    resumeDate.textContent = formatDate(bookmark.resumeDate);
    resumeDateRow.hidden = false;
  } else {
    resumeDate.textContent = "";
    resumeDateRow.hidden = true;
  }
}


// =========================
// 栞を保存
// =========================

bookmarkForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const bookmark = {
    currentTask: currentTaskInput.value.trim(),
    nextAction: nextActionInput.value.trim(),
    blocker: blockerInput.value.trim(),
    relatedUrl: relatedUrlInput.value.trim(),
    resumeDate: resumeDateInput.value,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmark));

  displayBookmark();
  bookmarkForm.reset();

  saveMessage.textContent = "栞をはさみました。次はここから再開できます。";

  document
    .getElementById("resumeCard")
    .scrollIntoView({ behavior: "smooth", block: "center" });

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 4000);
});


// =========================
// 再開できた栞を削除
// =========================

completeButton.addEventListener("click", function () {
  const shouldDelete = window.confirm(
    "この栞を外しますか？\n保存した内容は削除されます。"
  );

  if (!shouldDelete) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  displayBookmark();

  saveMessage.textContent = "栞を外しました。";

  window.setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


// =========================
// 最初の表示
// =========================

displayBookmark();