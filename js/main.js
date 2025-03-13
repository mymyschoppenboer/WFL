import { updateTime } from './timeModule.js?v=2';
import { initializeExplorer } from './explorerModule.js?v=2';
import { initializeTaskbarpet, setupTaskbarpet } from './taskbarpetModule.js?v=2';

import { showSteamMessage, showMayaStressReliefMessage, showNederlandsModeMessage, showVolumeZeroMessage, showUsersClickMessage, showMymycraftGameMessage, showSteamLibraryMessage } from './taskbarpetModule.js?v=2';

function createSteamWindow() {
  // Show pet message every time Steam is opened
  showSteamMessage();

  const steamWindow = document.createElement('div');
  steamWindow.className = 'steam-window window';
  steamWindow.dataset.title = 'Steam';

  // Add to taskbar immediately when created
  addToTaskbar(steamWindow);

  steamWindow.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <img src="images/Steam_icon_logo.png" alt="Steam" style="width: 2Vw; height: 2Vw;">
        <span style="color: black;">Steam Login</span>
      </div>
      <div class="window-controls">
        <div class="control minimize">─</div>
        <div class="control maximize">□</div>
        <div class="control close">×</div>
      </div>
    </div>
    <div class="steam-content" style="background-color: #000;">
      <img src="images/steam-logo-black-transparent.png" alt="Steam" class="steam-logo" style="width: 10Vw; height: auto;">
      <form class="steam-form">
        <input type="text" class="steam-input" placeholder="Email">
        <input type="password" class="steam-input" placeholder="Password">
        <button type="button" class="steam-button">Sign in</button>
      </form>
      <div class="steam-links">
        <a class="steam-link" id="steam-help-link">Help, I can't sign in</a>
        <a class="steam-link" id="steam-create-account-link">Create a Free Account</a>
      </div>
    </div>
  `;

  document.body.appendChild(steamWindow);
  window.bringToFront(steamWindow);

  steamWindow.addEventListener('pointerdown', () => {
    window.bringToFront(steamWindow);
  });

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  let isMaximized = false;

  const windowHeader = steamWindow.querySelector('.window-header');
  const minimizeButton = steamWindow.querySelector('.control.minimize');
  const maximizeButton = steamWindow.querySelector('.control.maximize');
  const closeButton = steamWindow.querySelector('.close');

  windowHeader.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('control')) return;
    if (isMaximized) return;

    const rect = steamWindow.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
  });

  document.addEventListener('pointermove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      steamWindow.style.transform = 'translate(0, 0)';
      steamWindow.style.left = `${currentX}px`;
      steamWindow.style.top = `${currentY}px`;
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });

  maximizeButton.addEventListener('click', () => {
    if (isMaximized) {
      steamWindow.style.width = '470px';
      steamWindow.style.height = 'auto';
      steamWindow.style.top = '50%';
      steamWindow.style.left = '50%';
      steamWindow.style.transform = 'translate(-50%, -50%)';
      xOffset = 0;
      yOffset = 0;
    } else {
      steamWindow.style.width = '100%';
      steamWindow.style.height = 'calc(100% - 40px)';
      steamWindow.style.top = '0';
      steamWindow.style.left = '0';
      steamWindow.style.transform = 'none';
    }
    isMaximized = !isMaximized;
  });

  minimizeButton.addEventListener('click', () => {
    steamWindow.style.display = 'none';
  });

  closeButton.addEventListener('click', () => {
    document.body.removeChild(steamWindow);
    removeFromTaskbar(steamWindow);
  });

  // Function to handle login attempt
  const attemptLogin = () => {
    const emailInput = steamWindow.querySelector('.steam-input[placeholder="Email"]');
    const passwordInput = steamWindow.querySelector('.steam-input[placeholder="Password"]');
    const email = emailInput.value;
    const password = passwordInput.value;
    const button = steamWindow.querySelector('.steam-button');
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    //USE THIS TO FIND THE PASSWORD IF YOU'RE BELGIAN
    if (email === "mayadebae@mail.com" && password === "oranjekat03") {
      // Close the login window
      document.body.removeChild(steamWindow);
      removeFromTaskbar(steamWindow);
      
      // Open the Steam library
      createSteamLibrary();
    } else {
      // Show "Invalid password" for 2 seconds
      button.textContent = 'Invalid email/password';
      button.style.background = '#32353c';
      button.style.cursor = 'not-allowed';
      
      // Disable inputs during the timeout
      emailInput.disabled = true;
      passwordInput.disabled = true;
      button.disabled = true;
      
      // Reset after 2 seconds
      setTimeout(() => {
        button.textContent = 'Sign in';
        button.style.background = 'linear-gradient(to right, #47bfff, #1a44c2)';
        button.style.cursor = 'pointer';
        emailInput.disabled = false;
        passwordInput.disabled = false;
        button.disabled = false;
        passwordInput.value = '';
        passwordInput.focus();
      }, 2000);
    }
  };
  
  // Add click event listener to the button
  steamWindow.querySelector('.steam-button').addEventListener('click', attemptLogin);
  
  // Add keydown event listener for Enter key
  steamWindow.querySelector('.steam-form').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      attemptLogin();
    }
  });

  const helpLink = steamWindow.querySelector('#steam-help-link');
  const createAccountLink = steamWindow.querySelector('#steam-create-account-link');

  helpLink.addEventListener('mouseover', () => {
    helpLink.textContent = "Stop clicking this Maya";
  });

  helpLink.addEventListener('mouseout', () => {
    helpLink.textContent = "Help, I can't sign in";
  });

  createAccountLink.addEventListener('mouseover', () => {
    createAccountLink.textContent = "Stop clicking this too";
  });

  createAccountLink.addEventListener('mouseout', () => {
    createAccountLink.textContent = "Create a Free Account";
  });

  // Center the window initially
  setTimeout(() => {
    const rect = steamWindow.getBoundingClientRect();
    
    // Check if mobile device for automatic fullscreen
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      steamWindow.style.transform = 'none';
      steamWindow.style.width = '100%';
      steamWindow.style.height = 'calc(100% - 40px)';
      steamWindow.style.left = '0';
      steamWindow.style.top = '0';
      isMaximized = true;
    } else {
      const centerX = (window.innerWidth - rect.width) / 2;
      const centerY = (window.innerHeight - rect.height) / 2;
      steamWindow.style.transform = 'none';
      steamWindow.style.left = `${centerX}px`;
      steamWindow.style.top = `${centerY}px`;
    }
  }, 0);
}

window.openSteam = createSteamWindow;

window.openMayaStressRelief = function() {
  // Show pet message every time Maya Stress Relief is opened
  showMayaStressReliefMessage();

  const errorWindow = document.createElement('div');
  errorWindow.className = 'text-window window';
  errorWindow.dataset.title = 'Access Denied';
  errorWindow.style.width = '400px';
  errorWindow.style.height = 'auto';
  
  window.addToTaskbar(errorWindow);
  
  errorWindow.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#ff0000"/>
          <text x="12" y="16" font-size="14" fill="white" text-anchor="middle">!</text>
        </svg>
        <span>Access Denied</span>
      </div>
      <div class="window-controls">
        <div class="control close">×</div>
      </div>
    </div>
    <div class="text-content" style="padding: 20px; text-align: center;">
      <p style="margin-bottom: 20px;">You do not have permission to run this file. Ask an administrator for permission.</p>
      <button onclick="this.closest('.window').querySelector('.close').click()" 
              style="padding: 8px 16px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">
        OK
      </button>
    </div>
  `;

  document.body.appendChild(errorWindow);
  window.bringToFront(errorWindow);

  errorWindow.addEventListener('pointerdown', () => {
    window.bringToFront(errorWindow);
  });

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  const windowHeader = errorWindow.querySelector('.window-header');

  windowHeader.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('control')) return;
    
    const rect = errorWindow.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
  });

  document.addEventListener('pointermove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      errorWindow.style.transform = `translate(0, 0)`;
      errorWindow.style.left = `${currentX}px`;
      errorWindow.style.top = `${currentY}px`;
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });

  errorWindow.querySelector('.close').addEventListener('click', () => {
    document.body.removeChild(errorWindow);
    window.removeFromTaskbar(errorWindow);
  });

  // Center the window initially - but don't fullscreen on mobile
  errorWindow.style.transform = 'translate(-50%, -50%)';
  errorWindow.style.left = '50%';
  errorWindow.style.top = '50%';
};

