// Preloader
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
});

// MENU RESPONSIVO
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuLinks = document.querySelectorAll(".mobile-menu a");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open"); // toggle abre e fecha
});

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });
});

//Tela Off
document.addEventListener("click", (e) => {
    if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
        mobileMenu.classList.remove("open");
    }
});

function updateOnlineStatus() {
    const offlineScreen = document.getElementById("offlineScreen");
    if (!navigator.onLine) {
        offlineScreen.style.display = "flex";
    } else {
        offlineScreen.style.display = "none";
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('load', updateOnlineStatus);
