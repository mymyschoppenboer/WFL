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
  // Create main dialog container
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
  dialogElement.style.display = "none"; // Hidden by default
  dialogElement.style.pointerEvents = "auto"; // Enable mouse interaction

  // Create character name element
  nameElement = document.createElement("div");
  nameElement.id = "character-name";
  nameElement.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  nameElement.style.color = "#ff8c00"; // Orange text
  nameElement.style.padding = "5px 10px";
  nameElement.style.borderRadius = "3px";
  nameElement.style.marginBottom = "5px";
  nameElement.style.fontWeight = "bold";
  nameElement.style.fontSize = "18px";
  nameElement.textContent = "Mymy"; // Character's name

  // Create text element for dialog content
  textElement = document.createElement("div");
  textElement.id = "dialog-text";
  textElement.style.color = "#ff8c00"; // Orange text
  textElement.style.padding = "10px";
  textElement.style.fontSize = "16px";
  textElement.style.lineHeight = "1.4";
  textElement.style.minHeight = "60px";

  // Create next button
  nextButton = document.createElement("div");
  nextButton.id = "next-button";
  nextButton.style.position = "absolute";
  nextButton.style.bottom = "10px";
  nextButton.style.right = "10px";
  nextButton.style.color = "#ff8c00"; // Orange text
  nextButton.style.fontSize = "24px";
  nextButton.style.cursor = "pointer";
  nextButton.innerHTML = "▶"; // Right arrow symbol
  nextButton.style.padding = "5px";
  nextButton.style.zIndex = "200"; // Ensure it's above other elements
  nextButton.style.pointerEvents = "auto"; // Make sure it can receive mouse events

  // Add click event to next button with explicit event handling
  nextButton.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    advanceDialog();
    console.log("Next button clicked, advancing dialog");
  };

  // Assemble the dialog box
  dialogElement.appendChild(nameElement);
  dialogElement.appendChild(textElement);
  dialogElement.appendChild(nextButton);

  // Add to HUD
  const hud = document.getElementById("hud");
  hud.style.pointerEvents = "none"; // Make HUD transparent to mouse events by default
  dialogElement.style.pointerEvents = "auto"; // But enable pointer events for the dialog
  hud.appendChild(dialogElement);

  // Create interaction prompt
  interactPromptElement = document.createElement("div");
  interactPromptElement.id = "interact-prompt";
  interactPromptElement.style.position = "absolute";
  interactPromptElement.style.top = "50%";
  interactPromptElement.style.left = "50%";
  interactPromptElement.style.transform = "translate(-50%, -50%)";
  interactPromptElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  interactPromptElement.style.color = "#ff8c00"; // Orange text
  interactPromptElement.style.padding = "10px 20px";
  interactPromptElement.style.borderRadius = "5px";
  interactPromptElement.style.fontFamily = "Arial, sans-serif";
  interactPromptElement.style.fontSize = "18px";
  interactPromptElement.style.textAlign = "center";
  interactPromptElement.style.zIndex = "100";
  interactPromptElement.style.display = "none"; // Hidden by default
  interactPromptElement.textContent = "Press E to interact";

  // Add to HUD
  document.getElementById("hud").appendChild(interactPromptElement);
}

// Show the dialog with the current message
function showDialog() {
  if (!dialogElement || !textElement) return;

  // Unlock the pointer to allow mouse interaction with dialog
  if (isLocked) {
    controls.unlock();
  }

  // Show the dialog box
  dialogElement.style.display = "block";
  isDialogOpen = true;

  // Hide the interaction prompt
  if (interactPromptElement) {
    interactPromptElement.style.display = "none";
  }

  // Set the current message based on whether the back door was destroyed
  if (isBackDoorDestroyed) {
    textElement.innerHTML = BACK_DOOR_DESTROYED_MESSAGES[messageIndex];
  } else {
    textElement.innerHTML = SPRITE_MESSAGES[messageIndex];
  }
}

// Hide the dialog box
function hideDialog() {
  if (!dialogElement) return;
  dialogElement.style.display = "none";
  isDialogOpen = false;

  // Re-lock the pointer for game controls
  if (!isLocked) {
    controls.lock();
  }
}

// Advance to the next dialog message
function advanceDialog() {
  messageIndex++;

  // Check which message array to use based on back door status
  if (isBackDoorDestroyed) {
    if (messageIndex < BACK_DOOR_DESTROYED_MESSAGES.length) {
      // Show the next message from the back door destroyed messages
      textElement.innerHTML = BACK_DOOR_DESTROYED_MESSAGES[messageIndex];
    } else {
      // End of dialog
      hideDialog();
      messageIndex = 0; // Reset for next interaction
    }
  } else {
    if (messageIndex < SPRITE_MESSAGES.length) {
      // Show the next message from the normal messages
      textElement.innerHTML = SPRITE_MESSAGES[messageIndex];
    } else {
      // End of dialog
      hideDialog();
      messageIndex = 0; // Reset for next interaction
    }
  }
}

// Show the interaction prompt
function showInteractPrompt() {
  if (!interactPromptElement) return;
  interactPromptElement.style.display = "block";
}

// Hide the interaction prompt
function hideInteractPrompt() {
  if (!interactPromptElement) return;
  interactPromptElement.style.display = "none";
}

