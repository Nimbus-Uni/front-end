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
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

leftBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
});

rightBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
});