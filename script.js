const playBtn = document.getElementById("playBtn");
const levelsBtn = document.getElementById("levelsBtn");
const creditsBtn = document.getElementById("creditsBtn");

const levelsPanel = document.getElementById("levelsPanel");
const creditsPanel = document.getElementById("creditsPanel");

const level1Btn = document.getElementById("level1Btn");
const level2Btn = document.getElementById("level2Btn");
const level2Text = document.getElementById("level2Text");

function hidePanels() {
  levelsPanel.classList.add("hidden");
  creditsPanel.classList.add("hidden");
}

function togglePanel(panel) {
  const isHidden = panel.classList.contains("hidden");
  hidePanels();
  if (isHidden) {
    panel.classList.remove("hidden");
  }
}

function updateLevelState() {
  const unlocked = localStorage.getItem("rabbitEscapeLevel2Unlocked") === "true";

  if (unlocked) {
    level2Btn.classList.remove("locked");
    level2Btn.classList.add("unlocked");
    level2Btn.disabled = false;
    level2Text.textContent = "Venezia Pizzeria";
  } else {
    level2Btn.classList.remove("unlocked");
    level2Btn.classList.add("locked");
    level2Btn.disabled = false;
    level2Text.textContent = "Locked - Beat Level 1";
  }
}

playBtn.addEventListener("click", () => {
  window.location.href = "school/";
});

levelsBtn.addEventListener("click", () => {
  updateLevelState();
  togglePanel(levelsPanel);
});

creditsBtn.addEventListener("click", () => {
  togglePanel(creditsPanel);
});

level1Btn.addEventListener("click", () => {
  window.location.href = "school/";
});

level2Btn.addEventListener("click", () => {
  const unlocked = localStorage.getItem("rabbitEscapeLevel2Unlocked") === "true";

  if (unlocked) {
    window.location.href = "pizzeria/";
  } else {
    updateLevelState();
    levelsPanel.classList.remove("hidden");
  }
});

updateLevelState();
