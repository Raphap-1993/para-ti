// ========= 1) TEXTO ESCRIBIÉNDOSE (loop) =========
const lines = [
  "Si pudiera elegir un lugar seguro, sería a tu lado.",
  "Gracias por existir. 💗",
  "¿Quieres ser mi San Valentín?"
];

const typeEl = document.getElementById("typewriter");

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeLine(text){
  for (let i = 0; i < text.length; i++){
    typeEl.textContent += text[i];
    await sleep(30 + Math.random() * 25);
  }
}

async function typeLoop(){
  while(true){
    typeEl.textContent = "";
    for (let i = 0; i < lines.length; i++){
      await typeLine(lines[i]);
      if (i < lines.length - 1) {
        typeEl.textContent += "\n";
        await sleep(500);
      }
    }
    await sleep(1800);
  }
}
typeLoop();

// ========= 2) CONTADOR “comenzó hace…” =========
const sinceEl = document.getElementById("since");
const startDate = new Date("2025-02-14T00:00:00"); // cámbiala

function updateSince(){
  const now = new Date();
  let diff = Math.max(0, now - startDate);

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  sinceEl.textContent =
    `Mi amor por ti comenzó hace... ${days} días ${hours} horas ${mins} minutos ${secs} segundos`;
}
setInterval(updateSince, 1000);
updateSince();

// ========= 3) CORAZONES QUE CAEN DESDE LA COPA (solo cuando hay hojas) =========
const falling = document.getElementById("falling");

// “Zona de copa” (en porcentaje del contenedor) para que caigan desde arriba del árbol, no desde cualquier parte.
const canopyArea = {
  xMin: 22, xMax: 78, // % horizontal
  yMin: 18, yMax: 55  // % vertical
};

// Timing: que empiece a caer después de que broten las hojas y pare al final del loop
const LOOP_MS = 9000;
const FALL_START = 3200; // ms
const FALL_END   = 8200; // ms

let fallInterval = null;

function spawnFallingHeart(){
  const h = document.createElement("div");
  h.className = "fall-heart";

  const x = canopyArea.xMin + Math.random() * (canopyArea.xMax - canopyArea.xMin);
  const y = canopyArea.yMin + Math.random() * (canopyArea.yMax - canopyArea.yMin);

  const dur = 2600 + Math.random() * 2400; // 2.6s a 5s
  const wind = (Math.random() * 220 - 110).toFixed(0) + "px";

  const colors = ["#ff2f86", "#ff5fb0", "#ff1f5a", "#ff79c6"];
  const c = colors[Math.floor(Math.random() * colors.length)];

  h.style.setProperty("--x", x + "%");
  h.style.setProperty("--y", y + "%");
  h.style.setProperty("--dur", dur + "ms");
  h.style.setProperty("--wind", wind);
  h.style.setProperty("--c", c);

  falling.appendChild(h);
  setTimeout(() => h.remove(), dur + 50);
}

function startFalling(){
  if (fallInterval) return;
  fallInterval = setInterval(spawnFallingHeart, 160);
}
function stopFalling(){
  if (!fallInterval) return;
  clearInterval(fallInterval);
  fallInterval = null;
}

// Loop sincronizado con la animación CSS
function scheduleLoop(){
  setTimeout(startFalling, FALL_START);
  setTimeout(stopFalling, FALL_END);

  setTimeout(() => {
    stopFalling();
    scheduleLoop();
  }, LOOP_MS);
}
scheduleLoop();
