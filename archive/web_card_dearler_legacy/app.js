const suits = ["\u2660", "\u2666", "\u2663", "\u2665"];
const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const maxPlayers = 6;
const maxCardsPerPlayer = 10;
const slotCount = 6;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactLayout = window.matchMedia("(max-width: 760px)");

const state = {
  players: 6,
  cardsPerPlayer: 8,
  dealt: [],
  dealing: false,
  deck: shuffleDeck(buildDeck()),
  phase: "READY",
  currentPlayer: 0,
  slotCurrent: 0,
  slotTarget: 0,
};

const elements = {
  players: document.querySelector("#players"),
  cards: document.querySelector("#cards"),
  playersValue: document.querySelector("#players-value"),
  cardsValue: document.querySelector("#cards-value"),
  playerRing: document.querySelector("#player-ring"),
  slotMap: document.querySelector("#slot-map"),
  dealTable: document.querySelector("#deal-table"),
  tableFelt: document.querySelector(".table-felt"),
  dealerDevice: document.querySelector(".table-dealer"),
  deckStack: document.querySelector("#deck-stack"),
  dealButton: document.querySelector("#deal-button"),
  shuffleButton: document.querySelector("#shuffle-button"),
  resetButton: document.querySelector("#reset-button"),
  lcd: document.querySelector("#lcd-readout"),
  flyingCard: document.querySelector("#flying-card"),
  rotationIndicator: document.querySelector("#rotation-indicator"),
  statusMode: document.querySelector("#status-mode"),
  statusPlayers: document.querySelector("#status-players"),
  statusCards: document.querySelector("#status-cards"),
  statusSlot: document.querySelector("#status-slot"),
  statusProgress: document.querySelector("#status-progress"),
  wishlistForm: document.querySelector("#wishlist-form"),
  wishlistStatus: document.querySelector("#wishlist-status"),
};

function buildDeck() {
  return [1, 2].flatMap((deck) => ranks.flatMap((rank) => suits.map((suit) => ({ rank, suit, deck }))));
}

