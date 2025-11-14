/**
 * CommandModeUI - Handles rendering of command mode overlay and feedback
 */
export class CommandModeUI {
  constructor(container) {
    this.container = container;
    this.overlay = null;
    this.inputDisplay = null;
    this.feedbackDisplay = null;
    this.feedbackTimeout = null;

    this._createElements();
  }

  /**
   * Create and append DOM elements for command mode UI
   * @private
   */
  _createElements() {
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.className = 'command-mode-overlay hidden';

    // Create command input display
    this.inputDisplay = document.createElement('div');
    this.inputDisplay.className = 'command-input';
    this.inputDisplay.textContent = ':';

    // Create feedback message display
    this.feedbackDisplay = document.createElement('div');
    this.feedbackDisplay.className = 'command-feedback hidden';

    // Assemble structure
    this.overlay.appendChild(this.inputDisplay);
    this.overlay.appendChild(this.feedbackDisplay);

    // Append to container
    this.container.appendChild(this.overlay);
  }

  /**
   * Show the command mode overlay
   */
  show() {
    this.overlay.classList.remove('hidden');
    this.updateInput('');
  }

  /**
   * Hide the command mode overlay
   */
  hide() {
    this.overlay.classList.add('hidden');
    this.updateInput('');
    this.clearFeedback();
  }

  /**
   * Check if overlay is visible
   * @returns {boolean} True if overlay is visible
   */
  isVisible() {
    return !this.overlay.classList.contains('hidden');
  }

  /**
   * Update the command input display
   * @param {string} buffer - The current command buffer
   */
  updateInput(buffer) {
    this.inputDisplay.textContent = ':' + buffer;
  }

  /**
   * Show feedback message
   * @param {string} message - The message to display
   * @param {string} type - Message type ('success' or 'error')
   * @param {number} duration - How long to show message (ms), 0 = permanent
   */
  showFeedback(message, type = 'success', duration = 2000) {
    // Clear any existing timeout
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    // Clear previous type classes
    this.feedbackDisplay.classList.remove('success', 'error');

    // Set message and type
    this.feedbackDisplay.textContent = message;
    this.feedbackDisplay.classList.add(type);
    this.feedbackDisplay.classList.remove('hidden');

    // Auto-clear after duration if specified
    if (duration > 0) {
      this.feedbackTimeout = setTimeout(() => {
        this.clearFeedback();
      }, duration);
    }
  }

  /**
   * Clear feedback message
   */
  clearFeedback() {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    this.feedbackDisplay.textContent = '';
    this.feedbackDisplay.classList.remove('success', 'error');
    this.feedbackDisplay.classList.add('hidden');
  }

  /**
   * Destroy the UI and clean up
   */
  destroy() {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
