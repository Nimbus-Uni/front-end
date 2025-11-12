console.log("Nimbus Security Page Loaded ✅");
// Tela de carregamento
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  loader.style.display = "none"; // esconde a tela de carregamento quando terminar de carregar
});

// Tela offline
function updateOnlineStatus() {
  const offlineScreen = document.getElementById("offline-screen");
  if (navigator.onLine) {
    offlineScreen.style.display = "none";
  } else {
    offlineScreen.style.display = "flex";
  }
}

// Detecta mudanças na conexão
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Checa status inicial
updateOnlineStatus();

const slides = document.querySelectorAll(".slide");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");
const index1 = document.getElementById("index-1");
const index2 = document.getElementById("index-2");
let index = 0;

function showSlide(i) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[i].classList.add("active");

  if (index === 0) {
    index1.style.width = "30px";
    index1.style.backgroundColor = "#1da1fb";
    index1.style.left = "45%";

    index2.style.width = "12px";
    index2.style.backgroundColor = "white";
    index2.style.left = "50%";
  }

  if (index === 1) {
    index2.style.width = "30px";
    index2.style.backgroundColor = "#1da1fb";
    index2.style.left = "50%";

    index1.style.width = "12px";
    index1.style.backgroundColor = "white";
    index1.style.left = "47.5%";
  }
}

leftBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

rightBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

index1.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

index2.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

let isShowing = false;
const menu = document.querySelector(".menu-responsive");
const closeArea = document.getElementById("close-area");

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    menu.style.display = "none";
    closeArea.style.display = "none";
    isShowing = false;
  }
});

function showMenu() {
  if (!isShowing) {
    menu.style.display = "flex";
    closeArea.style.display = "block";
    isShowing = true;
    return;
  }

  if (isShowing) {
    menu.style.display = "none";
    closeArea.style.display = "none";
    isShowing = false;
    return;
  }
}
