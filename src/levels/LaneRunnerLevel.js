/**
 * LaneRunnerLevel - A side-scrolling two-lane game for j/k training
 *
 * Teaches players to use index finger on 'j' (down) and middle finger on 'k' (up).
 * The player navigates a glowing cursor between two lanes to avoid obstacles
 * that scroll from right to left.
 */

/* global performance */

// Lane constants
const LANE_TOP = 0;
const LANE_BOTTOM = 1;

/**
 * Create the obstacle pattern for the level
 * Each obstacle has: { lane, distance } where distance is from start
 */
function createObstaclePattern() {
  // Hand-designed pattern - spread out for easier gameplay
  // Distances are in "units" from the start
  return [
    // Easy intro - very spread out
    { lane: LANE_BOTTOM, distance: 15 },
    { lane: LANE_TOP, distance: 35 },
    { lane: LANE_BOTTOM, distance: 55 },

    // Moderate sequence
    { lane: LANE_TOP, distance: 75 },
    { lane: LANE_BOTTOM, distance: 92 },
    { lane: LANE_TOP, distance: 108 },

    // Alternating pattern - still comfortable spacing
    { lane: LANE_BOTTOM, distance: 125 },
    { lane: LANE_TOP, distance: 140 },

    // Final stretch
    { lane: LANE_BOTTOM, distance: 155 },
  ];
}

/**
 * Create the coin pattern for the level
 * Coins encourage lane switching and reward exploration
 */
function createCoinPattern() {
  return [
    // Early coins to teach collection
    { lane: LANE_TOP, distance: 8 },
    { lane: LANE_BOTTOM, distance: 12 },

    // Coins between first obstacles - reward switching
    { lane: LANE_TOP, distance: 22 },
    { lane: LANE_TOP, distance: 26 },
    { lane: LANE_BOTTOM, distance: 42 },
    { lane: LANE_TOP, distance: 48 },

    // Mid section - alternating to encourage movement
    { lane: LANE_BOTTOM, distance: 62 },
    { lane: LANE_TOP, distance: 68 },
    { lane: LANE_BOTTOM, distance: 82 },
    { lane: LANE_TOP, distance: 88 },

    // Later section
    { lane: LANE_BOTTOM, distance: 98 },
    { lane: LANE_TOP, distance: 102 },
    { lane: LANE_BOTTOM, distance: 115 },
    { lane: LANE_TOP, distance: 120 },

    // Final coins
    { lane: LANE_BOTTOM, distance: 132 },
    { lane: LANE_TOP, distance: 138 },
    { lane: LANE_BOTTOM, distance: 145 },
    { lane: LANE_TOP, distance: 150 },
  ];
}

export class LaneRunnerLevel {
  constructor(config = {}) {
    this.config = {
      containerId: config.containerId || 'game-area',
      scrollSpeed: config.scrollSpeed || 3, // pixels per frame
      obstacleWidth: config.obstacleWidth || 40,
      laneHeight: config.laneHeight || 60,
      playerHeight: config.playerHeight || 40,
      playerWidth: config.playerWidth || 20, // half width for visibility
      levelLength: config.levelLength || 160, // in distance units
      unitWidth: config.unitWidth || 20, // pixels per distance unit
      onWin: config.onWin || (() => {}),
      onLose: config.onLose || (() => {}),
      ...config,
    };

    this.container = null;
    this.trackElement = null;
    this.playerElement = null;
    this.finishLineElement = null;

    // Game state
    this.playerLane = LANE_TOP;
    this.scrollPosition = 0;
    this.isRunning = false;
    this.hasStarted = false;
    this.gameOver = false;

    // Obstacles
    this.obstacles = [];
    this.obstacleElements = [];
    this.obstaclePattern = createObstaclePattern();

    // Coins
    this.coinElements = [];
    this.coinPattern = createCoinPattern();
    this.collectedCoins = new Set();
    this.score = 0;

    // Animation
    this.animationId = null;
    this.lastTime = 0;

    // Track dimensions (calculated on init)
    this.trackWidth = 0;
    this.totalLength = 0;
  }