function shuffleDeck(deck) {
  const copy = [...deck];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function isBlackSuit(suit) {
  return suit === "\u2660" || suit === "\u2663";
}

function calculateSlotTarget(playerIndex) {
  return Math.floor((playerIndex * slotCount) / state.players);
}

function slotAngle(slot) {
  return -90 + slot * (360 / slotCount);
}

function polarPosition(slot, radiusX, radiusY) {
  const radians = (slotAngle(slot) * Math.PI) / 180;
  return {
    x: Math.cos(radians) * radiusX,
    y: Math.sin(radians) * radiusY,
  };
}

function slotRadius() {
  return compactLayout.matches ? { x: 24, y: 26 } : { x: 34, y: 29 };
}

function playerRadius() {
  return compactLayout.matches ? { x: 22, y: 31 } : { x: 38, y: 34 };
}

function renderDeck() {
  elements.deckStack.innerHTML = "";
  state.deck.slice(0, 5).forEach((card, index) => {
    const node = document.createElement("div");
    node.className = `deck-card stack-card-${index}${isBlackSuit(card.suit) ? " black" : ""}`;
    node.dataset.suit = card.suit;
    node.innerHTML = `<span class="card-core">${card.rank}</span>`;
    elements.deckStack.appendChild(node);
  });
}

function renderSlots() {
  elements.slotMap.innerHTML = "";

  const occupiedSlots = new Set(
    Array.from({ length: state.players }, (_, playerIndex) => calculateSlotTarget(playerIndex))
  );

  for (let slot = 0; slot < slotCount; slot += 1) {
    const radius = slotRadius();
    const point = polarPosition(slot, radius.x, radius.y);
    const marker = document.createElement("span");
    marker.className = "slot-marker";
    if (slot === state.slotCurrent) marker.classList.add("is-current");
    if (slot === state.slotTarget) marker.classList.add("is-target");
    if (occupiedSlots.has(slot)) marker.classList.add("is-occupied");
    marker.style.setProperty("--x", `${point.x}%`);
    marker.style.setProperty("--y", `${point.y}%`);
    marker.innerHTML = `<span>${slot === 0 ? "HOME" : `S${slot}`}</span>`;
    elements.slotMap.appendChild(marker);
  }
}

function renderPlayers() {
  elements.playerRing.innerHTML = "";

  for (let playerIndex = 0; playerIndex < state.players; playerIndex += 1) {
    const playerNumber = playerIndex + 1;
    const slot = calculateSlotTarget(playerIndex);
    const radius = playerRadius();
    const point = polarPosition(slot, radius.x, radius.y);
    const hand = state.dealt.filter((card) => card.player === playerNumber);
    const station = document.createElement("article");
    station.className = "player-station";
    if (state.dealing && state.currentPlayer === playerIndex) {
      station.classList.add("is-active");
    }
    station.dataset.player = String(playerNumber);
    station.style.setProperty("--x", `${point.x}%`);
    station.style.setProperty("--y", `${point.y}%`);
    station.style.setProperty("--slot-angle", `${slotAngle(slot)}deg`);

    const cards = hand.map(renderMiniCard).join("");
    station.innerHTML = `
      <header>
        <span>Jugador ${playerNumber}</span>
        <strong>${hand.length}/${state.cardsPerPlayer}</strong>
      </header>
      <p>Slot ${slot}</p>
      <div class="player-card-drop">
        <div class="mini-hand">${cards || '<span class="empty-hand">Esperando</span>'}</div>
      </div>
    `;
    elements.playerRing.appendChild(station);
  }
}

function renderMiniCard(card, index) {
  const black = isBlackSuit(card.suit) ? " black" : "";
  return `<span class="mini-card${black}" style="--card-index: ${index}">${card.rank}<small>${card.suit}</small></span>`;
}

function updateStatus() {
  const total = state.players * state.cardsPerPlayer;
  elements.lcd.textContent = state.phase;
  elements.statusMode.textContent = state.phase;
  elements.statusPlayers.textContent = state.players;
  elements.statusCards.textContent = total;
  elements.statusSlot.textContent = `S${state.slotCurrent}`;
  elements.statusProgress.textContent = `${state.dealt.length}/${total}`;
  elements.dealTable.dataset.phase = state.phase;
  elements.rotationIndicator.style.setProperty("--slot-angle", `${slotAngle(state.slotCurrent)}deg`);
}

function renderTable() {
  renderDeck();
  renderSlots();
  renderPlayers();
  updateStatus();
}

function setPhase(phase) {
  state.phase = phase;
  updateStatus();
}

function updateControls() {
  state.players = Math.min(maxPlayers, Math.max(2, Number(elements.players.value)));
  state.cardsPerPlayer = Math.min(maxCardsPerPlayer, Math.max(1, Number(elements.cards.value)));
  elements.players.value = String(state.players);
  elements.cards.value = String(state.cardsPerPlayer);
  elements.playersValue.value = state.players;
  elements.cardsValue.value = state.cardsPerPlayer;
  state.dealt = [];
  state.currentPlayer = 0;
  state.slotCurrent = 0;
  state.slotTarget = 0;
  state.deck = shuffleDeck(buildDeck());
  setPhase("READY");
  renderTable();
}

function setControlsDisabled(disabled) {
  elements.players.disabled = disabled;
  elements.cards.disabled = disabled;
  elements.dealButton.disabled = disabled;
  elements.shuffleButton.disabled = disabled;
  elements.resetButton.disabled = disabled;
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.disabled = disabled;
  });
}

async function rotateToSlot(targetSlot, phase = "ROTATE_AUTO") {
  state.slotTarget = targetSlot;
  setPhase(phase);
  renderTable();

  while (state.slotCurrent !== state.slotTarget) {
    await wait(reducedMotion.matches ? 1 : 145);
    state.slotCurrent = (state.slotCurrent + 1) % slotCount;
    renderTable();
  }

  await wait(reducedMotion.matches ? 1 : 70);
}

async function animateCard(card, playerNumber) {
  const targetStation = elements.playerRing.querySelector(`[data-player="${playerNumber}"] .player-card-drop`);
  if (!targetStation) return;

  elements.flyingCard.className = "flying-card";
  elements.flyingCard.dataset.suit = card.suit;
  elements.flyingCard.innerHTML = `
    <span class="playing-card${isBlackSuit(card.suit) ? " black" : ""}" data-suit="${card.suit}">
      <span class="card-core">${card.rank}</span>
    </span>
  `;

  const tableRect = elements.tableFelt.getBoundingClientRect();
  const dealerRect = elements.dealerDevice.getBoundingClientRect();
  const targetRect = targetStation.getBoundingClientRect();
  const flyingWidth = elements.flyingCard.offsetWidth || 60;
  const flyingHeight = elements.flyingCard.offsetHeight || 84;
  const fromX = dealerRect.left + dealerRect.width / 2 - tableRect.left - flyingWidth / 2;
  const fromY = dealerRect.top + dealerRect.height / 2 - tableRect.top - flyingHeight / 2;
  const toX = targetRect.left + targetRect.width / 2 - tableRect.left - flyingWidth / 2;
  const toY = targetRect.top + targetRect.height / 2 - tableRect.top - flyingHeight / 2;

  elements.flyingCard.style.setProperty("--from-x", `${fromX}px`);
  elements.flyingCard.style.setProperty("--from-y", `${fromY}px`);
  elements.flyingCard.style.setProperty("--to-x", `${toX}px`);
  elements.flyingCard.style.setProperty("--to-y", `${toY}px`);

  void elements.flyingCard.offsetWidth;
  elements.flyingCard.classList.add("is-active");
  await wait(reducedMotion.matches ? 1 : 390);
  elements.flyingCard.classList.remove("is-active");
}

