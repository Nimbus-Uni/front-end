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

// Função para revelar elementos ao rolar a página
function revealOnScroll() {
  const reveals = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;
    let elementVisible = 100; // quanto precisa aparecer para ativar

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

// Escuta o scroll
window.addEventListener("scroll", revealOnScroll);

// Executa na primeira carga também
revealOnScroll();

// Cria clone do container do carrosel

let pos;

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  container.innerHTML += container.innerHTML;

  function loop() {
    pos -= 0.5;
    if (Math.abs(pos) >= container.scrollWidth / 2) {
      pos = 0;
    }
    container.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
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
