import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const MAP_SIZE = 24;
const HALF = MAP_SIZE / 2;
const MAX_HEIGHT = 14;
const BLOCK = 1;

const PALETTE = [
  { id: 1, color: 0xe74c3c, name: "Rouge" },
  { id: 2, color: 0x3498db, name: "Bleu" },
  { id: 3, color: 0x2ecc71, name: "Vert" },
  { id: 4, color: 0xf1c40f, name: "Jaune" },
  { id: 5, color: 0x9b59b6, name: "Violet" },
  { id: 6, color: 0xecf0f1, name: "Blanc" },
];

const canvas = document.getElementById("canvas");
const help = document.getElementById("help");
const btnPlay = document.getElementById("btnPlay");
const hotbar = document.getElementById("hotbar");
const crosshair = document.querySelector(".crosshair");
const blockCountEl = document.getElementById("blockCount");
const toast = document.getElementById("toast");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 40, 90);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xffffff, 0x3d5c3d, 0.65);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(20, 40, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 80;
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
scene.add(sun);

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const blocks = new Map();
const blockGeo = new THREE.BoxGeometry(BLOCK, BLOCK, BLOCK);
const ghostMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
const ghost = new THREE.Mesh(blockGeo, ghostMat);
ghost.visible = false;
scene.add(ghost);

let selectedColor = PALETTE[1].color;
let blockRotation = 0;
let locked = false;

const player = {
  height: 1.7,
  radius: 0.35,
  velocity: new THREE.Vector3(),
  onGround: false,
};

const keys = {};
const raycaster = new THREE.Raycaster();
raycaster.far = 8;

function blockKey(x, y, z) {
  return `${x},${y},${z}`;
}

function inBounds(x, y, z) {
  return x >= -HALF && x < HALF && z >= -HALF && z < HALF && y >= 0 && y < MAX_HEIGHT;
}

function createBlockMesh(color) {
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(blockGeo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addBlock(x, y, z, color, isGround = false) {
  const k = blockKey(x, y, z);
  if (blocks.has(k)) return false;
  const mesh = createBlockMesh(color);
  mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
  mesh.userData = { x, y, z, ground: isGround };
  scene.add(mesh);
  blocks.set(k, mesh);
  return true;
}

function removeBlock(x, y, z) {
  const k = blockKey(x, y, z);
  const mesh = blocks.get(k);
  if (!mesh || mesh.userData.ground) return false;
  scene.remove(mesh);
  mesh.geometry.dispose();
  mesh.material.dispose();
  blocks.delete(k);
  return true;
}

function buildWorld() {
  const grass = 0x5cb85c;
  const dirt = 0x8b6914;
  const stone = 0x7f8c8d;
  const sand = 0xf4d03f;
  const water = 0x3498db;

  for (let x = -HALF; x < HALF; x++) {
    for (let z = -HALF; z < HALF; z++) {
      const dist = Math.sqrt(x * x + z * z);
      const isBeach = dist > HALF - 4;
      const isPath = Math.abs(x) <= 1 && z > -4 && z < 8;
      let color = grass;
      if (isBeach) color = sand;
      if (isPath) color = 0xc0c0c0;
      addBlock(x, 0, z, color, true);
      if (!isBeach && Math.random() < 0.04) addBlock(x, 1, z, dirt, true);
    }
  }

  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      addBlock(x, 0, z, 0x95a5a6, true);
    }
  }

  const spawnHouse = (ox, oz) => {
    for (let x = 0; x < 4; x++) {
      for (let z = 0; z < 4; z++) {
        addBlock(ox + x, 1, oz + z, 0x3498db);
        if (x === 0 || x === 3 || z === 0 || z === 3) {
          for (let y = 2; y <= 3; y++) addBlock(ox + x, y, oz + z, 0xe74c3c);
        }
      }
    }
    addBlock(ox + 1, 4, oz + 1, 0xf1c40f);
    addBlock(ox + 2, 4, oz + 1, 0xf1c40f);
    addBlock(ox + 1, 4, oz + 2, 0xf1c40f);
    addBlock(ox + 2, 4, oz + 2, 0xf1c40f);
  };

  spawnHouse(-8, -6);
  spawnHouse(6, 4);

  for (let i = 0; i < 12; i++) {
    const tx = Math.floor(Math.random() * (HALF - 6)) - (HALF / 2 - 3);
    const tz = Math.floor(Math.random() * (HALF - 6)) - (HALF / 2 - 3);
    if (Math.abs(tx) < 5 && Math.abs(tz) < 5) continue;
    addBlock(tx, 1, tz, 0x27ae60);
    addBlock(tx, 2, tz, 0x2ecc71);
    addBlock(tx, 3, tz, 0x2ecc71);
  }

  const pond = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshLambertMaterial({ color: water, transparent: true, opacity: 0.75 })
  );
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(8, 0.52, -8);
  scene.add(pond);

  for (let i = 0; i < 8; i++) {
    addBlock(8 + (i % 4) - 1, 1, -9 + Math.floor(i / 4), stone);
  }

  updateBlockCount();
}

