document.addEventListener("DOMContentLoaded", () => {
  const ambientMusic = document.getElementById("ambientMusic");
  const playBtn = document.getElementById("playBtn");
  const readBtn = document.getElementById("readBtn");
  const muteBtn = document.getElementById("muteBtn");
  const readPanel = document.getElementById("readPanel");
  const closeReadBtn = document.getElementById("closeReadBtn");

  let muted = localStorage.getItem("rabbitEscapeMuted") === "true";
  let musicStarted = false;

  if (ambientMusic) {
    ambientMusic.volume = 0.35;
    ambientMusic.muted = muted;
  }

  function updateMuteButton() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? "Unmute" : "Mute";
  }

  function startMusic() {
    if (!ambientMusic || muted || musicStarted) return;

    ambientMusic.play()
      .then(() => {
        musicStarted = true;
      })
      .catch(() => {
        musicStarted = false;
      });
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("rabbitEscapeMuted", muted);

    if (ambientMusic) {
      ambientMusic.muted = muted;

      if (muted) {
        ambientMusic.pause();
        musicStarted = false;
      } else {
        startMusic();
      }
    }

    updateMuteButton();
  }

  function startGame() {
    startMusic();

    setTimeout(() => {
      window.location.href = "./school/";
    }, 150);
  }

  function openReadMe() {
    if (readPanel) {
      readPanel.classList.add("show");
    }
  }

  function closeReadMe() {
    if (readPanel) {
      readPanel.classList.remove("show");
    }
  }

  document.addEventListener("pointerdown", startMusic);

  if (playBtn) {
    playBtn.addEventListener("click", startGame);
  }

  if (readBtn) {
    readBtn.addEventListener("click", openReadMe);
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
  }

  if (closeReadBtn) {
    closeReadBtn.addEventListener("click", closeReadMe);
  }

  if (readPanel) {
    readPanel.addEventListener("click", (event) => {
      if (event.target === readPanel) {
        closeReadMe();
      }
    });
  }

  updateMuteButton();
});