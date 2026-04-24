const ambientSound = document.getElementById("ambientSound");

let audioStarted = false;

function startAudio() {
  if (audioStarted) return;

  audioStarted = true;
  ambientSound.volume = 0.35;

  ambientSound.play().catch(() => {
    console.log("Audio blocked until user interaction.");
  });
}

document.addEventListener("click", startAudio, { once: true });
document.addEventListener("keydown", startAudio, { once: true });

function goRoom(roomName) {
  startAudio();

  alert("Entering " + roomName + "...");

  // Later you can replace this with room pages, for example:
  // window.location.href = roomName.toLowerCase() + ".html";
}

function exitMap() {
  startAudio();

  // Sends player back to main menu
  window.location.href = "../index.html";
}