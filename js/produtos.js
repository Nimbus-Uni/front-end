console.log("Nimbus Security Page Loaded ✅");
// Tela de carregamento
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");

  if (loader != null) {
    loader.style.display = "none"; // esconde a tela de carregamento quando terminar de carregar
  }
});

// Tela offline
function updateOnlineStatus() {
  const offlineScreen = document.getElementById("offline-screen");
  if (navigator.onLine && offlineScreen != null) {
    offlineScreen.style.display = "none";
  }

  if (!navigator.onLine && offlineScreen != null) {
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

// Conexão com Firebase
const firebaseUrl = "https://esp32-a5949-default-rtdb.firebaseio.com";

// setInterval(() => {
//   pegarFotos();
// }, 1000);

async function pegarFotos() {
  try {
    const response = await fetch(`${firebaseUrl}/logs.json`);
    const data = await response.json();

    if (!data) {
      console.log("Fotos não encontradas");
      return;
    }

    const logs = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    const container = document.querySelector(".log-feed");

    let html = "";

    logs.reverse();

    let openLogs = [];
    let closeLogs = [];
    let movementLogs = [];

    let today = [];
    let yesterday = [];
    let lastWeek = [];
    let lastMonth = [];

    let date = new Date();
    let yesterdayDate = new Date(date);
    let lastWeekDate = new Date(date);

    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);

    date.setHours(0, 0, 0, 0);
    yesterdayDate.setHours(0, 0, 0, 0);
    lastWeekDate.setHours(0, 0, 0, 0);

    logs.forEach((log) => {
      let logData = new Date(log.dataHora);
      logData.setHours(0, 0, 0, 0);

      if (logData.getTime() === date.getTime()) {
        today.push(log);
      } else if (logData.getTime() === yesterdayDate.getTime()) {
        yesterday.push(log);
      } else if (
        logData.getTime() < yesterdayDate.getTime() &&
        logData.getTime() >= lastWeekDate.getTime()
      ) {
        lastWeek.push(log);
      } else if (logData.getTime() < lastWeekDate.getTime()) {
        lastMonth.push(log);
      }

      if (log.status === "open") {
        openLogs.push(log);
      }

      if (log.status === "close") {
        closeLogs.push(log);
      }

      if (log.status === "movement") {
        movementLogs.push(log);
      }
    });

    if (today.length > 0) {
      html += `<h2 class="title-date">Hoje</h2>`;
      html += `<div class="log-group">`;
      today.forEach((log) => {
        let logDate = new Date(log.dataHora);

        if (log.status == "close") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
        }

        if (log.status == "movement") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
            </article>`;
        }

        if (log.status == "open") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
            </article>`;
        }
      });

      html += `</div>`;
    }

    if (yesterday.length > 0) {
      html += `<h2 class="title-date">Ontem</h2>`;
      html += `<div class="log-group">`;

      yesterday.forEach((log) => {
        let logDate = new Date(log.dataHora);

        if (log.status == "close") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
        }

        if (log.status == "movement") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
        }

        if (log.status == "open") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
        }
      });

      html += `</div>`;
    }

    if (lastWeek.length > 0) {
      html += `<h2 class="title-date">Semana Passada</h2>`;
      html += `<div class="log-group">`;

      lastWeek.forEach((log) => {
        let logDate = new Date(log.dataHora);

        if (log.status == "close") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
        }

        if (log.status == "movement") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
        }

        if (log.status == "open") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
        }
      });

      html += `</div>`;
    }

    if (lastMonth.length > 0) {
      html += `<h2 class="title-date">Mais de uma semana</h2>`;
      html += `<div class="log-group">`;

      lastMonth.forEach((log) => {
        let logDate = new Date(log.dataHora);

        if (log.status == "close") {
          html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
        }

        if (log.status == "movement") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
        }

        if (log.status == "open") {
          html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
        }
      });

      html += `</div>`;
    }

    container.innerHTML = html;
  } catch (err) {
    console.log("Erro:", err);
  }
}

function showLogs(status) {
  if (today.length > 0) {
    html += `<h2 class="title-date">Hoje</h2>`;
    html += `<div class="log-group">`;
    today.forEach((log) => {
      let logDate = new Date(log.dataHora);

      if (log.status == "close") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
      }

      if (log.status == "movement") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
            </article>`;
      }

      if (log.status == "open") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
            </article>`;
      }
    });

    html += `</div>`;
  }

  if (yesterday.length > 0) {
    html += `<h2 class="title-date">Ontem</h2>`;
    html += `<div class="log-group">`;

    yesterday.forEach((log) => {
      let logDate = new Date(log.dataHora);

      if (log.status == "close") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
      }

      if (log.status == "movement") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
      }

      if (log.status == "open") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
      }
    });

    html += `</div>`;
  }

  if (lastWeek.length > 0) {
    html += `<h2 class="title-date">Semana Passada</h2>`;
    html += `<div class="log-group">`;

    lastWeek.forEach((log) => {
      let logDate = new Date(log.dataHora);

      if (log.status == "close") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
      }

      if (log.status == "movement") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
      }

      if (log.status == "open") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
      }
    });

    html += `</div>`;
  }

  if (lastMonth.length > 0) {
    html += `<h2 class="title-date">Mais de uma semana</h2>`;
    html += `<div class="log-group">`;

    lastMonth.forEach((log) => {
      let logDate = new Date(log.dataHora);

      if (log.status == "close") {
        html += `
            <article class="log-card">
            <div class="card-header">
              <h3>Cofre foi trancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-ok">Status: OK</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
          </article>`;
      }

      if (log.status == "movement") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O cofre detectou presença</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-aviso">Status: Aviso</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Foto</a>
            </div>
        </article>`;
      }

      if (log.status == "open") {
        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>O Cofre foi destrancado</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status status-emergencia">Status: Emergência</span>
            </div>
            <div class="card-body">
              <p><strong>Horário:</strong> ${logDate.toLocaleString(
                "pt-BR"
              )}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            <div class="card-footer">
              <a href="#" class="btn btn-ghost">Visualizar Fotos</a>
            </div>
        </article>`;
      }
    });

    html += `</div>`;
  }
}

pegarFotos();
