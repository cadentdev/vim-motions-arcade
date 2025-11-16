/**
 * StatusBar - Displays current mode (NORMAL/COMMAND) and messages
 * Similar to Vim's status line
 */
export class StatusBar {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.currentMode = 'NORMAL';

    this._createElements();
  }

  /**
   * Create and append DOM elements for status bar
   * @private
   */
  _createElements() {
    this.element = document.createElement('div');
    this.element.className = 'status-bar';
    this.element.textContent = this._formatMode(this.currentMode);
    this.container.appendChild(this.element);
  }

  /**
   * Format mode text with dashes (Vim style)
   * @private
   * @param {string} mode - The mode name
   * @returns {string} Formatted mode text
   */
  _formatMode(mode) {
    return `-- ${mode} --`;
  }

  /**
   * Set the current mode
   * @param {string} mode - The mode to display (e.g., 'NORMAL', 'COMMAND')
   */
  setMode(mode) {
    this.currentMode = mode;
    this.element.classList.remove('error');
    this.element.textContent = this._formatMode(mode);
  }

  /**
   * Show a temporary message
   * @param {string} message - The message to display
   */
  showMessage(message) {
    this.element.classList.remove('error');
    this.element.textContent = message;
  }

  /**
   * Show an error message
   * @param {string} message - The error message to display
   */
  showError(message) {
    this.element.classList.add('error');
    this.element.textContent = message;
  }

  /**
   * Clear message and return to mode display
   */
  clearMessage() {
    this.element.classList.remove('error');
    this.element.textContent = this._formatMode(this.currentMode);
  }

  /**
   * Hide the status bar
   */
  hide() {
    this.element.classList.add('hidden');
  }

  /**
   * Show the status bar
   */
  show() {
    this.element.classList.remove('hidden');
  }

  /**
   * Check if status bar is visible
   * @returns {boolean} True if visible
   */
  isVisible() {
    return !this.element.classList.contains('hidden');
  }

  /**
   * Destroy the status bar and clean up
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }
}
