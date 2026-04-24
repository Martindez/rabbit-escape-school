const rooms = {
  "Bell Tower": ["Main Hall"],
  Storage: ["Main Hall"],
  "Main Hall": ["Bell Tower", "Storage", "Confession", "Altar"],
  Confession: ["Main Hall"],
  Altar: ["Main Hall", "Entrance", "Basement", "Graveyard"],
  Entrance: ["Altar"],
  Basement: ["Altar", "Exit"],
  Graveyard: ["Altar", "Exit"],
  Exit: ["Basement", "Graveyard"]
};

const roomPositions = {
  "Bell Tower": { top: 14, left: 50 },
  Storage: { top: 35, left: 18 },
  "Main Hall": { top: 36, left: 50 },
  Confession: { top: 35, left: 82 },
  Altar: { top: 58, left: 50 },
  Entrance: { top: 79, left: 18 },
  Basement: { top: 79, left: 50 },
  Graveyard: { top: 79, left: 82 },
  Exit: { top: 92, left: 50 }
};

const relicPositions = {
  "Bell Tower": { top: 21, left: 50 },
  Storage: { top: 42, left: 24 },
  "Main Hall": { top: 45, left: 50 },
  Confession: { top: 42, left: 76 },
  Altar: { top: 62, left: 50 },
  Entrance: { top: 78, left: 24 },
  Basement: { top: 80, left: 50 },
  Graveyard: { top: 79, left: 77 }
};

const secretWord = "INSANE";

const relicRooms = [
  "Bell Tower",
  "Storage",
  "Main Hall",
  "Confession",
  "Altar",
  "Graveyard"
];

const relicLetters = {
  "Bell Tower": "I",
  Storage: "N",
  "Main Hall": "S",
  Confession: "A",
  Altar: "N",
  Graveyard: "E"
};

const totalRelics = 6;

let moveMode = "sneak";
let exitTimer = null;
let exitTimeLeft = 5;

let gameState = {
  playerRoom: "Entrance",
  killerRoom: "Bell Tower",
  collectedRelics: [],
  hearts: 1,
  turnCount: 0,
  exitChallengeStarted: false,
  gameStarted: false
};

let audioContext = null;
let playerLight = null;

const ui = {
  ambientMusic: document.getElementById("ambientMusic"),
  jumpscareSound: document.getElementById("jumpscareSound"),
  hud: document.getElementById("hud"),
  gameWrap: document.getElementById("gameWrap"),
  endScreen: document.getElementById("endScreen"),
  restartBtn: document.getElementById("restartBtn"),
  menuBtn: document.getElementById("menuBtn"),
  keyCount: document.getElementById("keyCount"),
  hearts: document.getElementById("hearts"),
  playerRoom: document.getElementById("playerRoom"),
  killerRoom: document.getElementById("killerRoom"),
  exitState: document.getElementById("exitState"),
  messageText: document.getElementById("messageText"),
  endTitle: document.getElementById("endTitle"),
  endText: document.getElementById("endText"),
  playerToken: document.getElementById("playerToken"),
  killerToken: document.getElementById("killerToken"),
  keyLayer: document.getElementById("keyLayer"),
  flashOverlay: document.getElementById("flashOverlay"),
  jumpscareOverlay: document.getElementById("jumpscareOverlay"),
  mapBoard: document.querySelector(".map-board"),
  roomButtons: document.querySelectorAll(".room-hotspot"),
  sneakBtn: document.getElementById("sneakBtn"),
  runBtn: document.getElementById("runBtn"),
  moveModeText: document.getElementById("moveModeText"),
  lettersText: document.getElementById("lettersText"),
  codeOverlay: document.getElementById("codeOverlay"),
  timerText: document.getElementById("timerText"),
  codeInput: document.getElementById("codeInput"),
  submitCodeBtn: document.getElementById("submitCodeBtn"),
  codeHint: document.getElementById("codeHint")
};

ui.restartBtn.addEventListener("click", startGame);

ui.menuBtn.addEventListener("click", () => {
  window.location.href = "../";
});

ui.sneakBtn.addEventListener("click", () => setMoveMode("sneak"));
ui.runBtn.addEventListener("click", () => setMoveMode("run"));

ui.submitCodeBtn.addEventListener("click", submitExitCode);

ui.codeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitExitCode();
});

ui.roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startAmbientMusic();
    movePlayer(button.dataset.room);
  });
});

document.addEventListener("pointerdown", startAmbientMusic);

function setMoveMode(mode) {
  moveMode = mode;

  ui.sneakBtn.classList.toggle("active", mode === "sneak");
  ui.runBtn.classList.toggle("active", mode === "run");
  ui.moveModeText.textContent = mode === "sneak" ? "Sneak" : "Run";

  showMessage(
    mode === "sneak"
      ? "Sneak mode: quieter, but slower tension."
      : "Run mode: loud. The killer becomes aggressive."
  );
}

