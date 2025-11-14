/**
 * ScreenManager - Manages game screen states and transitions
 */
export class ScreenManager {
  constructor() {
    // Define all valid screen states
    this.SCREENS = {
      MAIN_MENU: 'MAIN_MENU',
      PLAYING: 'PLAYING',
      LEVEL_COMPLETE: 'LEVEL_COMPLETE',
      LEVEL_FAILED: 'LEVEL_FAILED',
    };

    // Initialize with main menu
    this.currentScreen = this.SCREENS.MAIN_MENU;

    // Callbacks for screen lifecycle
    this.enterCallbacks = {};
    this.exitCallbacks = {};

    // Cleanup functions for current screen
    this.cleanupFunctions = [];
  }

  /**
   * Switch to a different screen
   * @param {string} screenName - The name of the screen to switch to
   * @throws {Error} If screen name is invalid
   */
  switchTo(screenName) {
    // Validate screen name
    if (!this.SCREENS[screenName]) {
      throw new Error(`Invalid screen: ${screenName}`);
    }

    const previousScreen = this.currentScreen;

    // Call exit callbacks for current screen
    if (this.exitCallbacks[previousScreen]) {
      this.exitCallbacks[previousScreen].forEach((callback) => callback());
    }

    // Run cleanup functions
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];

    // Update current screen
    this.currentScreen = screenName;

    // Call enter callbacks for new screen
    if (this.enterCallbacks[screenName]) {
      this.enterCallbacks[screenName].forEach((callback) => callback());
    }
  }

  /**
   * Register a callback to run when entering a screen
   * @param {string} screenName - The screen name
   * @param {Function} callback - The callback function
   */
  onScreenEnter(screenName, callback) {
    if (!this.enterCallbacks[screenName]) {
      this.enterCallbacks[screenName] = [];
    }
    this.enterCallbacks[screenName].push(callback);
  }

  /**
   * Register a callback to run when exiting a screen
   * @param {string} screenName - The screen name
   * @param {Function} callback - The callback function
   */
  onScreenExit(screenName, callback) {
    if (!this.exitCallbacks[screenName]) {
      this.exitCallbacks[screenName] = [];
    }
    this.exitCallbacks[screenName].push(callback);
  }

  /**
   * Register a cleanup function for the current screen
   * Will be called when switching away from current screen
   * @param {Function} cleanupFn - The cleanup function
   */
  registerCleanup(cleanupFn) {
    this.cleanupFunctions.push(cleanupFn);
  }
}
