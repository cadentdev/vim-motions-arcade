/**
 * GameState - Central game state management
 *
 * Manages all game state including player position, level state,
 * score, timer, health, and unlocked motions.
 */
export class GameState {
  constructor() {
    this.reset();
  }

  /**
   * Reset game state to initial values
   */
  reset() {
    // Player state
    this.player = {
      x: 0,
      y: 0,
      mode: 'normal', // normal, insert, visual, command
    };

    // Level state
    this.level = {
      current: 1,
      coins: [],
      totalCoins: 0,
      collectedCoins: 0,
    };

    // Scoring & progression
    this.score = 0;
    this.timer = 60; // seconds
    this.health = 3;

    // Unlocked motions (Phase 1: only hjkl unlocked)
    this.unlockedMotions = {
      h: true, // Left
      j: true, // Down
      k: true, // Up
      l: true, // Right
      w: false, // Word forward (Phase 2+)
      b: false, // Word backward (Phase 2+)
      e: false, // End of word (Phase 2+)
    };

    // XP & Leveling (Phase 5+)
    this.xp = 0;
    this.playerLevel = 1;

    // Game state flags
    this.isPaused = false;
    this.isGameOver = false;
    this.isLevelComplete = false;
  }

  /**
   * Update player position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  updatePlayerPosition(x, y) {
    this.player.x = x;
    this.player.y = y;
  }

  /**
   * Update player mode
   * @param {string} mode - The mode (normal, insert, visual, command)
   */
  updatePlayerMode(mode) {
    this.player.mode = mode;
  }

  /**
   * Add points to score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * Update timer value
   * @param {number} seconds - New timer value in seconds
   */
  updateTimer(seconds) {
    this.timer = seconds;
  }

  /**
   * Update health value
   * @param {number} health - New health value
   */
  updateHealth(health) {
    this.health = Math.max(0, health); // Don't allow negative health
  }

  /**
   * Initialize a level with coins
   * @param {number} levelNumber - The level number
   * @param {Array} coins - Array of coin objects {x, y, collected}
   */
  initializeLevel(levelNumber, coins) {
    this.level.current = levelNumber;
    this.level.coins = coins;
    this.level.totalCoins = coins.length;
    this.level.collectedCoins = coins.filter((coin) => coin.collected).length;
    this.isLevelComplete = false;
    this.isGameOver = false;
  }

  /**
   * Mark a coin as collected
   * @param {number} coinIndex - Index of the coin in the coins array
   */
  collectCoin(coinIndex) {
    if (
      coinIndex >= 0 &&
      coinIndex < this.level.coins.length &&
      !this.level.coins[coinIndex].collected
    ) {
      this.level.coins[coinIndex].collected = true;
      this.level.collectedCoins++;
    }
  }

  /**
   * Check if all coins have been collected
   * @returns {boolean}
   */
  areAllCoinsCollected() {
    return this.level.collectedCoins === this.level.totalCoins;
  }

  /**
   * Unlock a vim motion
   * @param {string} motion - The motion key (e.g., 'w', 'b', 'e')
   */
  unlockMotion(motion) {
    if (Object.prototype.hasOwnProperty.call(this.unlockedMotions, motion)) {
      this.unlockedMotions[motion] = true;
    }
  }

  /**
   * Check if a motion is unlocked
   * @param {string} motion - The motion key
   * @returns {boolean}
   */
  isMotionUnlocked(motion) {
    return this.unlockedMotions[motion] === true;
  }

  /**
   * Pause the game
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume the game
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * Mark the game as over
   */
  setGameOver() {
    this.isGameOver = true;
  }

  /**
   * Mark the level as complete
   */
  setLevelComplete() {
    this.isLevelComplete = true;
  }

  /**
   * Serialize game state to JSON
   * @returns {Object} - Serialized game state
   */
  toJSON() {
    return {
      player: { ...this.player },
      level: {
        current: this.level.current,
        coins: this.level.coins.map((coin) => ({ ...coin })),
        totalCoins: this.level.totalCoins,
        collectedCoins: this.level.collectedCoins,
      },
      score: this.score,
      timer: this.timer,
      health: this.health,
      unlockedMotions: { ...this.unlockedMotions },
      xp: this.xp,
      playerLevel: this.playerLevel,
      isPaused: this.isPaused,
      isGameOver: this.isGameOver,
      isLevelComplete: this.isLevelComplete,
    };
  }

  /**
   * Restore game state from JSON
   * @param {Object} data - Serialized game state
   */
  fromJSON(data) {
    this.player = { ...data.player };
    this.level = {
      current: data.level.current,
      coins: data.level.coins.map((coin) => ({ ...coin })),
      totalCoins: data.level.totalCoins,
      collectedCoins: data.level.collectedCoins,
    };
    this.score = data.score;
    this.timer = data.timer;
    this.health = data.health;
    this.unlockedMotions = { ...data.unlockedMotions };
    this.xp = data.xp;
    this.playerLevel = data.playerLevel;
    this.isPaused = data.isPaused;
    this.isGameOver = data.isGameOver;
    this.isLevelComplete = data.isLevelComplete;
  }
}