function startAmbientMusic() {
  const muted = localStorage.getItem("rabbitEscapeMuted") === "true";
  if (!ui.ambientMusic || muted) return;

  ui.ambientMusic.volume = 0.35;
  ui.ambientMusic.muted = false;
  ui.ambientMusic.play().catch(() => {});
}

function stopAmbientMusic() {
  if (!ui.ambientMusic) return;

  ui.ambientMusic.pause();
  ui.ambientMusic.currentTime = 0;
}

function playJumpscareSound() {
  if (!ui.jumpscareSound) return;

  ui.jumpscareSound.currentTime = 0;
  ui.jumpscareSound.volume = 0.85;
  ui.jumpscareSound.play().catch(() => {});
}

function createPlayerLight() {
  if (playerLight) return;

  playerLight = document.createElement("div");
  playerLight.className = "player-light";
  ui.mapBoard.appendChild(playerLight);
}

function initAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(frequency, duration, type = "sine", volume = 0.04) {
  if (!audioContext) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function startGame() {
  clearInterval(exitTimer);
  exitTimer = null;

  initAudio();
  startAmbientMusic();
  createPlayerLight();
  setMoveMode("sneak");

  gameState = {
    playerRoom: "Entrance",
    killerRoom: "Bell Tower",
    collectedRelics: [],
    hearts: 1,
    turnCount: 0,
    exitChallengeStarted: false,
    gameStarted: true
  };

  ui.codeOverlay.classList.add("hidden");
  ui.endScreen.classList.add("hidden");
  ui.hud.classList.remove("hidden");
  ui.gameWrap.classList.remove("hidden");

  showMessage("Collect the 6 cursed letters. The Exit will test you.");
  updateUI();
}

function movePlayer(room) {
  if (!gameState.gameStarted || gameState.exitChallengeStarted) return;

  const connectedRooms = rooms[gameState.playerRoom];

  if (!connectedRooms.includes(room)) {
    showMessage("You can only move to connected rooms.");
    playTone(130, 0.15, "square", 0.03);
    return;
  }

  if (room === "Exit" && gameState.collectedRelics.length < totalRelics) {
    showMessage("The Exit is sealed. Find every cursed letter first.");
    playTone(130, 0.15, "square", 0.03);
    return;
  }

  gameState.playerRoom = room;
  gameState.turnCount++;

  playTone(moveMode === "run" ? 560 : 390, 0.08, "triangle", 0.035);

  collectRelicIfNeeded();

  if (room === "Exit" && gameState.collectedRelics.length >= totalRelics) {
    updateUI();
    startExitChallenge();
    return;
  }

  if (moveMode === "sneak") {
    moveKillerSmart(0.45);
  } else {
    moveKillerSmart(0.9);

    if (Math.random() < 0.55) {
      moveKillerSmart(0.9);
      showMessage("The killer heard you running!");
    }
  }

  if (gameState.collectedRelics.length >= 4 && Math.random() < 0.35) {
    moveKillerSmart(0.8);
    showMessage("The church bell rings. The killer moves again.");
  }

  checkDanger();
  updateUI();
  dangerWarning();
}

function collectRelicIfNeeded() {
  const room = gameState.playerRoom;

  if (relicRooms.includes(room) && !gameState.collectedRelics.includes(room)) {
    gameState.collectedRelics.push(room);

    const letter = relicLetters[room];
    showMessage(`The relic whispers: "${letter}"`);

    playTone(740, 0.1, "triangle", 0.05);
    setTimeout(() => playTone(940, 0.12, "triangle", 0.05), 90);
  }
}

function startExitChallenge() {
  gameState.exitChallengeStarted = true;
  exitTimeLeft = 5;

  ui.codeOverlay.classList.remove("hidden");
  ui.codeInput.value = "";
  ui.codeHint.textContent = `Letters found: ${getRevealedWordDisplay()}`;
  ui.timerText.textContent = exitTimeLeft;

  setTimeout(() => ui.codeInput.focus(), 100);

  playTone(90, 0.25, "sawtooth", 0.05);

  exitTimer = setInterval(() => {
    exitTimeLeft--;
    ui.timerText.textContent = exitTimeLeft;

    playTone(80 + exitTimeLeft * 20, 0.08, "sawtooth", 0.04);

    if (exitTimeLeft <= 0) {
      clearInterval(exitTimer);
      failExitChallenge("Too slow. The church seals your fate.");
    }
  }, 1000);
}

function submitExitCode() {
  if (!gameState.exitChallengeStarted) return;

  const answer = ui.codeInput.value.trim().toUpperCase();

  if (answer === secretWord) {
    clearInterval(exitTimer);
    winGame();
  } else {
    failExitChallenge("Wrong word. The killer heard you.");
  }
}

function failExitChallenge(text) {
  clearInterval(exitTimer);
  ui.codeHint.textContent = text;

  setTimeout(() => {
    ui.codeOverlay.classList.add("hidden");
    gameState.killerRoom = "Exit";
    checkDanger();
    loseGame();
  }, 500);
}

function winGame() {
  gameState.gameStarted = false;
  stopAmbientMusic();

  ui.codeOverlay.classList.add("hidden");
  ui.endTitle.textContent = "FINAL BOSS COMPLETE!";
  ui.endText.textContent = "You solved the church word and escaped Still Insane.";
  ui.hud.classList.add("hidden");
  ui.gameWrap.classList.add("hidden");
  ui.endScreen.classList.remove("hidden");

  playTone(523, 0.12, "triangle", 0.05);
  setTimeout(() => playTone(659, 0.12, "triangle", 0.05), 120);
  setTimeout(() => playTone(784, 0.18, "triangle", 0.05), 240);
}

function moveKillerSmart(chaseChance) {
  const path = findShortestPath(gameState.killerRoom, gameState.playerRoom);

  if (path.length > 1 && Math.random() < chaseChance) {
    gameState.killerRoom = path[1];
  } else {
    const options = rooms[gameState.killerRoom].filter((room) => room !== "Exit");
    gameState.killerRoom = options[Math.floor(Math.random() * options.length)];
  }
}

function findShortestPath(start, target) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const room = path[path.length - 1];

    if (room === target) return path;

    rooms[room].forEach((nextRoom) => {
      if (!visited.has(nextRoom)) {
        visited.add(nextRoom);
        queue.push([...path, nextRoom]);
      }
    });
  }

  return [start];
}

