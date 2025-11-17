import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://esp32-a5949-default-rtdb.firebaseio.com",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

const backgroundCarousel = document.getElementById("background-carousel");
const closeCarousel = document.getElementById("close-carousel");
const carousel = document.getElementById("carousel");
const carouselImage = document.getElementById("carousel-image");
const groupIndex = document.getElementById("group-index");
const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");

const loaderSpinner = document.getElementById("loading-log");

let html = "";

let globalStatus = "all";
let globalOrder = "desc";

let filteredLogs = [];
let inversedFiltered = [];

let cache = {};

let htmlCarousel;
let index = 0;
let images;
let logTimestamp;

async function getPhotos() {
  const logsRef = ref(db, "logs");

  onValue(logsRef, async (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      console.log("Fotos não encontradas");
      return;
    }

    logs = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    invertedLogs = logs.toReversed();

    await showLogs("all", invertedLogs);
  });
}

async function showLogs(status, allLogs = logs) {
  globalStatus = status;
  today = [];
  yesterday = [];
  lastWeek = [];
  lastMonth = [];

  showLoader();

  await new Promise((r) => setTimeout(r, 50));

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

  try {
    await printLogs();
  } catch (e) {
    console.log("Erro ao capturar os logs.");
  }

  hideLoader();
}

async function printLogs() {
  html = "";

  if (globalOrder === "desc") {
    if (today.length > 0) {
      html += `<h2 class="title-date">Hoje</h2>`;
      html += `<div class="log-group">`;

      for (const log of today) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (yesterday.length > 0) {
      html += `<h2 class="title-date">Ontem</h2>`;
      html += `<div class="log-group">`;

      for (const log of yesterday) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (lastWeek.length > 0) {
      html += `<h2 class="title-date">Semana Passada</h2>`;
      html += `<div class="log-group">`;

      for (const log of lastWeek) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (lastMonth.length > 0) {
      html += `<h2 class="title-date">Mais de uma semana</h2>`;
      html += `<div class="log-group">`;

      for (const log of lastMonth) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }
  }

  if (globalOrder === "asc") {
    if (lastMonth.length > 0) {
      html += `<h2 class="title-date">Mais de uma semana</h2>`;
      html += `<div class="log-group">`;

      for (const log of lastMonth) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (lastWeek.length > 0) {
      html += `<h2 class="title-date">Semana Passada</h2>`;
      html += `<div class="log-group">`;

      for (const log of lastWeek) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (yesterday.length > 0) {
      html += `<h2 class="title-date">Ontem</h2>`;
      html += `<div class="log-group">`;

      for (const log of yesterday) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

      html += `</div>`;
    }

    if (today.length > 0) {
      html += `<h2 class="title-date">Hoje</h2>`;
      html += `<div class="log-group">`;

      for (const log of today) {
        let logDate = new Date(log.dataHora);
        let address = await getLocationByCoords(log.latitude, log.longitude);

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
              <p><strong>Localização:</strong> ${address}</p>
            </div>
            ${
              log.status === "movement" || log.status === "open"
                ? `<div class="card-footer"> <a class="btn btn-ghost" onClick="showImages(${
                    log.timestamp
                  }, 0)">${statusVariables[log.status][3]}</a> </div>`
                : ""
            }
        </article>`;
      }

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

function changeOrderButton(order) {
  if (order === "desc") {
    buttonDesc.classList.add("active");
    buttonAsc.classList.remove("active");
  }

  if (order === "asc") {
    buttonAsc.classList.add("active");
    buttonDesc.classList.remove("active");
  }
}

async function getLocationByCoords(lat, lon) {
  const key = `${lat},${lon}`;

  if (cache[key]) {
    return cache[key];
  }

  const apiKey = "00304d3031344c0ab2e524f58cda3799";
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}&lang=pt`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error ao se comunicar com o Geoapify.");
    }

    const data = await response.json();

    const city = data.features[0].properties.city || "Cidade não identificada";
    const state =
      data.features[0].properties.county || "Estado não identificado";
    const country =
      data.features[0].properties.country || "País não identificado";

    const fullAddress = `${city}, ${state}, ${country}`;

    cache[key] = fullAddress;

    return fullAddress;
  } catch (e) {
    console.error("Error ao converter coordenadas.");
    return "Não identificada";
  }
}

function showLoader() {
  loaderSpinner.style.display = "flex";
}

function hideLoader() {
  loaderSpinner.style.display = "none";
}

function showImages(logID, index) {
  const log = logs.find((log) => log.timestamp === logID);

  if (log.images === undefined) {
    carouselImage.src = log.image;

    groupIndex.innerHTML = "";

    arrowLeft.innerHTML = "";
    arrowRight.innerHTML = "";
  }

  if (log.images !== undefined) {
    images = Object.values(log.images);
    logTimestamp = logID;

    htmlCarousel = "";

    carouselImage.src = images[index];

    for (let i = 0; i < images.length; i++) {
      htmlCarousel += `
      <div class="index ${index === i && "index-active"}" onClick="setImage(${i})"></div>
      `;
    }

    arrowLeft.innerHTML = "❮";
    arrowRight.innerHTML = "❯";
    groupIndex.innerHTML = htmlCarousel;
  }

  closeCarousel.style.display = "block";
  carousel.style.display = "block";
  backgroundCarousel.style.display = "flex";
}

function hideCarousel() {
  index = 0;
  images = [];
  logTimestamp = 0;

  carousel.style.display = "none";
  closeCarousel.style.display = "none";
  backgroundCarousel.style.display = "none";
}

function lastImage() {
  if (Array.isArray(images) && index > 0) {
    index -= 1;
    showImages(logTimestamp, index);
  } else if (Array.isArray(images) && index == 0) {
    index = images.length - 1;
    showImages(logTimestamp, index);
  }
}

function nextImage() {
  if (Array.isArray(images) && index < images.length - 1) {
    index += 1;
    showImages(logTimestamp, index);
  } else if (Array.isArray(images) && index === images.length - 1) {
    index = 0;
    showImages(logTimestamp, index);
  }
}

function setImage(newIndex){
  index = newIndex;
  showImages(logTimestamp, index);
}

window.showImages = showImages;
window.changeOrder = changeOrder;
window.changeButton = changeButton;
window.changeOrderButton = changeOrderButton;
window.hideCarousel = hideCarousel;
window.lastImage = lastImage;
window.nextImage = nextImage;
window.showLogs = showLogs;
window.setImage = setImage;
window.showMenu = showMenu;

window.addEventListener("load", () => {
  getPhotos();
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