function init() {
  // Check if mobile device and set appropriate classes
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.classList.add('mobile-device');
  }
  
  // Create and add random message to loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'loading-message';
  
  // Different messages for mobile vs desktop
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    messageDiv.textContent = "Using a PC is recommended";
  } else {
    const loadingMessages = [
      "The Dutch invented the computer",
      "Only Belgians don't use fullscreen",
      "DO NOT LET COCO DOWNLOAD PROGRAMS",
      "When in doubt, reload the site",
      "Who said settings have to be useful?",
      "helpispilledstroopwafelsaponmykeyboardandspaceisntworkinganymore"
    ];
    messageDiv.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }
  
  loadingScreen.appendChild(messageDiv);

  setTimeout(() => {
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelector('.desktop').classList.remove('hidden');
  }, 3000);

  const backgroundUrl = localStorage.getItem('backgroundUrl') || 'https://c.pxhere.com/photos/b1/f9/waffle_herzchen_baked_food_heart_waffle_breakfast_sweetness_heart-1332010.jpg!d';
  document.body.style.backgroundImage = `url(${backgroundUrl})`;

  updateTime();
  setInterval(updateTime, 1000);

  initializeExplorer();

  const startButton = document.querySelector('.start-button');
  const startMenu = document.createElement('div');
  startMenu.className = 'start-menu';
  startMenu.innerHTML = `
    <div class="start-menu-header">
      <div class="user-profile">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="11" fill="#deb887"/>
            <path d="M4 12h16 M12 4v16 M6.5 4v16L6.5 4z M17.5 4v16L17.5 4z" stroke="#8b4513" stroke-width="2"/>
            <path d="M6.5 4v16 M17.5 4v16" stroke="#8b4513" stroke-width="1.5"/>
            <path d="M4 6.5h16 M4 17.5h16" stroke="#8b4513" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="user-name">Guest User</div>
      </div>
    </div>
    <div class="start-menu-items">
      <div class="menu-item" onclick="handleUsersClick()">
        <svg viewBox="0 0 24 24">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#FFA000"/>
          <path d="M20 8H4v10h16z" fill="#FFCA28"/>
        </svg>
        Users
      </div>
      <div class="menu-item" data-action="settings">
        <svg viewBox="0 0 24 24">
          <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path fill="#4CAF50" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
        </svg>
        Settings
      </div>
      <div class="menu-item" onclick="window.open('https://x.com/schoppenbot', '_blank')">
        <svg viewBox="0 0 24 24">
          <rect x="0" y="0" width="24" height="24" rx="4" fill="white"/>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Schoppenbot
      </div>
    </div>
    <div class="menu-footer">
      <div class="power-button">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
        </svg>
        Power
      </div>
      <div class="power-menu">
        <div class="power-menu-item disabled">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
          Shut down
          <div class="tooltip">No permission</div>
        </div>
        <div class="power-menu-item">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Restart
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(startMenu);

  const powerButton = startMenu.querySelector('.power-button');
  const powerMenu = startMenu.querySelector('.power-menu');

  powerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    powerMenu.classList.toggle('visible');
  });

  const restartButton = startMenu.querySelector('.power-menu-item:not(.disabled)');
  restartButton.addEventListener('click', () => {
    window.location.reload();
  });

  document.addEventListener('click', () => {
    powerMenu.classList.remove('visible');
  });

  powerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  let startMenuVisible = false;

  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenuVisible = !startMenuVisible;
    startMenu.classList.toggle('visible');
    startButton.style.background = startMenuVisible ? 'rgba(255, 255, 255, 0.1)' : '';
  });

  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && startMenuVisible) {
      startMenuVisible = false;
      startMenu.classList.remove('visible');
      startButton.style.background = '';
    }
  });

  const taskbarWindows = document.createElement('div');
  taskbarWindows.className = 'taskbar-windows';
  document.querySelector('.taskbar').insertBefore(taskbarWindows, document.querySelector('.time'));

  let activeWindow = null;

  window.bringToFront = function(windowElement) {
    if (activeWindow !== windowElement) {
      if (activeWindow) {
        activeWindow.style.zIndex = '100';
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${activeWindow.dataset.title}"]`);
        if (taskbarItem) taskbarItem.classList.remove('active');
      }
      windowElement.style.zIndex = '200';
      const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowElement.dataset.title}"]`);
      if (taskbarItem) taskbarItem.classList.add('active');
      activeWindow = windowElement;
    }
  };

  window.addToTaskbar = function(windowElement) {
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.dataset.window = windowElement.dataset.title;
    taskbarItem.innerHTML = `
      <svg class="taskbar-icon" viewBox="0 0 24 24">
        ${getIconForWindow(windowElement.dataset.title)}
      </svg>
      <span>${windowElement.dataset.title}</span>
      <div class="taskbar-close-button">
        <svg viewBox="0 0 10 10" style="width: 10px; height: 10px;">
          <path d="M1 1 L9 9 M9 1 L1 9" stroke="white" stroke-width="1.5"/>
        </svg>
      </div>
    `;

    taskbarItem.addEventListener('click', (event) => {
      if (event.target.closest('.taskbar-close-button')) {
        if (windowElement.dataset.title === 'File Explorer') {
          document.querySelector('.explorer-window').style.display = 'none';
        } else if (windowElement.parentElement) { 
          document.body.removeChild(windowElement);
        }
        removeFromTaskbar(windowElement);
        if (activeWindow === windowElement) {
          activeWindow = null;
        }
        return;
      }

      if (windowElement.style.display === 'none') {
        windowElement.style.display = '';
      }
      bringToFront(windowElement);
    });

    document.querySelector('.taskbar-windows').appendChild(taskbarItem);
    
    if (!activeWindow) {
      bringToFront(windowElement);
    } else {
      windowElement.style.zIndex = '100';
    }

    if (!windowElement.haspointerdownListener) {
      windowElement.addEventListener('pointerdown', () => {
        bringToFront(windowElement);
      });
      windowElement.haspointerdownListener = true;
    }
  };

  window.removeFromTaskbar = function(windowElement) {
    const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowElement.dataset.title}"]`);
    if (taskbarItem) {
      taskbarItem.remove();
    }
    if (activeWindow === windowElement) {
      activeWindow = null;
    }
  };

  function getIconForWindow(title) {
    switch (title) {
      case 'Steam':
        return `<image href="images/Steam_icon_logo.png" width="24" height="24"/>`;
      case 'Settings':
        return `<path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
               <path fill="#ffffff" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>`;
      case 'File Explorer':
        return `<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#ffffff"/>
               <path d="M20 8H4v10h16z" fill="#ffffff"/>`;
      default:
        if (title.endsWith('.mp4')) {
          return `<path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z" fill="#ffffff"/>
                 <path d="M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M14.5,12.5L11,15V9l3.5,2.5L18,9v6 L14.5,12.5z" fill="#ffffff"/>`;
        }
        return `<path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z" fill="#ffffff"/>
               <path d="M14,2v6h6L14,2z" fill="#ffffff"/>`;
    }
  }