  /**
   * Initialize the level
   */
  init() {
    this.container = document.getElementById(this.config.containerId);

    if (!this.container) {
      throw new Error(`Container not found: ${this.config.containerId}`);
    }

    this.container.innerHTML = '';

    // Calculate dimensions
    this.trackWidth = this.container.clientWidth || 800;
    this.totalLength = this.config.levelLength * this.config.unitWidth;

    // Create the track
    this.createTrack();
    this.createPlayer();
    this.createObstacles();
    this.createCoins();
    this.createFinishLine();

    // Setup input
    this.setupInput();

    // Initial render
    this.updateDebugInfo();
  }

  /**
   * Create the two-lane track
   */
  createTrack() {
    this.trackElement = document.createElement('div');
    this.trackElement.className = 'lane-track';

    // Create top lane
    const topLane = document.createElement('div');
    topLane.className = 'lane lane-top';
    topLane.style.height = `${this.config.laneHeight}px`;

    // Create lane divider
    this.dividerElement = document.createElement('div');
    this.dividerElement.className = 'lane-divider';

    // Create bottom lane
    const bottomLane = document.createElement('div');
    bottomLane.className = 'lane lane-bottom';
    bottomLane.style.height = `${this.config.laneHeight}px`;

    this.trackElement.appendChild(topLane);
    this.trackElement.appendChild(this.dividerElement);
    this.trackElement.appendChild(bottomLane);

    this.container.appendChild(this.trackElement);
  }

  /**
   * Create the player cursor
   */
  createPlayer() {
    this.playerElement = document.createElement('div');
    this.playerElement.className = 'lane-player glow';
    this.playerElement.style.width = `${this.config.playerWidth}px`;
    this.playerElement.style.height = `${this.config.playerHeight}px`;

    // Position player on left side, in top lane
    this.updatePlayerPosition();

    this.trackElement.appendChild(this.playerElement);
  }

  /**
   * Create obstacles based on the pattern
   */
  createObstacles() {
    this.obstacleElements = [];

    this.obstaclePattern.forEach((obstacle, index) => {
      const el = document.createElement('div');
      el.className = 'lane-obstacle';
      el.dataset.index = index;
      el.dataset.lane = obstacle.lane;
      el.style.width = `${this.config.obstacleWidth}px`;
      el.style.height = `${this.config.laneHeight - 10}px`;

      // Position based on distance and lane
      const xPos = obstacle.distance * this.config.unitWidth;
      el.style.left = `${xPos}px`;

      if (obstacle.lane === LANE_TOP) {
        el.style.top = '5px';
      } else {
        el.style.bottom = '5px';
        el.style.top = 'auto';
      }

      this.trackElement.appendChild(el);
      this.obstacleElements.push({
        element: el,
        lane: obstacle.lane,
        x: xPos,
      });
    });
  }

  /**
   * Create collectible coins
   */
  createCoins() {
    this.coinElements = [];

    this.coinPattern.forEach((coin, index) => {
      const el = document.createElement('div');
      el.className = 'lane-coin';
      el.dataset.index = index;
      el.dataset.lane = coin.lane;
      el.textContent = 'o';

      // Position based on distance and lane
      const xPos = coin.distance * this.config.unitWidth;
      el.style.left = `${xPos}px`;

      if (coin.lane === LANE_TOP) {
        el.style.top = `${(this.config.laneHeight - 20) / 2}px`;
      } else {
        el.style.top = `${this.config.laneHeight + 4 + (this.config.laneHeight - 20) / 2}px`;
      }

      this.trackElement.appendChild(el);
      this.coinElements.push({
        element: el,
        lane: coin.lane,
        x: xPos,
        collected: false,
      });
    });
  }