function dangerWarning() {
  const connected = rooms[gameState.playerRoom];

  if (connected.includes(gameState.killerRoom)) {
    showMessage("You hear breathing nearby...");
    playTone(90, 0.18, "sawtooth", 0.035);
  }
}

function checkDanger() {
  if (gameState.playerRoom === gameState.killerRoom) {
    gameState.hearts = 0;
    flash();
    playJumpscareSound();
    showJumpscare();
    loseGame();
  }
}

function loseGame() {
  gameState.gameStarted = false;
  stopAmbientMusic();

  ui.endTitle.textContent = "Caught!";
  ui.endText.textContent = "The killer found you in the church.";
  ui.hud.classList.add("hidden");
  ui.gameWrap.classList.add("hidden");

  setTimeout(() => {
    ui.endScreen.classList.remove("hidden");
  }, 900);
}

function updateUI() {
  ui.keyCount.textContent = gameState.collectedRelics.length;
  ui.hearts.textContent = gameState.hearts > 0 ? "❤️" : "💔";
  ui.playerRoom.textContent = gameState.playerRoom;
  ui.killerRoom.textContent = gameState.killerRoom;
  ui.exitState.textContent = gameState.collectedRelics.length >= totalRelics ? "Code Required" : "Sealed";
  ui.lettersText.textContent = getRevealedWordDisplay();

  moveToken(ui.playerToken, gameState.playerRoom);
  moveToken(ui.killerToken, gameState.killerRoom);
  moveLight(gameState.playerRoom);
  drawRelics();
}

function getRevealedWordDisplay() {
  return relicRooms
    .map((room) => gameState.collectedRelics.includes(room) ? relicLetters[room] : "_")
    .join(" ");
}

function moveToken(token, room) {
  const pos = roomPositions[room];

  token.style.top = `${pos.top}%`;
  token.style.left = `${pos.left}%`;

  animateToken(token);
}

function animateToken(token) {
  token.classList.remove("moving");
  void token.offsetWidth;
  token.classList.add("moving");
}

function moveLight(room) {
  if (!playerLight) return;

  const pos = roomPositions[room];

  setTimeout(() => {
    playerLight.style.top = `${pos.top}%`;
    playerLight.style.left = `${pos.left}%`;
  }, 80);
}

function drawRelics() {
  ui.keyLayer.innerHTML = "";

  relicRooms.forEach((room) => {
    if (gameState.collectedRelics.includes(room)) return;

    const pos = relicPositions[room];
    const relic = document.createElement("div");

    relic.className = "church-relic";
    relic.style.top = `${pos.top}%`;
    relic.style.left = `${pos.left}%`;

    ui.keyLayer.appendChild(relic);
  });
}

function showMessage(text) {
  ui.messageText.textContent = text;
}

function flash() {
  ui.flashOverlay.classList.remove("active");
  void ui.flashOverlay.offsetWidth;
  ui.flashOverlay.classList.add("active");
}

function showJumpscare() {
  ui.jumpscareOverlay.classList.remove("hidden");

  setTimeout(() => {
    ui.jumpscareOverlay.classList.add("hidden");
  }, 900);
}

startGame();