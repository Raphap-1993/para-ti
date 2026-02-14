// 1) TEXTO QUE SE ESCRIBE (loop)
const lines = [
  "Si pudiera elegir un lugar seguro, sería a tu lado.",
  "Gracias por existir. 💗",
  "¿Quieres ser mi San Valentín?"
];

const typeEl = document.getElementById("typewriter");

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

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeLine(text){
  for (let i = 0; i < text.length; i++){
    typeEl.textContent += text[i];
    await sleep(35 + Math.random() * 25);
  }
}

// 2) “MI AMOR POR TI COMENZÓ HACE…” (contador)
const sinceEl = document.getElementById("since");
// Cambia esta fecha a la tuya (AAAA-MM-DDTHH:MM:SS)
const startDate = new Date("2025-02-14T00:00:00");

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

// 3) CORAZONES CAYENDO POR EL VIENTO (loop)
const falling = document.getElementById("falling");

function spawnHeart(){
  const h = document.createElement("div");
  h.className = "heart";

  const x = Math.random() * 100; // vw dentro del contenedor
  const dur = 3 + Math.random() * 3.5;
  const wind = (Math.random() * 160 - 80).toFixed(0) + "px";

  const colors = ["#ff2f86", "#ff5fb0", "#ff1f5a", "#ff79c6"];
  const c = colors[Math.floor(Math.random() * colors.length)];

  h.style.setProperty("--x", x + "%");
  h.style.setProperty("--dur", dur + "s");
  h.style.setProperty("--wind", wind);
  h.style.setProperty("--c", c);

  falling.appendChild(h);

  // borrar cuando termine para no acumular
  setTimeout(() => h.remove(), dur * 1000);
}

setInterval(spawnHeart, 180);
typeLoop();
