/**
 * TutorialLevel - Tutorial Level 0: "How to Quit Vim"
 * Teaches players the fundamental :q command
 */
export class TutorialLevel {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.completed = false;

    // Load completion status from save
    this._loadCompletionStatus();
  }

  /**
   * Get tutorial content
   * @returns {Object} Tutorial content with title and instructions
   */
  getContent() {
    return {
      title: 'Tutorial Level 0: How to Quit Vim',
      instructions: `
Welcome to Vim Motions Arcade!

Before you begin your journey mastering vim motions,
you must first learn the most important command of all:

How to quit vim.

╔════════════════════════════════════════╗
║  Type :q and press Enter to continue   ║
╚════════════════════════════════════════╝

(Press : to enter command mode, then type q and press Enter)
      `.trim(),
    };
  }

  /**
   * Get a hint for completing the tutorial
   * @returns {string} Hint message
   */
  getHint() {
    return 'Hint: Press : (colon) to enter command mode, then type "q" and press Enter';
  }

  /**
   * Handle a command entered by the player
   * @param {string} command - The command entered (without the colon)
   * @returns {Object} Result with completed status and message
   */
  handleCommand(command) {
    const normalizedCommand = command.trim().toLowerCase();

    // Check if it's a quit command
    if (normalizedCommand === 'q' || normalizedCommand === 'quit') {
      return {
        completed: true,
        message:
          "Success! You've learned how to quit vim. You're ready to begin your journey!",
        nextAction: 'main_menu',
      };
    }

    // Other valid commands don't complete the tutorial
    if (normalizedCommand === 'help') {
      return {
        completed: false,
        message: 'To complete this tutorial, type :q and press Enter',
        nextAction: null,
      };
    }

    // Unknown command
    return {
      completed: false,
      message: `Unknown command: ${command}. Try :q to quit, or :help for assistance.`,
      nextAction: null,
    };
  }

  /**
   * Mark the tutorial as complete and save
   */
  markComplete() {
    this.completed = true;
    this._saveCompletionStatus();
  }

  /**
   * Check if tutorial is completed
   * @returns {boolean} True if tutorial has been completed
   */
  isCompleted() {
    return this.completed;
  }

  /**
   * Load completion status from save manager
   * @private
   */
  _loadCompletionStatus() {
    const save = this.saveManager.loadGame();
    if (save && save.tutorialCompleted) {
      this.completed = true;
    } else {
      this.completed = false;
    }
  }

  /**
   * Save completion status via save manager
   * @private
   */
  _saveCompletionStatus() {
    const save = this.saveManager.loadGame() || {};
    save.tutorialCompleted = this.completed;
    this.saveManager.saveGame(save);
  }

  /**
   * Reset tutorial completion status
   */
  reset() {
    this.completed = false;
    this._saveCompletionStatus();
  }
}
