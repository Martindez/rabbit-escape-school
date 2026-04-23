const rooms = {
  Electrical: ["Gym", "Security"],
  Gym: ["Electrical", "Kitchen", "Playground"],
  Kitchen: ["Gym", "Playground"],
  Security: ["Electrical", "Playground"],
  Playground: ["Gym", "Kitchen", "Security", "Exit"],
  Exit: ["Playground"]
};

const possibleKeyRooms = ["Electrical", "Gym", "Kitchen", "Security", "Playground"];
const totalKeys = 4;
const bestTimeStorageKey = "rabbitEscapeBestTime";

const roomPositions = {
  Electrical: { top: 18, left: 20 },
  Gym: { top: 18, left: 50 },
  Kitchen: { top: 18, left: 80 },
  Security: { top: 57, left: 14 },
  Playground: { top: 58, left: 50 },
  Exit: { top: 83, left: 50 }
};

const roomKeySpawnAreas = {
  Electrical: [
    { top: 15, left: 15 },
    { top: 17, left: 22 },
    { top: 20, left: 18 },
    { top: 21, left: 25 },
    { top: 16, left: 19 }
  ],
  Gym: [
    { top: 14, left: 45 },
    { top: 16, left: 52 },
    { top: 20, left: 48 },
    { top: 21, left: 55 },
    { top: 18, left: 50 }
  ],
  Kitchen: [
    { top: 15, left: 76 },
    { top: 17, left: 83 },
    { top: 20, left: 79 },
    { top: 22, left: 85 },
    { top: 18, left: 80 }
  ],
  Security: [
    { top: 53, left: 10 },
    { top: 56, left: 16 },
    { top: 60, left: 12 },
    { top: 58, left: 18 },
    { top: 55, left: 14 }
  ],
  Playground: [
    { top: 51, left: 44 },
    { top: 54, left: 55 },
    { top: 60, left: 47 },
    { top: 62, left: 57 },
    { top: 57, left: 50 }
  ]
};

let gameState = {
  playerRoom: "Playground",
  killerRoom: "Kitchen",
  keyRooms: [],
  keyVisualPositions: {},
  collectedKeys: [],
  hearts: 3,
  maxHearts: 3,
  gameStarted: false,
  startTime: 0,
  lastWarningTime: 0,
  safeTurns: 0
};

let audioContext = null;

const ui = {
  startScreen: document.getElementById("startScreen"),
  hud: document.getElementById("hud"),
  gameWrap: document.getElementById("gameWrap"),
  messageBox: document.getElementById("messageBox"),
  endScreen: document.getElementById("endScreen"),

  endTitle: document.getElementById("endTitle"),
  endText: document.getElementById("endText"),
  endTime: document.getElementById("endTime"),
  endHearts: document.getElementById("endHearts"),
  endKeys: document.getElementById("endKeys"),
  endBestTime: document.getElementById("endBestTime"),
  endEyebrow: document.getElementById("endEyebrow"),

  goalText: document.getElementById("goalText"),
  exitStateText: document.getElementById("exitState"),
  keyCountText: document.getElementById("keyCount"),
  heartsText: document.getElementById("hearts"),
  dangerText: document.getElementById("dangerText"),
  playerRoomText: document.getElementById("playerRoom"),
  killerRoomText: document.getElementById("killerRoom"),
  bestTimeText: document.getElementById("bestTime"),
  dangerBar: document.getElementById("dangerBar"),
  messageText: document.getElementById("messageText"),

  playerToken: document.getElementById("playerToken"),
  killerToken: document.getElementById("killerToken"),
  flashOverlay: document.getElementById("flashOverlay"),
  jumpscareOverlay: document.getElementById("jumpscareOverlay"),
  keyLayer: document.getElementById("keyLayer"),

  startBtn: document.getElementById("startBtn"),
  restartBtn: document.getElementById("restartBtn"),
  nextLevelBtn: document.getElementById("nextLevelBtn"),
  roomButtons: document.querySelectorAll(".room-hotspot"),
  roomRings: document.querySelectorAll(".room-ring")
};

ui.startBtn.addEventListener("click", startGame);
ui.restartBtn.addEventListener("click", resetGame);

if (ui.nextLevelBtn) {
  ui.nextLevelBtn.addEventListener("click", () => {
    window.location.href = "/rabbit-escape-school/pizzaria/";
  });
}

ui.roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!gameState.gameStarted) return;
    movePlayer(button.dataset.room);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  hardHideJumpscare();
  updateUI();
});

function initAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(frequency, duration, type = "sine", volume = 0.05, fade = 0.02) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + fade);
}

function playMoveSound() {
  playTone(420, 0.08, "triangle", 0.035);
}

