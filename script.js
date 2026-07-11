const appList = document.getElementById("appList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const randomBtn = document.getElementById("randomBtn");

const openSupportModalButton =
  document.getElementById("openSupportModal");

const supportModal =
  document.getElementById("supportModal");

const closeSupportModalButton =
  document.getElementById("closeSupportModal");

const cancelSupportModalButton =
  document.getElementById("cancelSupportModal");

const supportModalOverlay =
  document.getElementById("supportModalOverlay");

const stripeSupportLink =
  document.getElementById("stripeSupportLink");

function setupSiteInfo() {
  document.title = SITE.name;

  document.getElementById("siteLogo").textContent =
    SITE.name;

  document.getElementById("siteBadge").textContent =
    SITE.badge;

  document.getElementById("siteSlogan").textContent =
    SITE.slogan;

  document.getElementById("siteDescription").textContent =
    SITE.description;

  document.getElementById("footerText").textContent =
    `© ${SITE.year} ${SITE.name}`;

  /*
   * config.js にStripeのURLを書いた場合だけ、
   * モーダル内のリンクへ反映します。
   */
  if (
    SITE.supportUrl &&
    SITE.supportUrl !== "#"
  ) {
    stripeSupportLink.href = SITE.supportUrl;
  }
}

function renderApps(list) {
  appList.innerHTML = "";

  if (list.length === 0) {
    appList.innerHTML =
      `<p class="empty">該当するアプリがありません。</p>`;
    return;
  }

  list.forEach(app => {
    const card = document.createElement("article");
    card.className = "app-card";

    card.innerHTML = `
      <div class="icon">${app.icon}</div>
      <p class="date">${app.date}</p>
      <h3>${app.name}</h3>
      <p>${app.description}</p>
      <span class="tag">${app.category}</span>
      <br><br>
      <a class="btn primary" href="${app.url}">
        使ってみる
      </a>
    `;

    appList.appendChild(card);
  });
}

function renderCategories() {
  const categories = [
    "すべて",
    ...new Set(APPS.map(app => app.category))
  ];

  categoryButtons.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;

    button.addEventListener("click", () => {
      if (category === "すべて") {
        renderApps(APPS);
        return;
      }

      const filteredApps =
        APPS.filter(app => app.category === category);

      renderApps(filteredApps);
    });

    categoryButtons.appendChild(button);
  });
}

function searchApps() {
  const keyword =
    searchInput.value.trim().toLowerCase();

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(keyword) ||
    app.description.toLowerCase().includes(keyword) ||
    app.category.toLowerCase().includes(keyword)
  );

  renderApps(filteredApps);
}

function showRandomApp() {
  if (APPS.length === 0) {
    alert("現在公開中のアプリはありません。");
    return;
  }

  const randomApp =
    APPS[Math.floor(Math.random() * APPS.length)];

  const shouldOpen = confirm(
    `今日のおすすめは「${randomApp.name}」です！\n\n開きますか？`
  );

  if (shouldOpen) {
    window.location.href = randomApp.url;
  }
}

function openSupportModal() {
  supportModal.classList.add("is-open");
  supportModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  closeSupportModalButton.focus();
}

function closeSupportModal() {
  supportModal.classList.remove("is-open");
  supportModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  openSupportModalButton.focus();
}

setupSiteInfo();
renderCategories();
renderApps(APPS);

searchInput.addEventListener(
  "input",
  searchApps
);

randomBtn.addEventListener(
  "click",
  showRandomApp
);

openSupportModalButton.addEventListener(
  "click",
  openSupportModal
);

closeSupportModalButton.addEventListener(
  "click",
  closeSupportModal
);

cancelSupportModalButton.addEventListener(
  "click",
  closeSupportModal
);

supportModalOverlay.addEventListener(
  "click",
  closeSupportModal
);

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    supportModal.classList.contains("is-open")
  ) {
    closeSupportModal();
  }
});