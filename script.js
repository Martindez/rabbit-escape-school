(function () {
  const body = document.body;
  const ambientToggle = document.getElementById("ambientToggle");
  const STORAGE_KEY = "rabbitEscapeMenuAmbient";

  function saveAmbientState(isOn) {
    try {
      localStorage.setItem(STORAGE_KEY, isOn ? "on" : "off");
    } catch (error) {
      console.warn("Could not save ambient setting.", error);
    }
  }

  function loadAmbientState() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch (error) {
      console.warn("Could not load ambient setting.", error);
      return true;
    }
  }

  function applyAmbientState(isOn) {
    body.classList.toggle("ambient-off", !isOn);

    if (ambientToggle) {
      ambientToggle.textContent = isOn ? "Ambient: ON" : "Ambient: OFF";
      ambientToggle.classList.toggle("off", !isOn);
      ambientToggle.setAttribute("aria-pressed", String(!isOn));
    }

    saveAmbientState(isOn);
  }

  if (ambientToggle) {
    ambientToggle.addEventListener("click", function () {
      const isCurrentlyOn = !body.classList.contains("ambient-off");
      applyAmbientState(!isCurrentlyOn);
    });
  }

  applyAmbientState(loadAmbientState());
})();