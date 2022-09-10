"use strict";
import playList from "./playList.js";

let randomNum;
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const time = document.querySelector(".time");
const nameInput = document.querySelector(".name");
const greetigNew = document.querySelector(".greeting");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const cityInput = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const quote = document.querySelector(".quote-text");
const author = document.querySelector(".author");
const buttonQuete = document.querySelector(".change-quote");
const playButton = document.querySelector(".play ");
const audio = new Audio();
let isPlay = false;
const playListItems = document.querySelectorAll(".play-item");
const playNext = document.querySelector(".play-next");
const playPrev = document.querySelector(".play-prev");
let playNum = 0;
const settings = document.querySelector(".settings");
const settingsButton = document.querySelector(".settings__button");

const settingsPanel = document.querySelector(".settings__panel");
const state = {
  language: "en",
  photoSource: "github",
  blocks: ["time", "date", "greeting-container", "weather", "player", "quote"],
};

const tasks = [];
let checkboxState = 0;
let curLang = "eng";
const langRu = document.querySelector(".lang__ru");
const langEng = document.querySelector(".lang__eng");
initSettings();

function initSettings() {
  let savedLang = window.localStorage.getItem("lang");

  if (savedLang != null && savedLang === ".lang__ru") {
    langEng.classList.remove("lang__active");
    langRu.classList.add("lang__active");
  }
}

const showGreeting = () => {
  if (langEng.classList.contains("lang__active")) {
    greetigNew.textContent = `Good ${getTimeOfDay()}`;
  } else {
    greetigNew.textContent = `${getTimeOfDay()}`;
  }
};

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  setTimeout(showTime, 1000);
  showDate();
  showGreeting();
}

showTime();

function showDate() {
  if (langEng.classList.contains("lang__active")) {
    const datenew = document.querySelector(".date");
    const date = new Date();

    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    let currentDate = date.toLocaleDateString("en-US", options);
    datenew.textContent = currentDate;
  } else if (langRu.classList.contains("lang__active")) {
    const datenew = document.querySelector(".date");
    const date = new Date();

    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    let currentDate = date.toLocaleDateString("ru-RU", options);
    datenew.textContent = currentDate;
  }
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const ru = {
    night: `Доброй Ночи `,
    morning: `Доброе Утро `,
    afternoon: `Добрый День `,
    evening: `Добрый Вечер `,
  };
  if (langEng.classList.contains("lang__active")) {
    if (0 <= hours && hours < 6) {
      return "night";
    } else if (6 <= hours && hours < 12) {
      return "morning";
    } else if (12 <= hours && hours < 18) {
      return "afternoon";
    } else if (18 <= hours && hours < 24) {
      return "evening";
    }
  } else if (langRu.classList.contains("lang__active")) {
    const bgNum = String(randomNum).padStart(2, "0");
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = `url(${img.src})`;
    };
    if (0 <= hours && hours < 6) {
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/night/${bgNum}.jpg`;
      return `${ru.night}`;
    } else if (6 <= hours && hours < 12) {
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/morning/${bgNum}.jpg`;
      return `${ru.morning}`;
    } else if (12 <= hours && hours < 18) {
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/afternoon/${bgNum}.jpg`;
      return `${ru.afternoon}`;
    } else if (18 <= hours && hours < 24) {
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/${bgNum}.jpg`;
      return `${ru.evening}`;
    }
  }
}

getTimeOfDay();

function setName() {
  if (langEng.classList.contains("lang__active")) {
    nameInput.placeholder = "[Enter name]";
  } else if (langRu.classList.contains("lang__active")) {
    nameInput.placeholder = "[Введите имя]";
  }
}
setName();

function setLocalStorageName() {
  localStorage.setItem("name", nameInput.value);
}
window.addEventListener("beforeunload", setLocalStorageName);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    nameInput.value = localStorage.getItem("name");
  }
}
window.addEventListener("load", getLocalStorage);

function getRandomNum() {
  randomNum = Math.floor(Math.random() * 20) + 1;
}
getRandomNum();

