const menuMusic = document.getElementById("menuMusic");
const muteBtn = document.getElementById("muteBtn");

let muted = false;
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  audioUnlocked = true;
  menuMusic.muted = false;
  menuMusic.volume = 0.45;

  menuMusic.play().catch(() => {
    console.log("Audio will start after user interaction.");
  });

  muteBtn.textContent = "MUTE";
}

function playGame() {
  unlockAudio();

  setTimeout(() => {
    window.location.href = "school/";
  }, 300);
}

function toggleMute() {
  unlockAudio();

  muted = !muted;
  menuMusic.muted = muted;
  localStorage.setItem("rabbitEscapeMuted", muted);

  muteBtn.textContent = muted ? "UNMUTE" : "MUTE";
}

function openReadMe() {
  unlockAudio();

  alert(
    "STILL INSANE\n\n" +
    "Level 1: School\n" +
    "Level 2: Pizzaria\n" +
    "Level 3: Edderkoppen\n\n" +
    "Find all keys.\n" +
    "Avoid the killer.\n" +
    "Escape before you get caught."
  );
}