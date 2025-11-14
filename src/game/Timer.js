/**
 * Timer - Countdown timer for game levels
 */
export class Timer {
  constructor(initialTime) {
    this.initialTime = initialTime;
    this.time = initialTime;
    this.running = false;
    this.expired = false;
    this.expireCallback = null;
  }

  /**
   * Start the timer
   */
  start() {
    this.running = true;
    this.expired = false;
  }

  /**
   * Stop the timer
   */
  stop() {
    this.running = false;
  }

  /**
   * Pause the timer
   */
  pause() {
    this.running = false;
  }

  /**
   * Resume the timer
   */
  resume() {
    this.running = true;
  }

  /**
   * Update timer with delta time
   * @param {number} deltaMs - Time elapsed in milliseconds
   */
  update(deltaMs) {
    if (!this.running || this.expired) {
      return;
    }

    const deltaSeconds = deltaMs / 1000;
    this.time -= deltaSeconds;

    if (this.time <= 0) {
      this.time = 0;
      this.expired = true;
      this.running = false;

      if (this.expireCallback) {
        this.expireCallback();
        // Prevent callback from being called multiple times
        this.expireCallback = null;
      }
    }
  }

  /**
   * Check if timer is running
   * @returns {boolean} True if running
   */
  isRunning() {
    return this.running;
  }

  /**
   * Check if timer has expired
   * @returns {boolean} True if expired
   */
  isExpired() {
    return this.expired;
  }

  /**
   * Get current time
   * @returns {number} Time remaining in seconds
   */
  getTime() {
    return this.time;
  }

  /**
   * Get formatted time as MM:SS
   * @returns {string} Formatted time
   */
  getFormattedTime() {
    const totalSeconds = Math.floor(this.time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Set callback for when timer expires
   * @param {Function} callback - Callback function
   */
  onExpire(callback) {
    // Reset the callback when setting a new one
    this.expireCallback = callback;
  }

  /**
   * Reset timer to initial time
   */
  reset() {
    this.time = this.initialTime;
    this.running = false;
    this.expired = false;
  }

  /**
   * Get timer state
   * @returns {Object} Timer state
   */
  getState() {
    return {
      time: this.time,
      initialTime: this.initialTime,
      running: this.running,
      expired: this.expired,
    };
  }

  /**
   * Restore timer state
   * @param {Object} state - State object
   */
  setState(state) {
    this.time = state.time;
    this.initialTime = state.initialTime;
    this.running = state.running;
    this.expired = state.expired;
  }
}
