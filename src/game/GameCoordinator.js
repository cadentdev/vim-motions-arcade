/**
 * GameCoordinator - Main game coordinator that ties all systems together
 *
 * Initializes and manages:
 * - GameState
 * - GameLoop
 * - Renderers (Map, Player, Coin)
 * - HUD
 * - InputManager
 *
 * Handles win/lose callbacks and game flow.
 */

import { GameState } from './GameState.js';
import { GameLoop } from './GameLoop.js';
import { MapRenderer } from '../rendering/MapRenderer.js';
import { PlayerRenderer } from '../rendering/PlayerRenderer.js';
import { CoinRenderer } from '../rendering/CoinRenderer.js';
import { HUD } from '../ui/HUD.js';
import { InputManager } from '../input/InputManager.js';
import { MapGenerator } from '../map/MapGenerator.js';
import { Player } from '../entities/Player.js';

export class GameCoordinator {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.container = null;
    this.isRunning = false;

    // Game systems (initialized in startNewGame)
    this.gameState = null;
    this.gameLoop = null;
    this.mapRenderer = null;
    this.playerRenderer = null;
    this.coinRenderer = null;
    this.hud = null;
    this.inputManager = null;
    this.player = null;
    this.mapGenerator = null;
  }

  /**
   * Start a new game
   * @param {HTMLElement} container - DOM container for the game
   * @param {number} level - Level number to start
   */
  startNewGame(container, level) {
    // eslint-disable-next-line no-undef
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('Container must be a valid DOM element');
    }

    this.container = container;

    // Initialize GameState
    this.gameState = new GameState();

    // Generate map for this level
    this.mapGenerator = new MapGenerator({
      difficulty: level,
    });
    const mapData = this.mapGenerator.generate();
    this.gameState.map = mapData;

    // Initialize level with coins from map
    const coins = mapData.coinPositions.map((coin) => ({
      x: coin.x,
      y: coin.y,
      collected: false,
    }));
    this.gameState.initializeLevel(level, coins);

    // Set player starting position (center of map or first open space)
    this.gameState.updatePlayerPosition(5, 5);

    // Initialize Player (for movement logic)
    this.player = new Player({ x: 5, y: 5 }, mapData);

    // Initialize renderers
    this.mapRenderer = new MapRenderer();
    this.mapRenderer.setContainer(container);
    this.mapRenderer.renderMap(mapData);

    this.playerRenderer = new PlayerRenderer();
    this.playerRenderer.setContainer(container);
    this.playerRenderer.renderCursor(
      this.gameState.player.x,
      this.gameState.player.y
    );

    this.coinRenderer = new CoinRenderer();
    this.coinRenderer.setContainer(container);
    this.coinRenderer.renderCoins(this.gameState.level.coins);

    // Initialize HUD
    this.hud = new HUD();
    this.hud.initialize(container);
    this.hud.updateScore(this.gameState.score);
    this.hud.updateTimer(this.gameState.timer);
    this.hud.updateMode(this.gameState.player.mode);

    // Initialize InputManager
    this.inputManager = new InputManager({
      onMove: (key) => this.handleMovement(key),
      onCommandMode: () => this.handleCommandMode(),
      onEscape: () => this.handleEscape(),
    });
    this.inputManager.enable();

    // Initialize GameLoop with callbacks
    this.gameLoop = new GameLoop(this.gameState, {
      onUpdate: (deltaTime) => this.update(deltaTime),
      onRender: () => this.render(),
      onWin: () => this.handleWin(),
      onLose: () => this.handleLose(),
    });

    // Start the game loop
    this.gameLoop.start();
    this.isRunning = true;
  }

  /**
   * Handle movement input
   * @param {string} key - Movement key (h, j, k, l)
   */
  handleMovement(key) {
    if (!this.isRunning || !this.player) {
      return;
    }

    // Use Player class to handle movement
    this.player.move(key);

    // Sync player position to GameState
    this.gameState.updatePlayerPosition(this.player.x, this.player.y);

    // Check for coin collection
    this.checkCoinCollection();

    // Re-render player
    this.playerRenderer.renderCursor(this.player.x, this.player.y);

    // Center camera on player
    this.mapRenderer.centerOnPlayer(this.player.x, this.player.y);
  }

  /**
   * Handle command mode input
   */
  handleCommandMode() {
    // Future: implement command mode
    // For now, just a placeholder
  }

  /**
   * Handle escape key
   */
  handleEscape() {
    // Future: pause menu
    // For now, just a placeholder
  }

  /**
   * Check if player is on a coin
   */
  checkCoinCollection() {
    this.gameState.level.coins.forEach((coin, index) => {
      if (
        !coin.collected &&
        coin.x === this.gameState.player.x &&
        coin.y === this.gameState.player.y
      ) {
        // Collect coin
        this.gameState.collectCoin(index);
        this.gameState.score += 10; // Award points

        // Re-render coins
        this.coinRenderer.renderCoins(this.gameState.level.coins);

        // Update HUD
        this.hud.updateScore(this.gameState.score);
      }
    });
  }

  /**
   * Update game state (called each frame)
   * @param {number} _deltaTime - Time since last update
   */
  update(_deltaTime) {
    // Update HUD
    if (this.hud) {
      this.hud.updateTimer(this.gameState.timer);
    }

    // Re-render player if position changed
    if (this.playerRenderer) {
      this.playerRenderer.renderCursor(
        this.gameState.player.x,
        this.gameState.player.y
      );
    }

    // Notify state change callback
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(this.gameState);
    }
  }

  /**
   * Render game (called each frame)
   */
  render() {
    // Rendering is handled by individual renderers
    // This is a placeholder for future frame-based rendering
  }

  /**
   * Handle win condition
   */
  handleWin() {
    this.isRunning = false;
    this.inputManager.disable();

    if (this.callbacks.onWin) {
      this.callbacks.onWin({
        score: this.gameState.score,
        level: this.gameState.level.current,
        coinsCollected: this.gameState.level.collectedCoins,
        timeRemaining: this.gameState.timer,
      });
    }
  }

  /**
   * Handle lose condition
   */
  handleLose() {
    this.isRunning = false;
    this.inputManager.disable();

    if (this.callbacks.onLose) {
      this.callbacks.onLose({
        score: this.gameState.score,
        level: this.gameState.level.current,
        coinsCollected: this.gameState.level.collectedCoins,
        totalCoins: this.gameState.level.totalCoins,
      });
    }
  }

  /**
   * Pause the game
   */
  pause() {
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    if (this.inputManager) {
      this.inputManager.disable();
    }
    this.isRunning = false;
  }

  /**
   * Resume the game
   */
  resume() {
    if (this.gameLoop) {
      this.gameLoop.start();
    }
    if (this.inputManager) {
      this.inputManager.enable();
    }
    this.isRunning = true;
  }

  /**
   * Get current game state
   * @returns {GameState} Current game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Clean up and stop the game
   */
  cleanup() {
    // Stop game loop
    if (this.gameLoop) {
      this.gameLoop.stop();
    }

    // Disable input
    if (this.inputManager) {
      this.inputManager.disable();
    }

    // Clear renderers
    if (this.mapRenderer) {
      this.mapRenderer.clearMap();
    }
    if (this.playerRenderer) {
      this.playerRenderer.clearCursor();
    }
    if (this.coinRenderer) {
      this.coinRenderer.clearCoins();
    }

    // Remove HUD
    if (this.hud) {
      this.hud.destroy();
    }

    this.isRunning = false;
  }
}
