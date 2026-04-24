const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");
const playBtn = document.getElementById("playBtn");
const readBtn = document.getElementById("readBtn");
const closeReadBtn = document.getElementById("closeReadBtn");
const readPanel = document.getElementById("readPanel");
const loading = document.getElementById("loading");
const soundHint = document.getElementById("soundHint");

let muted = localStorage.getItem("rabbitEscapeMuted") === "true";
let musicStarted = false;

menuMusic.volume = 0.55;
menuMusic.muted = muted;

function updateMuteButton() {
  muteBtn.textContent = muted ? "UNMUTE" : "MUTE";
  muteBtn.classList.toggle("muted", muted);
}

async function startMusic() {
  if (muted || musicStarted) return;

  try {
    menuMusic.currentTime = menuMusic.currentTime || 0;
    await menuMusic.play();
    musicStarted = true;
    soundHint.classList.add("hide");
  } catch (error) {
    soundHint.classList.remove("hide");
  }
}

function toggleMute() {
  muted = !muted;
  menuMusic.muted = muted;
  localStorage.setItem("rabbitEscapeMuted", String(muted));

  if (muted) {
    menuMusic.pause();
    musicStarted = false;
  } else {
    startMusic();
  }

  updateMuteButton();
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

document.addEventListener("pointerdown", startMusic);
document.addEventListener("keydown", startMusic);

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