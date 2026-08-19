const STORAGE_KEY = "placeKeeperRecords";

const placeForm = document.getElementById("place-form");
const itemNameInput = document.getElementById("item-name");
const placeNameInput = document.getElementById("place-name");
const itemNoteInput = document.getElementById("item-note");
const itemPhotoInput = document.getElementById("item-photo");

const photoPreview = document.getElementById("photo-preview");
const previewImage = document.getElementById("preview-image");
const removePhotoButton = document.getElementById(
  "remove-photo-button"
);

const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");
const recordList = document.getElementById("record-list");

const deleteModal = document.getElementById("delete-modal");
const cancelDeleteButton = document.getElementById(
  "cancel-delete-button"
);
const confirmDeleteButton = document.getElementById(
  "confirm-delete-button"
);

let records = loadRecords();
let selectedPhoto = "";
let deleteTargetId = null;

/* =========================
   初期表示
========================= */

displayRecords(records);

/* =========================
   保存済みデータの読み込み
========================= */

function loadRecords() {
  const savedRecords = localStorage.getItem(STORAGE_KEY);

  if (!savedRecords) {
    return [];
  }

  try {
    const parsedRecords = JSON.parse(savedRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords;
  } catch (error) {
    console.error("記録の読み込みに失敗しました。", error);
    return [];
  }
}

/* =========================
   データを保存
========================= */

function saveRecords() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );

    return true;
  } catch (error) {
    console.error("記録の保存に失敗しました。", error);

    alert(
      "記録を保存できませんでした。\n" +
      "写真の容量が大きすぎる可能性があります。"
    );

    return false;
  }
}

/* =========================
   新しい記録を登録
========================= */

placeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemName = itemNameInput.value.trim();
  const placeName = placeNameInput.value.trim();
  const itemNote = itemNoteInput.value.trim();

  if (!itemName || !placeName) {
    return;
  }

  const newRecord = {
    id: createId(),
    itemName,
    placeName,
    itemNote,
    photo: selectedPhoto,
    createdAt: new Date().toISOString()
  };

  records.unshift(newRecord);

  const saved = saveRecords();

  if (!saved) {
    records.shift();
    return;
  }

  resetForm();
  displayRecords(records);
  searchInput.value = "";

  recordList.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

/* =========================
   重複しにくいIDを作る
========================= */

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

/* =========================
   写真を選択
========================= */

itemPhotoInput.addEventListener("change", async () => {
  const selectedFile = itemPhotoInput.files[0];

  if (!selectedFile) {
    return;
  }

  if (!selectedFile.type.startsWith("image/")) {
    alert("画像ファイルを選択してください。");
    removeSelectedPhoto();
    return;
  }

  try {
    selectedPhoto = await resizeImage(selectedFile);

    previewImage.src = selectedPhoto;
    photoPreview.hidden = false;
  } catch (error) {
    console.error("写真の読み込みに失敗しました。", error);

    alert("写真を読み込めませんでした。");
    removeSelectedPhoto();
  }
});

/* =========================
   写真を小さくして保存
========================= */

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("load", () => {
      const image = new Image();

      image.addEventListener("load", () => {
        const maximumSize = 900;

        let newWidth = image.width;
        let newHeight = image.height;

        if (newWidth > maximumSize || newHeight > maximumSize) {
          const scale = Math.min(
            maximumSize / newWidth,
            maximumSize / newHeight
          );

          newWidth = Math.round(newWidth * scale);
          newHeight = Math.round(newHeight * scale);
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = newWidth;
        canvas.height = newHeight;

        context.drawImage(
          image,
          0,
          0,
          newWidth,
          newHeight
        );

        const resizedPhoto = canvas.toDataURL(
          "image/jpeg",
          0.72
        );

        resolve(resizedPhoto);
      });

      image.addEventListener("error", reject);
      image.src = fileReader.result;
    });

    fileReader.addEventListener("error", reject);
    fileReader.readAsDataURL(file);
  });
}

/* =========================
   選択した写真を外す
========================= */

removePhotoButton.addEventListener(
  "click",
  removeSelectedPhoto
);

function removeSelectedPhoto() {
  selectedPhoto = "";
  itemPhotoInput.value = "";
  previewImage.src = "";
  photoPreview.hidden = true;
}

/* =========================
   入力欄を空に戻す
========================= */

function resetForm() {
  placeForm.reset();
  removeSelectedPhoto();
  itemNameInput.focus();
}

/* =========================
   記録一覧を表示
========================= */