// Check if player is near and looking at the sprite
function checkSpriteProximity() {
  if (!window.idleGifSprite || !camera) return;

  // Calculate distance between player and sprite
  const spritePos = window.idleGifSprite.position;
  const playerPos = camera.position;

  const dx = spritePos.x - playerPos.x;
  const dy = spritePos.y - playerPos.y;
  const dz = spritePos.z - playerPos.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Check if player is within interaction distance
  const wasNearSprite = isNearSprite;
  isNearSprite = distance <= SPRITE_INTERACTION_DISTANCE;

  // If player just left the interaction zone and dialog is open, close it
  if (!isNearSprite && wasNearSprite && isDialogOpen) {
    hideDialog();
    console.log("Player left sprite interaction zone, closing dialog");
  }

  // Check if player is looking at the sprite
  if (isNearSprite) {
    // Get the camera's direction vector
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Calculate vector from camera to sprite
    const toSprite = new THREE.Vector3();
    toSprite.subVectors(spritePos, playerPos).normalize();

    // Calculate dot product to determine if player is looking at sprite
    // Dot product close to 1 means vectors are pointing in similar directions
    const dotProduct = direction.dot(toSprite);

    // Consider player is looking at sprite if dot product is above 0.7 (roughly 45 degrees)
    const wasLookingAtSprite = isLookingAtSprite;
    isLookingAtSprite = dotProduct > 0.7;

    // Show or hide interaction prompt based on whether player is looking at sprite
    if (isLookingAtSprite && !wasLookingAtSprite && !isDialogOpen) {
      // Player just started looking at sprite, show prompt
      showInteractPrompt();
      console.log("Player is looking at sprite, showing interaction prompt");
    } else if (!isLookingAtSprite && wasLookingAtSprite) {
      // Player stopped looking at sprite, hide prompt
      hideInteractPrompt();
      console.log(
        "Player stopped looking at sprite, hiding interaction prompt"
      );
    }
  } else {
    // Player is not near sprite, hide prompt and reset looking state
    if (isLookingAtSprite) {
      hideInteractPrompt();
    }
    isLookingAtSprite = false;
  }
}

// Function to add idle.webm sprite at specified coordinates
function addIdleGifSprite(x, y, z) {
  // Create a video element
  const video = document.createElement("video");
  video.src = "idle.webm";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.display = "none";

  // Add the video to the document
  document.body.appendChild(video);

  // Create a video texture
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  // Important: Set the format to RGBA to support alpha channel
  videoTexture.format = THREE.RGBAFormat;

  // Create a plane geometry for the sprite (same dimensions as before: 1.5 x 1.5)
  const geometry = new THREE.PlaneGeometry(1.5, 1.5);

  // Create a material with the video texture that properly handles alpha
  const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5, // Helps with alpha rendering
    premultipliedAlpha: true, // Important for WebM alpha channel
  });

  // Create a mesh with the geometry and material
  const sprite = new THREE.Mesh(geometry, material);

  // Position the sprite at the specified coordinates
  sprite.position.set(x, y, z);

  // Make the sprite always face the camera
  sprite.lookAt(camera.position);

  // Add the sprite to the scene
  scene.add(sprite);

  // Start playing the video
  video.play().catch((e) => {
    console.error("Error playing video:", e);
  });

  console.log(
    `Added idle.webm sprite with transparency at coordinates: ${x}, ${y}, ${z}`
  );

  // Store a reference to update the sprite's rotation in the animation loop
  window.idleGifSprite = sprite;
  // Also store the video element for potential cleanup later
  window.idleVideo = video;
}

// Create the flat world with custom structures
function createWorld() {
  console.log(`Creating world of size ${WORLD_SIZE}x${WORLD_SIZE}`);

  // Create a flat world of blocks but don't add them to the scene yet
  // We'll only add blocks that are within the render distance
  let blocksCreated = 0;

  // Create the base ground layer
  for (let x = 0; x < WORLD_SIZE; x++) {
    for (let z = 0; z < WORLD_SIZE; z++) {
      createBlock(x, 0, z);
      blocksCreated++;
    }
  }

  // Add custom structures from the save file
  const customBlocks = [
    // White cloth floor around the house
    ...[37, 38, 39, 40].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 0, z },
        type: "white_cloth",
      }))
    ),

    // Dirt path and surroundings
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

    // Stone foundation (level 1)
    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 1, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 39, 40].map((z) => ({ position: { x, y: 1, z }, type: "stone" }))
    ),
    { position: { x: 41, y: 1, z: 38 }, type: "door" },
    { position: { x: 36, y: 1, z: 38 }, type: "door" },

    // Stone walls (level 2)
    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 2, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 39, 40].map((z) => ({ position: { x, y: 2, z }, type: "stone" }))
    ),
    { position: { x: 41, y: 2, z: 38 }, type: "door" },
    { position: { x: 36, y: 2, z: 38 }, type: "door" },

    // Stone walls (level 3)
    ...[36, 37, 38, 39, 40, 41].flatMap((x) =>
      [35, 41].map((z) => ({ position: { x, y: 3, z }, type: "stone" }))
    ),
    ...[36, 41].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 3, z },
        type: "stone",
      }))
    ),

    // Wooden structure
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

    // Wooden roof (level 4)
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

    // Wooden roof (level 5)
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

    // Wooden roof (level 6)
    ...[36, 37, 38, 39, 40, 41, 42].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 6, z }, type: "wood" }))
    ),
    ...[35].flatMap((x) =>
      [37, 38, 39].map((z) => ({ position: { x, y: 6, z }, type: "wood" }))
    ),

    // Flag pole
    ...[1, 2, 3, 4, 5].map((y) => ({
      position: { x: 45, y, z: 30 },
      type: "stone",
    })),

    // Flag
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

  // Create all the custom blocks
  for (const block of customBlocks) {
    const { x, y, z } = block.position;
    createBlock(x, y, z, block.type);
    blocksCreated++;
  }

  console.log(`Created ${blocksCreated} blocks in total`);
  console.log(`Player starting position: 64, 2, 64`);

  // Initial update of visible blocks
  updateVisibleBlocks();
}