function createAvatar() {
  const avatar = new THREE.Group();
  const skin = 0xffdbac;
  const shirt = 0x3b82f6;
  const pants = 0x2c3e50;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: skin }));
  head.position.y = 1.45;
  head.castShadow = true;

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.35), new THREE.MeshLambertMaterial({ color: shirt }));
  torso.position.y = 0.85;
  torso.castShadow = true;

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.28), new THREE.MeshLambertMaterial({ color: pants }));
  legL.position.set(-0.16, 0.3, 0);
  legL.castShadow = true;

  const legR = legL.clone();
  legR.position.x = 0.16;

  avatar.add(head, torso, legL, legR);
  return avatar;
}

const avatar = createAvatar();
scene.add(avatar);

function updateBlockCount() {
  let n = 0;
  blocks.forEach((b) => { if (!b.userData.ground) n++; });
  blockCountEl.textContent = n;
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 1800);
}

function buildHotbar() {
  PALETTE.forEach((p, i) => {
    const slot = document.createElement("button");
    slot.className = "slot" + (i === 1 ? " active" : "");
    slot.style.background = `#${p.color.toString(16).padStart(6, "0")}`;
    slot.title = p.name;
    slot.innerHTML = `<span>${p.id}</span>`;
    slot.addEventListener("click", () => selectColor(p.color, i));
    hotbar.appendChild(slot);
  });
}

function selectColor(color, index) {
  selectedColor = color;
  document.querySelectorAll(".slot").forEach((s, i) => s.classList.toggle("active", i === index));
  showToast(`Bloc : ${PALETTE[index].name}`);
}

function getInteractables() {
  return [...blocks.values()];
}

function getTarget() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(getInteractables(), false);
  if (!hits.length) return null;
  const hit = hits[0];
  const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).round();
  const p = hit.object.userData;
  return { hit, normal: n, block: p };
}

function updateGhost() {
  const t = getTarget();
  if (!t) { ghost.visible = false; return; }

  let nx = t.block.x + t.normal.x;
  let ny = t.block.y + t.normal.y;
  let nz = t.block.z + t.normal.z;

  if (!inBounds(nx, ny, nz) || blocks.has(blockKey(nx, ny, nz))) {
    ghost.visible = false;
    return;
  }

  if (playerOverlaps(nx, ny, nz)) {
    ghost.visible = false;
    return;
  }

  ghost.visible = true;
  ghost.position.set(nx + 0.5, ny + 0.5, nz + 0.5);
  ghost.rotation.y = blockRotation;
  ghost.material.color.setHex(selectedColor);
}

function playerOverlaps(bx, by, bz) {
  const px = controls.getObject().position.x;
  const py = controls.getObject().position.y;
  const pz = controls.getObject().position.z;
  const minX = bx, maxX = bx + 1;
  const minY = by, maxY = by + 1;
  const minZ = bz, maxZ = bz + 1;
  return (
    px + player.radius > minX && px - player.radius < maxX &&
    py > minY && py - player.height < maxY &&
    pz + player.radius > minZ && pz - player.radius < maxZ
  );
}

function placeBlock() {
  const t = getTarget();
  if (!t) return;
  const nx = t.block.x + t.normal.x;
  const ny = t.block.y + t.normal.y;
  const nz = t.block.z + t.normal.z;
  if (!inBounds(nx, ny, nz)) return;
  if (addBlock(nx, ny, nz, selectedColor)) {
    updateBlockCount();
  }
}

