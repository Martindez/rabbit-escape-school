const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");

let musicStarted = false;

document.addEventListener("pointerdown", startMusicOnce, { once: true });

function startMusicOnce() {
  if (musicStarted) return;

  const muted = localStorage.getItem("rabbitEscapeMuted") === "true";

  if (!menuMusic || muted) return;

  musicStarted = true;
  menuMusic.volume = 0.35;
  menuMusic.muted = false;
  menuMusic.play().catch(() => {});
}

function playGame() {
  startMusicOnce();

  setTimeout(() => {
    window.location.href = "./school/";
  }, 250);
}

function toggleMute() {
  const currentlyMuted = localStorage.getItem("rabbitEscapeMuted") === "true";
  const newMutedState = !currentlyMuted;

  localStorage.setItem("rabbitEscapeMuted", String(newMutedState));

  if (newMutedState) {
    if (menuMusic) {
      menuMusic.pause();
      menuMusic.muted = true;
    }

    if (muteBtn) muteBtn.textContent = "UNMUTE";
  } else {
    if (menuMusic) {
      menuMusic.muted = false;
      menuMusic.volume = 0.35;
      menuMusic.play().catch(() => {});
    }

    if (muteBtn) muteBtn.textContent = "MUTE";
  }
}

function loadMuteState() {
  const muted = localStorage.getItem("rabbitEscapeMuted") === "true";

  if (!muteBtn) return;

  if (muted) {
    muteBtn.textContent = "UNMUTE";

    if (menuMusic) {
      menuMusic.pause();
      menuMusic.muted = true;
    }
  } else {
    muteBtn.textContent = "MUTE";

    if (menuMusic) {
      menuMusic.muted = false;
    }
  }
}

function openReadMe() {
  if (document.getElementById("readmeOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "readmeOverlay";

  overlay.innerHTML = `
    <div class="readme-box">
      <h2>STILL INSANE</h2>
      <p class="small-text">A school project by Martin</p>

      <h3>HOW TO PLAY</h3>
      <p>Escape all 3 levels while being hunted by the killer.</p>

      <ul>
        <li>Click or tap connected rooms to move.</li>
        <li>Collect all keys in each level.</li>
        <li>When all keys are collected, the exit opens.</li>
        <li>Reach the exit to complete the level.</li>
        <li>If the killer reaches your room, you lose.</li>
      </ul>

      <h3>LEVELS</h3>
      <p>
        Level 1: School<br>
        Level 2: Pizzaria<br>
        Level 3: Edderkoppen
      </p>

      <h3>CONTROLS</h3>
      <p>
        PLAY starts the game.<br>
        MUTE turns music on or off.<br>
        READ ME opens this guide.
      </p>

      <h3>GOAL</h3>
      <p>Survive all three levels and escape Still Insane.</p>

      <button class="close-readme" type="button" onclick="closeReadMe()">CLOSE</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function closeReadMe() {
  const overlay = document.getElementById("readmeOverlay");

  if (overlay) {
    overlay.remove();
  }
}

loadMuteState();