//NEVER LET MYMY CODE AGAIN
let scene, camera, renderer;
let controls;
let blocks = [];
let isLocked = false;
let blockMeshes = {};
let raycaster;
let selectedBlock = null;
let selectedBlockFace = null;
let currentBlockType = "wgrass";
let gameInitialized = false;

let velocity = new THREE.Vector3(0, 0, 0);
let isJumping = false;
let isOnGround = true;
let playerHeight = 1.7;

// Snow particles system
let snowParticles = [];
let snowCount = 500; // Number of snow particles

// Character visibility toggle (0 = invisible, 1 = visible)
let showCharacter = 0; // Set to 0 to hide character, 1 to show

// Sign text variables
let isEditingSign = false;
let currentEditingSign = null;
let signTextInput = null;
let signTextDisplay = null;
const MAX_SIGN_CHARS = 40;

const SAVE_KEY = "mymycraft_save";
const AUTO_SAVE_INTERVAL = 10000;
let lastSaveTime = 0;

let isMainMenuVisible = true;

const SPRITE_INTERACTION_DISTANCE = 1.5;
const SPRITE_MESSAGES = [
  "<i>The Mymy? in front of you gives no response</i>",

];

const BACK_DOOR_DESTROYED_MESSAGES = [
"<i>The Mymy? in front of you gives no response</i>",
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
  GRASS_TOP: 0xffffff, // Changed from green to white to simulate snow
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
  SNOW: 0xffffff, // Added for snow particles
  SIGN: 0xd2b48c, // Tan color for sign
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
  sign: {
    materials: Array(6).fill({ color: COLORS.SIGN }),
    solid: false,
    isSign: true,
    text: "", // Default empty text
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
  "sign",
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
  "sign",
  "red_cloth",
  "yellow_cloth",
  "orange_cloth",
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
  
  // Create snow particles
  createSnowParticles();

  setupControls();

  window.addEventListener("resize", onWindowResize);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);

  createInventoryDisplay();
  
  // Create sign elements
  createSignElements();

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

// Function to create snow particles
function createSnowParticles() {
  for (let i = 0; i < snowCount; i++) {
    // Create a small white sphere for each snow particle
    const geometry = new THREE.SphereGeometry(0.03, 8, 8); // Small radius for snow
    const material = new THREE.MeshBasicMaterial({ color: COLORS.SNOW });
    const particle = new THREE.Mesh(geometry, material);
    
    // Random position within the world bounds
    const x = Math.random() * WORLD_SIZE;
    const y = Math.random() * 20 + 10; // Start above the player
    const z = Math.random() * WORLD_SIZE;
    
    particle.position.set(x, y, z);
    
    // Add random falling speed for each particle
    particle.userData.speed = Math.random() * 0.02 + 0.01;
    // Add slight random horizontal movement
    particle.userData.driftX = (Math.random() - 0.5) * 0.005;
    particle.userData.driftZ = (Math.random() - 0.5) * 0.005;
    
    scene.add(particle);
    snowParticles.push(particle);
  }
  
  console.log(`Created ${snowCount} snow particles`);
}

// Create sign text input and display elements
function createSignElements() {
  // Create container for sign editing
  const signEditContainer = document.createElement("div");
  signEditContainer.id = "sign-edit-container";
  signEditContainer.style.position = "absolute";
  signEditContainer.style.top = "50%";
  signEditContainer.style.left = "50%";
  signEditContainer.style.transform = "translate(-50%, -50%)";
  signEditContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  signEditContainer.style.border = "2px solid #555";
  signEditContainer.style.borderRadius = "5px";
  signEditContainer.style.padding = "20px";
  signEditContainer.style.width = "300px";
  signEditContainer.style.zIndex = "2000"; // Higher z-index to ensure it's on top
  signEditContainer.style.display = "none";
  signEditContainer.style.flexDirection = "column";
  signEditContainer.style.alignItems = "center";
  signEditContainer.style.gap = "10px";
  signEditContainer.style.pointerEvents = "auto"; // Ensure pointer events work

  // Add event listeners to stop propagation
  ["mousedown", "mouseup", "click", "dblclick"].forEach(eventType => {
    signEditContainer.addEventListener(eventType, function(event) {
      event.stopPropagation();
    });
  });

  // Create title with Minecraft-style appearance
  const title = document.createElement("h3");
  title.textContent = "Edit Sign";
  title.style.color = "#fff";
  title.style.margin = "0 0 10px 0";
  title.style.fontFamily = "'DotGothic16', sans-serif";
  title.style.textAlign = "center";
  signEditContainer.appendChild(title);

  // Create text input
  signTextInput = document.createElement("input");
  signTextInput.type = "text";
  signTextInput.maxLength = MAX_SIGN_CHARS;
  signTextInput.style.width = "100%";
  signTextInput.style.padding = "8px";
  signTextInput.style.backgroundColor = "#333";
  signTextInput.style.border = "1px solid #555";
  signTextInput.style.borderRadius = "3px";
  signTextInput.style.color = "#fff";
  signTextInput.style.fontFamily = "'DotGothic16', sans-serif";
  signTextInput.style.pointerEvents = "auto"; // Ensure pointer events work
  signEditContainer.appendChild(signTextInput);

  // Create character counter
  const charCounter = document.createElement("div");
  charCounter.style.color = "#aaa";
  charCounter.style.fontSize = "12px";
  charCounter.style.alignSelf = "flex-end";
  charCounter.textContent = `0/${MAX_SIGN_CHARS}`;
  signEditContainer.appendChild(charCounter);

  // Update character counter when typing
  signTextInput.addEventListener("input", function() {
    charCounter.textContent = `${this.value.length}/${MAX_SIGN_CHARS}`;
  });

  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.gap = "10px";
  buttonsContainer.style.marginTop = "10px";
  buttonsContainer.style.width = "100%";
  buttonsContainer.style.justifyContent = "center";
  signEditContainer.appendChild(buttonsContainer);

  // Create save button with Minecraft-style appearance
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.style.padding = "8px 16px";
  saveButton.style.backgroundColor = "#4CAF50";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "3px";
  saveButton.style.color = "white";
  saveButton.style.cursor = "pointer";
  saveButton.style.fontFamily = "'DotGothic16', sans-serif";
  saveButton.style.minWidth = "80px";
  saveButton.style.pointerEvents = "auto"; // Ensure pointer events work
  
  // Add event listeners to ensure clicks work
  ["mousedown", "mouseup", "click"].forEach(eventType => {
    saveButton.addEventListener(eventType, function(event) {
      event.stopPropagation();
      if (eventType === "click") {
        saveSignText();
      }
    });
  });
  
  buttonsContainer.appendChild(saveButton);

  // Create cancel button with Minecraft-style appearance
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.style.padding = "8px 16px";
  cancelButton.style.backgroundColor = "#f44336";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "3px";
  cancelButton.style.color = "white";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.fontFamily = "'DotGothic16', sans-serif";
  cancelButton.style.minWidth = "80px";
  cancelButton.style.pointerEvents = "auto"; // Ensure pointer events work
  
  // Add event listeners to ensure clicks work
  ["mousedown", "mouseup", "click"].forEach(eventType => {
    cancelButton.addEventListener(eventType, function(event) {
      event.stopPropagation();
      if (eventType === "click") {
        cancelSignEdit();
      }
    });
  });
  
  buttonsContainer.appendChild(cancelButton);

  // Add to HUD
  const hud = document.getElementById("hud");
  hud.appendChild(signEditContainer);

  // Create sign text display element (will be positioned at sign location)
  signTextDisplay = document.createElement("div");
  signTextDisplay.style.position = "absolute";
  signTextDisplay.style.color = "#000";
  signTextDisplay.style.fontFamily = "'DotGothic16', sans-serif";
  signTextDisplay.style.fontSize = "14px";
  signTextDisplay.style.textAlign = "center";
  signTextDisplay.style.pointerEvents = "none";
  signTextDisplay.style.userSelect = "none";
  signTextDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  signTextDisplay.style.padding = "5px";
  signTextDisplay.style.borderRadius = "3px";
  signTextDisplay.style.maxWidth = "150px";
  signTextDisplay.style.wordWrap = "break-word";
  signTextDisplay.style.display = "none";
  hud.appendChild(signTextDisplay);
}

// Show sign editing UI
function showSignEditor(sign) {
  if (isLocked) {
    controls.unlock();
  }
  
  isEditingSign = true;
  currentEditingSign = sign;
  
  // Get existing text if any
  const text = sign.userData.text || "";
  signTextInput.value = text;
  
  // Update character counter
  const charCounter = document.querySelector("#sign-edit-container div:nth-child(3)");
  if (charCounter) {
    charCounter.textContent = `${text.length}/${MAX_SIGN_CHARS}`;
  }
  
  // Show the editor
  const signEditContainer = document.getElementById("sign-edit-container");
  signEditContainer.style.display = "flex";
  
  // Make sure the HUD has pointer events enabled for the sign editor
  const hud = document.getElementById("hud");
  hud.style.pointerEvents = "auto";
  
  // Prevent clicks from passing through to the game
  document.body.style.pointerEvents = "none";
  signEditContainer.style.pointerEvents = "auto";
  
  // Focus the input after a short delay to ensure the UI is ready
  setTimeout(() => {
    signTextInput.focus();
  }, 100);
}

// Save sign text
function saveSignText() {
  if (!currentEditingSign) return;
  
  // Get text from input
  const text = signTextInput.value.trim();
  
  // Update sign's text
  currentEditingSign.userData.text = text;
  
  // Update the key in blockMeshes
  const x = Math.floor(currentEditingSign.position.x);
  const y = Math.floor(currentEditingSign.position.y);
  const z = Math.floor(currentEditingSign.position.z);
  const key = `${x},${y},${z}`;
  
  if (blockMeshes[key]) {
    blockMeshes[key].userData.text = text;
  }
  
  console.log(`Sign text saved: "${text}" at position ${x},${y},${z}`);
  
  // Hide editor
  const signEditContainer = document.getElementById("sign-edit-container");
  signEditContainer.style.display = "none";
  
  isEditingSign = false;
  currentEditingSign = null;
  
  // Lock controls again
  if (!isLocked) {
    controls.lock();
  }
  
  // Save game state
  saveGameState();
}

// Cancel sign editing
function cancelSignEdit() {
  // Hide editor
  const signEditContainer = document.getElementById("sign-edit-container");
  signEditContainer.style.display = "none";
  
  isEditingSign = false;
  currentEditingSign = null;
  
  // Lock controls again
  if (!isLocked) {
    controls.lock();
  }
}

// Update sign text display positions
function updateSignTextDisplays() {
if (!camera || !scene || !signTextDisplay) return;

// Hide the text display initially
signTextDisplay.style.display = "none";

// Check if player is looking at a sign
if (selectedBlock && selectedBlock.userData.isSign) {
  const text = selectedBlock.userData.text;
  
  // Only show if the sign has text
  if (text && text.length > 0) {
    // Convert 3D position to screen position
    const position = selectedBlock.position.clone();
    position.y += 0.7; // Position text above the sign
    
    const vector = position.project(camera);
    
    // Convert to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    
    // Get text color from sign if available, otherwise use default black
    const textColor = selectedBlock.userData.textColor || "#000000";
    
    // Update text display position and content
    signTextDisplay.style.left = `${x}px`;
    signTextDisplay.style.top = `${y}px`;
    signTextDisplay.style.transform = "translate(-50%, -100%)";
    signTextDisplay.textContent = text;
    signTextDisplay.style.display = "block";
    signTextDisplay.style.zIndex = "1000"; // Ensure text is visible above other elements
    signTextDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // Make background more visible
    signTextDisplay.style.padding = "5px 10px"; // Add more padding
    signTextDisplay.style.border = "1px solid #000"; // Add border
    signTextDisplay.style.fontWeight = "bold"; // Make text more readable
    signTextDisplay.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)"; // Add shadow for better visibility
    signTextDisplay.style.color = textColor; // Use the sign's text color
  }
}
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
  // If character visibility is disabled, don't allow interaction
  if (showCharacter === 0 || !window.idleGifSprite || !camera) return;

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
  // If showCharacter is 0, don't create the sprite
  if (showCharacter === 0) {
    console.log("Character visibility is disabled, not adding sprite");
    return;
  }

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
    // White cloth ground blocks
    ...[37, 38, 39, 40].flatMap((x) =>
      [36, 37, 38, 39, 40].map((z) => ({
        position: { x, y: 0, z },
        type: "white_cloth",
      }))
    ),
    
    // Add a sign with specific text and orange color
    {
      position: { x: 38, y: 1, z: 38 },
      type: "sign",
      text: "Someone has flattened my beautiful house and that someone will pay dearly for it.",
      textColor: "#ff8c00" // Orange text color
    },

    // Dirt path blocks - keep these intact
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

    // Keep only the specified door blocks
    { position: { x: 36, y: 1, z: 38 }, type: "door" },
    { position: { x: 36, y: 2, z: 38 }, type: "door" },

    // Stone pillar on the dirt path - keep this
    ...[1, 2, 3, 4, 5].map((y) => ({
      position: { x: 45, y, z: 30 },
      type: "stone",
    })),

    // Cloth blocks on the dirt path - keep these
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
    createBlock(x, y, z, block.type, block.text, block.textColor);
    blocksCreated++;
  }

  console.log(`Created ${blocksCreated} blocks in total`);
  console.log(`Player starting position: 64, 2, 64`);

  updateVisibleBlocks();
}