// Create a single block at the specified position
function createBlock(x, y, z, type = "grass") {
  // Create a block with different colored faces
  const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

  // Get block type definition
  const blockType = BLOCK_TYPES[type] || BLOCK_TYPES.grass;

  // Create materials for each face
  const materials = blockType.materials.map(
    (material) =>
      new THREE.MeshBasicMaterial({ color: material.color, fog: true })
  );

  const block = new THREE.Mesh(geometry, materials);
  block.position.set(x, y, z);

  // Store block type for later reference
  block.userData = {
    type: type,
    solid: blockType.solid,
    isDoor: blockType.isDoor || false,
  };

  // Store the block in our blockMeshes object with a key based on position
  const key = `${x},${y},${z}`;
  blockMeshes[key] = block;

  // We'll add it to the scene only if it's within render distance
  // This is handled by updateVisibleBlocks()

  return block;
}

// Update which blocks are visible based on player position
function updateVisibleBlocks() {
  if (!camera) return;

  // Get player position
  const playerX = Math.floor(camera.position.x);
  const playerY = Math.floor(camera.position.y);
  const playerZ = Math.floor(camera.position.z);

  // Debug info
  console.log(`Player position: ${playerX}, ${playerY}, ${playerZ}`);

  // Clear the current blocks array
  blocks.forEach((block) => {
    scene.remove(block);
  });
  blocks = [];

  // Add blocks that are within render distance
  let blocksAdded = 0;

  // Ensure we're using the correct range
  const minX = Math.max(0, playerX - RENDER_DISTANCE);
  const maxX = Math.min(WORLD_SIZE - 1, playerX + RENDER_DISTANCE);
  const minZ = Math.max(0, playerZ - RENDER_DISTANCE);
  const maxZ = Math.min(WORLD_SIZE - 1, playerZ + RENDER_DISTANCE);

  console.log(
    `Checking blocks in range: X(${minX}-${maxX}), Z(${minZ}-${maxZ})`
  );

  for (let x = minX; x <= maxX; x++) {
    for (let z = minZ; z <= maxZ; z++) {
      // Check all possible heights for blocks
      for (let y = 0; y < MAX_BUILD_HEIGHT; y++) {
        const key = `${x},${y},${z}`;
        const block = blockMeshes[key];

        if (block) {
          // Calculate distance to player
          const dx = x - playerX;
          const dy = y - playerY;
          const dz = z - playerZ;
          const distanceSquared = dx * dx + dy * dy + dz * dz;

          // Only add blocks within render distance
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

// Set up first-person controls
function setupControls() {
  controls = new THREE.PointerLockControls(camera, document.body);

  // No instructions element - removed as requested

  // Set up event listeners for controls
  controls.addEventListener("lock", function () {
    isLocked = true;
  });

  controls.addEventListener("unlock", function () {
    isLocked = false;
  });

  // Set up keyboard controls
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

  // Separate jump key tracking
  let jumpKeyPressed = false;
  let canJump = true;

  document.addEventListener("keydown", function (event) {
    // Log all key presses for debugging
    console.log("Key pressed:", event.code, event.key);

    // Handle WASD movement keys
    if (keys.hasOwnProperty(event.code)) {
      keys[event.code] = true;
    }

    // Handle space bar for jumping
    if (event.code === "Space" || event.key === " ") {
      jumpKeyPressed = true;
      console.log("Jump key pressed");

      // Initiate jump immediately if on ground and can jump
      if (isOnGround && canJump) {
        velocity.y = JUMP_VELOCITY;
        isOnGround = false;
        isJumping = true;
        canJump = false; // Prevent repeated jumps until key is released
        console.log("JUMP INITIATED with velocity:", JUMP_VELOCITY);
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    // Handle WASD movement keys
    if (keys.hasOwnProperty(event.code)) {
      keys[event.code] = false;
    }

    // Handle space bar for jumping
    if (event.code === "Space" || event.key === " ") {
      jumpKeyPressed = false;
      canJump = true; // Reset jump ability when key is released
      console.log("Jump key released");
    }
  });

  // Add movement to animation loop
  const moveSpeed = 0.05;
  const playerRadius = 0.3; // Player collision radius

  // Helper function to check if a position collides with any solid blocks
  function checkBlockCollision(position) {
    // Check blocks in a small area around the player
    const checkRadius = 1;
    const playerX = Math.floor(position.x);
    const playerY = Math.floor(position.y);
    const playerZ = Math.floor(position.z);

    // Check blocks at player's feet and head level
    for (let y = playerY - 1; y <= playerY + 0.1; y++) {
      // Skip if outside valid height range
      if (y < 0 || y >= MAX_BUILD_HEIGHT) continue;

      for (let x = playerX - checkRadius; x <= playerX + checkRadius; x++) {
        for (let z = playerZ - checkRadius; z <= playerZ + checkRadius; z++) {
          // Skip if outside world bounds
          if (x < 0 || x >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) continue;

          const key = `${x},${y},${z}`;
          const block = blockMeshes[key];

          if (block && block.userData.solid) {
            // Calculate distance from player center to block center
            const dx = position.x - block.position.x;
            const dz = position.z - block.position.z;
            const distanceSquared = dx * dx + dz * dz;

            // Check if player is colliding with this block
            // Allow a small margin for collision detection
            if (
              distanceSquared <
              (playerRadius + BLOCK_SIZE / 2) * (playerRadius + BLOCK_SIZE / 2)
            ) {
              return true; // Collision detected
            }
          }
        }
      }
    }
    return false; // No collision
  }

  // Check if the player is standing on a block
  function checkIfOnGround() {
    // Position slightly below the player's feet
    const feetPosition = camera.position.clone();
    feetPosition.y -= playerHeight / 2 + 0.1; // Half of player height plus a small margin

    // Check blocks directly below the player
    const playerX = Math.floor(feetPosition.x);
    const playerY = Math.floor(feetPosition.y);
    const playerZ = Math.floor(feetPosition.z);

    // Check a small area below the player's feet
    for (let x = playerX - 1; x <= playerX + 1; x++) {
      for (let z = playerZ - 1; z <= playerZ + 1; z++) {
        // Skip if outside world bounds
        if (x < 0 || x >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) continue;

        // Check for blocks at the player's feet level and one below
        // This helps with more reliable ground detection
        for (let y = playerY; y >= playerY - 1; y--) {
          const key = `${x},${y},${z}`;
          const block = blockMeshes[key];

          if (block && block.userData.solid) {
            // Calculate horizontal distance from player to block center
            const dx = feetPosition.x - block.position.x;
            const dz = feetPosition.z - block.position.z;
            const horizontalDistanceSquared = dx * dx + dz * dz;

            // Check if player is directly above this block
            if (
              horizontalDistanceSquared <
              (playerRadius + BLOCK_SIZE / 2) * (playerRadius + BLOCK_SIZE / 2)
            ) {
              // Check vertical distance - increased threshold slightly for better detection
              const dy = Math.abs(
                feetPosition.y - (block.position.y + BLOCK_SIZE / 2)
              );
              if (dy < 0.25) {
                // Slightly increased threshold for ground detection
                return true; // Player is on ground
              }
            }
          }
        }
      }
    }
    return false; // Player is not on ground
  }

  window.movePlayer = function () {
    if (!isLocked) return;

    // Store current position
    const oldPosition = camera.position.clone();

    // Handle horizontal movement first
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

    // Check if new position is outside world boundaries
    const margin = 0.5; // Keep a small margin from the edge
    if (
      camera.position.x < margin ||
      camera.position.x > WORLD_SIZE - margin ||
      camera.position.z < margin ||
      camera.position.z > WORLD_SIZE - margin
    ) {
      // If outside boundaries, revert to old position (horizontal only)
      camera.position.x = oldPosition.x;
      camera.position.z = oldPosition.z;
      horizontalMoved = false;
    }

    // Check for horizontal collisions with solid blocks
    if (horizontalMoved && checkBlockCollision(camera.position)) {
      // If collision detected, revert to old position (horizontal only)
      camera.position.x = oldPosition.x;
      camera.position.z = oldPosition.z;
      console.log("Horizontal collision detected, movement blocked");
    }

    // Now handle vertical movement (gravity)

    // Check if player is on ground after horizontal movement
    isOnGround = checkIfOnGround();

    // Log jump state for debugging
    console.log("Jump state:", {
      isOnGround,
      jumpKeyPressed,
      canJump,
      velocity: velocity.y,
      isJumping,
    });

    // Note: Jump is now initiated in the keydown event handler
    // This section now only handles the physics after jump is initiated

    // Apply gravity if player is not on ground
    if (!isOnGround) {
      // Increase downward velocity due to gravity, up to terminal velocity
      velocity.y = Math.max(velocity.y - GRAVITY, -TERMINAL_VELOCITY);

      // Check if we're at the peak of our jump (for better jump feel)
      if (isJumping && velocity.y <= 0) {
        console.log("Reached jump peak, starting to fall");
      }
    } else {
      // Reset vertical velocity when on ground
      velocity.y = 0;
      isJumping = false;

      // Ensure player is positioned exactly on top of the block
      // This prevents "sinking" into the ground
      const feetPosition = camera.position.clone();
      feetPosition.y -= playerHeight / 2;
      const blockY = Math.floor(feetPosition.y);
      camera.position.y = blockY + BLOCK_SIZE + playerHeight / 2;
    }

    // Store position before applying gravity
    const preGravityPosition = camera.position.clone();

    // Apply velocity to position
    camera.position.y += velocity.y;

    // Check if player has fallen below reset height
    if (camera.position.y < RESET_HEIGHT) {
      // Reset player to a safe position
      camera.position.set(WORLD_SIZE / 2, 2, WORLD_SIZE / 2);
      velocity.set(0, 0, 0);
      console.log("Player fell too far and was reset");
      return;
    }

    // Check for vertical collisions
    if (checkBlockCollision(camera.position)) {
      // If collision detected after falling, place player on top of the block
      camera.position.y = preGravityPosition.y;
      velocity.y = 0;
      isOnGround = true;
    }
  };
}

// Handle window resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse clicks
function onClick(event) {
  // If main menu is visible, don't handle game clicks
  if (isMainMenuVisible) {
    return;
  }

  // If inventory is open, don't handle game clicks
  if (isInventoryOpen) {
    // Prevent default behavior to avoid camera control
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // If dialog is open, don't handle game clicks
  if (isDialogOpen) {
    return;
  }

  if (!isLocked) {
    controls.lock();
    return;
  }

  // Left click (primary button) - break block
  if (event.button === 0) {
    breakBlock();
  }
  // Right click (secondary button) - place block
  else if (event.button === 2) {
    placeBlock();
  }
}

// Handle key presses for hotbar selection and other controls
function onKeyDown(event) {
  // Log key press for debugging
  console.log("Key pressed:", event.code);

  // If main menu is visible, don't handle game keys
  if (isMainMenuVisible) {
    // Allow Escape key to exit options menu if implemented later
    return;
  }

  // If inventory is open, only handle the I key to close it
  if (isInventoryOpen) {
    // 'I' key to close inventory
    if (event.code === "KeyI") {
      toggleInventory();
    }

    return; // Don't process other keys when inventory is open
  }

  // Number keys 1-9 for hotbar selection when inventory is closed
  if (event.code >= "Digit1" && event.code <= "Digit9") {
    const num = parseInt(event.code.replace("Digit", "")) - 1;
    if (num >= 0 && num < HOTBAR.length) {
      selectedHotbarIndex = num;
      currentBlockType = HOTBAR[selectedHotbarIndex];
      updateHotbarDisplay();

      // Save the game state when hotbar selection changes
      saveGameState();
    }
  }

  // 'I' key to open inventory
  if (event.code === "KeyI") {
    toggleInventory();
  }

  // 'K' key to reset player position to center of map
  if (event.code === "KeyK") {
    // Reset player to position 64,2,64 (center of map)
    camera.position.set(64, 2, 64);
    velocity.set(0, 0, 0); // Reset velocity
    console.log("Player position reset to 64,2,64");

    // Save the game state after resetting position
    saveGameState();
  }

  // 'R' key to reset the world
  if (event.code === "KeyR") {
    console.log("R key pressed - resetting world");
    resetWorld();
  }

  // 'E' key to interact with sprite
  if (event.code === "KeyE") {
    // Check if player is near and looking at the sprite
    if (isNearSprite && isLookingAtSprite) {
      if (!isDialogOpen) {
        // Start dialog
        messageIndex = 0;
        showDialog();
        console.log("Started dialog with sprite");
      } else {
        // Advance dialog
        advanceDialog();
        console.log("Advanced dialog");
      }
    }
  }

  // 'Escape' key to return to main menu
  if (event.code === "Escape" && !isDialogOpen && !isInventoryOpen) {
    returnToMainMenu();
  }
}

// Function to return to the main menu
function returnToMainMenu() {
  console.log("Returning to main menu");

  // Unlock controls if locked
  if (isLocked && controls) {
    controls.unlock();
  }

  // Hide the game container
  document.getElementById("game-container").style.display = "none";

  // Show the main menu
  document.getElementById("main-menu").style.display = "flex";

  isMainMenuVisible = true;
}

// Create hotbar display
function createInventoryDisplay() {
  // Create hotbar element
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

  // Create slots for each hotbar item (limited to 9)
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

    // Display block name
    slot.textContent = blockType.replace("_", " ");

    // Add key number indicator
    const keyNumber = document.createElement("div");
    keyNumber.className = "key-number";
    keyNumber.style.position = "absolute";
    keyNumber.style.top = "2px";
    keyNumber.style.left = "2px";
    keyNumber.style.fontSize = "10px";
    keyNumber.style.color = "#aaa";
    keyNumber.textContent = (index + 1).toString();
    slot.appendChild(keyNumber);

    // Highlight selected slot
    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    }

    hotbarElement.appendChild(slot);
  });

  document.getElementById("hud").appendChild(hotbarElement);

  // Create inventory menu (initially hidden)
  createInventoryMenu();
}

// Update hotbar display when selection changes
function updateHotbarDisplay() {
  const slots = document.querySelectorAll(".hotbar-slot");

  // Update slot content and selection
  slots.forEach((slot, index) => {
    // Update block type
    const blockType = HOTBAR[index];
    slot.dataset.blockType = blockType;

    // Update text content (preserve the key number)
    const keyNumber = slot.querySelector(".key-number");
    slot.textContent = blockType.replace("_", " ");
    if (keyNumber) {
      slot.appendChild(keyNumber);
    } else {
      // Recreate key number if it doesn't exist
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

    // Update selection
    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    } else {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      slot.style.border = "none";
    }
  });

  // Update current block type
  currentBlockType = HOTBAR[selectedHotbarIndex];
}

// Create the inventory menu with drag and drop functionality
function createInventoryMenu() {
  // Create inventory container
  const inventoryMenu = document.createElement("div");
  inventoryMenu.id = "inventory-menu";
  inventoryMenu.style.display = "none"; // Hidden by default
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
  inventoryMenu.style.pointerEvents = "auto"; // Ensure it captures mouse events

  // Prevent all mouse events from propagating to the game
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

  // Add title
  const title = document.createElement("h2");
  title.textContent = "Inventory";
  title.style.textAlign = "center";
  title.style.marginBottom = "20px";
  inventoryMenu.appendChild(title);

  // Add instructions
  const instructions = document.createElement("p");
  instructions.textContent = "Drag blocks to your hotbar slots";
  instructions.style.textAlign = "center";
  instructions.style.marginBottom = "20px";
  instructions.style.fontSize = "14px";
  instructions.style.color = "#aaa";
  inventoryMenu.appendChild(instructions);

  // Create grid for blocks
  const blocksGrid = document.createElement("div");
  blocksGrid.style.display = "grid";
  blocksGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  blocksGrid.style.gap = "10px";

  // Add all available blocks to the grid
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
    blockItem.style.userSelect = "none"; // Prevent text selection during drag

    // Make the item draggable
    blockItem.setAttribute("draggable", "true");

    // Add hover effect
    blockItem.addEventListener("mouseover", function () {
      this.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });

    blockItem.addEventListener("mouseout", function () {
      this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });

    // Prevent mouse events from propagating to the game
    blockItem.addEventListener("mousedown", function (event) {
      event.stopPropagation();
    });

    blockItem.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    // Add drag start event
    blockItem.addEventListener("dragstart", function (event) {
      // Prevent event propagation
      event.stopPropagation();

      // Store the block type in the drag data
      event.dataTransfer.setData("text/plain", blockType);

      // Change cursor style during drag
      this.style.cursor = "grabbing";

      // Set a custom drag image (optional)
      const dragIcon = document.createElement("div");
      dragIcon.textContent = blockType;
      dragIcon.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      dragIcon.style.color = "white";
      dragIcon.style.padding = "5px";
      dragIcon.style.borderRadius = "3px";
      dragIcon.style.position = "absolute";
      dragIcon.style.top = "-1000px"; // Position off-screen
      document.body.appendChild(dragIcon);
      event.dataTransfer.setDragImage(dragIcon, 0, 0);
      setTimeout(() => document.body.removeChild(dragIcon), 0);
    });

    // Add drag end event
    blockItem.addEventListener("dragend", function (event) {
      // Prevent event propagation
      event.stopPropagation();

      // Reset cursor style
      this.style.cursor = "grab";
    });

    blocksGrid.appendChild(blockItem);
  });

  inventoryMenu.appendChild(blocksGrid);

  // Create a hotbar display inside the inventory menu
  const hotbarPreview = document.createElement("div");
  hotbarPreview.id = "hotbar-preview";
  hotbarPreview.style.display = "flex";
  hotbarPreview.style.justifyContent = "center";
  hotbarPreview.style.gap = "5px";
  hotbarPreview.style.marginTop = "20px";
  hotbarPreview.style.padding = "10px";
  hotbarPreview.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  hotbarPreview.style.borderRadius = "5px";

  // Create slots for each hotbar item
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

    // Add key number indicator
    const keyNumber = document.createElement("div");
    keyNumber.className = "key-number";
    keyNumber.style.position = "absolute";
    keyNumber.style.top = "2px";
    keyNumber.style.left = "2px";
    keyNumber.style.fontSize = "10px";
    keyNumber.style.color = "#aaa";
    keyNumber.textContent = (index + 1).toString();
    slot.appendChild(keyNumber);

    // Highlight selected slot
    if (index === selectedHotbarIndex) {
      slot.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      slot.style.border = "2px solid #fff";
    }

    // Prevent all mouse events from propagating to the game
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

    // Add drop event handlers
    slot.addEventListener("dragover", function (event) {
      // Allow drop
      event.preventDefault();
      event.stopPropagation();
      // Visual feedback
      this.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      this.style.border = "2px dashed #fff";
    });

    slot.addEventListener("dragleave", function (event) {
      event.stopPropagation();
      // Reset visual feedback
      if (index === selectedHotbarIndex) {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        this.style.border = "2px solid #fff";
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        this.style.border = "none";
      }
    });

    slot.addEventListener("drop", function (event) {
      // Prevent default behavior
      event.preventDefault();
      event.stopPropagation();

      // Get the dragged block type
      const blockType = event.dataTransfer.getData("text/plain");

      // Update the hotbar
      HOTBAR[index] = blockType;

      // Update the slot
      this.dataset.blockType = blockType;
      this.textContent = blockType.replace("_", " ");

      // Re-add the key number
      this.appendChild(keyNumber);

      // Reset visual feedback
      if (index === selectedHotbarIndex) {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        this.style.border = "2px solid #fff";
        // Update current block type
        currentBlockType = blockType;
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        this.style.border = "none";
      }

      // Update the main hotbar display
      updateHotbarDisplay();

      // Save the game state
      saveGameState();

      console.log(`Placed ${blockType} in hotbar slot ${index + 1}`);
    });

    hotbarPreview.appendChild(slot);
  });

  inventoryMenu.appendChild(hotbarPreview);

  // Add to HUD
  document.getElementById("hud").appendChild(inventoryMenu);
}

// Toggle inventory menu visibility
function toggleInventory() {
  isInventoryOpen = !isInventoryOpen;

  const inventoryMenu = document.getElementById("inventory-menu");
  const hud = document.getElementById("hud");
  if (!inventoryMenu || !hud) return;

  if (isInventoryOpen) {
    // Show inventory and unlock pointer to allow normal mouse interaction
    inventoryMenu.style.display = "block";

    // Enable pointer events on the HUD to capture mouse events
    hud.style.pointerEvents = "auto";

    // Always unlock controls when opening inventory
    if (isLocked) {
      controls.unlock();
      isLocked = false; // Update the lock state
    }

    // Add event listener for mouse movement to enable normal mouse interaction
    document.addEventListener("mousemove", handleInventoryMouseMove);

    // Prevent the game from capturing clicks
    document.body.style.pointerEvents = "none";
    inventoryMenu.style.pointerEvents = "auto";

    console.log("Inventory opened, camera control disabled");
  } else {
    // Hide inventory
    inventoryMenu.style.display = "none";

    // Disable pointer events on the HUD except for specific elements
    hud.style.pointerEvents = "none";

    // Re-enable pointer events for the dialog if it's open
    if (isDialogOpen && dialogElement) {
      dialogElement.style.pointerEvents = "auto";
    }

    // Re-enable pointer events for the game
    document.body.style.pointerEvents = "auto";

    // Remove the mouse move event listener
    document.removeEventListener("mousemove", handleInventoryMouseMove);

    // Only lock controls if not in dialog
    if (!isDialogOpen) {
      controls.lock();
      isLocked = true; // Update the lock state
    }

    console.log("Inventory closed, camera control restored");
  }
}

// Handle mouse movement when inventory is open
function handleInventoryMouseMove(event) {
  // This function exists to ensure the event listener can be properly removed
  // The actual mouse handling is done by the browser for hovering over inventory items
}

// Break a block (remove it)
function breakBlock() {
  if (!selectedBlock) return;

  // Get the position of the selected block
  const position = selectedBlock.position;
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);
  const z = Math.floor(position.z);

  // Check if the block is one of the "back door" blocks at X: 40 Y:2 Z:38 or X: 40 Y:3 Z:38
  if ((x === 36 && y === 2 && z === 38) || (x === 36 && y === 3 && z === 38)) {
    console.log("Back door block destroyed!");
    // Set the flag to indicate back door has been destroyed
    isBackDoorDestroyed = true;
    // Reset message index to start with the first message
    messageIndex = 0;

    // If player is near the sprite, show the new dialogue immediately
    if (isNearSprite && isLookingAtSprite) {
      showDialog();
    }
  }

  // Remove the block from the scene
  scene.remove(selectedBlock);

  // Remove from blocks array
  const blockIndex = blocks.indexOf(selectedBlock);
  if (blockIndex !== -1) {
    blocks.splice(blockIndex, 1);
  }

  // Remove from blockMeshes
  const key = `${x},${y},${z}`;
  delete blockMeshes[key];

  // Reset selection
  selectedBlock = null;

  // Save the game state after breaking a block
  saveGameState();
}