function setBg() {
  let timeOfDay = getTimeOfDay();
  const bgNum = String(randomNum).padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();

function getSlideNext() {
  if (randomNum === 20) {
    randomNum = 1;
  } else {
    randomNum++;
  }
  setBg();
}

function getSlidePrev() {
  if (randomNum === 1) {
    randomNum = 20;
  } else {
    randomNum--;
  }
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

//https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=en&appid=67fcd439d0307804eb2687f02f8f44a0&units=metric

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=en&appid=67fcd439d0307804eb2687f02f8f44a0&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (langEng.classList.contains("lang__active")) {
    if (res.status != 200) {
      weatherIcon.className = "";
      temperature.textContent = "city not found";
      weatherDescription.textContent = "";
      wind.textContent = "";
      humidity.textContent = "";
    } else {
      weatherIcon.className = "weather-icon owf";
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      wind.textContent =
        "Wind speed:" + " " + `${data.wind.speed.toFixed(0)}m/s`;
      humidity.textContent =
        "Humidity:" + " " + `${data.main.humidity.toFixed(0)}%`;
    }
  } else if (langRu.classList.contains("lang__active")) {
    if (res.status != 200) {
      weatherIcon.className = "";
      temperature.textContent = "Город не найден";
      weatherDescription.textContent = "";
      wind.textContent = "";
      humidity.textContent = "";
    } else {
      temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
      weatherDescription.textContent = "";
      wind.textContent =
        "Скорость ветра:" + " " + `${data.wind.speed.toFixed(0)}м/c`;
      humidity.textContent =
        "Влажность:" + " " + `${data.main.humidity.toFixed(0)}%`;
    }
  }
}

function setCity(event) {
  if (event.code === "Enter") {
    getWeather();
    cityInput.blur();
  }
}

document.addEventListener("DOMContentLoaded", getWeather);
cityInput.addEventListener("keypress", setCity);

function cityLocalStorage2() {
  localStorage.setItem("city", cityInput.value);
}
window.addEventListener("beforeunload", cityLocalStorage2);

function getLocalStorage2() {
  if (localStorage.getItem("city")) {
    cityInput.value = localStorage.getItem("city");
    getWeather();
  }
}
window.addEventListener("load", getLocalStorage2);

async function getQuotes() {
  if (langEng.classList.contains("lang__active")) {
    const quotes = "data.json";
    const res = await fetch(quotes);
    const data = await res.json();

    quote.textContent = data[0].text;
    author.textContent = data[0].author;
    let index = 1;

    function getQuotesNext() {
      let value = data[index];
      quote.textContent = value.text;
      author.textContent = value.author;

      if (index === 4) {
        index = 0;
      } else {
        index++;
      }
    }
    buttonQuete.addEventListener("click", getQuotesNext);
  } else if (langRu.classList.contains("lang__active")) {
    const quotes = "dataru.json";
    const res = await fetch(quotes);
    const data = await res.json();

    quote.textContent = data[0].text;
    author.textContent = data[0].author;
    let index = 1;

    function getQuotesNext() {
      let value = data[index];
      quote.textContent = value.text;
      author.textContent = value.author;

      if (index === 4) {
        index = 0;
      } else {
        index++;
      }
    }
    buttonQuete.addEventListener("click", getQuotesNext);
  }
}

getQuotes();

function startAudio() {
  audio.play();
  isPlay = true;
  playButton.classList.add("pause");
  playActive();
}

function stopAudio() {
  audio.pause();
  isPlay = false;
  playButton.classList.remove("pause");
}

function applyAdio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
}

function playAudio() {
  applyAdio();

  if (!isPlay) {
    startAudio();
  } else {
    stopAudio();
  }
}

function playNextAudio() {
  playNum = playNum === 3 ? 0 : playNum + 1;

  applyAdio();
  startAudio();
}

function playPrevAudio() {
  playNum = playNum === 0 ? 3 : playNum - 1;

  applyAdio();
  startAudio();
}

function playActive() {
  playListItems.forEach((element) => {
    element.classList.remove("item-aclive");
  });

  let item = playListItems.item(playNum);
  item.classList.add("item-aclive");
}

playButton.addEventListener("click", playAudio);
playNext.addEventListener("click", playNextAudio);
playPrev.addEventListener("click", playPrevAudio);

settingsButton.addEventListener("click", toggleSettingPanel);

function toggleSettingPanel() {
  settingsPanel.classList.add("settings__panel_hide");
  settingsPanel.classList.toggle("settings__panel_show");
  settings.classList.toggle("button_register");
}

function popupClickHandler(event) {
  if (event.target.matches(".settings")) {
    toggleSettingPanel();
  }
}

settings.addEventListener("click", popupClickHandler);

const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

allCheckboxes.forEach((el, i) => {
  let key = `.${state.blocks[i]}`;
  let savedValue = window.localStorage.getItem(key);
  let elemToHide = document.querySelector(key);

  if (savedValue) {
    elemToHide.classList.add("hidden");
    el.checked = false;
  }

  el.addEventListener("change", () => {
    elemToHide.classList.toggle("hidden");

    if (elemToHide.classList.contains("hidden")) {
      window.localStorage.setItem(key, true);
    } else {
      window.localStorage.removeItem(key);
    }
  });
});

function toggleActiveLang() {
  langEng.classList.toggle("lang__active");
  langRu.classList.toggle("lang__active");

  if (langEng.classList.contains("lang__active")) {
    window.localStorage.setItem("lang", ".lang__eng");
  } else {
    window.localStorage.setItem("lang", ".lang__ru");
  }

  setName();
  getWeather();
  getQuotes();
  setQuotesLang();
}
langRu.addEventListener("click", toggleActiveLang);
langEng.addEventListener("click", toggleActiveLang);
//window.localStorage.getItem("click", toggleActiveLang);

const classENGLanguage = document.querySelector(".classENGLanguage");
const classENGTime = document.querySelector(".classENGTime");
const classENGDate = document.querySelector(".classENGDate");
const classENGGreeting = document.querySelector(".classENGGreeting");
const classENGWeather = document.querySelector(".classENGWeather");
const classENGAudio = document.querySelector(".classENGAudio");
const classENGQuotes = document.querySelector(".classENGQuotes");
function setQuotesLang() {
  if (langEng.classList.contains("lang__active")) {
    classENGLanguage.textContent = "Language";
    classENGLanguage.style.paddingRight = "38px";
    classENGTime.textContent = "Time";
    classENGDate.textContent = "Date";
    classENGGreeting.textContent = "Greeting";
    classENGWeather.textContent = "Weather";
    classENGAudio.textContent = "Audio";
    classENGQuotes.textContent = "Quotes";
  } else if (langRu.classList.contains("lang__active")) {
    classENGLanguage.textContent = "Язык";
    classENGLanguage.style.paddingRight = "70px";
    classENGTime.textContent = "Время";
    classENGDate.textContent = "Дата";
    classENGGreeting.textContent = "Приветствие";
    classENGWeather.textContent = "Погода";
    classENGAudio.textContent = "Аудио";
    classENGQuotes.textContent = "Цитаты";
  }
}
setQuotesLang();
