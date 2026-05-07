const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");

const characterOverlay = document.getElementById("characterOverlay");
const levelOverlay = document.getElementById("levelOverlay");
const readmeOverlay = document.getElementById("readmeOverlay");

const selectedCharacterPreview = document.getElementById("selectedCharacterPreview");
const selectedCharacterName = document.getElementById("selectedCharacterName");

const characters = {
  "player.png": "Alansius",
  "player2.png": "Pascorali",
  "player3.png": "Rumi"
};

function initMenu() {
  const savedCharacter = localStorage.getItem("stillInsaneCharacter") || "player.png";
  const characterName = characters[savedCharacter] || "Alansius";

  localStorage.setItem("stillInsaneCharacter", savedCharacter);
  localStorage.setItem("stillInsaneCharacterName", characterName);

  updateCharacterPreview(savedCharacter);
  updateMuteButton();

  document.addEventListener("pointerdown", startMenuMusic, { once: false });
}

function isMuted() {
  return localStorage.getItem("stillInsaneMuted") === "true";
}

function startMenuMusic() {
  if (!menuMusic || isMuted()) return;

  menuMusic.volume = 0.35;
  menuMusic.muted = false;
  menuMusic.play().catch(() => {});
}

function playGame() {
  startMenuMusic();
  window.location.href = "./school/";
}

function toggleMute() {
  const newMuted = !isMuted();
  localStorage.setItem("stillInsaneMuted", String(newMuted));

  if (menuMusic) {
    menuMusic.muted = newMuted;

    if (newMuted) {
      menuMusic.pause();
    } else {
      startMenuMusic();
    }
  }

  updateMuteButton();
}

function updateMuteButton() {
  if (!muteBtn) return;
  muteBtn.textContent = isMuted() ? "UNMUTE" : "MUTE";
}

function openCharacterSelect() {
  if (!characterOverlay) return;
  closeAllOverlays();
  characterOverlay.classList.remove("hidden");
  markSelectedCharacter();
}

function closeCharacterSelect() {
  if (!characterOverlay) return;
  characterOverlay.classList.add("hidden");
}

function selectCharacter(fileName) {
  const characterName = characters[fileName] || "Alansius";

  localStorage.setItem("stillInsaneCharacter", fileName);
  localStorage.setItem("stillInsaneCharacterName", characterName);

  updateCharacterPreview(fileName);
  markSelectedCharacter();
}

function updateCharacterPreview(fileName) {
  const characterName = characters[fileName] || "Alansius";

  if (selectedCharacterPreview) {
    selectedCharacterPreview.src = `assets/${fileName}`;
  }

  if (selectedCharacterName) {
    selectedCharacterName.textContent = characterName;
  }
}

function markSelectedCharacter() {
  const savedCharacter = localStorage.getItem("stillInsaneCharacter") || "player.png";
  const cards = document.querySelectorAll("#characterOverlay .character-card");

  cards.forEach((card) => {
    const img = card.querySelector("img");
    const src = img ? img.getAttribute("src") : "";
    card.classList.toggle("selected", src.includes(savedCharacter));
  });
}

function openLevelSelect() {
  if (!levelOverlay) return;
  closeAllOverlays();
  levelOverlay.classList.remove("hidden");
}

function closeLevelSelect() {
  if (!levelOverlay) return;
  levelOverlay.classList.add("hidden");
}

function goToLevel(level) {
  startMenuMusic();
  window.location.href = `./${level}/`;
}

function openReadMe() {
  if (!readmeOverlay) return;
  closeAllOverlays();
  readmeOverlay.classList.remove("hidden");
}

function closeReadMe() {
  if (!readmeOverlay) return;
  readmeOverlay.classList.add("hidden");
}

function closeAllOverlays() {
  if (characterOverlay) characterOverlay.classList.add("hidden");
  if (levelOverlay) levelOverlay.classList.add("hidden");
  if (readmeOverlay) readmeOverlay.classList.add("hidden");
}

initMenu();
