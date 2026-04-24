const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");

function startMenuMusic() {
  const muted = localStorage.getItem("rabbitEscapeMuted") === "true";
  if (!menuMusic || muted) return;

  menuMusic.muted = false;
  menuMusic.volume = 0.35;
  menuMusic.play().catch(() => {});
}

document.addEventListener("click", startMenuMusic);
document.addEventListener("touchstart", startMenuMusic);

function playGame() {
  startMenuMusic();
  window.location.href = "./school/";
}

function toggleMute() {
  const muted = localStorage.getItem("rabbitEscapeMuted") === "true";
  const newMuted = !muted;

  localStorage.setItem("rabbitEscapeMuted", String(newMuted));

  if (newMuted) {
    menuMusic.pause();
    menuMusic.muted = true;
    muteBtn.textContent = "UNMUTE";
  } else {
    menuMusic.muted = false;
    menuMusic.volume = 0.35;
    menuMusic.play().catch(() => {});
    muteBtn.textContent = "MUTE";
  }
}

function openReadMe() {
  startMenuMusic();

  if (document.getElementById("readmeOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "readmeOverlay";

  overlay.innerHTML = `
    <div class="readme-box">
      <h2>STILL INSANE</h2>
      <p class="small-text">A school project by Martin</p>

      <h3>HOW TO PLAY</h3>
      <ul>
        <li>Click or tap connected rooms to move.</li>
        <li>Collect all keys in each level.</li>
        <li>When all keys are collected, the exit opens.</li>
        <li>If the killer reaches your room, you lose.</li>
      </ul>

      <h3>LEVELS</h3>
      <p>Level 1: School<br>Level 2: Pizzaria<br>Level 3: Edderkoppen</p>

      <button class="close-readme" onclick="closeReadMe()">CLOSE</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function closeReadMe() {
  const overlay = document.getElementById("readmeOverlay");
  if (overlay) overlay.remove();
}

if (localStorage.getItem("rabbitEscapeMuted") === "true") {
  muteBtn.textContent = "UNMUTE";
}