  /**
   * Create the finish line
   */
  createFinishLine() {
    this.finishLineElement = document.createElement('div');
    this.finishLineElement.className = 'finish-line';
    this.finishLineElement.style.left = `${this.totalLength}px`;

    // Add checkered pattern text
    const label = document.createElement('span');
    label.className = 'finish-label';
    label.textContent = 'FINISH';
    this.finishLineElement.appendChild(label);

    this.trackElement.appendChild(this.finishLineElement);
  }

  /**
   * Setup keyboard input
   */
  setupInput() {
    this.keyHandler = (e) => {
      // Restart always works, even when game is over
      if (e.key.toLowerCase() === 'r') {
        this.restart();
        return;
      }

      if (this.gameOver) return;

      switch (e.key.toLowerCase()) {
        case 'j':
          e.preventDefault();
          this.moveToLane(LANE_BOTTOM);
          break;
        case 'k':
          e.preventDefault();
          this.moveToLane(LANE_TOP);
          break;
        case ' ':
        case 'enter':
          if (!this.hasStarted) {
            e.preventDefault();
            this.start();
          }
          break;
        case 'escape':
          if (this.isRunning) {
            this.pause();
          } else if (this.hasStarted && !this.gameOver) {
            this.resume();
          }
          break;
      }
    };

    document.addEventListener('keydown', this.keyHandler);
  }

  /**
   * Move player to specified lane
   */
  moveToLane(lane) {
    if (this.playerLane === lane) return;

    this.playerLane = lane;
    this.updatePlayerPosition();
    this.updateDebugInfo();

    // Check for immediate collision after lane change
    if (this.isRunning) {
      this.checkCollisions();
    }
  }

  /**
   * Update player visual position
   */
  updatePlayerPosition() {
    const playerX = 60; // Fixed X position on left side

    let playerY;
    if (this.playerLane === LANE_TOP) {
      playerY = (this.config.laneHeight - this.config.playerHeight) / 2;
    } else {
      playerY =
        this.config.laneHeight +
        4 +
        (this.config.laneHeight - this.config.playerHeight) / 2;
    }

    this.playerElement.style.left = `${playerX}px`;
    this.playerElement.style.top = `${playerY}px`;
  }

  /**
   * Start the game
   */
  start() {
    if (this.hasStarted && !this.gameOver) return;

    // Hide instructions overlay
    const overlay = document.getElementById('instructions-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }

    this.hasStarted = true;
    this.isRunning = true;
    this.gameOver = false;
    this.scrollPosition = 0;
    this.lastTime = performance.now();

    this.gameLoop();
    this.updateDebugInfo();
  }

  /**
   * Pause the game
   */
  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.updateDebugInfo();
  }

  /**
   * Resume the game
   */
  resume() {
    if (this.gameOver) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
    this.updateDebugInfo();
  }

  /**
   * Restart the level
   */
  restart() {
    this.pause();

    this.scrollPosition = 0;
    this.playerLane = LANE_TOP;
    this.gameOver = false;
    this.hasStarted = false;

    // Reset player position
    this.updatePlayerPosition();
    this.playerElement.classList.remove('hit');

    // Reset obstacles visual position
    this.updateObstaclePositions();

    // Reset coins
    this.collectedCoins.clear();
    this.score = 0;
    this.coinElements.forEach((coin) => {
      coin.collected = false;
      coin.element.classList.remove('collected');
    });

    // Reset finish line
    this.finishLineElement.classList.remove('reached');

    // Show instructions overlay
    const overlay = document.getElementById('instructions-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }

    // Reset debug info styling
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
      debugInfo.classList.remove('win', 'lose');
    }

    this.updateDebugInfo();
  }