function displayRecords(targetRecords) {
  recordList.replaceChildren();

  emptyMessage.hidden = targetRecords.length > 0;

  targetRecords.forEach((record) => {
    const recordCard = createRecordCard(record);
    recordList.appendChild(recordCard);
  });
}

/* =========================
   蔵書カードを作成
========================= */

function createRecordCard(record) {
  const recordCard = document.createElement("article");
  recordCard.className = "record-card";

  const imageArea = document.createElement("div");
  imageArea.className = "record-image-area";

  if (record.photo) {
    const photo = document.createElement("img");
    photo.src = record.photo;
    photo.alt = `${record.itemName}の記録写真`;

    imageArea.appendChild(photo);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "record-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = "⌕";

    imageArea.appendChild(placeholder);
  }

  const details = document.createElement("div");
  details.className = "record-details";

  const recordNumber = document.createElement("p");
  recordNumber.className = "record-number";
  recordNumber.textContent = "ARCHIVE RECORD";

  const title = document.createElement("h3");
  title.className = "record-title";
  title.textContent = record.itemName;

  const place = document.createElement("p");
  place.className = "record-place";
  place.textContent = `所蔵場所：${record.placeName}`;

  details.appendChild(recordNumber);
  details.appendChild(title);
  details.appendChild(place);

  if (record.itemNote) {
    const note = document.createElement("p");
    note.className = "record-note";
    note.textContent = record.itemNote;

    details.appendChild(note);
  }

  const date = document.createElement("p");
  date.className = "record-date";
  date.textContent = `記録日：${formatDate(record.createdAt)}`;

  const foundButton = document.createElement("button");
  foundButton.className = "found-button";
  foundButton.type = "button";
  foundButton.textContent = "✓";
  foundButton.setAttribute(
    "aria-label",
    `${record.itemName}を見つけた`
  );

  foundButton.addEventListener("click", () => {
    openDeleteModal(record.id);
  });

  details.appendChild(date);
  details.appendChild(foundButton);

  recordCard.appendChild(imageArea);
  recordCard.appendChild(details);

  return recordCard;
}

/* =========================
   日付を表示用に変換
========================= */

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

/* =========================
   記録を検索
========================= */

searchInput.addEventListener("input", () => {
  const keyword = normalizeText(searchInput.value);

  if (!keyword) {
    displayRecords(records);
    return;
  }

  const filteredRecords = records.filter((record) => {
    const searchableText = normalizeText(
      [
        record.itemName,
        record.placeName,
        record.itemNote
      ].join(" ")
    );

    return searchableText.includes(keyword);
  });

  displayRecords(filteredRecords);

  if (filteredRecords.length === 0) {
    emptyMessage.hidden = false;

    const emptyTitle = emptyMessage.querySelector("p");
    const emptyDescription =
      emptyMessage.querySelector("span");

    emptyTitle.textContent = "該当する記録がありません。";
    emptyDescription.textContent =
      "別の言葉でもう一度探してみてください。";
  }
});

/* =========================
   検索文字をそろえる
========================= */

function normalizeText(text) {
  return String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "");
}

/* =========================
   発見確認画面
========================= */

function openDeleteModal(recordId) {
  deleteTargetId = recordId;
  deleteModal.hidden = false;
  document.body.style.overflow = "hidden";

  confirmDeleteButton.focus();
}

function closeDeleteModal() {
  deleteTargetId = null;
  deleteModal.hidden = true;
  document.body.style.overflow = "";
}

cancelDeleteButton.addEventListener(
  "click",
  closeDeleteModal
);

deleteModal
  .querySelector(".modal-overlay")
  .addEventListener("click", closeDeleteModal);

confirmDeleteButton.addEventListener("click", () => {
  if (!deleteTargetId) {
    return;
  }

  const previousRecords = [...records];

  records = records.filter(
    (record) => record.id !== deleteTargetId
  );

  if (!saveRecords()) {
    records = previousRecords;
    return;
  }

  closeDeleteModal();

  const keyword = normalizeText(searchInput.value);

  if (!keyword) {
    displayRecords(records);
    return;
  }

  const filteredRecords = records.filter((record) => {
    const searchableText = normalizeText(
      [
        record.itemName,
        record.placeName,
        record.itemNote
      ].join(" ")
    );

    return searchableText.includes(keyword);
  });

  displayRecords(filteredRecords);
});

/* =========================
   Escキーで確認画面を閉じる
========================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !deleteModal.hidden) {
    closeDeleteModal();
  }
});