const placeForm = document.getElementById("placeForm");
const placeInput = document.getElementById("placeInput");
const addButton = document.getElementById("addButton");
const placeList = document.getElementById("placeList");
const emptyMessage = document.getElementById("emptyMessage");
const decideButton = document.getElementById("decideButton");
const hint = document.getElementById("hint");
const treeScene = document.getElementById("treeScene");
const treeMessage = document.getElementById("treeMessage");
const resultPlace = document.getElementById("resultPlace");
const resultActions = document.getElementById("resultActions");
const backButton = document.getElementById("backButton");

let places = [];
let isChoosing = false;

placeInput.addEventListener("input", () => {
  addButton.disabled = placeInput.value.trim() === "";
});

placeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newPlaces = placeInput.value
    .split(/、|\n/)
    .map((place) => place.trim())
    .filter((place) => place !== "");

  if (newPlaces.length === 0) return;

  places.push(...newPlaces);
  placeInput.value = "";
  addButton.disabled = true;

  renderPlaces();
  placeInput.focus();
});

decideButton.addEventListener("click", () => {
  if (places.length < 2 || isChoosing) return;

  isChoosing = true;

  const selectedPlace =
    places[Math.floor(Math.random() * places.length)];

  resultPlace.textContent = selectedPlace;
  treeMessage.textContent = "木が行き先を選んでいます…";
  resultActions.hidden = true;
  treeScene.className = "tree-scene falling";
  treeScene.hidden = false;

  window.setTimeout(() => {
    treeScene.className = "tree-scene revealed";
    treeMessage.textContent = "今日の行き先は…";
    resultActions.hidden = false;
    backButton.focus();
  }, 2600);
});

backButton.addEventListener("click", () => {
  treeScene.hidden = true;
  treeScene.className = "tree-scene";
  resultActions.hidden = true;
  isChoosing = false;
  decideButton.focus();
});

function removePlace(index) {
  places.splice(index, 1);
  renderPlaces();
}

function renderPlaces() {
  placeList.innerHTML = "";

  places.forEach((place, index) => {
    const item = document.createElement("div");
    item.className = "place-chip";

    const pin = document.createElement("span");
    pin.className = "pin";
    pin.textContent = "●";
    pin.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.textContent = place;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `${place}を削除`);
    removeButton.addEventListener("click", () => {
      removePlace(index);
    });

    item.append(pin, name, removeButton);
    placeList.appendChild(item);
  });

  emptyMessage.hidden = places.length !== 0;
  decideButton.disabled = places.length < 2;

  if (places.length === 0) {
    hint.textContent = "候補を2つ追加すると決められます";
  } else if (places.length === 1) {
    hint.textContent = "あと1つ候補を追加すると決められます";
  } else {
    hint.textContent = `${places.length}件の候補から選びます`;
  }
}

renderPlaces();