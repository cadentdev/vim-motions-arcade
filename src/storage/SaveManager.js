/**
 * SaveManager - Handles saving and loading game state to localStorage
 */
export class SaveManager {
  constructor() {
    this.saveKey = 'vim-arcade-save';
  }

  /**
   * Save game state to localStorage
   * @param {Object} gameState - The game state to save
   */
  saveGame(gameState) {
    try {
      const serialized = JSON.stringify(gameState);
      localStorage.setItem(this.saveKey, serialized);
    } catch (error) {
      console.error('Failed to save game:', error);
      throw error;
    }
  }

  /**
   * Load game state from localStorage
   * @returns {Object|null} The saved game state, or null if no save exists
   */
  loadGame() {
    try {
      const serialized = localStorage.getItem(this.saveKey);

      if (!serialized) {
        return null;
      }

      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load game (corrupted save data):', error);
      return null;
    }
  }

  /**
   * Check if a save file exists
   * @returns {boolean} True if a save exists
   */
  hasSave() {
    return localStorage.getItem(this.saveKey) !== null;
  }

  /**
   * Delete the saved game
   */
  deleteSave() {
    localStorage.removeItem(this.saveKey);
  }
}
