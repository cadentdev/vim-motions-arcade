/**
 * Score - Tracks player score and bonuses
 */
export class Score {
  constructor() {
    this.score = 0;
    this.coinsCollected = 0;
    this.bonuses = [];
  }

  /**
   * Get current score
   * @returns {number} Current score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get number of coins collected
   * @returns {number} Coins collected
   */
  getCoinsCollected() {
    return this.coinsCollected;
  }

  /**
   * Add points to score
   * @param {number} points - Points to add
   */
  addPoints(points) {
    if (points > 0) {
      this.score += points;
    }
  }

  /**
   * Collect a coin
   * @param {number} value - Coin value
   */
  collectCoin(value) {
    this.coinsCollected++;
    this.addPoints(value);
  }

  /**
   * Add a bonus
   * @param {number} value - Bonus value
   * @param {string} type - Bonus type
   */
  addBonus(value, type) {
    this.bonuses.push({ type, value });
    this.addPoints(value);
  }

  /**
   * Get all bonuses
   * @returns {Array} Array of bonus objects
   */
  getBonuses() {
    return this.bonuses;
  }

  /**
   * Reset score
   */
  reset() {
    this.score = 0;
    this.coinsCollected = 0;
    this.bonuses = [];
  }

  /**
   * Get score state
   * @returns {Object} Score state
   */
  getState() {
    // Calculate base score (without bonuses for state export)
    const baseScore =
      this.score - this.bonuses.reduce((sum, b) => sum + b.value, 0);

    return {
      score: baseScore,
      coinsCollected: this.coinsCollected,
      bonuses: this.bonuses,
    };
  }

  /**
   * Restore score state
   * @param {Object} state - State object
   */
  setState(state) {
    this.score = state.score;
    this.coinsCollected = state.coinsCollected;
    this.bonuses = state.bonuses;
  }
}