function deleteBlock() {
  const t = getTarget();
  if (!t) return;
  if (removeBlock(t.block.x, t.block.y, t.block.z)) {
    updateBlockCount();
  }
}

function getGroundY(x, z) {
  let maxY = 0;
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  for (let y = 0; y < MAX_HEIGHT; y++) {
    if (blocks.has(blockKey(ix, y, iz)) || blocks.has(blockKey(ix + 1, y, iz)) ||
        blocks.has(blockKey(ix, y, iz + 1)) || blocks.has(blockKey(ix + 1, y, iz + 1))) {
      maxY = Math.max(maxY, y + 1);
    }
  }
  return maxY;
}

function collidesHorizontal(pos) {
  const r = player.radius;
  const yFeet = Math.floor(pos.y - player.height);
  const yHead = Math.floor(pos.y);
  for (let y = yFeet; y <= yHead; y++) {
    for (const [dx, dz] of [[-r, -r], [r, -r], [-r, r], [r, r], [0, 0]]) {
      const bx = Math.floor(pos.x + dx);
      const bz = Math.floor(pos.z + dz);
      if (blocks.has(blockKey(bx, y, bz))) return true;
    }
  }
  return false;
}

function updatePlayer(dt) {
  const obj = controls.getObject();
  const speed = keys["ShiftLeft"] || keys["ShiftRight"] ? 10 : 6;
  const dir = new THREE.Vector3();

  if (keys["KeyW"] || keys["KeyZ"]) dir.z -= 1;
  if (keys["KeyS"]) dir.z += 1;
  if (keys["KeyA"] || keys["KeyQ"]) dir.x -= 1;
  if (keys["KeyD"]) dir.x += 1;

  if (dir.lengthSq() > 0) {
    dir.normalize();
    dir.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), controls.getObject().rotation.y));
  }

  const next = obj.position.clone();
  next.x += dir.x * speed * dt;
  next.z += dir.z * speed * dt;

  if (!collidesHorizontal(new THREE.Vector3(next.x, obj.position.y, obj.position.z))) {
    obj.position.x = next.x;
  }
  if (!collidesHorizontal(new THREE.Vector3(obj.position.x, obj.position.y, next.z))) {
    obj.position.z = next.z;
  }

  player.velocity.y -= 22 * dt;
  obj.position.y += player.velocity.y * dt;

  const ground = getGroundY(obj.position.x, obj.position.z) + player.height;
  if (obj.position.y <= ground) {
    obj.position.y = ground;
    player.velocity.y = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  if ((keys["Space"]) && player.onGround) {
    player.velocity.y = 9;
    player.onGround = false;
  }

  obj.position.x = THREE.MathUtils.clamp(obj.position.x, -HALF + 1, HALF - 0.01);
  obj.position.z = THREE.MathUtils.clamp(obj.position.z, -HALF + 1, HALF - 0.01);

  avatar.position.copy(obj.position);
  avatar.position.y -= player.height;
  avatar.rotation.y = obj.rotation.y;

  const walk = dir.lengthSq() > 0 && player.onGround;
  if (walk) {
    avatar.position.y += Math.sin(performance.now() * 0.012) * 0.04;
  }
}

let last = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  if (locked) {
    updatePlayer(dt);
    updateGhost();
  }

  renderer.render(scene, camera);
}

btnPlay.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  locked = true;
  help.classList.add("hidden");
  crosshair.classList.add("visible");
  hotbar.classList.add("visible");
});

controls.addEventListener("unlock", () => {
  locked = false;
  help.classList.remove("hidden");
  crosshair.classList.remove("visible");
  hotbar.classList.remove("visible");
  ghost.visible = false;
});

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 6) selectColor(PALETTE[num - 1].color, num - 1);
  if (e.code === "KeyR") blockRotation += Math.PI / 2;
});

document.addEventListener("keyup", (e) => { keys[e.code] = false; });

canvas.addEventListener("mousedown", (e) => {
  if (!locked) return;
  if (e.button === 0) placeBlock();
  if (e.button === 2) deleteBlock();
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

buildHotbar();
buildWorld();
controls.getObject().position.set(0, 4, 6);
requestAnimationFrame(animate);
