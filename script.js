const mainArea = document.getElementById("main-area");
const cardContainer = document.getElementById("card-container");
const overlayFlipper = document.getElementById("overlay-flipper");
const mainImage = document.getElementById("main-image");
const backButtonArea = document.getElementById("back-button-area");

// --- Menu Hotspots ---
const menuHome = document.getElementById("menu-home");
const menuDocs = document.getElementById("menu-docs");
const menuHistory = document.getElementById("menu-history");
const menuSettings = document.getElementById("menu-settings");

const state = {
  currentView: "card", // 'card', 'horizontal', 'docs', 'history', 'settings'
  isFlipped: false,
  hasInteracted: false,
  isFullscreen: false,
};

// --- Fullscreen Logic ---
function requestFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen().catch(err => console.log(err));
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function isFullscreenActive() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function showFullscreenPrompt() {
  if (document.getElementById('fullscreen-prompt')) return;
  const prompt = document.createElement('div');
  prompt.id = 'fullscreen-prompt';
  prompt.innerHTML = `<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; text-align: center; z-index: 1000;">แตะเพื่อเข้าสู่โหมดเต็มจอ</div>`;
  document.body.appendChild(prompt);
  setTimeout(() => prompt.remove(), 3000);
}

function handleFirstInteraction() {
  console.log("Interaction detected. Attempting to go fullscreen.");
  if (!state.hasInteracted) {
    state.hasInteracted = true;
    const prompt = document.getElementById('fullscreen-prompt');
    if (prompt) prompt.remove();
    if (!isFullscreenActive()) {
      requestFullscreen();
    }
  }
}

document.addEventListener('fullscreenchange', () => {
  state.isFullscreen = isFullscreenActive();
  console.log('Fullscreen state changed:', state.isFullscreen);
  if (!state.isFullscreen && state.hasInteracted) {
    showFullscreenPrompt();
  }
});
document.addEventListener('webkitfullscreenchange', () => {
  state.isFullscreen = isFullscreenActive();
});


// --- View Manager ---
function setView(viewName) {
  state.currentView = viewName;

  // Determine the correct view class to apply
  let viewClass = `${viewName}-view`;
  if (['docs', 'history', 'settings'].includes(viewName)) {
    viewClass = 'menu-view';
  }
  mainArea.className = viewClass; // e.g., "card-view" or "menu-view"

  // Set the correct image source for menu views
  switch(viewName) {
    case 'card':
      state.isFlipped = false;
      overlayFlipper.classList.remove('flipped');
      break;
    case 'docs':
      mainImage.src = 'images/3.png';
      break;
    case 'history':
      mainImage.src = 'images/4.png';
      break;
    case 'settings':
      mainImage.src = 'images/5.png';
      break;
    case 'horizontal':
      mainImage.src = 'images/6.png';
      break;
  }
}

// --- Card Flip Logic ---
function flipCard() {
  if (state.currentView === "card") {
    state.isFlipped = !state.isFlipped;
    overlayFlipper.classList.toggle("flipped");
  }
}

// --- Event Listeners ---

// 1. Card Interaction
overlayFlipper.addEventListener("click", flipCard); // << แก้ไข: ย้าย listener มาที่ overlayFlipper

let tapTimer;
cardContainer.addEventListener("touchend", () => { // คงไว้ที่ cardContainer สำหรับ double tap
  if (tapTimer) {
    clearTimeout(tapTimer);
    tapTimer = null;
    setView("horizontal"); // Double tap
  } else {
    tapTimer = setTimeout(() => {
      tapTimer = null;
    }, 300);
  }
});

// 2. Horizontal Mode Interaction
mainImage.addEventListener("click", () => {
  if (state.currentView === "horizontal") {
    const currentSrc = mainImage.src;
    mainImage.src = currentSrc.includes("6.png") ? "images/7.png" : "images/6.png";
  }
});

// 3. Back Button
backButtonArea.addEventListener("click", () => setView("card"));
backButtonArea.addEventListener("touchend", () => setView("card"));

// 4. Invisible Menu Hotspots
menuHome.addEventListener("click", () => setView("card"));
menuDocs.addEventListener("click", () => setView("docs"));
menuHistory.addEventListener("click", () => setView("history"));
menuSettings.addEventListener("click", () => setView("settings"));

// --- Initial Load ---
window.addEventListener("load", () => {
  console.log("Page loaded. Setting up initial view and fullscreen listeners.");
  setView('card'); // Set initial view
  setTimeout(() => {
    if (!state.isFullscreen && !state.hasInteracted) {
      showFullscreenPrompt();
    }
  }, 1000);

  // Add listeners for first interaction to trigger fullscreen
  mainArea.addEventListener('touchstart', handleFirstInteraction, { once: true });
  mainArea.addEventListener('click', handleFirstInteraction, { once: true });
});
