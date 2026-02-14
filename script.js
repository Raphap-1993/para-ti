(() => {
  const HEART_COUNT = 75;
  const SPROUT_START_DELAY = 2600;
  const SPROUT_INTERVAL_MIN = 30;
  const SPROUT_INTERVAL_MAX = 90;
  const FALL_START_GAP = 1200;
  const FALL_INTERVAL_MIN = 120;
  const FALL_INTERVAL_MAX = 420;

  const canopy = document.getElementById("canopy");
  const svg = document.getElementById("treeSvg");
  if (!canopy || !svg) return; // por si estás en otra página

  const center = { x: 305, y: 190 };
  const radiusX = 190;
  const radiusY = 170;

  const leaves = [];
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randi = (min, max) => Math.floor(rand(min, max + 1));

  function randomHeartColor(){
    const colors = ["#ff3b7f","#ff5fa2","#ff7fb0","#ff96c1","#ff2f6f"];
    return colors[randi(0, colors.length - 1)];
  }

  function randomPointInOval(){
    const t = Math.random() * Math.PI * 2;
    const u = Math.pow(Math.random(), 0.55);
    return {
      x: center.x + Math.cos(t) * radiusX * u,
      y: center.y + Math.sin(t) * radiusY * u
    };
  }

  function createLeaf(){
    const {x, y} = randomPointInOval();
    const size = rand(16, 34);
    const rot = rand(-25, 25);

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#heart");
    use.setAttribute("x", x - size/2);
    use.setAttribute("y", y - size/2);
    use.setAttribute("width", size);
    use.setAttribute("height", size);
    use.setAttribute("class", "leaf");
    use.style.fill = randomHeartColor();
    use.style.transform = `rotate(${rot}deg)`;
    use.style.filter = "drop-shadow(0 6px 10px rgba(0,0,0,.12))";
    canopy.appendChild(use);
    return use;
  }

  function sproutLeaves(){
    let created = 0;
    (function next(){
      if(created >= HEART_COUNT) return;
      const leaf = createLeaf();
      leaves.push(leaf);
      created++;
      setTimeout(next, randi(SPROUT_INTERVAL_MIN, SPROUT_INTERVAL_MAX));
    })();
  }

  function startFalling(){
    const pool = [...leaves];
    (function dropOne(){
      if(pool.length === 0) return;
      const leaf = pool.splice(randi(0, pool.length-1), 1)[0];

      leaf.style.setProperty("--dx", rand(-40, 40).toFixed(1) + "px");
      leaf.style.setProperty("--dy", rand(220, 320).toFixed(1) + "px");
      leaf.style.setProperty("--rot", rand(-220, 220).toFixed(0) + "deg");
      leaf.style.setProperty("--fallDur", rand(1.8, 3.2).toFixed(2) + "s");
      leaf.classList.add("falling");
      leaf.addEventListener("animationend", () => leaf.remove(), { once:true });

      setTimeout(dropOne, randi(FALL_INTERVAL_MIN, FALL_INTERVAL_MAX));
    })();
  }

  setTimeout(() => {
    sproutLeaves();
    const avg = (SPROUT_INTERVAL_MIN + SPROUT_INTERVAL_MAX) / 2;
    const approxEnd = HEART_COUNT * avg;
    setTimeout(() => startFalling(), approxEnd + FALL_START_GAP);
  }, SPROUT_START_DELAY);
})();