function playKeySound() {
  playTone(660, 0.08, "triangle", 0.05);
  setTimeout(() => playTone(880, 0.12, "triangle", 0.04), 70);
}

function playWarningSound() {
  playTone(230, 0.1, "sawtooth", 0.05);
  setTimeout(() => playTone(200, 0.1, "sawtooth", 0.045), 80);
}

function playHitSound() {
  playTone(180, 0.1, "sawtooth", 0.065);
  setTimeout(() => playTone(120, 0.16, "sawtooth", 0.06), 70);
}

function playWinSound() {
  playTone(523, 0.12, "triangle", 0.05);
  setTimeout(() => playTone(659, 0.12, "triangle", 0.05), 100);
  setTimeout(() => playTone(784, 0.18, "triangle", 0.05), 200);
}

function playLockedSound() {
  playTone(150, 0.12, "square", 0.04);
}

function flashScreen(type = "warning") {
  if (!ui.flashOverlay) return;

  ui.flashOverlay.classList.remove("active", "warning");
  void ui.flashOverlay.offsetWidth;
  ui.flashOverlay.classList.add(type);
}

function shakeScreen() {
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
}

function hardHideJumpscare() {
  if (!ui.jumpscareOverlay) return;

  ui.jumpscareOverlay.classList.add("hidden");
  ui.jumpscareOverlay.style.display = "none";
  ui.jumpscareOverlay.style.visibility = "hidden";
  ui.jumpscareOverlay.style.pointerEvents = "none";
  ui.jumpscareOverlay.setAttribute("aria-hidden", "true");
}

function showJumpscareOverlay() {
  if (!ui.jumpscareOverlay) return;

  ui.jumpscareOverlay.classList.remove("hidden");
  ui.jumpscareOverlay.style.display = "flex";
  ui.jumpscareOverlay.style.visibility = "visible";
  ui.jumpscareOverlay.style.pointerEvents = "auto";
  ui.jumpscareOverlay.setAttribute("aria-hidden", "false");
}

function showJumpscare(duration = 650) {
  if (!ui.jumpscareOverlay) return Promise.resolve();

  showJumpscareOverlay();
  shakeScreen();

  return new Promise((resolve) => {
    setTimeout(() => {
      hardHideJumpscare();
      resolve();
    }, duration);
  });
}

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getBestTime() {
  return localStorage.getItem(bestTimeStorageKey);
}

function setBestTime(seconds) {
  const currentBest = getBestTime();
  if (!currentBest || seconds < Number(currentBest)) {
    localStorage.setItem(bestTimeStorageKey, String(seconds));
  }
}

function assignRandomKeys() {
  gameState.keyRooms = shuffle(possibleKeyRooms).slice(0, totalKeys);
  gameState.keyVisualPositions = {};

  gameState.keyRooms.forEach((room) => {
    const spawnOptions = shuffle(roomKeySpawnAreas[room]);
    gameState.keyVisualPositions[room] = spawnOptions[0];
  });
}

function resetRoundState() {
  gameState.playerRoom = "Playground";
  gameState.killerRoom = "Kitchen";
  gameState.collectedKeys = [];
  gameState.hearts = gameState.maxHearts;
  gameState.safeTurns = 0;
  gameState.startTime = 0;
  gameState.lastWarningTime = 0;
}

function startGame() {
  initAudio();
  hardHideJumpscare();
  assignRandomKeys();
  resetRoundState();

  gameState.gameStarted = true;
  gameState.startTime = Date.now();

  ui.startScreen.classList.add("hidden");
  ui.hud.classList.remove("hidden");
  ui.gameWrap.classList.remove("hidden");
  ui.messageBox.classList.remove("hidden");
  ui.endScreen.classList.add("hidden");

  if (ui.nextLevelBtn) {
    ui.nextLevelBtn.classList.add("hidden");
  }

  showMessage("Goal: Collect all 4 glowing keys, then reach the Exit.");
  updateUI();
}

function resetGame() {
  hardHideJumpscare();

  gameState.gameStarted = false;
  gameState.keyRooms = [];
  gameState.keyVisualPositions = {};
  resetRoundState();

  ui.startScreen.classList.remove("hidden");
  ui.hud.classList.add("hidden");
  ui.gameWrap.classList.add("hidden");
  ui.messageBox.classList.add("hidden");
  ui.endScreen.classList.add("hidden");

  if (ui.nextLevelBtn) {
    ui.nextLevelBtn.classList.add("hidden");
  }

  renderKeys();
  showMessage("Press Start to begin.");
  updateUI();
}