// Place a new block
function placeBlock() {
  if (!selectedBlock || !selectedBlockFace) return;

  // Calculate the position for the new block based on the face
  const position = selectedBlock.position.clone();

  // Get the face normal from the intersection
  const normal = new THREE.Vector3().copy(selectedBlockFace.face.normal);

  // Add the normal to the position to place the block adjacent to the selected face
  position.add(normal);

  // Round to integers
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);
  const z = Math.floor(position.z);

  console.log(`Attempting to place block at: ${x}, ${y}, ${z}`);

  // Check if there's already a block at this position
  const key = `${x},${y},${z}`;
  if (blockMeshes[key]) {
    console.log("Block already exists at this position");
    return;
  }

  // Check if the position is within world bounds and below max build height
  if (
    x < 0 ||
    x >= WORLD_SIZE ||
    y < 0 ||
    y >= MAX_BUILD_HEIGHT || // Use MAX_BUILD_HEIGHT instead of WORLD_SIZE
    z < 0 ||
    z >= WORLD_SIZE
  ) {
    console.log("Position out of bounds or above max build height");
    return;
  }

  // Special case for door - place two blocks vertically
  if (currentBlockType === "door") {
    // Check if there's enough height for a door
    if (y + 1 >= MAX_BUILD_HEIGHT) {
      console.log("Not enough height for a door");
      return;
    }

    // Place bottom part of the door
    const bottomDoor = createBlock(x, y, z, "door");
    scene.add(bottomDoor);
    blocks.push(bottomDoor);

    // Place top part of the door
    const topKey = `${x},${y + 1},${z}`;
    if (!blockMeshes[topKey]) {
      const topDoor = createBlock(x, y + 1, z, "door");
      scene.add(topDoor);
      blocks.push(topDoor);
    }

    console.log("Door placed successfully");
  } else {
    // Create and add the new block
    const newBlock = createBlock(x, y, z, currentBlockType);
    scene.add(newBlock);
    blocks.push(newBlock);
    console.log(`${currentBlockType} block placed successfully`);
  }

  // Save the game state after placing a block
  saveGameState();
}

