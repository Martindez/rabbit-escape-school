const playBtn = document.getElementById("playBtn");
const readBtn = document.getElementById("readBtn");
const closeReadBtn = document.getElementById("closeReadBtn");
const readPanel = document.getElementById("readPanel");
const loading = document.getElementById("loading");

let audioContext;
let ambientOscillator;
let ambientGain;
let ambientStarted = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency, duration, type, volume) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function startAmbientSound() {
  if (ambientStarted) return;

  const ctx = getAudioContext();
  ambientOscillator = ctx.createOscillator();
  ambientGain = ctx.createGain();

  ambientOscillator.type = "sawtooth";
  ambientOscillator.frequency.setValueAtTime(42, ctx.currentTime);

  ambientGain.gain.setValueAtTime(0.012, ctx.currentTime);

  ambientOscillator.connect(ambientGain);
  ambientGain.connect(ctx.destination);
  ambientOscillator.start();

  ambientStarted = true;
}

function hoverSound() {
  playTone(120, 0.09, "sine", 0.035);
  setTimeout(() => playTone(70, 0.08, "triangle", 0.025), 45);
}

function clickSound() {
  playTone(55, 0.16, "sawtooth", 0.055);
  setTimeout(() => playTone(38, 0.18, "sawtooth", 0.04), 90);
}

function openSound() {
  playTone(180, 0.12, "triangle", 0.04);
  setTimeout(() => playTone(95, 0.18, "sine", 0.035), 80);
}

function startGame() {
  startAmbientSound();
  clickSound();

  playBtn.disabled = true;
  readBtn.disabled = true;
  playBtn.textContent = "Loading...";

  loading.classList.add("show");
  loading.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    window.location.href = "./school/";
  }, 750);
}

function openReadMe() {
  startAmbientSound();
  openSound();
  readPanel.classList.add("show");
  readPanel.setAttribute("aria-hidden", "false");
}

function closeReadMe() {
  clickSound();
  readPanel.classList.remove("show");
  readPanel.setAttribute("aria-hidden", "true");
}

[playBtn, readBtn, closeReadBtn].forEach((button) => {
  button.addEventListener("mouseenter", hoverSound);
  button.addEventListener("focus", hoverSound);
});

playBtn.addEventListener("click", startGame);
readBtn.addEventListener("click", openReadMe);
closeReadBtn.addEventListener("click", closeReadMe);

readPanel.addEventListener("click", (event) => {
  if (event.target === readPanel) closeReadMe();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeReadMe();
  if (event.key === "Enter" && !readPanel.classList.contains("show")) startGame();
});