function movePlayer(targetRoom) {
  if (!rooms[gameState.playerRoom].includes(targetRoom)) {
    showMessage("You can only move to connected glowing rooms.");
    return;
  }

  gameState.playerRoom = targetRoom;
  playMoveSound();

  if (gameState.safeTurns > 0) {
    gameState.safeTurns -= 1;
  }

  checkForKeyPickup();

  if (gameState.playerRoom === "Exit" && !exitIsOpen()) {
    showMessage("The Exit is locked. Collect all 4 keys first.");
    playLockedSound();
  } else if (
    !gameState.collectedKeys.includes(gameState.playerRoom) ||
    !gameState.keyRooms.includes(gameState.playerRoom)
  ) {
    if (!(gameState.playerRoom === "Exit" && exitIsOpen())) {
      showMessage(`You moved to ${gameState.playerRoom}.`);
    }
  }

  if (gameState.safeTurns === 0 && gameState.playerRoom === gameState.killerRoom) {
    playerHit();
    return;
  }

  moveKiller();

  if (gameState.safeTurns === 0 && gameState.playerRoom === gameState.killerRoom) {
    playerHit();
    return;
  }

  if (gameState.playerRoom === "Exit" && exitIsOpen()) {
    winGame();
    return;
  }

  maybeShowDangerWarning();
  updateUI();
}

function checkForKeyPickup() {
  const currentRoom = gameState.playerRoom;

  if (
    gameState.keyRooms.includes(currentRoom) &&
    !gameState.collectedKeys.includes(currentRoom)
  ) {
    gameState.collectedKeys.push(currentRoom);
    playKeySound();

    if (gameState.collectedKeys.length === gameState.keyRooms.length) {
      showMessage("All 4 keys collected! The Exit is OPEN!");
    } else {
      const keysLeft = gameState.keyRooms.length - gameState.collectedKeys.length;
      showMessage(`You found a key in ${currentRoom}. ${keysLeft} key left.`);
    }
  }
}

function moveKiller() {
  if (gameState.safeTurns > 0 && Math.random() < 0.55) {
    return;
  }

  const path = shortestPath(gameState.killerRoom, gameState.playerRoom);

  if (path.length > 1 && Math.random() < 0.85) {
    gameState.killerRoom = path[1];
  } else {
    const choices = rooms[gameState.killerRoom];
    gameState.killerRoom = choices[Math.floor(Math.random() * choices.length)];
  }
}

function shortestPath(start, goal) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === goal) return path;

    for (const next of rooms[current]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }

  return [start];
}

function getDistance(a, b) {
  return Math.max(0, shortestPath(a, b).length - 1);
}

function exitIsOpen() {
  return gameState.collectedKeys.length === gameState.keyRooms.length && gameState.keyRooms.length > 0;
}

async function playerHit() {
  if (!gameState.gameStarted) return;

  gameState.hearts -= 1;
  playHitSound();
  flashScreen("active");
  await showJumpscare();

  if (gameState.hearts <= 0) {
    loseGame();
    return;
  }

  gameState.playerRoom = "Playground";
  gameState.safeTurns = 1;

  showMessage(
    `Caught! You lost 1 heart. ${gameState.hearts} heart${gameState.hearts === 1 ? "" : "s"} left. Safe for 1 move.`
  );
  updateUI();
}

function loseGame() {
  hardHideJumpscare();
  gameState.gameStarted = false;

  ui.hud.classList.add("hidden");
  ui.gameWrap.classList.add("hidden");
  ui.messageBox.classList.add("hidden");
  ui.endScreen.classList.remove("hidden");

  ui.endEyebrow.textContent = "GAME OVER";
  ui.endTitle.textContent = "You Were Caught!";
  ui.endText.textContent = "The killer rabbit caught you 3 times.";
  ui.endTime.textContent = "--";
  ui.endHearts.textContent = "0";
  ui.endKeys.textContent = `${gameState.collectedKeys.length}/${totalKeys}`;

  const best = getBestTime();
  ui.endBestTime.textContent = best ? `${best}s` : "--";

  if (ui.nextLevelBtn) {
    ui.nextLevelBtn.classList.add("hidden");
  }
}

function winGame() {
  hardHideJumpscare();
  gameState.gameStarted = false;

  ui.hud.classList.add("hidden");
  ui.gameWrap.classList.add("hidden");
  ui.messageBox.classList.add("hidden");
  ui.endScreen.classList.remove("hidden");

  const totalSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
  setBestTime(totalSeconds);
  playWinSound();

  ui.endEyebrow.textContent = "ROUND COMPLETE";
  ui.endTitle.textContent = "You Escaped!";
  ui.endText.textContent = "You got all 4 keys and escaped the school.";
  ui.endTime.textContent = `${totalSeconds}s`;
  ui.endHearts.textContent = `${gameState.hearts}`;
  ui.endKeys.textContent = `${gameState.collectedKeys.length}/${totalKeys}`;

  const best = getBestTime();
  ui.endBestTime.textContent = best ? `${best}s` : "--";

  if (ui.nextLevelBtn) {
    ui.nextLevelBtn.classList.remove("hidden");
  }

  updateBestTime();
}

