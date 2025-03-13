//NEVER LET MYMY CODE AGAIN
let scene, camera, renderer;
let controls;
let blocks = [];
let isLocked = false;
let blockMeshes = {};
let raycaster;
let selectedBlock = null;
let selectedBlockFace = null;
let currentBlockType = "grass";
let gameInitialized = false;

let velocity = new THREE.Vector3(0, 0, 0);
let isJumping = false;
let isOnGround = true;
let playerHeight = 1.7;

const SAVE_KEY = "mymycraft_save";
const AUTO_SAVE_INTERVAL = 10000;
let lastSaveTime = 0;

let isMainMenuVisible = true;

const SPRITE_INTERACTION_DISTANCE = 1.5;
const SPRITE_MESSAGES = [
  "Hallo!",
  "I built this just for Maya but she didn't appreciate my beautiful work.",
  "No matter.",
  "I put this to better use anyway.",
  "This is my new home away from home!",
  'Away from that traitorous "Handler" at least...',
  "You can stay for as long as you want.",
  "Do mind the <i>back door</i> though, I kind of need it.",
];

const BACK_DOOR_DESTROYED_MESSAGES = [
  "You're lucky that's not my only <i>back door</i>.",
  "You're still a terrible Belg for doing that though...",
];

let isBackDoorDestroyed = false;
let isNearSprite = false;
let isLookingAtSprite = false;
let messageIndex = 0;
let isDialogOpen = false;
let dialogElement = null;
let nameElement = null;
let textElement = null;
let nextButton = null;
let interactPromptElement = null;

const WORLD_SIZE = 128;
const BLOCK_SIZE = 1;
const MAX_BUILD_HEIGHT = 12;
const RENDER_DISTANCE = 12;
const FOG_COLOR = 0x808080;
const GRAVITY = 0.005;
const TERMINAL_VELOCITY = 0.15;
const RESET_HEIGHT = -10;
const JUMP_VELOCITY = 0.12;
const COLORS = {
  GRASS_TOP: 0x7cba3b,
  GRASS_SIDE: 0x8e7340,
  DIRT: 0x6e5a38,
  STONE: 0x888888,
  WOOD: 0x8b4513,
  DOOR: 0x8b4513,
  RED_CLOTH: 0xcc3333,
  ORANGE_CLOTH: 0xff8800,
  YELLOW_CLOTH: 0xffff00,
  BLUE_CLOTH: 0x3333cc,
  WHITE_CLOTH: 0xeeeeee,
  BLACK_CLOTH: 0x222222,
};

const BLOCK_TYPES = {
  grass: {
    materials: [
      { color: COLORS.GRASS_SIDE },
      { color: COLORS.GRASS_SIDE },
      { color: COLORS.GRASS_TOP },
      { color: COLORS.DIRT },
      { color: COLORS.GRASS_SIDE },
      { color: COLORS.GRASS_SIDE },
    ],
    solid: true,
  },
  dirt: {
    materials: Array(6).fill({ color: COLORS.DIRT }),
    solid: true,
  },
  stone: {
    materials: Array(6).fill({ color: COLORS.STONE }),
    solid: true,
  },
  wood: {
    materials: Array(6).fill({ color: COLORS.WOOD }),
    solid: true,
  },
  door: {
    materials: Array(6).fill({ color: COLORS.DOOR }),
    solid: false,
    isDoor: true,
  },
  red_cloth: {
    materials: Array(6).fill({ color: COLORS.RED_CLOTH }),
    solid: true,
  },
  orange_cloth: {
    materials: Array(6).fill({ color: COLORS.ORANGE_CLOTH }),
    solid: true,
  },
  yellow_cloth: {
    materials: Array(6).fill({ color: COLORS.YELLOW_CLOTH }),
    solid: true,
  },
  blue_cloth: {
    materials: Array(6).fill({ color: COLORS.BLUE_CLOTH }),
    solid: true,
  },
  white_cloth: {
    materials: Array(6).fill({ color: COLORS.WHITE_CLOTH }),
    solid: true,
  },
  black_cloth: {
    materials: Array(6).fill({ color: COLORS.BLACK_CLOTH }),
    solid: true,
  },
};

const ALL_BLOCKS = [
  "grass",
  "dirt",
  "stone",
  "wood",
  "door",
  "red_cloth",
  "orange_cloth",
  "yellow_cloth",
  "blue_cloth",
  "white_cloth",
  "black_cloth",
];

const HOTBAR = [
  "grass",
  "dirt",
  "stone",
  "wood",
  "door",
  "red_cloth",
  "yellow_cloth",
  "orange_cloth",
  "white_cloth",
];

let selectedHotbarIndex = 0;
let isInventoryOpen = false;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(FOG_COLOR);

  scene.fog = new THREE.Fog(FOG_COLOR, 1, RENDER_DISTANCE * 0.75);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    RENDER_DISTANCE * 2
  );
  camera.position.set(WORLD_SIZE / 2, 2, WORLD_SIZE / 2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("game-container").appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();

  createWorld();

  setupControls();

  window.addEventListener("resize", onWindowResize);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);

  createInventoryDisplay();

  addIdleGifSprite(38, 1.5, 38);

  createMessageDisplay();

  const savedGameLoaded = loadGameState();
  if (savedGameLoaded) {
    console.log("Saved game loaded successfully");
    updateHotbarDisplay();
  } else {
    console.log("Starting new game");
  }

  animate();
}