// Cast a ray to find which block the player is looking at
function updateRaycaster() {
  if (!isLocked || !camera || !scene) return;

  // Get the camera's direction vector
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Set the raycaster from the camera position in the direction the camera is facing
  raycaster.set(camera.position, direction);

  // Find intersections with blocks
  const intersects = raycaster.intersectObjects(blocks);

  // Reset selection
  selectedBlock = null;
  selectedBlockFace = null;

  // If we found an intersection, store the selected block and face
  if (intersects.length > 0) {
    selectedBlock = intersects[0].object;
    selectedBlockFace = intersects[0];

    // Debug info
    console.log("Selected block at:", selectedBlock.position);
    console.log("Face normal:", selectedBlockFace.face.normal);
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move player based on key presses
  if (typeof window.movePlayer === "function") {
    window.movePlayer();
  }

  // Update which blocks are visible based on player position
  updateVisibleBlocks();

  // Update raycaster to detect which block is being looked at
  updateRaycaster();

  // Update coordinates display
  updateCoordinatesDisplay();

  // Make the idle.gif sprite always face the camera, but only rotate on Y axis
  if (window.idleGifSprite) {
    // Get the sprite's current position
    const spritePos = window.idleGifSprite.position.clone();

    // Create a target position at the same height as the sprite
    const targetPos = camera.position.clone();
    targetPos.y = spritePos.y; // Keep the same Y value to prevent vertical rotation

    // Make the sprite face the camera horizontally only
    window.idleGifSprite.lookAt(targetPos);

    // Check if player is near the sprite and handle messages
    checkSpriteProximity();
  }

  // Check if it's time to auto-save
  checkAutoSave();

  // Render the scene
  renderer.render(scene, camera);
}

// Update the coordinates display with the player's current position
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

// Save the current game state to localStorage
function saveGameState() {
  // Create a save object with all the necessary data
  const saveData = {
    // Save player position and inventory selection
    player: {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      selectedHotbarIndex: selectedHotbarIndex,
      hotbar: HOTBAR,
    },
    // Save all placed blocks (excluding the original ground blocks)
    blocks: [],
  };

  // Iterate through all block meshes
  for (const key in blockMeshes) {
    const block = blockMeshes[key];
    const [x, y, z] = key.split(",").map(Number);

    // Only save blocks that aren't part of the original ground (y > 0)
    // Also save any blocks that have been placed at y=0 that aren't grass
    // (since the original ground is all grass blocks)
    if (y > 0 || (y === 0 && block.userData.type !== "grass")) {
      saveData.blocks.push({
        position: { x, y, z },
        type: block.userData.type,
      });
    }
  }

  // Save to localStorage
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved successfully");
    lastSaveTime = Date.now();
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}

// Load the game state from localStorage
function loadGameState() {
  try {
    const saveData = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saveData) {
      console.log("No saved game found");
      return false;
    }

    console.log("Loading saved game...");

    // Load player position if available
    if (saveData.player && saveData.player.position) {
      const pos = saveData.player.position;
      camera.position.set(pos.x, pos.y, pos.z);
      console.log(`Restored player position: ${pos.x}, ${pos.y}, ${pos.z}`);
    } else {
      // Default position if not available
      camera.position.set(64, 2, 64);
      console.log("No saved position found, using default (64, 2, 64)");
    }

    // Load hotbar and selection if available
    if (saveData.player) {
      // Load hotbar if available
      if (saveData.player.hotbar) {
        // Copy saved hotbar to HOTBAR array
        for (
          let i = 0;
          i < Math.min(saveData.player.hotbar.length, HOTBAR.length);
          i++
        ) {
          HOTBAR[i] = saveData.player.hotbar[i];
        }
        console.log("Restored hotbar configuration");
      }

      // Load selected hotbar index if available
      if (saveData.player.selectedHotbarIndex !== undefined) {
        selectedHotbarIndex = saveData.player.selectedHotbarIndex;
        currentBlockType = HOTBAR[selectedHotbarIndex];
        console.log(`Restored hotbar selection: ${currentBlockType}`);
      } else if (saveData.player.selectedInventoryIndex !== undefined) {
        // Backward compatibility with old save format
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

    // We don't need to load blocks from save file since they're now generated in createWorld()
    // The custom blocks are already created when the world is generated

    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}

// Check if it's time to auto-save
function checkAutoSave() {
  const currentTime = Date.now();
  if (currentTime - lastSaveTime > AUTO_SAVE_INTERVAL) {
    saveGameState();
  }
}

// Reset the world to its default state
function resetWorld() {
  console.log("Resetting world to default state...");

  // Clear the current save from localStorage
  localStorage.removeItem(SAVE_KEY);

  // Clear all blocks from the scene
  blocks.forEach((block) => {
    scene.remove(block);
  });
  blocks = [];

  // Clear all block meshes
  blockMeshes = {};

  // Reset back door destroyed flag
  isBackDoorDestroyed = false;

  // Reset player position to center of map
  camera.position.set(WORLD_SIZE / 2, 2, WORLD_SIZE / 2);
  velocity.set(0, 0, 0);

  // Reset hotbar to default
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

  // Recreate the world
  createWorld();

  console.log("World reset complete");
}

// Initialize the main menu
function initMainMenu() {
  console.log("Initializing main menu");

  // Add event listeners for menu buttons
  document.getElementById("play-button").addEventListener("click", startGame);
  document
    .getElementById("options-button")
    .addEventListener("click", showOptions);

  // Initialize splash text
  initSplashText();
}

// Initialize the splash text with a random message
function initSplashText() {
  const splashElement = document.getElementById("splash-text");
  if (splashElement) {
    // Array of possible splash texts
    const splashTexts = [
      "Now with 50% more fog!",
      "100% Belgian free",
      "Realistic Dutch terrain",
      "Definitely nothing fishy",
      "38 amazing features!",
      "Held together with duct tape!",
    ];

    // Randomly select a splash text
    const randomIndex = Math.floor(Math.random() * splashTexts.length);
    splashElement.textContent = splashTexts[randomIndex];

    console.log("Splash text initialized: " + splashTexts[randomIndex]);
  }
}

// Start the game from the main menu
function startGame() {
  console.log("Starting game from main menu");

  // Hide the main menu
  document.getElementById("main-menu").style.display = "none";

  // Show the game container
  document.getElementById("game-container").style.display = "block";

  // Initialize the game if it hasn't been initialized yet
  if (!gameInitialized) {
    init();
    gameInitialized = true;
  } else {
    // If game was already initialized, just lock controls
    if (controls) {
      controls.lock();
    }
  }

  isMainMenuVisible = false;
}

// Show options menu (placeholder function)
function showOptions() {
  console.log("Controls button clicked");
  // This could be expanded to show actual options
  alert(
    "I suppose I can tell a Belg like you how to play\nWASD to move\nSpace to jump\nI to access a HUGE range of blocks\nClick and drag to put them into your hotbar\nK to reset your pathetic life\nIf you really mess up my world you better press R to fix it."
  );
}

// Initialize the main menu when the page loads
window.addEventListener("load", initMainMenu);