function updateBestTime() {
  const best = getBestTime();
  ui.bestTimeText.textContent = best ? `${best}s` : "--";
}

function updateDanger() {
  const distance = getDistance(gameState.playerRoom, gameState.killerRoom);

  let label = "Low";
  let width = 18;

  if (distance === 0) {
    label = "Caught";
    width = 100;
  } else if (distance === 1) {
    label = "High";
    width = 85;
  } else if (distance === 2) {
    label = "Medium";
    width = 58;
  }

  if (gameState.safeTurns > 0) {
    label = "Safe";
    width = 12;
  }

  ui.dangerText.textContent = label;
  ui.dangerBar.style.width = `${width}%`;
}

function updateHearts() {
  ui.heartsText.textContent = "❤️ ".repeat(gameState.hearts).trim();
}

function updateGoalStatus() {
  if (!gameState.gameStarted) {
    ui.goalText.textContent = "Find 4 keys";
    ui.exitStateText.textContent = "Locked";
    return;
  }

  if (exitIsOpen()) {
    ui.goalText.textContent = "Reach the Exit";
    ui.exitStateText.textContent = "OPEN";
  } else {
    const keysLeft = gameState.keyRooms.length - gameState.collectedKeys.length;
    ui.goalText.textContent = `Find ${keysLeft} more key${keysLeft === 1 ? "" : "s"}`;
    ui.exitStateText.textContent = "Locked";
  }
}

function setTokenPosition(token, roomName) {
  const position = roomPositions[roomName];
  token.style.top = `${position.top}%`;
  token.style.left = `${position.left}%`;
}

function renderKeys() {
  if (!ui.keyLayer) return;
  ui.keyLayer.innerHTML = "";

  gameState.keyRooms.forEach((room) => {
    if (gameState.collectedKeys.includes(room)) return;

    const keyPosition = gameState.keyVisualPositions[room];
    if (!keyPosition) return;

    const keyElement = document.createElement("div");
    keyElement.className = "map-key";
    keyElement.style.top = `${keyPosition.top}%`;
    keyElement.style.left = `${keyPosition.left}%`;
    keyElement.title = `${room} key`;

    ui.keyLayer.appendChild(keyElement);
  });
}

function updateBoard() {
  ui.roomButtons.forEach((button) => {
    const room = button.dataset.room;
    button.classList.remove("connected", "locked");

    if (room === gameState.playerRoom) {
      button.classList.add("locked");
      button.disabled = true;
    } else if (rooms[gameState.playerRoom].includes(room)) {
      button.classList.add("connected");
      button.disabled = false;
    } else {
      button.classList.add("locked");
      button.disabled = true;
    }
  });

  ui.roomRings.forEach((ring) => {
    const room = ring.dataset.ring;
    ring.classList.remove("connected", "current", "killer-room", "exit-open", "safe-turn");

    if (room === gameState.playerRoom) {
      if (gameState.safeTurns > 0) {
        ring.classList.add("safe-turn");
      } else {
        ring.classList.add("current");
      }
    } else if (rooms[gameState.playerRoom].includes(room)) {
      ring.classList.add("connected");
    }

    if (room === gameState.killerRoom) {
      ring.classList.add("killer-room");
    }

    if (room === "Exit" && exitIsOpen()) {
      ring.classList.add("exit-open");
    }
  });

  setTokenPosition(ui.playerToken, gameState.playerRoom);
  setTokenPosition(ui.killerToken, gameState.killerRoom);
  renderKeys();
}

function maybeShowDangerWarning() {
  if (gameState.safeTurns > 0) return;

  const distance = getDistance(gameState.playerRoom, gameState.killerRoom);
  const now = Date.now();

  if (distance === 1 && now - gameState.lastWarningTime > 1200) {
    showMessage("Warning: The killer is very close!");
    playWarningSound();
    flashScreen("warning");
    gameState.lastWarningTime = now;
  } else if (exitIsOpen() && gameState.playerRoom !== "Exit") {
    showMessage("All keys collected! Run to the Exit!");
  }
}

function updateUI() {
  ui.keyCountText.textContent = gameState.collectedKeys.length;
  ui.playerRoomText.textContent = gameState.playerRoom;
  ui.killerRoomText.textContent = gameState.killerRoom;
  updateHearts();
  updateBestTime();
  updateGoalStatus();
  updateBoard();
  updateDanger();
}

function showMessage(text) {
  ui.messageText.textContent = text;
}

hardHideJumpscare();
updateUI();