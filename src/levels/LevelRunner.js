/**
 * LevelRunner - Standalone level execution environment
 *
 * Bypasses the main game flow (menus, saves, progression) to run
 * a single level directly for testing and iteration.
 */

import { Player } from '../entities/Player.js';
import { InputManager } from '../input/InputManager.js';

export class LevelRunner {
  constructor(config = {}) {
    this.config = {
      containerId: config.containerId || 'game-area',
      debugHeaderId: config.debugHeaderId || 'debug-header',
      debugFooterId: config.debugFooterId || 'debug-footer',
      onWin: config.onWin || (() => {}),
      onLose: config.onLose || (() => {}),
      ...config,
    };

    this.container = null;
    this.level = null;
    this.player = null;
    this.inputManager = null;
    this.isRunning = false;

    // Rendering elements
    this.mapElement = null;
    this.cursorElement = null;
    this.coinElements = [];

    // Character dimensions (monospace grid)
    this.charWidth = 10;
    this.charHeight = 16;

    // Game state
    this.collectedCoins = new Set();
    this.moveCount = 0;
  }

  /**
   * Initialize with a level definition
   * @param {Object} level - Level definition object
   */
  init(level) {
    this.level = level;
    this.container = document.getElementById(this.config.containerId);

    if (!this.container) {
      throw new Error(
        `Container element not found: ${this.config.containerId}`
      );
    }

    // Clear any existing content
    this.container.innerHTML = '';

    // Create map container
    this.mapElement = document.createElement('div');
    this.mapElement.className = 'level-map';
    this.mapElement.style.position = 'relative';
    this.mapElement.style.width = `${level.width * this.charWidth}px`;
    this.mapElement.style.height = `${level.height * this.charHeight}px`;
    this.container.appendChild(this.mapElement);

    // Render level elements
    this.renderWalls();
    this.renderCoins();
    this.renderPlayer();

    // Setup input
    this.inputManager = new InputManager({
      onMove: (key) => this.handleMove(key),
      onEscape: () => this.handleEscape(),
    });

    // Add restart key listener
    this.restartHandler = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.restart();
      }
    };
    document.addEventListener('keydown', this.restartHandler);

    // Update debug display
    this.updateDebugInfo();
  }

  /**
   * Start the level
   */
  start() {
    if (!this.level) {
      throw new Error('No level loaded. Call init() first.');
    }

    this.inputManager.enable();
    this.isRunning = true;
    this.updateDebugInfo();
  }

  /**
   * Restart the current level
   */
  restart() {
    this.collectedCoins.clear();
    this.moveCount = 0;

    // Reset player position
    const startPos = this.level.playerStart || { x: 1, y: 1 };
    this.player.setPosition(startPos.x, startPos.y);
    this.updatePlayerPosition();

    // Reset coins visibility
    this.coinElements.forEach((el) => {
      el.style.display = 'block';
      el.classList.remove('collected');
    });

    this.updateDebugInfo();
  }

  /**
   * Render maze walls
   */
  renderWalls() {
    const { walls, width, height } = this.level;

    // Create wall elements
    walls.forEach((wall) => {
      const wallEl = document.createElement('div');
      wallEl.className = 'maze-wall';
      wallEl.style.position = 'absolute';
      wallEl.style.left = `${wall.x * this.charWidth}px`;
      wallEl.style.top = `${wall.y * this.charHeight}px`;
      wallEl.style.width = `${this.charWidth}px`;
      wallEl.style.height = `${this.charHeight}px`;
      wallEl.textContent = '#';
      this.mapElement.appendChild(wallEl);
    });

    // Add border walls if not already defined
    this.renderBorder(width, height);
  }

  /**
   * Render border walls around the maze
   */
  renderBorder(_width, _height) {
    // Only render border if we have explicit dimensions
    // The walls array should already contain border walls
  }

  /**
   * Render collectible coins
   */
  renderCoins() {
    const { coins } = this.level;
    this.coinElements = [];

    coins.forEach((coin, index) => {
      const coinEl = document.createElement('div');
      coinEl.className = 'maze-coin';
      coinEl.dataset.index = index;
      coinEl.style.position = 'absolute';
      coinEl.style.left = `${coin.x * this.charWidth}px`;
      coinEl.style.top = `${coin.y * this.charHeight}px`;
      coinEl.style.width = `${this.charWidth}px`;
      coinEl.style.height = `${this.charHeight}px`;
      coinEl.textContent = '\u25C6'; // Diamond character
      this.mapElement.appendChild(coinEl);
      this.coinElements.push(coinEl);
    });
  }

  /**
   * Render the player cursor
   */
  renderPlayer() {
    const startPos = this.level.playerStart || { x: 1, y: 1 };

    // Create Player entity for movement logic
    this.player = new Player(startPos, {
      width: this.level.width,
      height: this.level.height,
      blocks: [], // No word blocks in maze mode
    });

    // Create cursor element
    this.cursorElement = document.createElement('div');
    this.cursorElement.className = 'player-cursor glow';
    this.cursorElement.style.position = 'absolute';
    this.cursorElement.style.width = `${this.charWidth}px`;
    this.cursorElement.style.height = `${this.charHeight}px`;
    this.cursorElement.style.zIndex = '10';
    this.cursorElement.textContent = '\u2588'; // Block character
    this.mapElement.appendChild(this.cursorElement);

    this.updatePlayerPosition();
  }

  /**
   * Update cursor visual position
   */
  updatePlayerPosition() {
    const { x, y } = this.player.getPosition();
    this.cursorElement.style.left = `${x * this.charWidth}px`;
    this.cursorElement.style.top = `${y * this.charHeight}px`;
  }

  /**
   * Handle movement input
   * @param {string} key - Movement key (h, j, k, l)
   */
  handleMove(key) {
    if (!this.isRunning) return;

    const oldPos = this.player.getPosition();
    let newX = oldPos.x;
    let newY = oldPos.y;

    switch (key) {
      case 'h':
        newX--;
        break;
      case 'l':
        newX++;
        break;
      case 'k':
        newY--;
        break;
      case 'j':
        newY++;
        break;
    }

    // Check bounds
    if (
      newX < 0 ||
      newX >= this.level.width ||
      newY < 0 ||
      newY >= this.level.height
    ) {
      return;
    }

    // Check wall collision
    if (this.isWall(newX, newY)) {
      return;
    }

    // Move is valid
    this.player.setPosition(newX, newY);
    this.moveCount++;
    this.updatePlayerPosition();

    // Check coin collection
    this.checkCoinCollection();

    // Update debug info
    this.updateDebugInfo();

    // Check win condition
    if (this.collectedCoins.size === this.level.coins.length) {
      this.handleWin();
    }
  }

  /**
   * Check if a position is a wall
   */
  isWall(x, y) {
    return this.level.walls.some((wall) => wall.x === x && wall.y === y);
  }

  /**
   * Check if player is on a coin and collect it
   */
  checkCoinCollection() {
    const { x, y } = this.player.getPosition();

    this.level.coins.forEach((coin, index) => {
      if (!this.collectedCoins.has(index) && coin.x === x && coin.y === y) {
        this.collectedCoins.add(index);
        this.coinElements[index].style.display = 'none';
        this.coinElements[index].classList.add('collected');
      }
    });
  }

  /**
   * Handle escape key
   */
  handleEscape() {
    // For now, just pause/unpause
    this.isRunning = !this.isRunning;
    this.updateDebugInfo();
  }

  /**
   * Handle win condition
   */
  handleWin() {
    this.isRunning = false;
    this.inputManager.disable();

    // Update debug header
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
      debugInfo.textContent = `LEVEL COMPLETE! Moves: ${this.moveCount}`;
      debugInfo.classList.add('win');
    }

    this.config.onWin({
      moves: this.moveCount,
      coins: this.collectedCoins.size,
    });
  }

  /**
   * Update debug display information
   */
  updateDebugInfo() {
    const debugInfo = document.getElementById('debug-info');
    const debugPosition = document.getElementById('debug-position');

    if (debugInfo && this.level) {
      const status = this.isRunning ? 'PLAYING' : 'PAUSED';
      const coins = `${this.collectedCoins.size}/${this.level.coins.length}`;
      debugInfo.textContent = `${status} | Coins: ${coins} | Moves: ${this.moveCount}`;
    }

    if (debugPosition && this.player) {
      const pos = this.player.getPosition();
      debugPosition.textContent = `Position: (${pos.x}, ${pos.y})`;
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.inputManager) {
      this.inputManager.disable();
    }

    if (this.restartHandler) {
      document.removeEventListener('keydown', this.restartHandler);
    }

    if (this.container) {
      this.container.innerHTML = '';
    }

    this.isRunning = false;
  }
}
