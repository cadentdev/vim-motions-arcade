/**
 * Coin - Represents a collectible coin in the game
 */
export class Coin {
  constructor(x, y, value = 10) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.collected = false;
  }

  /**
   * Collect the coin
   * @returns {number} Value of coin, or 0 if already collected
   */
  collect() {
    if (this.collected) {
      return 0;
    }

    this.collected = true;
    return this.value;
  }

  /**
   * Check if coin is collected
   * @returns {boolean} True if collected
   */
  isCollected() {
    return this.collected;
  }

  /**
   * Get coin position
   * @returns {Object} Position {x, y}
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Check if coin is at given position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if at position
   */
  isAt(x, y) {
    return this.x === x && this.y === y;
  }

  /**
   * Get coin state
   * @returns {Object} Coin state
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      value: this.value,
      collected: this.collected,
    };
  }

  /**
   * Restore coin state
   * @param {Object} state - State object
   */
  setState(state) {
    this.x = state.x;
    this.y = state.y;
    this.value = state.value;
    this.collected = state.collected;
  }
}