function createMessageDisplay() {
  dialogElement = document.createElement("div");
  dialogElement.id = "dialog-box";
  dialogElement.style.position = "absolute";
  dialogElement.style.bottom = "100px";
  dialogElement.style.left = "50%";
  dialogElement.style.transform = "translateX(-50%)";
  dialogElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  dialogElement.style.border = "2px solid #555";
  dialogElement.style.borderRadius = "5px";
  dialogElement.style.padding = "10px";
  dialogElement.style.width = "500px";
  dialogElement.style.fontFamily = "Arial, sans-serif";
  dialogElement.style.zIndex = "100";
  dialogElement.style.display = "none";
  dialogElement.style.pointerEvents = "auto";

  nameElement = document.createElement("div");
  nameElement.id = "character-name";
  nameElement.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  nameElement.style.color = "#ff8c00";
  nameElement.style.padding = "5px 10px";
  nameElement.style.borderRadius = "3px";
  nameElement.style.marginBottom = "5px";
  nameElement.style.fontWeight = "bold";
  nameElement.style.fontSize = "18px";
  nameElement.textContent = "Mymy";

  textElement = document.createElement("div");
  textElement.id = "dialog-text";
  textElement.style.color = "#ff8c00";
  textElement.style.padding = "10px";
  textElement.style.fontSize = "16px";
  textElement.style.lineHeight = "1.4";
  textElement.style.minHeight = "60px";

  nextButton = document.createElement("div");
  nextButton.id = "next-button";
  nextButton.style.position = "absolute";
  nextButton.style.bottom = "10px";
  nextButton.style.right = "10px";
  nextButton.style.color = "#ff8c00";
  nextButton.style.fontSize = "24px";
  nextButton.style.cursor = "pointer";
  nextButton.innerHTML = "▶";
  nextButton.style.padding = "5px";
  nextButton.style.zIndex = "200";
  nextButton.style.pointerEvents = "auto";

  nextButton.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    advanceDialog();
    console.log("Next button clicked, advancing dialog");
  };

  dialogElement.appendChild(nameElement);
  dialogElement.appendChild(textElement);
  dialogElement.appendChild(nextButton);

  const hud = document.getElementById("hud");
  hud.style.pointerEvents = "none";
  dialogElement.style.pointerEvents = "auto";
  hud.appendChild(dialogElement);

  interactPromptElement = document.createElement("div");
  interactPromptElement.id = "interact-prompt";
  interactPromptElement.style.position = "absolute";
  interactPromptElement.style.top = "50%";
  interactPromptElement.style.left = "50%";
  interactPromptElement.style.transform = "translate(-50%, -50%)";
  interactPromptElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  interactPromptElement.style.color = "#ff8c00";
  interactPromptElement.style.padding = "10px 20px";
  interactPromptElement.style.borderRadius = "5px";
  interactPromptElement.style.fontFamily = "Arial, sans-serif";
  interactPromptElement.style.fontSize = "18px";
  interactPromptElement.style.textAlign = "center";
  interactPromptElement.style.zIndex = "100";
  interactPromptElement.style.display = "none";
  interactPromptElement.textContent = "Press E to interact";

  document.getElementById("hud").appendChild(interactPromptElement);
}

function showDialog() {
  if (!dialogElement || !textElement) return;

  if (isLocked) {
    controls.unlock();
  }

  dialogElement.style.display = "block";
  isDialogOpen = true;

  if (interactPromptElement) {
    interactPromptElement.style.display = "none";
  }

  if (isBackDoorDestroyed) {
    textElement.innerHTML = BACK_DOOR_DESTROYED_MESSAGES[messageIndex];
  } else {
    textElement.innerHTML = SPRITE_MESSAGES[messageIndex];
  }
}

function hideDialog() {
  if (!dialogElement) return;
  dialogElement.style.display = "none";
  isDialogOpen = false;

  if (!isLocked) {
    controls.lock();
  }
}

function advanceDialog() {
  messageIndex++;

  if (isBackDoorDestroyed) {
    if (messageIndex < BACK_DOOR_DESTROYED_MESSAGES.length) {
      textElement.innerHTML = BACK_DOOR_DESTROYED_MESSAGES[messageIndex];
    } else {
      hideDialog();
      messageIndex = 0;
    }
  } else {
    if (messageIndex < SPRITE_MESSAGES.length) {
      textElement.innerHTML = SPRITE_MESSAGES[messageIndex];
    } else {
      hideDialog();
      messageIndex = 0;
    }
  }
}

function showInteractPrompt() {
  if (!interactPromptElement) return;
  interactPromptElement.style.display = "block";
}

function hideInteractPrompt() {
  if (!interactPromptElement) return;
  interactPromptElement.style.display = "none";
}

function checkSpriteProximity() {
  if (!window.idleGifSprite || !camera) return;

  const spritePos = window.idleGifSprite.position;
  const playerPos = camera.position;

  const dx = spritePos.x - playerPos.x;
  const dy = spritePos.y - playerPos.y;
  const dz = spritePos.z - playerPos.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const wasNearSprite = isNearSprite;
  isNearSprite = distance <= SPRITE_INTERACTION_DISTANCE;

  if (!isNearSprite && wasNearSprite && isDialogOpen) {
    hideDialog();
    console.log("Player left sprite interaction zone, closing dialog");
  }

  if (isNearSprite) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    const toSprite = new THREE.Vector3();
    toSprite.subVectors(spritePos, playerPos).normalize();

    const dotProduct = direction.dot(toSprite);

    const wasLookingAtSprite = isLookingAtSprite;
    isLookingAtSprite = dotProduct > 0.7;

    if (isLookingAtSprite && !wasLookingAtSprite && !isDialogOpen) {
      showInteractPrompt();
      console.log("Player is looking at sprite, showing interaction prompt");
    } else if (!isLookingAtSprite && wasLookingAtSprite) {
      hideInteractPrompt();
      console.log(
        "Player stopped looking at sprite, hiding interaction prompt"
      );
    }
  } else {
    if (isLookingAtSprite) {
      hideInteractPrompt();
    }
    isLookingAtSprite = false;
  }
}