//Damn even I think I could code better than Mymy
  function initializeSettings() {
    const settingsMenuItem = document.querySelector('.menu-item[data-action="settings"]');
    
    settingsMenuItem.addEventListener('click', () => {
      const settingsWindow = document.createElement('div');
      settingsWindow.className = 'settings-window window';
      settingsWindow.dataset.title = 'Settings';
      settingsWindow.style.transform = 'translate(-50%, -50%)';
      settingsWindow.innerHTML = `
        <div class="window-header">
          <div class="window-title">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path fill="#4CAF50" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
            </svg>
            <span>Settings</span>
          </div>
          <div class="window-controls">
            <div class="control close">×</div>
          </div>
        </div>
        <div class="settings-content">
          <div class="setting-item">
            <span>Experimental Mode</span>
            <button class="experimental-button">Enable</button>
          </div>
          <div class="setting-item">
            <span>Nederlands Mode</span>
            <label class="toggle-switch">
              <input type="checkbox" id="nederlands-toggle">
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span>"Assistant"</span>
            <label class="toggle-switch">
              <input type="checkbox" id="taskbar-pet-toggle">
              <span class="slider"></span>
            </label>
          </div>
          <div class="slider-container">
            <label for="assistant-volume">"Assistant" Volume</label>
            <input type="range" min="0" max="100" value="75" class="volume-slider" id="assistant-volume">
          </div>
          <div class="setting-item">
            <span>Close all Tabs</span>
            <button class="close-all-tabs-button">Close</button>
          </div>
        </div>
      `;

      document.body.appendChild(settingsWindow);
      addToTaskbar(settingsWindow);
      window.bringToFront(settingsWindow); 

      settingsWindow.addEventListener('pointerdown', () => {
        window.bringToFront(settingsWindow); 
      });

      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;
      let xOffset = 0;
      let yOffset = 0;

      const windowHeader = settingsWindow.querySelector('.window-header');

      windowHeader.addEventListener('pointerdown', (e) => {
        if (e.target.classList.contains('control')) return;
        
        const rect = settingsWindow.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
      });

      document.addEventListener('pointermove', (e) => {
        if (isDragging) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          xOffset = currentX;
          yOffset = currentY;
          settingsWindow.style.transform = `translate(0, 0)`;
          settingsWindow.style.left = `${currentX}px`;
          settingsWindow.style.top = `${currentY}px`;
        }
      });

      document.addEventListener('pointerup', () => {
        isDragging = false;
      });

      const rect = settingsWindow.getBoundingClientRect();
      const centerX = (window.innerWidth - rect.width) / 2;
      const windowHeight = settingsWindow.offsetHeight || 400; 
      const taskbarHeight = 40;
      const positionY = window.innerHeight - windowHeight - taskbarHeight - 10; 
      settingsWindow.style.transform = 'none';
      settingsWindow.style.left = `${centerX}px`;
      settingsWindow.style.top = `${positionY}px`;

      settingsWindow.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(settingsWindow);
        removeFromTaskbar(settingsWindow);
      });

      // Initialize Nederlands Mode toggle
      const nederlandsToggle = settingsWindow.querySelector('#nederlands-toggle');
      nederlandsToggle.checked = document.body.classList.contains('nederlands');
      
      nederlandsToggle.addEventListener('change', () => {
        document.body.classList.toggle('nederlands');
        localStorage.setItem('nederlandsMode', nederlandsToggle.checked);
        
        // Show message every time Nederlands Mode is enabled
        if (nederlandsToggle.checked) {
          showNederlandsModeMessage();
        }
      });

      // Initialize Taskbar Pet toggle
      const taskbarPetToggle = settingsWindow.querySelector('#taskbar-pet-toggle');
      const taskbarPet = document.querySelector('.taskbar-pet');
      taskbarPetToggle.checked = taskbarPet.classList.contains('active');
      
      taskbarPetToggle.addEventListener('change', () => {
        taskbarPet.classList.toggle('active');
        localStorage.setItem('taskbarPetEnabled', taskbarPetToggle.checked);
        if (taskbarPetToggle.checked) {
          initializeTaskbarpet();
        }
      });

      const closeAllTabsButton = settingsWindow.querySelector('.close-all-tabs-button');
      closeAllTabsButton.addEventListener('click', () => {
        const windows = document.querySelectorAll('.window');
        windows.forEach(win => {
          if (!win.classList.contains('start-menu') && !win.classList.contains('taskbar') && !win.classList.contains('settings-window') && !win.classList.contains('steam-window') && !win.classList.contains('explorer-window')) {
            document.body.removeChild(win);
            window.removeFromTaskbar(win);
          } else if (win.classList.contains('explorer-window')) {
            win.style.display = 'none';
            window.removeFromTaskbar(win);
          } else if (win.classList.contains('steam-window')) {
            document.body.removeChild(win);
            window.removeFromTaskbar(win);
          } else if (win.classList.contains('settings-window')) {
            document.body.removeChild(win);
            window.removeFromTaskbar(win);
          }
        });
      });

      const experimentalButton = settingsWindow.querySelector('.experimental-button');
      experimentalButton.addEventListener('click', () => {
        const bsod = document.createElement('div');
        bsod.className = 'bsod';
        bsod.innerHTML = `
          <h1>WFL OS</h1>
          <p>A problem has been detected and WFL has been shut down to prevent damage to your computer.</p>
          <p>CRITICAL_PROCESS_DIED</p>
          <p>If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
          <p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any WFL updates you might need.</p>
          <p>Technical information:</p>
          <p>*** STOP: 0x000000FE (0x00000008, 0x000000006, 0x00000009, 0x847075cc)</p>
        `;

        document.body.appendChild(bsod);
        setTimeout(() => {
          bsod.classList.add('active');
        }, 100);

        setTimeout(() => {
          window.location.reload();
        }, 10000);
      });

      // Initialize Assistant Volume slider
      const assistantVolumeSlider = settingsWindow.querySelector('#assistant-volume');
      assistantVolumeSlider.value = localStorage.getItem('assistantVolume') || 75;
      
      assistantVolumeSlider.addEventListener('input', () => {
        const volume = assistantVolumeSlider.value;
        localStorage.setItem('assistantVolume', volume);
        
        // Update global assistant volume
        window.assistantVolume = volume / 100;
        
        // If volume is zero, show message
        if (parseInt(volume) === 0) {
          showVolumeZeroMessage();
        }
      });
    });
  }

  initializeSettings();

  // Initialize event handling for mobile devices
  makeTouchFriendly();

  // Add show desktop button (ensure there's only one)
  const showDesktopButton = document.querySelector('.show-desktop');
  if (showDesktopButton) {
    let windowStates = new Map();

    showDesktopButton.addEventListener('click', () => {
      const windows = document.querySelectorAll('.window');
      const allHidden = Array.from(windows).every(win => 
        win.style.display === 'none' || !win.style.display
      );

      if (allHidden) {
        // Restore all windows to their previous state
        windows.forEach(win => {
          const previousState = windowStates.get(win);
          if (previousState) {
            win.style.display = previousState;
          }
        });
        windowStates.clear();
      } else {
        // Save and hide all windows
        windows.forEach(win => {
          if (win.style.display !== 'none') {
            windowStates.set(win, win.style.display);
            win.style.display = 'none';
          }
        });
      }
    });
  }
  // Initialize taskbarpet from the module
  setupTaskbarpet();
}