  /**
   * Main game loop
   */
  gameLoop() {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = (now - this.lastTime) / 16.67; // Normalize to ~60fps
    this.lastTime = now;

    // Update scroll position
    this.scrollPosition += this.config.scrollSpeed * delta;

    // Update obstacle and coin positions
    this.updateObstaclePositions();

    // Check collisions and coin collection
    this.checkCollisions();
    this.checkCoinCollection();

    // Check win condition
    this.checkWin();

    // Continue loop
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Update obstacle positions based on scroll
   */
  updateObstaclePositions() {
    this.obstacleElements.forEach((obs) => {
      obs.element.style.transform = `translateX(${-this.scrollPosition}px)`;
    });

    // Update coin positions
    this.coinElements.forEach((coin) => {
      coin.element.style.transform = `translateX(${-this.scrollPosition}px)`;
    });

    // Update finish line position
    if (this.finishLineElement) {
      this.finishLineElement.style.transform = `translateX(${-this.scrollPosition}px)`;
    }

    // Update lane divider to scroll with obstacles
    if (this.dividerElement) {
      this.dividerElement.style.backgroundPosition = `${-this.scrollPosition}px 0`;
    }
  }

  /**
   * Check for collisions with obstacles
   */
  checkCollisions() {
    const playerX = 60;
    const playerRight = playerX + this.config.playerWidth;

    for (const obs of this.obstacleElements) {
      // Only check obstacles in the same lane
      if (obs.lane !== this.playerLane) continue;

      const obsLeft = obs.x - this.scrollPosition;
      const obsRight = obsLeft + this.config.obstacleWidth;

      // Check horizontal overlap
      if (playerRight > obsLeft && playerX < obsRight) {
        this.handleCollision();
        return;
      }
    }
  }

  /**
   * Check for coin collection
   */
  checkCoinCollection() {
    const playerX = 60;
    const playerRight = playerX + this.config.playerWidth;

    this.coinElements.forEach((coin, index) => {
      if (coin.collected) return;
      if (coin.lane !== this.playerLane) return;

      const coinLeft = coin.x - this.scrollPosition;
      const coinRight = coinLeft + 20; // coin width

      // Check horizontal overlap
      if (playerRight > coinLeft && playerX < coinRight) {
        coin.collected = true;
        coin.element.classList.add('collected');
        this.collectedCoins.add(index);
        this.score += 10;
        this.updateDebugInfo();
      }
    });
  }

  /**
   * Handle collision with obstacle
   */
  handleCollision() {
    this.isRunning = false;
    this.gameOver = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Visual feedback
    this.playerElement.classList.add('hit');

    // Update debug info
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
      debugInfo.textContent = 'COLLISION! Press R to restart';
      debugInfo.classList.add('lose');
    }

    this.config.onLose({
      distance: Math.floor(this.scrollPosition / this.config.unitWidth),
    });
  }

  /**
   * Check win condition
   */
  checkWin() {
    const finishX = this.totalLength - this.scrollPosition;

    // Player reaches finish line when it scrolls past them
    if (finishX <= 60 + this.config.playerWidth) {
      this.handleWin();
    }
  }

  /**
   * Handle win condition
   */
  handleWin() {
    this.isRunning = false;
    this.gameOver = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Visual feedback
    this.finishLineElement.classList.add('reached');

    // Update debug info
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
      debugInfo.textContent = `LEVEL COMPLETE! Score: ${this.score} | ${this.collectedCoins.size}/${this.coinPattern.length} coins`;
      debugInfo.classList.add('win');
    }

    this.config.onWin({
      distance: this.config.levelLength,
      score: this.score,
      coinsCollected: this.collectedCoins.size,
    });
  }

  /**
   * Update debug display
   */
  updateDebugInfo() {
    const debugInfo = document.getElementById('debug-info');
    const debugPosition = document.getElementById('debug-position');

    if (debugInfo) {
      if (!this.hasStarted) {
        debugInfo.textContent = 'Press SPACE to start';
      } else if (this.gameOver) {
        // Already set by win/lose handlers
      } else if (this.isRunning) {
        const progress = Math.floor(
          (this.scrollPosition / this.totalLength) * 100
        );
        debugInfo.textContent = `Progress: ${progress}% | Score: ${this.score}`;
      } else {
        debugInfo.textContent = 'PAUSED - Press ESC to resume';
      }
    }

    if (debugPosition) {
      debugPosition.textContent = `Lane: ${this.playerLane === LANE_TOP ? 'TOP' : 'BOTTOM'}`;
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
    }

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
