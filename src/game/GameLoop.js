/**
 * GameLoop - Main game loop with fixed timestep
 *
 * Uses requestAnimationFrame with fixed timestep for consistent
 * game speed across all devices.
 */
export class GameLoop {
  constructor(gameState, callbacks = {}) {
    this.gameState = gameState;
    this.callbacks = callbacks;

    // Loop state
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60; // 60 FPS fixed update rate

    // Frame tracking
    this.frameCount = 0;
    this.fpsStartTime = 0;
    this.fpsFrameCount = 0;

    // Bind loop method to preserve 'this' context
    this.loop = this.loop.bind(this);
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) {
      return; // Already running
    }

    this.isRunning = true;
    this.lastTime = this.getTime();
    this.fpsStartTime = this.lastTime;
    this.fpsFrameCount = 0;
    this.animationId = this.requestFrame(this.loop);
  }

  /**
   * Get current time (can be overridden for testing)
   * @returns {number}
   */
  getTime() {
    // eslint-disable-next-line no-undef
    return performance.now();
  }

  /**
   * Request animation frame (can be overridden for testing)
   * @param {Function} callback
   * @returns {number}
   */
  requestFrame(callback) {
    return requestAnimationFrame(callback);
  }

  /**
   * Cancel animation frame (can be overridden for testing)
   * @param {number} id
   */
  cancelFrame(id) {
    cancelAnimationFrame(id);
  }

  /**
   * Stop the game loop
   */
  stop() {
    if (!this.isRunning) {
      return; // Already stopped
    }

    this.isRunning = false;
    if (this.animationId !== null) {
      this.cancelFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main game loop
   * @param {number} currentTime - Current timestamp from requestAnimationFrame
   */
  loop(currentTime) {
    if (!this.isRunning) {
      return;
    }

    // Calculate time since last frame
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed update loop (game logic at 60 FPS)
    while (this.accumulator >= this.fixedDelta) {
      this.update(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
      this.frameCount++;
      this.fpsFrameCount++;
    }

    // Render (can run at variable framerate)
    this.render();

    // Check win/lose conditions
    this.checkGameConditions();

    // Continue loop if still running
    if (this.isRunning) {
      this.animationId = this.requestFrame(this.loop);
    }
  }

  /**
   * Manually tick the game loop (useful for testing)
   * @param {number} deltaTime - Time elapsed in milliseconds
   */
  tick(deltaTime = 16.67) {
    // Mock requestFrame to prevent actual animation frame
    const originalRequestFrame = this.requestFrame;
    this.requestFrame = () => null;

    const currentTime = this.lastTime + deltaTime;
    this.loop(currentTime);

    // Restore original requestFrame
    this.requestFrame = originalRequestFrame;
  }

  /**
   * Update game state (called at fixed 60 FPS)
   * @param {number} delta - Fixed delta time in milliseconds
   */
  update(delta) {
    // Don't update game state when paused
    if (this.gameState.isPaused) {
      return;
    }

    // Update timer
    const deltaSeconds = delta / 1000;
    this.gameState.timer = Math.max(0, this.gameState.timer - deltaSeconds);

    // Call custom update callback
    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate(delta);
    }
  }

  /**
   * Render the current game state
   */
  render() {
    // Call custom render callback
    if (this.callbacks.onRender) {
      this.callbacks.onRender();
    }
  }

  /**
   * Check for win/lose conditions
   */
  checkGameConditions() {
    // Win condition: All coins collected
    if (
      this.gameState.areAllCoinsCollected() &&
      !this.gameState.isLevelComplete
    ) {
      this.gameState.setLevelComplete();
      this.stop();
      if (this.callbacks.onWin) {
        this.callbacks.onWin();
      }
    }

    // Lose condition: Timer expired
    if (this.gameState.timer <= 0 && !this.gameState.isGameOver) {
      this.gameState.setGameOver();
      this.stop();
      if (this.callbacks.onLose) {
        this.callbacks.onLose();
      }
    }
  }

  /**
   * Pause the game
   */
  pause() {
    this.gameState.pause();
  }

  /**
   * Resume the game
   */
  resume() {
    this.gameState.resume();
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    if (this.gameState.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Get average FPS over the last second
   * @returns {number} - Average FPS
   */
  getAverageFPS() {
    const currentTime = this.getTime();
    const elapsed = currentTime - this.fpsStartTime;

    if (elapsed < 1000) {
      return 0; // Not enough data yet
    }

    const fps = (this.fpsFrameCount / elapsed) * 1000;
    return Math.round(fps);
  }
}
