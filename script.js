// DOM Elements
const display = document.getElementById("display");
const lapBtn = document.getElementById("lapBtn");
const startStopBtn = document.getElementById("startStopBtn");
const lapsList = document.getElementById("laps");
const modeToggle = document.getElementById("modeToggle");
const resetConfirm = document.getElementById("resetConfirm");
const confirmReset = document.getElementById("confirmReset");
const cancelReset = document.getElementById("cancelReset");
const toggleClockBtn = document.getElementById("toggleClock");
const clockDisplay = document.getElementById("clock");

let startTime, interval, elapsed = 0;
let running = false, lastLap = 0;

function formatTime(ms) {
  const date = new Date(ms);
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  const cs = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${min}:${sec}.${cs}`;
}

function updateTime() {
  elapsed = Date.now() - startTime;
  display.textContent = formatTime(elapsed);
}

// ========== Stopwatch Logic ========== //
startStopBtn.addEventListener("click", () => {
  if (!running && elapsed === 0) {
    // Start
    startTime = Date.now();
    interval = setInterval(updateTime, 50);
    running = true;
    startStopBtn.textContent = "Stop";
    startStopBtn.className = "stop";
    lapBtn.disabled = false;

  } else if (running) {
    // Pause
    clearInterval(interval);
    running = false;

    startStopBtn.textContent = "Resume";
    startStopBtn.className = "start";
    lapBtn.disabled = true;

    if (!document.getElementById("resetBtn")) {
      const resetBtn = document.createElement("button");
      resetBtn.id = "resetBtn";
      resetBtn.textContent = "Reset";
      resetBtn.className = "start";
      document.querySelector(".buttons").appendChild(resetBtn);

      resetBtn.addEventListener("click", () => {
        resetConfirm.style.display = "flex";
      });
    }

  } else {
    // Resume
    startTime = Date.now() - elapsed;
    interval = setInterval(updateTime, 50);
    running = true;
    startStopBtn.textContent = "Stop";
    startStopBtn.className = "stop";
    lapBtn.disabled = false;

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) resetBtn.remove();
  }
});

lapBtn.addEventListener("click", () => {
  const now = elapsed;
  const lapTime = now - lastLap;
  lastLap = now;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>Lap ${lapsList.children.length + 1}</strong>
    <span>${formatTime(lapTime)} / ${formatTime(now)}</span>
  `;
  lapsList.prepend(li);

  new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg").play();
});

confirmReset.addEventListener("click", () => {
  clearInterval(interval);
  elapsed = 0;
  lastLap = 0;
  display.textContent = "00:00.00";
  lapsList.innerHTML = "";
  resetConfirm.style.display = "none";
  startStopBtn.textContent = "Start";
  startStopBtn.className = "start";
  if (document.getElementById("resetBtn")) {
    document.getElementById("resetBtn").remove();
  }
});

cancelReset.addEventListener("click", () => {
  resetConfirm.style.display = "none";
});

// ========== DARK MODE with PERSISTENCE ========== //
if (localStorage.getItem("mode") === "dark") {
  modeToggle.checked = true;
  document.body.classList.add("dark");
}

modeToggle.addEventListener("change", () => {
  const isDark = modeToggle.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("mode", isDark ? "dark" : "light");
});

// ========== CLOCK DISPLAY with PERSISTENCE ========== //
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  clockDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateClock, 1000);

// Load clock state from localStorage
const clockVisible = localStorage.getItem("showClock") === "true";
clockDisplay.style.display = clockVisible ? "block" : "none";
toggleClockBtn.innerHTML = clockVisible ? "🕒 Hide Time" : "🕒 Show Time";

// Toggle clock visibility
toggleClockBtn.addEventListener("click", () => {
  const isVisible = clockDisplay.style.display === "block";
  clockDisplay.style.display = isVisible ? "none" : "block";
  toggleClockBtn.innerHTML = isVisible ? "🕒 Show Time" : "🕒 Hide Time";
  localStorage.setItem("showClock", !isVisible);
});