function addIdleGifSprite(x, y, z) {
  const video = document.createElement("video");
  video.src = "idle.webm";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.display = "none";

  document.body.appendChild(video);

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  videoTexture.format = THREE.RGBAFormat;

  const geometry = new THREE.PlaneGeometry(1.5, 1.5);

  const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    premultipliedAlpha: true,
  });

  const sprite = new THREE.Mesh(geometry, material);

  sprite.position.set(x, y, z);

  sprite.lookAt(camera.position);

  scene.add(sprite);

  video.play().catch((e) => {
    console.error("Error playing video:", e);
  });

  console.log(
    `Added idle.webm sprite with transparency at coordinates: ${x}, ${y}, ${z}`
  );

  window.idleGifSprite = sprite;
  window.idleVideo = video;
}

function createWorld() {
  console.log(`Creating world of size ${WORLD_SIZE}x${WORLD_SIZE}`);

  let blocksCreated = 0;

  for (let x = 0; x < WORLD_SIZE; x++) {
    for (let z = 0; z < WORLD_SIZE; z++) {
      createBlock(x, 0, z);
      blocksCreated++;
    }
  }

  const customBlocks = [
    ...[37, 38, 39, 40].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 0, z },
        type: "white_cloth",
      }))
    ),

    ...[42, 43, 44, 45, 46, 47].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 0, z }, type: "dirt" }))
    ),
    ...[43, 44, 45, 46, 47].flatMap((x) =>
      [28, 29, 30, 31, 32].map((z) => ({
        position: { x, y: 0, z },
        type: "dirt",
      }))
    ),
    ...[45, 46].map((x) => ({ position: { x, y: 0, z: 36 }, type: "dirt" })),
    { position: { x: 46, y: 0, z: 33 }, type: "dirt" },
    { position: { x: 46, y: 0, z: 34 }, type: "dirt" },
    { position: { x: 46, y: 0, z: 35 }, type: "dirt" },

    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 1, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 39, 40].map((z) => ({ position: { x, y: 1, z }, type: "stone" }))
    ),
    { position: { x: 41, y: 1, z: 38 }, type: "door" },
    { position: { x: 36, y: 1, z: 38 }, type: "door" },

    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 2, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 39, 40].map((z) => ({ position: { x, y: 2, z }, type: "stone" }))
    ),
    { position: { x: 41, y: 2, z: 38 }, type: "door" },
    { position: { x: 36, y: 2, z: 38 }, type: "door" },

    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 3, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 3, z },
        type: "stone",
      }))
    ),

    ...[35, 36, 37, 38, 39, 40, 41, 42].map((x) => ({
      position: { x, y: 3, z: 34 },
      type: "wood",
    })),
    ...[35, 42].map((x) => ({ position: { x, y: 3, z: 35 }, type: "wood" })),
    ...[35, 36, 37, 38, 39, 40, 41, 42].map((x) => ({
      position: { x, y: 3, z: 42 },
      type: "wood",
    })),
    ...[35, 42].map((x) => ({ position: { x, y: 3, z: 41 }, type: "wood" })),

    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 4, z }, type: "wood" }))
    ),
    { position: { x: 36, y: 4, z: 37 }, type: "stone" },
    { position: { x: 36, y: 4, z: 38 }, type: "stone" },
    { position: { x: 36, y: 4, z: 39 }, type: "stone" },
    { position: { x: 41, y: 4, z: 37 }, type: "stone" },
    { position: { x: 41, y: 4, z: 38 }, type: "stone" },
    { position: { x: 41, y: 4, z: 39 }, type: "stone" },
    ...[37, 38, 39, 40].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 4, z },
        type: "wood",
      }))
    ),
    ...[35, 42].flatMap((x) =>
      [35, 36, 40, 41].map((z) => ({ position: { x, y: 4, z }, type: "wood" }))
    ),

    ...[36, 37, 38, 39, 40, 41].map((x) => ({
      position: { x, y: 5, z: 36 },
      type: "wood",
    })),
    ...[36, 37, 38, 39, 40, 41].map((x) => ({
      position: { x, y: 5, z: 40 },
      type: "wood",
    })),
    ...[36, 41].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 5, z }, type: "wood" }))
    ),
    ...[35, 42].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 5, z },
        type: "wood",
      }))
    ),

    ...[36, 37, 38, 39, 40, 41, 42].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 6, z }, type: "wood" }))
    ),
    ...[35].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 6, z }, type: "wood" }))
    ),

    ...[1, 2, 3, 4, 5].map((y) => ({
      position: { x: 45, y, z: 30 },
      type: "stone",
    })),

    ...[26, 27, 28, 29].map((z) => ({
      position: { x: 45, y: 5, z },
      type: "red_cloth",
    })),
    ...[26, 27, 28, 29].map((z) => ({
      position: { x: 45, y: 4, z },
      type: "white_cloth",
    })),
    ...[26, 27, 28, 29].map((z) => ({
      position: { x: 45, y: 3, z },
      type: "blue_cloth",
    })),
  ];

  for (const block of customBlocks) {
    const { x, y, z } = block.position;
    createBlock(x, y, z, block.type);
    blocksCreated++;
  }

  console.log(`Created ${blocksCreated} blocks in total`);
  console.log(`Player starting position: 64, 2, 64`);

  updateVisibleBlocks();
}

function createBlock(x, y, z, type = "grass") {
  const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

  const blockType = BLOCK_TYPES[type] || BLOCK_TYPES.grass;

  const materials = blockType.materials.map(
    (material) =>
      new THREE.MeshBasicMaterial({ color: material.color, fog: true })
  );

  const block = new THREE.Mesh(geometry, materials);
  block.position.set(x, y, z);

  block.userData = {
    type: type,
    solid: blockType.solid,
    isDoor: blockType.isDoor || false,
  };

  const key = `${x},${y},${z}`;
  blockMeshes[key] = block;


  return block;
}

