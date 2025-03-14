// Taskbarpet functionality
export function initializeTaskbarpet() {
  const taskbarpet = document.querySelector(".taskbar-pet");
  if (!taskbarpet) return;

  let isDragging = false;
  let offsetX, offsetY;
  let currentX = 0;
  let currentY = window.innerHeight - taskbarpet.offsetHeight - 40;
  let direction = 1; // 1 for right, -1 for left
  let isMoving = false;
  let isTurning = false;
  let changeDirectionTimeout;
  let moveTimeout;
  let velocityY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let animationFrame;
  let dragMessageTimeout;
  let lastMessageTime = 0;
  let rotationAngle = 180; // Start with 180 degrees since we're flipping the initial facing direction
  const minimumMessageDelay = 30000; // 30 seconds in milliseconds
  let currentTypingInterval = null; // To track current typing animation
  let currentFadeTimeout = null; // To track the fade timeout
  const gravity = 0.5;

  const petImg = taskbarpet.querySelector("img");

  // Add the non-selectable attribute to prevent text selection during drag
  taskbarpet.setAttribute("unselectable", "on");
  taskbarpet.style.webkitUserSelect = "none";
  taskbarpet.style.userSelect = "none";
  taskbarpet.style.msUserSelect = "none";
  taskbarpet.style.MozUserSelect = "none";

  let speechBubble = taskbarpet.querySelector(".speech-bubble");
  if (!speechBubble) {
    speechBubble = document.createElement("div");
    speechBubble.className = "speech-bubble";
    const speechText = document.createElement("span");
    speechText.className = "speech-text";
    speechBubble.appendChild(speechText);
    taskbarpet.appendChild(speechBubble);
  }

  // Ensure the speech bubble is also non-selectable
  speechBubble.setAttribute("unselectable", "on");
  speechBubble.style.webkitUserSelect = "none";
  speechBubble.style.userSelect = "none";
  speechBubble.style.msUserSelect = "none";
  speechBubble.style.MozUserSelect = "none";

  function showDragMessage() {
    const speechText = speechBubble.querySelector(".speech-text");
    clearSpeechBubble(); // Clear any existing message first
    speechBubble.style.opacity = "1";
    typeText(speechText, "So... this is how it ends...");
    lastMessageTime = Date.now();
  }

  function clearSpeechBubble() {
    // Clear current typing animation if it exists
    if (currentTypingInterval) {
      clearTimeout(currentTypingInterval);
      currentTypingInterval = null;
    }

    // Clear any scheduled fade animation
    if (currentFadeTimeout) {
      clearTimeout(currentFadeTimeout);
      currentFadeTimeout = null;
    }

    // Clear the text and hide bubble immediately
    const speechText = speechBubble.querySelector(".speech-text");
    speechText.textContent = "";

    if (dragMessageTimeout) {
      clearTimeout(dragMessageTimeout);
      dragMessageTimeout = null;
    }
  }

  function hideSpeechBubble() {
    speechBubble.style.opacity = "0";
    if (dragMessageTimeout) {
      clearTimeout(dragMessageTimeout);
      dragMessageTimeout = null;
    }

    if (currentFadeTimeout) {
      clearTimeout(currentFadeTimeout);
      currentFadeTimeout = null;
    }
  }

  function typeText(element, text, index = 0) {
    // Clear any existing typing interval
    if (currentTypingInterval) {
      clearTimeout(currentTypingInterval);
    }

    if (index < text.length) {
      element.textContent = text.substring(0, index + 1);

      // Play typing sound for each character - ensure AudioContext is resumed
      if (audioContext.state === "suspended") {
        audioContext.resume().then(() => playTypingSound());
      } else {
        playTypingSound();
      }

      currentTypingInterval = setTimeout(
        () => typeText(element, text, index + 1),
        75
      ); // Slower typing (was 50ms)
    } else {
      currentTypingInterval = null;

      // Schedule the fade out to happen 2 seconds after typing completes
      if (currentFadeTimeout) {
        clearTimeout(currentFadeTimeout);
      }
      currentFadeTimeout = setTimeout(() => {
        speechBubble.style.opacity = "0";
        currentFadeTimeout = null;
      }, 2000);
    }
  }

  // Create audio context for typing sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let typingSoundBuffer = null;

  // Load the typing sound
  fetch("media/a.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      typingSoundBuffer = audioBuffer;
    })
    .catch((error) => console.error("Error loading typing sound:", error));

  // Function to play typing sound with random pitch
  function playTypingSound() {
    if (!typingSoundBuffer || audioContext.state === "suspended") return;

    // Get current volume setting, default to 0.075 if not set
    const volumeLevel =
      window.assistantVolume !== undefined ? window.assistantVolume : 0.075;

    // If volume is 0, don't play sound
    if (volumeLevel <= 0) return;

    const source = audioContext.createBufferSource();
    source.buffer = typingSoundBuffer;

    // Random pitch between .9 and 1.2
    const randomPitch = 0.9 + Math.random() * 0.2;
    source.playbackRate.value = randomPitch;

    // Create a gain node to control volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volumeLevel; // Use the current volume level

    // Connect nodes: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
  }

  function applyPhysics() {
    if (!isDragging) {
      velocityY += gravity;
      currentY += velocityY;

      const maxY = window.innerHeight - taskbarpet.offsetHeight - 40;
      if (currentY > maxY) {
        currentY = maxY;
        velocityY = 0;
      }

      taskbarpet.style.top = `${currentY}px`;
    }

    animationFrame = requestAnimationFrame(applyPhysics);
  }

  taskbarpet.addEventListener("pointerdown", (e) => {
    e.preventDefault(); // Prevent default selection behavior
    isDragging = true;
    isMoving = false;
    clearInterval(moveTimeout);
    clearTimeout(changeDirectionTimeout);
    petImg.src = "media/idle.gif";

    const rect = taskbarpet.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    taskbarpet.style.cursor = "grabbing";
    showDragMessage();
  });

  document.addEventListener("pointermove", (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevent selection during drag
      currentX = e.clientX - dragOffsetX;
      currentY = e.clientY - dragOffsetY;

      currentX = Math.max(
        0,
        Math.min(currentX, window.innerWidth - taskbarpet.offsetWidth)
      );
      currentY = Math.max(
        0,
        Math.min(currentY, window.innerHeight - taskbarpet.offsetHeight - 40)
      );

      taskbarpet.style.left = `${currentX}px`;
      taskbarpet.style.top = `${currentY}px`;
    }
  });

  document.addEventListener("pointerup", () => {
    if (isDragging) {
      isDragging = false;
      taskbarpet.style.cursor = "pointer";
      velocityY = 0;
      hideSpeechBubble();
      setTimeout(startMoving, Math.random() * 3000 + 2000);
    }
  });

  function startMoving() {
    if (!isMoving && taskbarpet.classList.contains("active") && !isDragging) {
      isMoving = true;
      petImg.src = "media/walk.gif";
      // Set initial rotation based on direction (flipped from original)
      petImg.style.transform =
        direction === 1 ? "rotateY(180deg)" : "rotateY(0deg)";
      moveTimeout = setInterval(updatePetPosition, 50);
      scheduleDirectionChange();
    }
  }

  function stopMoving() {
    if (isMoving) {
      isMoving = false;
      petImg.src = "media/idle.gif";
      clearInterval(moveTimeout);
      clearTimeout(changeDirectionTimeout);

      setTimeout(startMoving, Math.random() * 3000 + 2000);
    }
  }

  function scheduleDirectionChange() {
    clearTimeout(changeDirectionTimeout);
    changeDirectionTimeout = setTimeout(() => {
      stopMoving();
    }, Math.random() * 5000 + 3000);
  }

  function changeDirection() {
    if (isTurning) return;

    isTurning = true;
    isMoving = false;
    clearInterval(moveTimeout);

    // Start turning animation - flipped angles from original
    let targetAngle = direction === 1 ? 0 : 180;
    let startAngle = direction === 1 ? 180 : 0;
    let animationStartTime = null;
    const animationDuration = 300; // ms

    function animateTurn(timestamp) {
      if (!animationStartTime) animationStartTime = timestamp;
      const elapsed = timestamp - animationStartTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Calculate current angle using easing
      const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth easing
      rotationAngle = startAngle + (targetAngle - startAngle) * easedProgress;

      // Apply rotation
      petImg.style.transform = `rotateY(${rotationAngle}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animateTurn);
      } else {
        // Animation complete, update direction and continue moving
        direction = -direction;
        isTurning = false;
        isMoving = true;
        petImg.src = "media/walk.gif";
        moveTimeout = setInterval(updatePetPosition, 50);
      }
    }

    requestAnimationFrame(animateTurn);
  }

  function updatePetPosition() {
    if (!isDragging) {
      currentX += direction * 2;

      if (currentX <= 0) {
        currentX = 0;
        if (direction === -1) {
          changeDirection();
        }
      } else if (currentX >= window.innerWidth - taskbarpet.offsetWidth) {
        currentX = window.innerWidth - taskbarpet.offsetWidth;
        if (direction === 1) {
          changeDirection();
        }
      }

      taskbarpet.style.left = `${currentX}px`;
    }
  }

  // Initialize the pet image with the correct rotation for the starting direction
  petImg.style.transform =
    direction === 1 ? "rotateY(180deg)" : "rotateY(0deg)";
  taskbarpet.style.cursor = "pointer";

  if (taskbarpet.classList.contains("active")) {
    setTimeout(startMoving, 1000);
    applyPhysics();
  }

  window.addEventListener("resize", () => {
    if (currentX > window.innerWidth - taskbarpet.offsetWidth) {
      currentX = window.innerWidth - taskbarpet.offsetWidth;
      taskbarpet.style.left = `${currentX}px`;
    }
    const maxY = window.innerHeight - taskbarpet.offsetHeight - 40;
    if (currentY > maxY) {
      currentY = maxY;
      taskbarpet.style.top = `${currentY}px`;
    }
  });

  const messages = [
    "At least I don't have to deal with Coco here",
    "This is better than the school bathroom I guess",
    "My feet hurt",
    "I'm too tired for this",
    "Fatigue levels rising...",
    "What are you going to force me to talk too?",
    "I hate this place",
  ];

  function showSpeechBubble() {
    if (taskbarpet.classList.contains("active") && !isDragging) {
      const now = Date.now();
      // Only show random messages if enough time has passed since the last message
      if (now - lastMessageTime >= minimumMessageDelay) {
        const message = messages[Math.floor(Math.random() * messages.length)];

        // Clear any existing message first
        clearSpeechBubble();

        speechBubble.style.opacity = "1";
        typeText(speechBubble.querySelector(".speech-text"), message);

        lastMessageTime = now;
      }
    }
  }

  function scheduleSpeech() {
    if (taskbarpet.classList.contains("active")) {
      const delay = Math.random() * 30000 + 30000;
      setTimeout(() => {
        showSpeechBubble();
        scheduleSpeech();
      }, delay);
    }
  }

  function showSpecificMessage(message) {
    if (taskbarpet.classList.contains("active") && !isDragging) {
      const now = Date.now();
      // Update the lastMessageTime regardless of whether we show the message
      // This ensures a specific message doesn't get followed by a random one too soon
      lastMessageTime = now;

      // Clear any existing message first
      clearSpeechBubble();

      speechBubble.style.opacity = "1";
      typeText(speechBubble.querySelector(".speech-text"), message);

      return true; // Always return true to indicate message was processed
    }
    return false;
  }

  // Export the showPetMessage function to the window object
  window.showPetMessage = function (message) {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (taskbarpet.classList.contains("active") && !isDragging) {
      const now = Date.now();
      // Update the lastMessageTime regardless of whether we show the message
      // This ensures a specific message doesn't get followed by a random one too soon
      lastMessageTime = now;

      // Clear any existing message first
      clearSpeechBubble();

      speechBubble.style.opacity = "1";
      typeText(speechBubble.querySelector(".speech-text"), message);

      return true; // Always return true to indicate message was processed
    }
    return false;
  };

  // Always show the welcome message when the taskbarpet is activated
  // Clear any existing message first
  clearSpeechBubble();

  speechBubble.style.opacity = "1";
  typeText(
    speechBubble.querySelector(".speech-text"),
    "Hi I'm Mayabot. I'd prefer if you didn't ask me for help..."
  );
  lastMessageTime = Date.now();

  // Schedule speech after initial message (wait for typing + 2s delay)
  setTimeout(() => {
    scheduleSpeech();
  }, 31 * 75 + 2000 + 2000);

  const originalActiveChange = taskbarpet.classList.toggle;
  taskbarpet.classList.toggle = function (className) {
    const result = originalActiveChange.apply(this, arguments);
    if (className === "active" && this.classList.contains("active")) {
      scheduleSpeech();
    }
    return result;
  };

  // Initialize audio context on first user interaction with pet
  taskbarpet.addEventListener("pointerdown", () => {
    // Resume AudioContext if it's suspended (browsers require user interaction)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  });

  // Add extra protection for mobile
  taskbarpet.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault(); // Prevent default touch behavior which can cause selection
    },
    { passive: false }
  );

  taskbarpet.addEventListener(
    "touchmove",
    (e) => {
      if (isDragging) {
        e.preventDefault(); // Prevent selection during touch drag
      }
    },
    { passive: false }
  );
}
// Function to handle video-specific messages
export function showVideoMessage(videoName) {
  if (window.showPetMessage) {
    setTimeout(() => {
      if (videoName === "media/thisisasign.mp4") {
        window.showPetMessage("They let MYMY of all people have a phone???");
      } else if (videoName === "media/pbj.mp4") {
        window.showPetMessage("I hate this stupid video");
      } else if (videoName === "media/wastedyears.mp4") {
        window.showPetMessage("If I could thow Coco like that I would");
      } else if (videoName === "media/horrific.mp4") {
        window.showPetMessage("It's NOT funny");
      } else if (videoName === "media/thecup.mp4") {
        window.showPetMessage(
          "Mymy shouldn't be calling anyone out with the amount of that stupid stroopwafel drink she downs everyday"
        );
      } else if (videoName === "media/rightfoot.mp4") {
        window.showPetMessage("I'm never showing Coco another game again");
      }
      
    }, 500);
  }
}

// Function to show message when Steam is opened
export function showSteamMessage() {
  if (window.showPetMessage) {
    setTimeout(() => {
      window.showPetMessage(
        "I wasted so much time trying to get this stupid thing to work"
      );
    }, 500);
  }
}

// Function to show message when Steam library is opened
export function showSteamLibraryMessage() {
  if (window.showPetMessage) {
    setTimeout(() => {
      window.showPetMessage(
        "Really loving the wide selection of games here... Also who said you could use MY account?"
      );
    }, 500);
  }
}

// Function to show message when Maya Stress Relief is opened
export function showMayaStressReliefMessage() {
  if (window.showPetMessage) {
    setTimeout(() => {
      window.showPetMessage(
        "NO NO... no... you are NOT allowed to look at that"
      );
    }, 500);
  }
}

// Function to show message when Nederlands Mode is enabled
export function showNederlandsModeMessage() {
  if (window.showPetMessage) {
    window.showPetMessage(
      "Wow I wonder who could have possibly made this useless feature"
    );
  }
}

// Function to show message when volume is set to zero
export function showVolumeZeroMessage() {
  if (window.showPetMessage) {
    window.showPetMessage("I didn't like talking to you anyway");
  }
}

// Function to show message when Users is clicked
export function showUsersClickMessage() {
  if (window.showPetMessage) {
    setTimeout(() => {
      window.showPetMessage("At least she's organized...");
    }, 500);
  }
}

// Function to show message when Mymycraft game opens
export function showMymycraftGameMessage() {
  if (window.showPetMessage) {
    setTimeout(() => {
      window.showPetMessage(
        "Mymy would name her game after herself... go head, im not playing that"
      );
    }, 500);
  }
}

// Function to check if taskbarpet is enabled and initialize it
export function setupTaskbarpet() {
  const taskbarpet = document.querySelector(".taskbar-pet");
  // Don't restore the taskbarpet state from localStorage
  // Always start with the taskbarpet closed
  
  // We still need to keep the toggle functionality in the settings
  // but we won't restore the state on page load
}