function openTextFile(name, content) {
  const textWindow = document.createElement('div');
  textWindow.className = 'text-window window';
  textWindow.dataset.title = name;

  // Add to taskbar immediately when created
  addToTaskbar(textWindow);

  textWindow.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <span>${name}</span>
      </div>
      <div class="window-controls">
        <div class="control close">×</div>
      </div>
    </div>
    <div class="text-content">
      <pre>${content}</pre>
    </div>
  `;

  document.body.appendChild(textWindow);
  window.bringToFront(textWindow);

  textWindow.addEventListener('pointerdown', () => {
    window.bringToFront(textWindow);
  });

  let isDragging = false;
  let initialX, initialY;
  let isMaximized = false;

  const textWindowHeader = textWindow.querySelector('.window-header');

  // Center the window initially
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    textWindow.style.transform = 'none';
    textWindow.style.width = '100%';
    textWindow.style.height = 'calc(100% - 40px)';
    textWindow.style.left = '0';
    textWindow.style.top = '0';
    textWindow.style.transform = 'none';
  } else {
    const centerX = (window.innerWidth - 500) / 2;
    const centerY = (window.innerHeight - 400) / 2;
    textWindow.style.left = `${centerX}px`;
    textWindow.style.top = `${centerY}px`;
    textWindow.style.width = '500px';
    textWindow.style.height = '400px';
    textWindow.style.transform = 'none';
  }

  textWindowHeader.addEventListener('pointerdown', e => {
    if (e.target.classList.contains('close')) {
      document.body.removeChild(textWindow);
      window.removeFromTaskbar(textWindow);
      return;
    }
    if (isMaximized) return;

    // Use pointer capture for better mobile support
    textWindowHeader.setPointerCapture(e.pointerId);

    // Get the current position
    const rect = textWindow.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    isDragging = true;
  });

  textWindowHeader.addEventListener('pointermove', e => {
    if (isDragging) {
      e.preventDefault();
      // Calculate the new position
      const newX = e.clientX - initialX;
      const newY = e.clientY - initialY;
      
      // Apply the new position
      textWindow.style.left = `${newX}px`;
      textWindow.style.top = `${newY}px`;
    }
  });

  textWindowHeader.addEventListener('pointerup', e => {
    if (isDragging) {
      textWindowHeader.releasePointerCapture(e.pointerId);
      isDragging = false;
    }
  });

  textWindowHeader.addEventListener('pointercancel', e => {
    if (isDragging) {
      textWindowHeader.releasePointerCapture(e.pointerId);
      isDragging = false;
    }
  });

  // Add maximize functionality
  textWindow.querySelector('.maximize')?.addEventListener('click', () => {
    if (isMaximized) {
      textWindow.style.width = '500px';
      textWindow.style.height = '400px';
      textWindow.style.top = '50%';
      textWindow.style.left = '50%';
      textWindow.style.transform = 'translate(-50%, -50%)';
    } else {
      textWindow.style.width = '100%';
      textWindow.style.height = 'calc(100% - 40px)';
      textWindow.style.top = '0';
      textWindow.style.left = '0';
      textWindow.style.transform = 'none';
    }
    isMaximized = !isMaximized;
  });

  // Add close button functionality
  textWindow.querySelector('.close').addEventListener('click', () => {
    document.body.removeChild(textWindow);
    window.removeFromTaskbar(textWindow);
  });
}

window.changeBackground = function(url) {
  document.body.style.backgroundImage = `url(${url})`;
  localStorage.setItem('backgroundUrl', url);
};

document.addEventListener('DOMContentLoaded', init);

function handleUsersClick() {
  // Show pet message every time Users is clicked
  showUsersClickMessage();
  openExplorer();
}

function makeTouchFriendly() {
  // Prevent default touch behaviors that might interfere with our app
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent pinch zoom
    }
  }, { passive: false });
  
  // Disable double-tap to zoom
  let lastTapTime = 0;
  document.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
    }
    lastTapTime = currentTime;
  });
  
  // Get all windows including those that will be created dynamically
  document.addEventListener('pointerdown', function(e) {
    const windowHeader = e.target.closest('.window-header');
    if (!windowHeader) return;
    
    // Don't start dragging if clicking on controls
    if (e.target.classList.contains('control')) return;
    
    const windowElement = windowHeader.closest('.window');
    if (!windowElement) return;
    
    // Check if window is maximized
    const isMaximized = windowElement.dataset.maximized === 'true';
    if (isMaximized) return;
    
    // Set pointer capture to track movement even if pointer leaves the element
    windowHeader.setPointerCapture(e.pointerId);
    
    // Get initial position
    const rect = windowElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const onPointerMove = function(moveEvent) {
      if (moveEvent.pointerId !== e.pointerId) return;
      
      // Calculate new position
      const x = moveEvent.clientX - offsetX;
      const y = moveEvent.clientY - offsetY;
      
      // Apply new position
      windowElement.style.transform = 'none';
      windowElement.style.left = `${x}px`;
      windowElement.style.top = `${y}px`;
    };
    
    const onPointerUp = function(upEvent) {
      if (upEvent.pointerId !== e.pointerId) return;
      
      // Remove event listeners
      windowHeader.removeEventListener('pointermove', onPointerMove);
      windowHeader.removeEventListener('pointerup', onPointerUp);
      windowHeader.removeEventListener('pointercancel', onPointerUp);
      
      // Release pointer capture
      windowHeader.releasePointerCapture(e.pointerId);
    };
    
    // Add event listeners for move and up/cancel events
    windowHeader.addEventListener('pointermove', onPointerMove);
    windowHeader.addEventListener('pointerup', onPointerUp);
    windowHeader.addEventListener('pointercancel', onPointerUp);
  });
}

function createSteamLibrary() {
  // Show pet message when Steam library is opened
  showSteamLibraryMessage();

  const steamLibraryWindow = document.createElement('div');
  steamLibraryWindow.className = 'steam-window window';
  steamLibraryWindow.dataset.title = 'Steam';

  // Add to taskbar immediately when created
  addToTaskbar(steamLibraryWindow);

  steamLibraryWindow.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <img src="images/Steam_icon_logo.png" alt="Steam" style="width: 2Vw; height: 2Vw;">
        <span style="color: black;">Steam Library</span>
      </div>
      <div class="window-controls">
        <div class="control minimize">─</div>
        <div class="control maximize">□</div>
        <div class="control close">×</div>
      </div>
    </div>
    <div class="steam-content" style="background-color: #1b2838; padding: 20px;">
      <div class="steam-library-header">
        <div class="steam-nav">
          <div class="steam-nav-item active">LIBRARY</div>
          <div class="steam-nav-item">STORE</div>
          <div class="steam-nav-item">COMMUNITY</div>
          <div class="steam-nav-item">mayadebae</div>
        </div>
      </div>
      <div class="steam-library-content">
        <div class="game-item">
          <img src="images/mymycraft.png" alt="Mymycraft" class="game-image">
          <div class="game-info">
            <div class="game-title">Mymycraft</div>
            <div class="game-status">Ready to Play</div>
            <button class="play-button">PLAY</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(steamLibraryWindow);
  window.bringToFront(steamLibraryWindow);

  steamLibraryWindow.addEventListener('pointerdown', () => {
    window.bringToFront(steamLibraryWindow);
  });

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  let isMaximized = false;

  const windowHeader = steamLibraryWindow.querySelector('.window-header');
  const minimizeButton = steamLibraryWindow.querySelector('.control.minimize');
  const maximizeButton = steamLibraryWindow.querySelector('.control.maximize');
  const closeButton = steamLibraryWindow.querySelector('.close');

  windowHeader.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('control')) return;
    if (isMaximized) return;

    const rect = steamLibraryWindow.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
  });

  document.addEventListener('pointermove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      steamLibraryWindow.style.transform = 'translate(0, 0)';
      steamLibraryWindow.style.left = `${currentX}px`;
      steamLibraryWindow.style.top = `${currentY}px`;
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });

  maximizeButton.addEventListener('click', () => {
    if (isMaximized) {
      steamLibraryWindow.style.width = '700px';
      steamLibraryWindow.style.height = 'auto';
      steamLibraryWindow.style.top = '50%';
      steamLibraryWindow.style.left = '50%';
      steamLibraryWindow.style.transform = 'translate(-50%, -50%)';
      xOffset = 0;
      yOffset = 0;
    } else {
      steamLibraryWindow.style.width = '100%';
      steamLibraryWindow.style.height = 'calc(100% - 40px)';
      steamLibraryWindow.style.top = '0';
      steamLibraryWindow.style.left = '0';
      steamLibraryWindow.style.transform = 'none';
    }
    isMaximized = !isMaximized;
  });

  minimizeButton.addEventListener('click', () => {
    steamLibraryWindow.style.display = 'none';
  });

  closeButton.addEventListener('click', () => {
    document.body.removeChild(steamLibraryWindow);
    removeFromTaskbar(steamLibraryWindow);
  });

  // Add click handler for the play button
  const playButton = steamLibraryWindow.querySelector('.play-button');
  playButton.addEventListener('click', () => {
    playButton.textContent = 'LAUNCHING...';
    playButton.style.background = '#32353c';
    
    setTimeout(() => {
      playButton.textContent = 'PLAY';
      playButton.style.background = '';
      
      // Create a new fullscreen window for the MymyCraft game
      const gameWindow = document.createElement('div');
      gameWindow.className = 'game-window window';
      gameWindow.dataset.title = 'Mymycraft';
      
      // Show pet message when Mymycraft game opens
      showMymycraftGameMessage();
      gameWindow.style.width = '100%';
      gameWindow.style.height = 'calc(100% - 40px)';
      gameWindow.style.top = '0';
      gameWindow.style.left = '0';
      gameWindow.style.zIndex = '1000';
      gameWindow.style.background = '#000';
      
      // Add to taskbar
      addToTaskbar(gameWindow);
      
      gameWindow.innerHTML = `
        <div class="window-header">
          <div class="window-title">
            <img src="images/mymycraft.png" alt="Mymycraft" style="width: 20px; height: 20px;">
            <span>Mymycraft</span>
          </div>
          <div class="window-controls">
            <div class="control minimize">─</div>
            <div class="control maximize">□</div>
            <div class="control close">×</div>
          </div>
        </div>
        <div class="game-content">
          <iframe src="MymyCraft/index.html" frameborder="0" style="width: 100%; height: 100%;"></iframe>
        </div>
      `;
      
      document.body.appendChild(gameWindow);
      window.bringToFront(gameWindow);
      
      // Set up window controls
      const closeBtn = gameWindow.querySelector('.close');
      const minimizeBtn = gameWindow.querySelector('.minimize');
      const maximizeBtn = gameWindow.querySelector('.maximize');
      
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(gameWindow);
        removeFromTaskbar(gameWindow);
      });
      
      minimizeBtn.addEventListener('click', () => {
        gameWindow.style.display = 'none';
      });
      
      let isMaximized = true;
      maximizeBtn.addEventListener('click', () => {
        if (isMaximized) {
          gameWindow.style.width = '800px';
          gameWindow.style.height = '600px';
          gameWindow.style.top = '50%';
          gameWindow.style.left = '50%';
          gameWindow.style.transform = 'translate(-50%, -50%)';
        } else {
          gameWindow.style.width = '100%';
          gameWindow.style.height = 'calc(100% - 40px)';
          gameWindow.style.top = '0';
          gameWindow.style.left = '0';
          gameWindow.style.transform = 'none';
        }
        isMaximized = !isMaximized;
      });
    }, 2000);
  });

  // Center the window initially
  setTimeout(() => {
    const rect = steamLibraryWindow.getBoundingClientRect();
    
    // Check if mobile device for automatic fullscreen
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      steamLibraryWindow.style.transform = 'none';
      steamLibraryWindow.style.width = '100%';
      steamLibraryWindow.style.height = 'calc(100% - 40px)';
      steamLibraryWindow.style.left = '0';
      steamLibraryWindow.style.top = '0';
      isMaximized = true;
    } else {
      const centerX = (window.innerWidth - rect.width) / 2;
      const centerY = (window.innerHeight - rect.height) / 2;
      steamLibraryWindow.style.transform = 'none';
      steamLibraryWindow.style.left = `${centerX}px`;
      steamLibraryWindow.style.top = `${centerY}px`;
    }
  }, 0);
}

window.addEventListener('resize', function() {
  // Reposition windows if they're outside the visible area after rotation
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    if (win.style.display !== 'none') {
      const rect = win.getBoundingClientRect();
      // If window is outside visible area, center it
      if (rect.right > window.innerWidth || rect.bottom > window.innerHeight - 40 || rect.left < 0 || rect.top < 0) {
        win.style.left = '50%';
        win.style.top = '50%';
        win.style.transform = 'translate(-50%, -50%)';
      }
    }
  });
});

// Initialize the assistant volume from localStorage when the app starts
window.assistantVolume = (localStorage.getItem('assistantVolume') || 75) / 100;