function updateVisibleBlocks() {
  if (!camera) return;

  const playerX = Math.floor(camera.position.x);
  const playerY = Math.floor(camera.position.y);
  const playerZ = Math.floor(camera.position.z);

  console.log(`Player position: ${playerX}, ${playerY}, ${playerZ}`);

  blocks.forEach((block) => {
    scene.remove(block);
  });
  blocks = [];

  let blocksAdded = 0;

  const minX = Math.max(0, playerX - RENDER_DISTANCE);
  const maxX = Math.min(WORLD_SIZE - 1, playerX + RENDER_DISTANCE);
  const minZ = Math.max(0, playerZ - RENDER_DISTANCE);
  const maxZ = Math.min(WORLD_SIZE - 1, playerZ + RENDER_DISTANCE);

  console.log(
    `Checking blocks in range: X(${minX}-${maxX}), Z(${minZ}-${maxZ})`
  );

  for (let x = minX; x <= maxX; x++) {
    for (let z = minZ; z <= maxZ; z++) {
      for (let y = 0; y < MAX_BUILD_HEIGHT; y++) {
        const key = `${x},${y},${z}`;
        const block = blockMeshes[key];

        if (block) {
          const dx = x - playerX;
          const dy = y - playerY;
          const dz = z - playerZ;
          const distanceSquared = dx * dx + dy * dy + dz * dz;

          if (distanceSquared <= RENDER_DISTANCE * RENDER_DISTANCE) {
            scene.add(block);
            blocks.push(block);
            blocksAdded++;
          }
        }
      }
    }
  }

  console.log(`Added ${blocksAdded} blocks to the scene`);
}