function createBlock(x, y, z, type = "grass", customText = null, textColor = null) {
  let geometry, materials, block;
  
  const blockType = BLOCK_TYPES[type] || BLOCK_TYPES.grass;
  
  if (type === "sign") {
    // For signs, create a single mesh with a box geometry for better hitbox detection
    geometry = new THREE.BoxGeometry(0.6, 0.4, 0.1); // Reduced height from 0.8 to 0.4
    
    // Create a canvas for the sign texture to make it look written on
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    
    // Set background color (wooden sign)
    context.fillStyle = '#d2b48c';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add wood grain texture
    context.strokeStyle = '#b8926a';
    context.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const y = i * 16 + 8;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
    
    // Add some random "writing" marks to make it look written on
    context.fillStyle = '#553311';
    // Horizontal lines resembling text
    for (let i = 0; i < 4; i++) {
      const y = 30 + i * 20;
      const width = 70 + Math.random() * 30;
      const x = 10 + Math.random() * 10;
      context.fillRect(x, y, width, 3);
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create materials with the texture for the front and back, plain for other sides
    materials = [
      new THREE.MeshBasicMaterial({ color: COLORS.SIGN, fog: true }), // right
      new THREE.MeshBasicMaterial({ color: COLORS.SIGN, fog: true }), // left
      new THREE.MeshBasicMaterial({ color: COLORS.SIGN, fog: true }), // top
      new THREE.MeshBasicMaterial({ color: COLORS.SIGN, fog: true }), // bottom
      new THREE.MeshBasicMaterial({ map: texture, fog: true }), // front
      new THREE.MeshBasicMaterial({ map: texture, fog: true })  // back
    ];
    
    // Create the main sign block
    block = new THREE.Mesh(geometry, materials);
    
    // Rotate the sign 90 degrees around the Y axis
    block.rotation.y = Math.PI / 2; // 90 degrees in radians
    
    // Create the sign post (smaller vertical block) as a separate mesh
    const postGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1); // Increased height from 0.6 to 0.8
    const postMaterial = new THREE.MeshBasicMaterial({ color: COLORS.WOOD, fog: true });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    
    // Position post below the sign to connect with the board
    post.position.set(0, -0.6, 0); // Adjusted from -0.7 to -0.6 to connect with the board
    
    // Add post as a child of the main block
    block.add(post);
    
    // Position the entire sign
    block.position.set(x, y, z);
  } else {
    // Regular block creation for other block types
    geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    materials = blockType.materials.map(
      (material) =>
        new THREE.MeshBasicMaterial({ color: material.color, fog: true })
    );
    
    block = new THREE.Mesh(geometry, materials);
    block.position.set(x, y, z);
  }

  block.userData = {
    type: type,
    solid: blockType.solid,
    isDoor: blockType.isDoor || false,
    isSign: blockType.isSign || false,
    text: customText || blockType.text || "",
    textColor: textColor || "#000000", // Default to black if not specified
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
    // Only allow interaction if character visibility is enabled
    if (showCharacter === 1 && isNearSprite && isLookingAtSprite) {
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

  if ((x === 36 && y === 2 && z === 38) || (x === 36 && y === 1 && z === 38)) {
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
  } else if (currentBlockType === "sign") {
    // Create a sign block
    const newSign = createBlock(x, y, z, "sign");
    scene.add(newSign);
    blocks.push(newSign);
    console.log("Sign placed successfully");
    
    // Open sign editor after placing
    showSignEditor(newSign);
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
  
  // Update snow particles
  updateSnowParticles();
  
  // Update sign text displays
  updateSignTextDisplays();

  // Only update character if visibility is enabled
  if (showCharacter === 1 && window.idleGifSprite) {
    const spritePos = window.idleGifSprite.position.clone();

    const targetPos = camera.position.clone();
    targetPos.y = spritePos.y;

    window.idleGifSprite.lookAt(targetPos);

    checkSpriteProximity();
  }

  checkAutoSave();

  renderer.render(scene, camera);
}

// Function to update snow particles position
function updateSnowParticles() {
  if (!camera) return;
  
  const playerX = Math.floor(camera.position.x);
  const playerZ = Math.floor(camera.position.z);
  
  snowParticles.forEach(particle => {
    // Move particle down based on its speed
    particle.position.y -= particle.userData.speed;
    
    // Add slight horizontal drift
    particle.position.x += particle.userData.driftX;
    particle.position.z += particle.userData.driftZ;
    
    // If particle goes below ground level, reset it to the top
    if (particle.position.y < 0) {
      // Reset to a random position above the player
      particle.position.x = Math.random() * RENDER_DISTANCE * 2 + (playerX - RENDER_DISTANCE);
      particle.position.y = Math.random() * 5 + 15; // Random height above
      particle.position.z = Math.random() * RENDER_DISTANCE * 2 + (playerZ - RENDER_DISTANCE);
      
      // Randomize drift slightly
      particle.userData.driftX = (Math.random() - 0.5) * 0.005;
      particle.userData.driftZ = (Math.random() - 0.5) * 0.005;
    }
    
    // If particle drifts too far from player, bring it back
    const dx = particle.position.x - playerX;
    const dz = particle.position.z - playerZ;
    const distanceSquared = dx * dx + dz * dz;
    
    if (distanceSquared > RENDER_DISTANCE * RENDER_DISTANCE) {
      particle.position.x = Math.random() * RENDER_DISTANCE * 2 + (playerX - RENDER_DISTANCE);
      particle.position.z = Math.random() * RENDER_DISTANCE * 2 + (playerZ - RENDER_DISTANCE);
    }
  });
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
      const blockData = {
        position: { x, y, z },
        type: block.userData.type,
      };
      
      // Save sign text if it's a sign
      if (block.userData.isSign && block.userData.text) {
        blockData.text = block.userData.text;
      }
      
      saveData.blocks.push(blockData);
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
    
    // Load sign text from saved blocks
    if (saveData.blocks && saveData.blocks.length > 0) {
      for (const blockData of saveData.blocks) {
        const { x, y, z } = blockData.position;
        const key = `${x},${y},${z}`;
        
        // If the block exists and it's a sign with text
        if (blockMeshes[key] && blockData.type === "sign" && blockData.text) {
          blockMeshes[key].userData.text = blockData.text;
          console.log(`Restored sign text at ${x},${y},${z}: "${blockData.text}"`);
        }
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
    "sign",
    "red_cloth",
    "orange_cloth",
    "yellow_cloth"
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
