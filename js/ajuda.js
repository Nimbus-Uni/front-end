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

function gerarFAQ(duvidas, duvidasArea) {
  duvidasArea.innerHTML = "";

  if (duvidas.length === 0) {
    duvidasArea.innerHTML =
      "<h1 id='sem-duvida'>Infelizmente sua dúvida não está disponível em nosso FAQ no momento :/</h1>";
  }

  if (duvidas.length !== 0) {
    duvidas.forEach((duvida, index) => {
      duvidasArea.innerHTML += `
  <section id="duvida">
  <main>
    <div>
      <h3>${duvida.titulo}</h3>
      <button onclick="mostraResposta('botao-${index + 1}', 'resposta-${
        index + 1
      }')" id="botao-${index + 1}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            d="m2.931 10.843l4.685-4.611a.546.546 0 0 1 .768 0l4.685 4.61a.55.55 0 0 0 .771 0a.53.53 0 0 0 0-.759l-4.684-4.61a1.65 1.65 0 0 0-2.312 0l-4.684 4.61a.53.53 0 0 0 0 .76a.55.55 0 0 0 .771 0"
          />
        </svg>
      </button>
    </div>
    <p id="resposta-${index + 1}">
  ${duvida.resposta}
    </p>
  </main>
</section>
  `;
    });
  }
}

// Sistema de Pesquisa

let duvida = [
  {
    titulo: "Quais serviços/produtos a empresa oferece?",
    resposta:
      "Oferecemos soluções completas em segurança e tecnologia, incluindo sistemas de monitoramento digital, cofres inteligentes, ferramentas de proteção de dados e softwares de gestão. Nossos produtos foram desenvolvidos para garantir confiabilidade, praticidade e proteção em ambientes pessoais e corporativos.",
  },
  {
    titulo: "É necessário conhecimento técnico para utilizar as soluções?",
    resposta:
      "Não. Nossos produtos e sistemas foram desenvolvidos para serem intuitivos e fáceis de usar, mesmo por usuários sem experiência técnica. Além disso, oferecemos tutoriais e suporte para auxiliar na configuração inicial e no uso diário.",
  },
  {
    titulo: "Existe suporte técnico em caso de problemas?",
    resposta:
      "Sim. Nossa equipe de suporte está disponível para auxiliar em qualquer dificuldade relacionada aos produtos e serviços. Oferecemos atendimento rápido e eficiente, garantindo que você tenha toda a assistência necessária sempre que precisar.",
  },
  {
    titulo: "Como entro em contato com a equipe de suporte?",
    resposta:
      "Você pode entrar em contato através do nosso formulário de contato. Nossa equipe está pronta para responder suas dúvidas e fornecer suporte técnico especializado.",
  },
];

let duvidasPesquisa = [];

let duvidasArea = document.getElementById("area-duvidas");

let barraPesquisa = document.getElementById("pesquisa");

gerarFAQ(duvida, duvidasArea);

barraPesquisa.addEventListener("input", (e) => {
  duvidasPesquisa = [];

  if (e.target.value.length === 0) {
    duvidasPesquisa = [
      {
        titulo: "Quais serviços/produtos a empresa oferece?",
        resposta:
          "Oferecemos soluções completas em segurança e tecnologia, incluindo sistemas de monitoramento digital, cofres inteligentes, ferramentas de proteção de dados e softwares de gestão. Nossos produtos foram desenvolvidos para garantir confiabilidade, praticidade e proteção em ambientes pessoais e corporativos.",
      },
      {
        titulo: "É necessário conhecimento técnico para utilizar as soluções?",
        resposta:
          "Não. Nossos produtos e sistemas foram desenvolvidos para serem intuitivos e fáceis de usar, mesmo por usuários sem experiência técnica. Além disso, oferecemos tutoriais e suporte para auxiliar na configuração inicial e no uso diário.",
      },
      {
        titulo: "Existe suporte técnico em caso de problemas?",
        resposta:
          "Sim. Nossa equipe de suporte está disponível para auxiliar em qualquer dificuldade relacionada aos produtos e serviços. Oferecemos atendimento rápido e eficiente, garantindo que você tenha toda a assistência necessária sempre que precisar.",
      },
      {
        titulo: "Como entro em contato com a equipe de suporte?",
        resposta:
          "Você pode entrar em contato através do nosso formulário de contato. Nossa equipe está pronta para responder suas dúvidas e fornecer suporte técnico especializado.",
      },
    ];
  }

  if (e.target.value.length !== 0) {
    duvida.forEach((duvida) => {
      if (
        duvida.titulo.includes(e.target.value) ||
        duvida.resposta.includes(e.target.value)
      ) {
        duvidasPesquisa.push(duvida);
      }
    });
  }

  gerarFAQ(duvidasPesquisa, duvidasArea);
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
