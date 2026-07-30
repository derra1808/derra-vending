const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const LANES = 4;
const LANE_W = W / LANES;

const overlay = document.getElementById("overlay");
const gameOverEl = document.getElementById("gameOver");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const bestEl = document.getElementById("best");
const finalScoreEl = document.getElementById("finalScore");
const newRecordEl = document.getElementById("newRecord");

let best = parseInt(localStorage.getItem("miniCourseBest") || "0", 10);
bestEl.textContent = best;

const player = {
  lane: 1,
  x: 0,
  y: H - 100,
  w: 44,
  h: 72,
  targetX: 0,
};

const state = {
  running: false,
  score: 0,
  speed: 4,
  lineOffset: 0,
  obstacles: [],
  spawnTimer: 0,
  shake: 0,
};

const COLORS = ["#ef4444", "#f97316", "#eab308", "#a855f7", "#64748b"];

function laneCenter(lane) {
  return lane * LANE_W + LANE_W / 2;
}

function resetGame() {
  player.lane = 1;
  player.targetX = laneCenter(1);
  player.x = player.targetX;
  state.score = 0;
  state.speed = 4;
  state.lineOffset = 0;
  state.obstacles = [];
  state.spawnTimer = 0;
  state.shake = 0;
  scoreEl.textContent = "0";
  speedEl.textContent = "0";
}

function startGame() {
  resetGame();
  overlay.classList.add("hidden");
  gameOverEl.classList.add("hidden");
  state.running = true;
}

function endGame() {
  state.running = false;
  state.shake = 12;
  finalScoreEl.textContent = Math.floor(state.score);
  if (state.score > best) {
    best = Math.floor(state.score);
    localStorage.setItem("miniCourseBest", String(best));
    bestEl.textContent = best;
    newRecordEl.classList.remove("hidden");
  } else {
    newRecordEl.classList.add("hidden");
  }
  setTimeout(() => gameOverEl.classList.remove("hidden"), 400);
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * LANES);
  const overlap = state.obstacles.some(
    (o) => o.lane === lane && o.y < 120
  );
  if (overlap) return;

  state.obstacles.push({
    lane,
    x: laneCenter(lane),
    y: -90,
    w: 40,
    h: 68,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
}

function drawRoad(shakeX, shakeY) {
  ctx.save();
  ctx.translate(shakeX, shakeY);

  ctx.fillStyle = "#141c28";
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i <= LANES; i++) {
    ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
    ctx.fillRect(i * LANE_W - 1, 0, 2, H);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.setLineDash([28, 28]);
  ctx.lineDashOffset = -state.lineOffset;

  for (let l = 1; l < LANES; l++) {
    ctx.beginPath();
    ctx.moveTo(l * LANE_W, 0);
    ctx.lineTo(l * LANE_W, H);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawCar(x, y, w, h, color, isPlayer) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(-w / 2 + 3, -h / 2 + 6, w, h);

  const body = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  if (isPlayer) {
    body.addColorStop(0, "#67e8f9");
    body.addColorStop(1, "#0891b2");
  } else {
    body.addColorStop(0, color);
    body.addColorStop(1, shade(color, -30));
  }

  roundRect(-w / 2, -h / 2, w, h, 8);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  roundRect(-w / 2 + 6, -h / 2 + 10, w - 12, h * 0.28, 4);
  ctx.fill();

  ctx.fillStyle = "#1e293b";
  roundRect(-w / 2 + 4, h / 2 - 14, 10, 10, 3);
  ctx.fill();
  roundRect(w / 2 - 14, h / 2 - 14, 10, 10, 3);
  ctx.fill();
  roundRect(-w / 2 + 4, -h / 2 + 4, 10, 10, 3);
  ctx.fill();
  roundRect(w / 2 - 14, -h / 2 + 4, 10, 10, 3);
  ctx.fill();

  if (isPlayer) {
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-4, -h / 2 - 4, 8, 6);
  }

  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amount;
  let g = ((n >> 8) & 255) + amount;
  let b = (n & 255) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${r},${g},${b})`;
}

function rectsOverlap(a, b) {
  return (
    Math.abs(a.x - b.x) < (a.w + b.w) * 0.42 &&
    Math.abs(a.y - b.y) < (a.h + b.h) * 0.42
  );
}

function update(dt) {
  if (!state.running) {
    if (state.shake > 0) state.shake *= 0.85;
    return;
  }

  player.targetX = laneCenter(player.lane);
  player.x += (player.targetX - player.x) * 0.22;

  state.lineOffset += state.speed * 1.8;
  state.score += state.speed * 0.08;
  state.speed = Math.min(14, 4 + state.score / 400);

  scoreEl.textContent = Math.floor(state.score);
  speedEl.textContent = Math.floor(state.speed * 10);

  state.spawnTimer += dt;
  const interval = Math.max(550, 1400 - state.score * 2);
  if (state.spawnTimer > interval) {
    spawnObstacle();
    state.spawnTimer = 0;
  }

  for (const o of state.obstacles) {
    o.y += state.speed;
  }
  state.obstacles = state.obstacles.filter((o) => o.y < H + 100);

  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  for (const o of state.obstacles) {
    if (rectsOverlap(pBox, o)) {
      endGame();
      break;
    }
  }
}

function draw() {
  const shakeX = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;
  const shakeY = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;

  drawRoad(shakeX, shakeY);

  ctx.save();
  ctx.translate(shakeX, shakeY);

  for (const o of state.obstacles) {
    drawCar(o.x, o.y, o.w, o.h, o.color, false);
  }
  drawCar(player.x, player.y, player.w, player.h, null, true);

  ctx.restore();
}

let last = performance.now();
function loop(now) {
  const dt = now - last;
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function moveLeft() {
  if (player.lane > 0) player.lane--;
}

function moveRight() {
  if (player.lane < LANES - 1) player.lane++;
}

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLeft();
    e.preventDefault();
  }
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveRight();
    e.preventDefault();
  }
  if (e.key === " " && overlay && !overlay.classList.contains("hidden")) {
    startGame();
  }
});

document.getElementById("btnStart").addEventListener("click", startGame);
document.getElementById("btnRestart").addEventListener("click", startGame);

const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");

function bindTouch(btn, dir) {
  const action = dir === "left" ? moveLeft : moveRight;
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (state.running) action();
  });
  btn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (state.running) action();
  });
}

bindTouch(btnLeft, "left");
bindTouch(btnRight, "right");

player.x = laneCenter(player.lane);
requestAnimationFrame(loop);