function setupControls() {
  controls = new THREE.PointerLockControls(camera, document.body);


  controls.addEventListener("lock", function () {
    isLocked = true;
  });

  controls.addEventListener("unlock", function () {
    isLocked = false;
  });

  const moveForward = function (distance) {
    controls.moveForward(distance);
  };

  const moveRight = function (distance) {
    controls.moveRight(distance);
  };

  const keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  };

  let jumpKeyPressed = false;
  let canJump = true;

  document.addEventListener("keydown", function (event) {
    console.log("Key pressed:", event.code, event.key);

    if (keys.hasOwnProperty(event.code)) {
      keys[event.code] = true;
    }

    if (event.code === "Space" || event.key === " ") {
      jumpKeyPressed = true;
      console.log("Jump key pressed");

      if (isOnGround && canJump) {
        velocity.y = JUMP_VELOCITY;
        isOnGround = false;
        isJumping = true;
        canJump = false;
        console.log("JUMP INITIATED with velocity:", JUMP_VELOCITY);
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    if (keys.hasOwnProperty(event.code)) {
      keys[event.code] = false;
    }

    if (event.code === "Space" || event.key === " ") {
      jumpKeyPressed = false;
      canJump = true;
      console.log("Jump key released");
    }
  });

  const moveSpeed = 0.05;
  const playerRadius = 0.3;

  function checkBlockCollision(position) {
    const checkRadius = 1;
    const playerX = Math.floor(position.x);
    const playerY = Math.floor(position.y);
    const playerZ = Math.floor(position.z);

    for (let y = playerY - 1; y <= playerY + 0.1; y++) {
      if (y < 0 || y >= MAX_BUILD_HEIGHT) continue;

      for (let x = playerX - checkRadius; x <= playerX + checkRadius; x++) {
        for (let z = playerZ - checkRadius; z <= playerZ + checkRadius; z++) {
          if (x < 0 || x >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) continue;

          const key = `${x},${y},${z}`;
          const block = blockMeshes[key];

          if (block && block.userData.solid) {
            const dx = position.x - block.position.x;
            const dz = position.z - block.position.z;
            const distanceSquared = dx * dx + dz * dz;

            if (
              distanceSquared <
              (playerRadius + BLOCK_SIZE / 2) * (playerRadius + BLOCK_SIZE / 2)
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  function checkIfOnGround() {
    const feetPosition = camera.position.clone();
    feetPosition.y -= playerHeight / 2 + 0.1;

    const playerX = Math.floor(feetPosition.x);
    const playerY = Math.floor(feetPosition.y);
    const playerZ = Math.floor(feetPosition.z);

    for (let x = playerX - 1; x <= playerX + 1; x++) {
      for (let z = playerZ - 1; z <= playerZ + 1; z++) {
        if (x < 0 || x >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) continue;

        for (let y = playerY; y >= playerY - 1; y--) {
          const key = `${x},${y},${z}`;
          const block = blockMeshes[key];

          if (block && block.userData.solid) {
            const dx = feetPosition.x - block.position.x;
            const dz = feetPosition.z - block.position.z;
            const horizontalDistanceSquared = dx * dx + dz * dz;

            if (
              horizontalDistanceSquared <
              (playerRadius + BLOCK_SIZE / 2) * (playerRadius + BLOCK_SIZE / 2)
            ) {
              const dy = Math.abs(
                feetPosition.y - (block.position.y + BLOCK_SIZE / 2)
              );
              if (dy < 0.25) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  window.movePlayer = function () {
    if (!isLocked) return;

    const oldPosition = camera.position.clone();

    let horizontalMoved = false;

    if (keys["KeyW"]) {
      moveForward(moveSpeed);
      horizontalMoved = true;
    }
    if (keys["KeyS"]) {
      moveForward(-moveSpeed);
      horizontalMoved = true;
    }
    if (keys["KeyA"]) {
      moveRight(-moveSpeed);
      horizontalMoved = true;
    }
    if (keys["KeyD"]) {
      moveRight(moveSpeed);
      horizontalMoved = true;
    }

    const margin = 0.5;
    if (
      camera.position.x < margin ||
      camera.position.x > WORLD_SIZE - margin ||
      camera.position.z < margin ||
      camera.position.z > WORLD_SIZE - margin
    ) {
      camera.position.x = oldPosition.x;
      camera.position.z = oldPosition.z;
      horizontalMoved = false;
    }

    if (horizontalMoved && checkBlockCollision(camera.position)) {
      camera.position.x = oldPosition.x;
      camera.position.z = oldPosition.z;
      console.log("Horizontal collision detected, movement blocked");
    }


    isOnGround = checkIfOnGround();

    console.log("Jump state:", {
      isOnGround,
      jumpKeyPressed,
      canJump,
      velocity: velocity.y,
      isJumping,
    });


    if (!isOnGround) {
      velocity.y = Math.max(velocity.y - GRAVITY, -TERMINAL_VELOCITY);

      if (isJumping && velocity.y <= 0) {
        console.log("Reached jump peak, starting to fall");
      }
    } else {
      velocity.y = 0;
      isJumping = false;

      const feetPosition = camera.position.clone();
      feetPosition.y -= playerHeight / 2;
      const blockY = Math.floor(feetPosition.y);
      camera.position.y = blockY + BLOCK_SIZE + playerHeight / 2;
    }

    const preGravityPosition = camera.position.clone();

    camera.position.y += velocity.y;

    if (camera.position.y < RESET_HEIGHT) {
      camera.position.set(WORLD_SIZE / 2, 2, WORLD_SIZE / 2);
      velocity.set(0, 0, 0);
      console.log("Player fell too far and was reset");
      return;
    }

    if (checkBlockCollision(camera.position)) {
      camera.position.y = preGravityPosition.y;
      velocity.y = 0;
      isOnGround = true;
    }
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
  if (isMainMenuVisible) {
    return;
  }

  if (isInventoryOpen) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isDialogOpen) {
    return;
  }

  if (!isLocked) {
    controls.lock();
    return;
  }

  if (event.button === 0) {
    breakBlock();
  }
  else if (event.button === 2) {
    placeBlock();
  }
}

function onKeyDown(event) {
  console.log("Key pressed:", event.code);

  if (isMainMenuVisible) {
    return;
  }

  if (isInventoryOpen) {
    if (event.code === "KeyI") {
      toggleInventory();
    }

    return;
  }

  if (event.code >= "Digit1" && event.code <= "Digit9") {
    const num = parseInt(event.code.replace("Digit", "")) - 1;
    if (num >= 0 && num < HOTBAR.length) {
      selectedHotbarIndex = num;
      currentBlockType = HOTBAR[selectedHotbarIndex];
      updateHotbarDisplay();

      saveGameState();
    }
  }

  if (event.code === "KeyI") {
    toggleInventory();
  }

  if (event.code === "KeyK") {
    camera.position.set(64, 2, 64);
    velocity.set(0, 0, 0);
    console.log("Player position reset to 64,2,64");

    saveGameState();
  }

  if (event.code === "KeyR") {
    console.log("R key pressed - resetting world");
    resetWorld();
  }

  if (event.code === "KeyE") {
    if (isNearSprite && isLookingAtSprite) {
      if (!isDialogOpen) {
        messageIndex = 0;
        showDialog();
        console.log("Started dialog with sprite");
      } else {
        advanceDialog();
        console.log("Advanced dialog");
      }
    }
  }

  if (event.code === "Escape" && !isDialogOpen && !isInventoryOpen) {
    returnToMainMenu();
  }
}

function returnToMainMenu() {
  console.log("Returning to main menu");

  if (isLocked && controls) {
    controls.unlock();
  }

  document.getElementById("game-container").style.display = "none";

  document.getElementById("main-menu").style.display = "flex";

  isMainMenuVisible = true;
}

function createInventoryDisplay() {
  const hotbarElement = document.createElement("div");
  hotbarElement.id = "hotbar";
  hotbarElement.style.position = "absolute";
  hotbarElement.style.bottom = "20px";
  hotbarElement.style.left = "50%";
  hotbarElement.style.transform = "translateX(-50%)";
  hotbarElement.style.display = "flex";
  hotbarElement.style.gap = "5px";
  hotbarElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  hotbarElement.style.padding = "5px";
  hotbarElement.style.borderRadius = "5px";
  hotbarElement.style.zIndex = "10";

  HOTBAR.forEach((blockType, index) => {
    const slot = document.createElement("div");
    slot.className = "hotbar-slot";
    slot.dataset.blockType = blockType;
    slot.style.width = "50px";
    slot.style.height = "50px";
    slot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    slot.style.display = "flex";
    slot.style.flexDirection = "column";
    slot.style.justifyContent = "center";
    slot.style.alignItems = "center";
    slot.style.borderRadius = "3px";
    slot.style.position = "relative";
    slot.style.color = "#fff";
    slot.style.fontSize = "12px";
    slot.style.textAlign = "center";
    slot.style.padding = "2px";
    slot.style.wordBreak = "break-word";

    slot.textContent = blockType.replace("_", " ");

    const keyNumber = document.createElement("div");
    keyNumber.className = "key-number";
    keyNumber.style.position = "absolute";
    keyNumber.style.top = "2px";
    keyNumber.style.left = "2px";
    keyNumber.style.fontSize = "10px";
    keyNumber.style.color = "#aaa";
    keyNumber.textContent = (index + 1).toString();
    slot.appendChild(keyNumber);

    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    }

    hotbarElement.appendChild(slot);
  });

  document.getElementById("hud").appendChild(hotbarElement);

  createInventoryMenu();
}

function updateHotbarDisplay() {
  const slots = document.querySelectorAll(".hotbar-slot");

  slots.forEach((slot, index) => {
    const blockType = HOTBAR[index];
    slot.dataset.blockType = blockType;

    const keyNumber = slot.querySelector(".key-number");
    slot.textContent = blockType.replace("_", " ");
    if (keyNumber) {
      slot.appendChild(keyNumber);
    } else {
      const newKeyNumber = document.createElement("div");
      newKeyNumber.className = "key-number";
      newKeyNumber.style.position = "absolute";
      newKeyNumber.style.top = "2px";
      newKeyNumber.style.left = "2px";
      newKeyNumber.style.fontSize = "10px";
      newKeyNumber.style.color = "#aaa";
      newKeyNumber.textContent = (index + 1).toString();
      slot.appendChild(newKeyNumber);
    }

    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    } else {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      slot.style.border = "none";
    }
  });

  currentBlockType = HOTBAR[selectedHotbarIndex];
}

function createInventoryMenu() {
  const inventoryMenu = document.createElement("div");
  inventoryMenu.id = "inventory-menu";
  inventoryMenu.style.display = "none";
  inventoryMenu.style.position = "absolute";
  inventoryMenu.style.top = "50%";
  inventoryMenu.style.left = "50%";
  inventoryMenu.style.transform = "translate(-50%, -50%)";
  inventoryMenu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  inventoryMenu.style.border = "2px solid #555";
  inventoryMenu.style.borderRadius = "5px";
  inventoryMenu.style.padding = "20px";
  inventoryMenu.style.width = "80%";
  inventoryMenu.style.maxWidth = "600px";
  inventoryMenu.style.maxHeight = "80%";
  inventoryMenu.style.overflowY = "auto";
  inventoryMenu.style.zIndex = "1000";
  inventoryMenu.style.color = "#fff";
  inventoryMenu.style.pointerEvents = "auto";

  [
    "mousedown",
    "mouseup",
    "click",
    "dblclick",
    "mousemove",
    "mouseover",
    "mouseout",
    "contextmenu",
  ].forEach((eventType) => {
    inventoryMenu.addEventListener(eventType, function (event) {
      event.stopPropagation();
    });
  });

  const title = document.createElement("h2");
  title.textContent = "Inventory";
  title.style.textAlign = "center";
  title.style.marginBottom = "20px";
  inventoryMenu.appendChild(title);

  const instructions = document.createElement("p");
  instructions.textContent = "Drag blocks to your hotbar slots";
  instructions.style.textAlign = "center";
  instructions.style.marginBottom = "20px";
  instructions.style.fontSize = "14px";
  instructions.style.color = "#aaa";
  inventoryMenu.appendChild(instructions);

  const blocksGrid = document.createElement("div");
  blocksGrid.style.display = "grid";
  blocksGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  blocksGrid.style.gap = "10px";

  ALL_BLOCKS.forEach((blockType) => {
    const blockItem = document.createElement("div");
    blockItem.className = "inventory-item";
    blockItem.dataset.blockType = blockType;
    blockItem.textContent = blockType.replace("_", " ");
    blockItem.style.padding = "10px";
    blockItem.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    blockItem.style.borderRadius = "5px";
    blockItem.style.cursor = "grab";
    blockItem.style.textAlign = "center";
    blockItem.style.userSelect = "none";

    blockItem.setAttribute("draggable", "true");

    blockItem.addEventListener("mouseover", function () {
      this.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });

    blockItem.addEventListener("mouseout", function () {
      this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });

    blockItem.addEventListener("mousedown", function (event) {
      event.stopPropagation();
    });

    blockItem.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    blockItem.addEventListener("dragstart", function (event) {
      event.stopPropagation();

      event.dataTransfer.setData("text/plain", blockType);

      this.style.cursor = "grabbing";

      const dragIcon = document.createElement("div");
      dragIcon.textContent = blockType;
      dragIcon.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      dragIcon.style.color = "white";
      dragIcon.style.padding = "5px";
      dragIcon.style.borderRadius = "3px";
      dragIcon.style.position = "absolute";
      dragIcon.style.top = "-1000px";
      document.body.appendChild(dragIcon);
      event.dataTransfer.setDragImage(dragIcon, 0, 0);
      setTimeout(() => document.body.removeChild(dragIcon), 0);
    });

    blockItem.addEventListener("dragend", function (event) {
      event.stopPropagation();

      this.style.cursor = "grab";
    });

    blocksGrid.appendChild(blockItem);
  });

  inventoryMenu.appendChild(blocksGrid);

  const hotbarPreview = document.createElement("div");
  hotbarPreview.id = "hotbar-preview";
  hotbarPreview.style.display = "flex";
  hotbarPreview.style.justifyContent = "center";
  hotbarPreview.style.gap = "5px";
  hotbarPreview.style.marginTop = "20px";
  hotbarPreview.style.padding = "10px";
  hotbarPreview.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  hotbarPreview.style.borderRadius = "5px";

  HOTBAR.forEach((blockType, index) => {
    const slot = document.createElement("div");
    slot.className = "hotbar-preview-slot";
    slot.dataset.slotIndex = index;
    slot.dataset.blockType = blockType;
    slot.textContent = blockType.replace("_", " ");
    slot.style.width = "60px";
    slot.style.height = "60px";
    slot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    slot.style.display = "flex";
    slot.style.flexDirection = "column";
    slot.style.justifyContent = "center";
    slot.style.alignItems = "center";
    slot.style.borderRadius = "3px";
    slot.style.position = "relative";
    slot.style.color = "#fff";
    slot.style.fontSize = "12px";
    slot.style.textAlign = "center";
    slot.style.padding = "2px";
    slot.style.wordBreak = "break-word";

    const keyNumber = document.createElement("div");
    keyNumber.className = "key-number";
    keyNumber.style.position = "absolute";
    keyNumber.style.top = "2px";
    keyNumber.style.left = "2px";
    keyNumber.style.fontSize = "10px";
    keyNumber.style.color = "#aaa";
    keyNumber.textContent = (index + 1).toString();
    slot.appendChild(keyNumber);

    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    }

    [
      "mousedown",
      "mouseup",
      "click",
      "dblclick",
      "mousemove",
      "mouseover",
      "mouseout",
      "contextmenu",
    ].forEach((eventType) => {
      slot.addEventListener(eventType, function (event) {
        event.stopPropagation();
      });
    });

    slot.addEventListener("dragover", function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      this.style.border = "2px dashed #fff";
    });

    slot.addEventListener("dragleave", function (event) {
      event.stopPropagation();
      if (index === selectedHotbarIndex) {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        this.style.border = "2px solid #fff";
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        this.style.border = "none";
      }
    });

    slot.addEventListener("drop", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const blockType = event.dataTransfer.getData("text/plain");

      HOTBAR[index] = blockType;

      this.dataset.blockType = blockType;
      this.textContent = blockType.replace("_", " ");

      this.appendChild(keyNumber);

      if (index === selectedHotbarIndex) {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        this.style.border = "2px solid #fff";
        currentBlockType = blockType;
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        this.style.border = "none";
      }

      updateHotbarDisplay();

      saveGameState();

      console.log(`Placed ${blockType} in hotbar slot ${index + 1}`);
    });

    hotbarPreview.appendChild(slot);
  });

  inventoryMenu.appendChild(hotbarPreview);

  document.getElementById("hud").appendChild(inventoryMenu);
}

function toggleInventory() {
  isInventoryOpen = !isInventoryOpen;

  const inventoryMenu = document.getElementById("inventory-menu");
  const hud = document.getElementById("hud");
  if (!inventoryMenu || !hud) return;

  if (isInventoryOpen) {
    inventoryMenu.style.display = "block";

    hud.style.pointerEvents = "auto";

    if (isLocked) {
      controls.unlock();
      isLocked = false;
    }

    document.addEventListener("mousemove", handleInventoryMouseMove);

    document.body.style.pointerEvents = "none";
    inventoryMenu.style.pointerEvents = "auto";

    console.log("Inventory opened, camera control disabled");
  } else {
    inventoryMenu.style.display = "none";

    hud.style.pointerEvents = "none";

    if (isDialogOpen && dialogElement) {
      dialogElement.style.pointerEvents = "auto";
    }

    document.body.style.pointerEvents = "auto";

    document.removeEventListener("mousemove", handleInventoryMouseMove);

    if (!isDialogOpen) {
      controls.lock();
      isLocked = true;
    }

    console.log("Inventory closed, camera control restored");
  }
}

function handleInventoryMouseMove(event) {
}

function breakBlock() {
  if (!selectedBlock) return;

  const position = selectedBlock.position;
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);
  const z = Math.floor(position.z);

  if ((x === 36 && y === 2 && z === 38) || (x === 36 && y === 3 && z === 38)) {
    console.log("Back door block destroyed!");
    isBackDoorDestroyed = true;
    messageIndex = 0;

    if (isNearSprite && isLookingAtSprite) {
      showDialog();
    }
  }

  scene.remove(selectedBlock);

  const blockIndex = blocks.indexOf(selectedBlock);
  if (blockIndex !== -1) {
    blocks.splice(blockIndex, 1);
  }

  const key = `${x},${y},${z}`;
  delete blockMeshes[key];

  selectedBlock = null;

  saveGameState();
}

function placeBlock() {
  if (!selectedBlock || !selectedBlockFace) return;

  const position = selectedBlock.position.clone();

  const normal = new THREE.Vector3().copy(selectedBlockFace.face.normal);

  position.add(normal);

  const x = Math.floor(position.x);
  const y = Math.floor(position.y);
  const z = Math.floor(position.z);

  console.log(`Attempting to place block at: ${x}, ${y}, ${z}`);

  const key = `${x},${y},${z}`;
  if (blockMeshes[key]) {
    console.log("Block already exists at this position");
    return;
  }

  if (
    x < 0 ||
    x >= WORLD_SIZE ||
    y < 0 ||
    y >= MAX_BUILD_HEIGHT ||
    z < 0 ||
    z >= WORLD_SIZE
  ) {
    console.log("Position out of bounds or above max build height");
    return;
  }

  if (currentBlockType === "door") {
    if (y + 1 >= MAX_BUILD_HEIGHT) {
      console.log("Not enough height for a door");
      return;
    }

    const bottomDoor = createBlock(x, y, z, "door");
    scene.add(bottomDoor);
    blocks.push(bottomDoor);

    const topKey = `${x},${y + 1},${z}`;
    if (!blockMeshes[topKey]) {
      const topDoor = createBlock(x, y + 1, z, "door");
      scene.add(topDoor);
      blocks.push(topDoor);
    }

    console.log("Door placed successfully");
  } else {
    const newBlock = createBlock(x, y, z, currentBlockType);
    scene.add(newBlock);
    blocks.push(newBlock);
    console.log(`${currentBlockType} block placed successfully`);
  }

  saveGameState();
}

function updateRaycaster() {
  if (!isLocked || !camera || !scene) return;

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  raycaster.set(camera.position, direction);

  const intersects = raycaster.intersectObjects(blocks);

  selectedBlock = null;
  selectedBlockFace = null;

  if (intersects.length > 0) {
    selectedBlock = intersects[0].object;
    selectedBlockFace = intersects[0];

    console.log("Selected block at:", selectedBlock.position);
    console.log("Face normal:", selectedBlockFace.face.normal);
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (typeof window.movePlayer === "function") {
    window.movePlayer();
  }

  updateVisibleBlocks();

  updateRaycaster();

  updateCoordinatesDisplay();

  if (window.idleGifSprite) {
    const spritePos = window.idleGifSprite.position.clone();

    const targetPos = camera.position.clone();
    targetPos.y = spritePos.y;

    window.idleGifSprite.lookAt(targetPos);

    checkSpriteProximity();
  }

  checkAutoSave();

  renderer.render(scene, camera);
}

function updateCoordinatesDisplay() {
  if (!camera) return;

  const coordsElement = document.getElementById("coordinates");
  if (coordsElement) {
    const x = Math.floor(camera.position.x);
    const y = Math.floor(camera.position.y);
    const z = Math.floor(camera.position.z);
    coordsElement.textContent = `X: ${x} Y: ${y} Z: ${z}`;
  }
}

function saveGameState() {
  const saveData = {
    player: {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      selectedHotbarIndex: selectedHotbarIndex,
      hotbar: HOTBAR,
    },
    blocks: [],
  };

  for (const key in blockMeshes) {
    const block = blockMeshes[key];
    const [x, y, z] = key.split(",").map(Number);

    if (y > 0 || (y === 0 && block.userData.type !== "grass")) {
      saveData.blocks.push({
        position: { x, y, z },
        type: block.userData.type,
      });
    }
  }

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved successfully");
    lastSaveTime = Date.now();
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}

function loadGameState() {
  try {
    const saveData = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saveData) {
      console.log("No saved game found");
      return false;
    }

    console.log("Loading saved game...");

    if (saveData.player && saveData.player.position) {
      const pos = saveData.player.position;
      camera.position.set(pos.x, pos.y, pos.z);
      console.log(`Restored player position: ${pos.x}, ${pos.y}, ${pos.z}`);
    } else {
      camera.position.set(64, 2, 64);
      console.log("No saved position found, using default (64, 2, 64)");
    }

    if (saveData.player) {
      if (saveData.player.hotbar) {
        for (
          let i = 0;
          i < Math.min(saveData.player.hotbar.length, HOTBAR.length);
          i++
        ) {
          HOTBAR[i] = saveData.player.hotbar[i];
        }
        console.log("Restored hotbar configuration");
      }

      if (saveData.player.selectedHotbarIndex !== undefined) {
        selectedHotbarIndex = saveData.player.selectedHotbarIndex;
        currentBlockType = HOTBAR[selectedHotbarIndex];
        console.log(`Restored hotbar selection: ${currentBlockType}`);
      } else if (saveData.player.selectedInventoryIndex !== undefined) {
        selectedHotbarIndex = Math.min(
          saveData.player.selectedInventoryIndex,
          HOTBAR.length - 1
        );
        currentBlockType = HOTBAR[selectedHotbarIndex];
        console.log(
          `Converted old inventory selection to hotbar selection: ${currentBlockType}`
        );
      }
    }


    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}

function checkAutoSave() {
  const currentTime = Date.now();
  if (currentTime - lastSaveTime > AUTO_SAVE_INTERVAL) {
    saveGameState();
  }
}

function resetWorld() {
  console.log("Resetting world to default state...");

  localStorage.removeItem(SAVE_KEY);

  blocks.forEach((block) => {
    scene.remove(block);
  });
  blocks = [];

  blockMeshes = {};

  isBackDoorDestroyed = false;

  camera.position.set(WORLD_SIZE / 2, 2, WORLD_SIZE / 2);
  velocity.set(0, 0, 0);

  HOTBAR.splice(
    0,
    HOTBAR.length,
    "grass",
    "dirt",
    "stone",
    "wood",
    "door",
    "red_cloth",
    "orange_cloth",
    "yellow_cloth",
    "blue_cloth"
  );
  selectedHotbarIndex = 0;
  currentBlockType = HOTBAR[selectedHotbarIndex];
  updateHotbarDisplay();

  createWorld();

  console.log("World reset complete");
}

function initMainMenu() {
  console.log("Initializing main menu");

  document.getElementById("play-button").addEventListener("click", startGame);
  document
    .getElementById("options-button")
    .addEventListener("click", showOptions);

  initSplashText();
}

function initSplashText() {
  const splashElement = document.getElementById("splash-text");
  if (splashElement) {
    const splashTexts = [
      "Now with 50% more fog!",
      "100% Belgian free",
      "Realistic Dutch terrain",
      "Definitely nothing fishy",
      "38 amazing features!",
      "Held together with duct tape!",
    ];

    const randomIndex = Math.floor(Math.random() * splashTexts.length);
    splashElement.textContent = splashTexts[randomIndex];

    console.log("Splash text initialized: " + splashTexts[randomIndex]);
  }
}

function startGame() {
  console.log("Starting game from main menu");

  document.getElementById("main-menu").style.display = "none";

  document.getElementById("game-container").style.display = "block";

  if (!gameInitialized) {
    init();
    gameInitialized = true;
  } else {
    if (controls) {
      controls.lock();
    }
  }

  isMainMenuVisible = false;
}

function showOptions() {
  console.log("Controls button clicked");
  alert(
    "I suppose I can tell a Belg like you how to play\nWASD to move\nSpace to jump\nI to access a HUGE range of blocks\nClick and drag to put them into your hotbar\nK to reset your pathetic life\nIf you really mess up my world you better press R to fix it."
  );
}

window.addEventListener("load", initMainMenu);
