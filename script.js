/* =========================
   CONFIG
========================= */

// Cambia SOLO la fecha, si quieres que el contador sea real.
const LOVE_START = "2025-02-14T00:00:00";

// Texto EXACTO (no cambiado)
const LINES = [
  { id: "t1", text: "Para el amor de mi vida:" },
  { id: "t2", text: "Si pudiera elegir un lugar\nseguro, sería a tu lado." },
  { id: "t3", text: "Mi amor por ti comenzó hace..." }
];

// Timings (ms)
const TRUNK_GROW_MS = 1600;
const LEAVES_POP_TOTAL_MS = 1400;
const START_FALL_AFTER_MS = 700; // después de empezar a salir hojas

/* =========================
   DOM
========================= */
const canopyEl = document.getElementById("canopy");
const fallLayer = document.getElementById("fallLayer");
const counterEl = document.getElementById("counter");
const trunkEl = document.querySelector(".trunk");

/* =========================
   Utils
========================= */
const palette = ["#ff1744","#ff2b6a","#ff5c8a","#ffd1dc","#ffffff"];
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function pad2(n){ return String(n).padStart(2,"0"); }

function updateCounter(){
  const start = new Date(LOVE_START).getTime();
  const now = Date.now();
  let diff = Math.max(0, now - start);

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  counterEl.textContent =
    `${days} días ${pad2(hours)} horas ${pad2(minutes)} minutos ${pad2(seconds)} segundos`;
}

/* =========================
   Typewriter (texto escribiéndose)
========================= */
async function typeLine(el, text, speed = 22){
  el.textContent = "";
  for (let i = 0; i < text.length; i++){
    el.textContent += text[i];
    await sleep(speed);
  }
}

async function runTypewriter(){
  for (const line of LINES){
    const el = document.getElementById(line.id);
    await typeLine(el, line.text, 22);
    await sleep(160);
  }
}

/* =========================
   Tree: trunk grow → leaves appear
========================= */

// corazón paramétrico (contorno)
function heartPoints(n=240){
  const pts = [];
  for(let i=0;i<n;i++){
    const t = (Math.PI*2) * (i/n);
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    pts.push({x,y});
  }
  return pts;
}

function buildLeaves(count=270){
  canopyEl.innerHTML = "";
  const W = canopyEl.clientWidth;
  const H = canopyEl.clientHeight;

  const pts = heartPoints(260);
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const leaves = [];

  for(let i=0;i<count;i++){
    const p = pts[Math.floor(Math.random()*pts.length)];

    // base mapping
    let px = ((p.x - minX) / (maxX - minX)) * W;
    let py = (1 - (p.y - minY) / (maxY - minY)) * H;

    // push inward for fill
    const cx = (minX + maxX)/2;
    const cy = (minY + maxY)/2;
    const nx = (p.x - cx) / (maxX - minX);
    const ny = (p.y - cy) / (maxY - minY);
    const push = rand(0.06, 0.50);

    px = px - nx * push * W;
    py = py + ny * push * H;

    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = `${px}px`;
    leaf.style.top  = `${py}px`;
    leaf.style.background = pick(palette);
    leaf.style.transform = `rotate(45deg) scale(${rand(0.70, 1.18)})`;

    canopyEl.appendChild(leaf);
    leaves.push(leaf);
  }

  return leaves;
}

async function growTrunk(){
  trunkEl.style.height = "0px";
  trunkEl.animate(
    [{ height: "0px" }, { height: "105px" }],
    { duration: TRUNK_GROW_MS, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
  );
  await sleep(TRUNK_GROW_MS);
}

async function popLeaves(leaves){
  // aparecen en oleadas (como “creciendo”)
  const start = performance.now();
  const total = leaves.length;

  for(let i=0;i<total;i++){
    const t = (i/total) * LEAVES_POP_TOTAL_MS;
    setTimeout(() => {
      leaves[i].classList.add("pop");
    }, t);
  }

  // espera a que termine
  await sleep(LEAVES_POP_TOTAL_MS + 250);
}

/* =========================
   Falling leaves/hearts
========================= */

function spawnFallingFromCanopy(){
  const rect = canopyEl.getBoundingClientRect();

  // punto de salida dentro del “corazón”
  const x = rand(rect.left + rect.width*0.15, rect.left + rect.width*0.85);
  const y = rand(rect.top + rect.height*0.25, rect.top + rect.height*0.82);

  const el = document.createElement("div");
  el.className = "falling";
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  el.style.background = pick(palette);

  const duration = rand(3.6, 7.4);
  const dx = rand(-70, 70);
  const rot = rand(-220, 220);

  el.style.animationDuration = `${duration}s`;
  el.style.setProperty("--dx", `${dx}px`);
  el.style.setProperty("--rot", `${rot}deg`);

  fallLayer.appendChild(el);
  setTimeout(() => el.remove(), duration*1000 + 200);
}

/* =========================
   Orchestrator (todo junto)
========================= */
async function start(){
  // contador continuo
  updateCounter();
  setInterval(updateCounter, 1000);

  // preparar hojas (pero invisibles)
  const leaves = buildLeaves(280);

  // 1) crecer tronco
  const trunkTask = growTrunk();

  // 2) escribir texto al mismo tiempo (como el video)
  const typeTask = runTypewriter();

  await trunkTask;

  // 3) aparecer hojas
  const popTask = popLeaves(leaves);

  // 4) empezar caída mientras siguen apareciendo
  setTimeout(() => {
    // lluvia continua desde el canopy
    setInterval(spawnFallingFromCanopy, 150);
  }, START_FALL_AFTER_MS);

  await Promise.all([typeTask, popTask]);
}

// Rebuild on resize
window.addEventListener("resize", () => {
  buildLeaves(280);
});

window.addEventListener("load", start);
