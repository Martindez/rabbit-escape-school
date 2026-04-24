(function () {
  const body = document.body;
  const ambientToggle = document.getElementById("ambientToggle");
  const STORAGE_KEY = "rabbitEscapeMenuAmbient";

  function getSavedAmbient() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      return true;
    }
  }

  function setAmbient(isOn) {
    body.classList.toggle("ambient-off", !isOn);

    if (ambientToggle) {
      ambientToggle.textContent = isOn ? "Ambient: ON" : "Ambient: OFF";
      ambientToggle.classList.toggle("off", !isOn);
    }

    try {
      localStorage.setItem(STORAGE_KEY, isOn ? "on" : "off");
    } catch {}
  }

  ambientToggle?.addEventListener("click", () => {
    setAmbient(body.classList.contains("ambient-off"));
  });

  document.querySelector(".level-3")?.addEventListener("click", () => {
    alert("Level 3 is coming soon!");
  });

  setAmbient(getSavedAmbient());
})();