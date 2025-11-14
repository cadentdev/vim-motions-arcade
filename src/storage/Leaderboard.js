/**
 * Leaderboard - Manages top scores in localStorage
 */
export class Leaderboard {
  constructor() {
    this.storageKey = 'vim-arcade-leaderboard';
    this.maxScores = 10;
  }

  /**
   * Add a score to the leaderboard
   * @param {Object} scoreEntry - { score, level, date }
   */
  addScore(scoreEntry) {
    const scores = this._loadScores();
    scores.push(scoreEntry);

    // Sort by score descending (highest first)
    scores.sort((a, b) => b.score - a.score);

    // Keep only top 10
    const topScores = scores.slice(0, this.maxScores);

    this._saveScores(topScores);
  }

  /**
   * Get top scores with rank numbers
   * @param {number} limit - Number of scores to return (default 10)
   * @returns {Array} Array of score entries with rank property
   */
  getTopScores(limit = this.maxScores) {
    const scores = this._loadScores();
    return scores.slice(0, limit).map((score, index) => ({
      ...score,
      rank: index + 1,
    }));
  }

  /**
   * Get the rank a given score would have
   * @param {number} score - The score to check
   * @returns {number} The rank (1-based)
   */
  getPlayerRank(score) {
    const scores = this._loadScores();
    let rank = 1;

    for (const entry of scores) {
      if (score > entry.score) {
        return rank;
      }
      rank++;
    }

    return rank;
  }

  /**
   * Clear all scores
   */
  clearLeaderboard() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Load scores from localStorage
   * @private
   * @returns {Array} Array of score entries
   */
  _loadScores() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      return [];
    }
  }

  /**
   * Save scores to localStorage
   * @private
   * @param {Array} scores - Array of score entries
   */
  _saveScores(scores) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(scores));
    } catch (error) {
      console.error('Failed to save leaderboard:', error);
    }
  }
}
