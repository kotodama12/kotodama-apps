// =========================
// 基本設定
// =========================
const STORAGE_KEY = "decisionLogEntries";

const decisionForm = document.getElementById("decisionForm");
const pendingList = document.getElementById("pendingList");
const reviewedList = document.getElementById("reviewedList");

const goodCount = document.getElementById("goodCount");
const neutralCount = document.getElementById("neutralCount");
const regretCount = document.getElementById("regretCount");

const reviewModal = document.getElementById("reviewModal");
const reviewForm = document.getElementById("reviewForm");
const reviewDecisionId = document.getElementById("reviewDecisionId");
const reviewDecisionTitle = document.getElementById(
  "reviewDecisionTitle"
);
const reviewNote = document.getElementById("reviewNote");

let decisions = loadDecisions();


// =========================
// 初期表示
// =========================
setDefaultReviewDate();
renderAll();


// =========================
// 判断を保存する
// =========================
decisionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document
    .getElementById("decisionTitle")
    .value
    .trim();

  const category = document
    .getElementById("decisionCategory")
    .value;

  const reason = document
    .getElementById("decisionReason")
    .value
    .trim();

  const expectedResult = document
    .getElementById("expectedResult")
    .value
    .trim();

  const reviewDate = document
    .getElementById("reviewDate")
    .value;

  if (!title || !reason) {
    alert("判断したことと、その理由を入力してください。");
    return;
  }

  const newDecision = {
    id: createId(),
    title,
    category,
    reason,
    expectedResult,
    reviewDate,
    createdAt: new Date().toISOString(),
    reviewed: false,
    result: "",
    reviewNote: "",
    reviewedAt: ""
  };

  decisions.unshift(newDecision);

  saveDecisions();
  renderAll();

  decisionForm.reset();
  setDefaultReviewDate();

  alert("判断を記録しました。");
});


// =========================
// 判断カードの操作
// =========================
pendingList.addEventListener("click", (event) => {
  const reviewButton = event.target.closest("[data-review-id]");
  const deleteButton = event.target.closest("[data-delete-id]");

  if (reviewButton) {
    openReviewModal(reviewButton.dataset.reviewId);
  }

  if (deleteButton) {
    deleteDecision(deleteButton.dataset.deleteId);
  }
});

reviewedList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-id]");

  if (deleteButton) {
    deleteDecision(deleteButton.dataset.deleteId);
  }
});


// =========================
// 振り返りを保存する
// =========================
reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedResult = document.querySelector(
    'input[name="reviewResult"]:checked'
  );

  if (!selectedResult) {
    alert("結果を選んでください。");
    return;
  }

  const targetDecision = decisions.find(
    (decision) => decision.id === reviewDecisionId.value
  );

  if (!targetDecision) {
    closeReviewModal();
    return;
  }

  targetDecision.reviewed = true;
  targetDecision.result = selectedResult.value;
  targetDecision.reviewNote = reviewNote.value.trim();
  targetDecision.reviewedAt = new Date().toISOString();

  saveDecisions();
  renderAll();
  closeReviewModal();

  alert("振り返りを保存しました。");
});


// =========================
// モーダルを閉じる操作
// =========================
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeReviewModal);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    reviewModal.classList.contains("is-open")
  ) {
    closeReviewModal();
  }
});


// =========================
// 一覧全体を表示する
// =========================
function renderAll() {
  renderPendingDecisions();
  renderReviewedDecisions();
  renderSummary();
}