async function deal() {
  if (state.dealing) return;

  const total = state.players * state.cardsPerPlayer;
  if (state.deck.length < total) {
    state.deck = shuffleDeck(buildDeck());
  }

  state.dealing = true;
  setControlsDisabled(true);
  state.dealt = [];
  state.currentPlayer = 0;
  state.slotCurrent = 0;
  state.slotTarget = 0;
  setPhase("AUTO_INIT");
  renderTable();
  await wait(reducedMotion.matches ? 1 : 180);

  for (let index = 0; index < total; index += 1) {
    const playerIndex = index % state.players;
    const playerNumber = playerIndex + 1;
    const targetSlot = calculateSlotTarget(playerIndex);
    const card = state.deck.shift();

    state.currentPlayer = playerIndex;
    await rotateToSlot(targetSlot, "ROTATE_AUTO");

    setPhase("PUSH_AUTO");
    renderTable();
    await animateCard(card, playerNumber);

    card.player = playerNumber;
    card.slot = targetSlot;
    card.order = index + 1;
    state.dealt.push(card);
    renderTable();
    await wait(reducedMotion.matches ? 1 : 80);
  }

  await rotateToSlot(0, "RETURN_HOME_AUTO");
  state.currentPlayer = 0;
  setPhase("READY");
  state.dealing = false;
  setControlsDisabled(false);
  renderTable();
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function shuffle() {
  if (state.dealing) return;
  state.deck = shuffleDeck(buildDeck());
  state.dealt = [];
  state.currentPlayer = 0;
  state.slotCurrent = 0;
  state.slotTarget = 0;
  setPhase("INIT");
  renderTable();
  window.setTimeout(() => {
    setPhase("READY");
    renderTable();
  }, reducedMotion.matches ? 1 : 520);
}

async function reset() {
  if (state.dealing) return;

  state.dealing = true;
  setControlsDisabled(true);
  state.dealt = [];
  state.currentPlayer = 0;
  await rotateToSlot(0, "RETURN_HOME_AUTO");
  state.deck = buildDeck();
  state.slotCurrent = 0;
  state.slotTarget = 0;
  setPhase("READY");
  state.dealing = false;
  setControlsDisabled(false);
  renderTable();
}

async function submitWishlist(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();

  if (!email) {
    elements.wishlistStatus.textContent = "Introduce un email para unirte a la wishlist.";
    return;
  }

  submitButton.disabled = true;
  elements.wishlistStatus.textContent = "Guardando solicitud...";

  try {
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });

      if (!response.ok) throw new Error("Waitlist submission failed");
    } else {
      window.localStorage.setItem("elco-wishlist", JSON.stringify(Object.fromEntries(data.entries())));
    }

    form.reset();
    elements.wishlistStatus.textContent = "Listo. Te hemos apuntado a la wishlist.";
  } catch (error) {
    elements.wishlistStatus.textContent = "No se pudo enviar ahora. Prueba de nuevo en unos segundos.";
  } finally {
    submitButton.disabled = false;
  }
}

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.dealing) return;
    const target = button.dataset.step === "players" ? elements.players : elements.cards;
    const direction = Number(button.dataset.dir);
    const next = Number(target.value) + direction;
    target.value = String(Math.min(Number(target.max), Math.max(Number(target.min), next)));
    updateControls();
  });
});

elements.players.addEventListener("input", updateControls);
elements.cards.addEventListener("input", updateControls);
elements.dealButton.addEventListener("click", deal);
elements.shuffleButton.addEventListener("click", shuffle);
elements.resetButton.addEventListener("click", reset);
elements.wishlistForm.addEventListener("submit", submitWishlist);
compactLayout.addEventListener("change", renderTable);

renderTable();
