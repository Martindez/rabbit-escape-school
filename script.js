const playBtn = document.getElementById("playBtn");
const viewBgBtn = document.getElementById("viewBgBtn");
const loading = document.getElementById("loading");

function startGame() {
  playBtn.disabled = true;
  playBtn.textContent = "Loading...";

  loading.classList.add("show");

  setTimeout(() => {
    window.location.href = "./school/";
  }, 650);
}

playBtn.addEventListener("click", startGame);

viewBgBtn.addEventListener("click", () => {
  window.open("./assets/menu-bg-clean.jpg", "_blank");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});