// =========================
// 振り返り待ちを表示する
// =========================
function renderPendingDecisions() {
  const pendingDecisions = decisions.filter(
    (decision) => !decision.reviewed
  );

  if (pendingDecisions.length === 0) {
    pendingList.innerHTML = `
      <div class="empty-message">
        <span class="empty-icon">📝</span>
        <p>まだ記録された判断はありません。</p>
      </div>
    `;
    return;
  }

  pendingList.innerHTML = pendingDecisions
    .map((decision) => {
      const isDue = isReviewDateDue(decision.reviewDate);

      return `
        <article class="decision-item">
          <div class="decision-item-top">
            <div>
              <h3>${escapeHtml(decision.title)}</h3>

              <p class="decision-date">
                ${formatDate(decision.createdAt)}に記録
              </p>
            </div>

            <span class="category-badge">
              ${escapeHtml(decision.category)}
            </span>
          </div>

          <div class="decision-detail">
            <p class="decision-detail-title">選んだ理由</p>

            <p class="decision-detail-text">
              ${escapeHtml(decision.reason)}
            </p>
          </div>

          ${decision.expectedResult
          ? `
                <div class="decision-detail">
                  <p class="decision-detail-title">
                    期待していること
                  </p>

                  <p class="decision-detail-text">
                    ${escapeHtml(decision.expectedResult)}
                  </p>
                </div>
              `
          : ""
        }

          ${decision.reviewDate
          ? `
                <p class="review-date ${isDue ? "is-due" : ""}">
                  ${isDue
            ? "振り返る時期になりました"
            : `振り返り予定：${formatDateOnly(
              decision.reviewDate
            )}`
          }
                </p>
              `
          : `
                <p class="review-date">
                  振り返り日は設定されていません
                </p>
              `
        }

          <div class="item-actions">
            <button
              type="button"
              class="review-button"
              data-review-id="${decision.id}"
            >
              この判断を振り返る
            </button>

            <button
              type="button"
              class="delete-button"
              data-delete-id="${decision.id}"
            >
              削除
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}


// =========================
// 振り返り済みを表示する
// =========================
function renderReviewedDecisions() {
  const reviewedDecisions = decisions.filter(
    (decision) => decision.reviewed
  );

  if (reviewedDecisions.length === 0) {
    reviewedList.innerHTML = `
      <div class="empty-message">
        <span class="empty-icon">🔍</span>
        <p>振り返った判断はまだありません。</p>
      </div>
    `;
    return;
  }

  reviewedList.innerHTML = reviewedDecisions
    .map((decision) => {
      const resultInfo = getResultInfo(decision.result);

      return `
        <article class="decision-item">
          <div class="decision-item-top">
            <div>
              <h3>${escapeHtml(decision.title)}</h3>

              <p class="decision-date">
                ${formatDate(decision.createdAt)}に記録
              </p>
            </div>

            <span class="category-badge">
              ${escapeHtml(decision.category)}
            </span>
          </div>

          <span class="result-badge ${resultInfo.className}">
            ${resultInfo.label}
          </span>

          <div class="decision-detail">
            <p class="decision-detail-title">選んだ理由</p>

            <p class="decision-detail-text">
              ${escapeHtml(decision.reason)}
            </p>
          </div>

          ${decision.reviewNote
          ? `
                <div class="decision-detail">
                  <p class="decision-detail-title">
                    結果と学んだこと
                  </p>

                  <p class="decision-detail-text">
                    ${escapeHtml(decision.reviewNote)}
                  </p>
                </div>
              `
          : ""
        }

          <p class="review-date">
            ${formatDate(decision.reviewedAt)}に振り返り
          </p>

          <div class="item-actions">
            <button
              type="button"
              class="delete-button"
              data-delete-id="${decision.id}"
            >
              削除
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}


// =========================
// 集計を表示する
// =========================
function renderSummary() {
  goodCount.textContent = decisions.filter(
    (decision) => decision.result === "good"
  ).length;

  neutralCount.textContent = decisions.filter(
    (decision) => decision.result === "neutral"
  ).length;

  regretCount.textContent = decisions.filter(
    (decision) => decision.result === "regret"
  ).length;
}


// =========================
// 振り返り画面を開く
// =========================
function openReviewModal(id) {
  const targetDecision = decisions.find(
    (decision) => decision.id === id
  );

  if (!targetDecision) {
    return;
  }

  reviewForm.reset();
  reviewDecisionId.value = targetDecision.id;
  reviewDecisionTitle.textContent = targetDecision.title;

  reviewModal.classList.add("is-open");
  reviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const firstResultInput = reviewModal.querySelector(
    'input[name="reviewResult"]'
  );

  if (firstResultInput) {
    firstResultInput.focus();
  }
}


// =========================
// 振り返り画面を閉じる
// =========================
function closeReviewModal() {
  reviewModal.classList.remove("is-open");
  reviewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  reviewForm.reset();
  reviewDecisionId.value = "";
  reviewDecisionTitle.textContent = "";
}


// =========================
// 判断を削除する
// =========================
function deleteDecision(id) {
  const targetDecision = decisions.find(
    (decision) => decision.id === id
  );

  if (!targetDecision) {
    return;
  }

  const shouldDelete = confirm(
    `「${targetDecision.title}」を削除しますか？`
  );

  if (!shouldDelete) {
    return;
  }

  decisions = decisions.filter(
    (decision) => decision.id !== id
  );

  saveDecisions();
  renderAll();
}


// =========================
// 保存したデータを読み込む
// =========================
function loadDecisions() {
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
    console.error("データの読み込みに失敗しました。", error);
    return [];
  }
}


// =========================
// データを保存する
// =========================
function saveDecisions() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(decisions)
  );
}


// =========================
// 振り返り日の初期値
// =========================
function setDefaultReviewDate() {
  const reviewDateInput = document.getElementById("reviewDate");
  const defaultDate = new Date();

  defaultDate.setDate(defaultDate.getDate() + 7);

  reviewDateInput.value = formatDateForInput(defaultDate);
}


// =========================
// IDを作る
// =========================
function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


// =========================
// 結果の表示内容
// =========================
function getResultInfo(result) {
  const resultMap = {
    good: {
      label: "正解だった",
      className: "good"
    },
    neutral: {
      label: "どちらともいえない",
      className: "neutral"
    },
    regret: {
      label: "後悔した",
      className: "regret"
    }
  };

  return (
    resultMap[result] || {
      label: "未設定",
      className: "neutral"
    }
  );
}


// =========================
// 振り返る日を過ぎたか確認する
// =========================
function isReviewDateDue(reviewDate) {
  if (!reviewDate) {
    return false;
  }

  const today = new Date();
  const todayText = formatDateForInput(today);

  return reviewDate <= todayText;
}


// =========================
// 日付を入力欄用に変換する
// =========================
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// =========================
// 日付だけを日本語で表示する
// =========================
function formatDateOnly(dateText) {
  if (!dateText) {
    return "";
  }

  const [year, month, day] = dateText.split("-");

  return `${year}年${Number(month)}月${Number(day)}日`;
}


// =========================
// 保存日時を日本語で表示する
// =========================
function formatDate(dateText) {
  if (!dateText) {
    return "";
  }

  const date = new Date(dateText);

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}


// =========================
// 入力された文字を安全に表示する
// =========================
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}