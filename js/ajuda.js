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

let isOpen = false;

function mostraResposta(botaoX, respostaX) {
  isOpen = !isOpen;

  let resposta = document.getElementById(respostaX);

  let botao = document.getElementById(botaoX);
  if (isOpen) {
    resposta.style.display = "block";
    botao.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="non-zero" d="M13.069 5.157L8.384 9.768a.546.546 0 0 1-.768 0L2.93 5.158a.55.55 0 0 0-.771 0a.53.53 0 0 0 0 .759l4.684 4.61a1.65 1.65 0 0 0 2.312 0l4.684-4.61a.53.53 0 0 0 0-.76a.55.55 0 0 0-.771 0"/></svg>';
  } else {
    resposta.style.display = "none";
    botao.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m2.931 10.843l4.685-4.611a.546.546 0 0 1 .768 0l4.685 4.61a.55.55 0 0 0 .771 0a.53.53 0 0 0 0-.759l-4.684-4.61a1.65 1.65 0 0 0-2.312 0l-4.684 4.61a.53.53 0 0 0 0 .76a.55.55 0 0 0 .771 0"/></svg >';
  }
}
