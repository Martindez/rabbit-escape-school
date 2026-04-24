const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");
const playBtn = document.getElementById("playBtn");
const readBtn = document.getElementById("readBtn");
const closeReadBtn = document.getElementById("closeReadBtn");
const readPanel = document.getElementById("readPanel");
const loading = document.getElementById("loading");

let musicStarted = false;
let muted = localStorage.getItem("rabbitEscapeMuted") === "true";

menuMusic.volume = 0.42;
menuMusic.muted = muted;

function updateMuteButton() {
  muteBtn.textContent = muted ? "Music: OFF" : "Music: ON";
}

async function startMusic() {
  if (musicStarted || muted) return;

  try {
    await menuMusic.play();
    musicStarted = true;
  } catch {
    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });
  }
}

function toggleMute() {
  muted = !muted;
  menuMusic.muted = muted;
  localStorage.setItem("rabbitEscapeMuted", String(muted));

  if (!muted) {
    startMusic();
  }

  updateMuteButton();
}

function playHoverSound() {
  if (muted) return;

  const sound = new Audio("./assets/menu-theme.mp3");
  sound.volume = 0;
}

function startGame() {
  startMusic();

  playBtn.disabled = true;
  readBtn.disabled = true;
  playBtn.textContent = "Loading...";

  loading.classList.add("show");
  loading.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    window.location.href = "./school/";
  }, 700);
}

function openReadMe() {
  startMusic();
  readPanel.classList.add("show");
  readPanel.setAttribute("aria-hidden", "false");
}

function closeReadMe() {
  readPanel.classList.remove("show");
  readPanel.setAttribute("aria-hidden", "true");
}

muteBtn.addEventListener("click", toggleMute);
playBtn.addEventListener("click", startGame);
readBtn.addEventListener("click", openReadMe);
closeReadBtn.addEventListener("click", closeReadMe);

readPanel.addEventListener("click", (event) => {
  if (event.target === readPanel) closeReadMe();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeReadMe();

  if (event.key === "Enter" && !readPanel.classList.contains("show")) {
    startGame();
  }
});

updateMuteButton();
startMusic();