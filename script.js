(function () {
  const body = document.body;
  const ambientToggle = document.getElementById("ambientToggle");
  const menuButtons = document.querySelectorAll(".menu-button");
  const levelCards = document.querySelectorAll(".level-card");

  const STORAGE_KEY = "rabbitEscapeAmbientEnabled";

  function setAmbient(enabled) {
    body.classList.toggle("ambient-off", !enabled);

    if (ambientToggle) {
      ambientToggle.classList.toggle("is-off", !enabled);
      ambientToggle.setAttribute("aria-pressed", String(!enabled));
      ambientToggle.textContent = enabled ? "Ambient Glow: ON" : "Ambient Glow: OFF";
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.warn("Could not save ambient setting:", error);
    }
  }

  function loadAmbient() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return true;
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Could not load ambient setting:", error);
      return true;
    }
  }

  function clearActiveCards() {
    levelCards.forEach((card) => card.classList.remove("is-active"));
  }

  function activateCardByName(name) {
    clearActiveCards();
    const target = document.querySelector(`.level-card[data-card="${name}"]`);
    if (target) {
      target.classList.add("is-active");
    }
  }

  if (ambientToggle) {
    ambientToggle.addEventListener("click", () => {
      const isCurrentlyOff = body.classList.contains("ambient-off");
      setAmbient(isCurrentlyOff);
    });
  }

  menuButtons.forEach((button) => {
    const hoverName = button.dataset.hover;

    button.addEventListener("mouseenter", () => {
      if (hoverName) activateCardByName(hoverName);
    });

    button.addEventListener("focus", () => {
      if (hoverName) activateCardByName(hoverName);
    });

    button.addEventListener("mouseleave", clearActiveCards);
    button.addEventListener("blur", clearActiveCards);
  });

  levelCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const cardName = card.dataset.card;
      if (!cardName) return;
      activateCardByName(cardName);
    });

    card.addEventListener("mouseleave", clearActiveCards);
  });

  setAmbient(loadAmbient());
})();