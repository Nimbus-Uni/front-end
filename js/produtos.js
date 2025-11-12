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
//   getPhotos();
// }, 1000);

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

const statusVariables = {
  open: [
    "O Cofre foi destrancado",
    "status-emergencia",
    "Status: Emergência",
    "Visualizar Fotos",
  ],
  close: ["O Cofre foi trancado", "status-ok", "Status: OK"],
  movement: [
    "O Cofre detectou presença",
    "status-aviso",
    "Status: Aviso",
    "Visualizar Foto",
  ],
};

let logs = [];
let invertedLogs = [];

const container = document.querySelector(".log-feed");

const buttonAll = document.querySelector(".btn-all");
const buttonOK = document.querySelector(".btn-close");
const buttonWarning = document.querySelector(".btn-warning");
const buttonEmergence = document.querySelector(".btn-emergence");

const buttonDesc = document.querySelector(".btn-desc");
const buttonAsc = document.querySelector(".btn-asc");

let html = "";

let globalStatus = "all";
let globalOrder = "desc";

async function getPhotos() {
  try {
    const response = await fetch(`${firebaseUrl}/logs.json`);
    const data = await response.json();

    if (!data) {
      console.log("Fotos não encontradas");
      return;
    }

    logs = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    invertedLogs = logs.toReversed();

    showLogs("all", invertedLogs);
  } catch (err) {
    console.log("Erro:", err);
  }
}

let filteredLogs = [];
let inversedFiltered = [];

function showLogs(status, allLogs = logs) {
  globalStatus = status;
  today = [];
  yesterday = [];
  lastWeek = [];
  lastMonth = [];

  if (globalOrder === "desc") {
    allLogs = invertedLogs;
  }

  if (globalOrder === "asc") {
    allLogs = logs;
  }

  if (status === "all") {
    allLogs.forEach((log) => {
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
    });
  }

  if (status !== "all") {
    filteredLogs = [];

    allLogs.forEach((log) => {
      if (log.status === status) {
        filteredLogs.push(log);
      }
    });

    inversedFiltered = filteredLogs.toReversed();

    filteredLogs.forEach((filteredLog) => {
      let filteredLogDate = new Date(filteredLog.dataHora);
      filteredLogDate.setHours(0, 0, 0, 0);

      if (filteredLogDate.getTime() === date.getTime()) {
        today.push(filteredLog);
      } else if (filteredLogDate.getTime() === yesterdayDate.getTime()) {
        yesterday.push(filteredLog);
      } else if (
        filteredLogDate.getTime() < yesterdayDate.getTime() &&
        filteredLogDate.getTime() >= lastWeekDate.getTime()
      ) {
        lastWeek.push(filteredLog);
      } else if (filteredLogDate.getTime() < lastWeekDate.getTime()) {
        lastMonth.push(filteredLog);
      }
    });
  }

  changeButton(status);

  printLogs();
}

function printLogs() {
  html = "";

  if (globalOrder === "desc") {
    if (today.length > 0) {
      html += `<h2 class="title-date">Hoje</h2>`;
      html += `<div class="log-group">`;

      today.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (yesterday.length > 0) {
      html += `<h2 class="title-date">Ontem</h2>`;
      html += `<div class="log-group">`;

      yesterday.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (lastWeek.length > 0) {
      html += `<h2 class="title-date">Semana Passada</h2>`;
      html += `<div class="log-group">`;

      lastWeek.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (lastMonth.length > 0) {
      html += `<h2 class="title-date">Mais de uma semana</h2>`;
      html += `<div class="log-group">`;

      lastMonth.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }
  }

  if (globalOrder === "asc") {
    if (lastMonth.length > 0) {
      html += `<h2 class="title-date">Mais de uma semana</h2>`;
      html += `<div class="log-group">`;

      lastMonth.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (lastWeek.length > 0) {
      html += `<h2 class="title-date">Semana Passada</h2>`;
      html += `<div class="log-group">`;

      lastWeek.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (yesterday.length > 0) {
      html += `<h2 class="title-date">Ontem</h2>`;
      html += `<div class="log-group">`;

      yesterday.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;
      });

      html += `</div>`;
    }

    if (today.length > 0) {
      html += `<h2 class="title-date">Hoje</h2>`;
      html += `<div class="log-group">`;

      today.forEach((log) => {
        let logDate = new Date(log.dataHora);

        html += `
        <article class="log-card">
            <div class="card-header">
              <h3>${statusVariables[log.status][0]}</h3>
              <span class="log-id">ID #${log.timestamp}</span>
              <span class="status ${statusVariables[log.status][1]}">${
          statusVariables[log.status][2]
        }</span>
            </div>
            <div class="card-body">
              <p><strong>Data:</strong> ${logDate.toLocaleString("pt-BR")}</p>
              <p><strong>Localização:</strong> Itapevi, São Paulo</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a href="#" class="btn btn-ghost">${
                    statusVariables[log.status][3]
                  }</a> </div>`
                : ""
            }
        </article>`;

        html += `</div>`;
      });

      html += `</div>`;
    }
  }

  container.innerHTML = html;
}

function changeOrder(order) {
  globalOrder = order;

  if (order === "desc") {
    showLogs(globalStatus, invertedLogs);
  }

  if (order === "asc") {
    showLogs(globalStatus, logs);
  }

  changeOrderButton(order);
}

function changeButton(status) {
  if (status === "all") {
    buttonAll.classList.add("active");
    buttonOK.classList.remove("active");
    buttonWarning.classList.remove("active");
    buttonEmergence.classList.remove("active");
  }

  if (status === "close") {
    buttonOK.classList.add("active");
    buttonAll.classList.remove("active");
    buttonWarning.classList.remove("active");
    buttonEmergence.classList.remove("active");
  }

  if (status === "movement") {
    buttonWarning.classList.add("active");
    buttonAll.classList.remove("active");
    buttonOK.classList.remove("active");
    buttonEmergence.classList.remove("active");
  }

  if (status === "open") {
    buttonEmergence.classList.add("active");
    buttonWarning.classList.remove("active");
    buttonAll.classList.remove("active");
    buttonOK.classList.remove("active");

  }
}

function changeOrderButton(order){
  if (order === "desc"){
    buttonDesc.classList.add("active");
    buttonAsc.classList.remove("active");
  }

  if (order === "asc"){
    buttonAsc.classList.add("active");
    buttonDesc.classList.remove("active");
  }
}

getPhotos();

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
