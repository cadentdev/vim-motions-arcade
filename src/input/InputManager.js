/**
 * InputManager - Keyboard input handling system
 *
 * Manages keyboard events for movement, command mode, and other inputs.
 * Provides enable/disable functionality and key blocking.
 */
export class InputManager {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.isEnabled = false;
    this.blockedKeys = new Set();

    // Bind event handler to preserve 'this' context
    this.handleKeyDown = this.handleKeyDown.bind(this);

    // Movement keys
    this.movementKeys = new Set(['h', 'j', 'k', 'l']);
  }

  /**
   * Enable input handling
   */
  enable() {
    if (this.isEnabled) {
      return; // Already enabled
    }

    this.isEnabled = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Disable input handling
   */
  disable() {
    if (!this.isEnabled) {
      return; // Already disabled
    }

    this.isEnabled = false;
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    if (!this.isEnabled) {
      return;
    }

    // Ignore keys with modifiers (Ctrl, Alt, Meta)
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    const key = event.key.toLowerCase();

    // Check if key is blocked
    if (this.blockedKeys.has(key)) {
      return;
    }

    // Handle movement keys (hjkl)
    if (this.movementKeys.has(key)) {
      event.preventDefault();
      if (this.callbacks.onMove) {
        this.callbacks.onMove(key);
      }
      return;
    }

    // Handle command mode (:)
    if (event.key === ':') {
      event.preventDefault();
      if (this.callbacks.onCommandMode) {
        this.callbacks.onCommandMode();
      }
      return;
    }

    // Handle Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.callbacks.onEscape) {
        this.callbacks.onEscape();
      }
      return;
    }
  }

  /**
   * Block specific keys from being processed
   * @param {Array<string>} keys - Array of key names to block
   */
  blockKeys(keys) {
    keys.forEach((key) => this.blockedKeys.add(key.toLowerCase()));
  }

  /**
   * Unblock specific keys
   * @param {Array<string>} keys - Array of key names to unblock
   */
  unblockKeys(keys) {
    keys.forEach((key) => this.blockedKeys.delete(key.toLowerCase()));
  }

  /**
   * Clear all blocked keys
   */
  clearBlockedKeys() {
    this.blockedKeys.clear();
  }
}
