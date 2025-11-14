/**
 * PlayerRenderer - Visual cursor rendering system
 *
 * Renders the player cursor as a DOM element with smooth transitions.
 * Provides character-grid-based positioning aligned with MapRenderer.
 */
export class PlayerRenderer {
  constructor() {
    this.container = null;
    this.cursorElement = null;
    this.characterWidth = 10; // pixels per character (match MapRenderer)
    this.characterHeight = 16; // pixels per line (match MapRenderer)
  }

  /**
   * Set the DOM container for rendering
   * @param {HTMLElement} container - The container element
   */
  setContainer(container) {
    // eslint-disable-next-line no-undef
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('Container must be a valid DOM element');
    }

    this.container = container;
  }

  /**
   * Render cursor at specified grid position
   * @param {number} x - X coordinate (in characters)
   * @param {number} y - Y coordinate (in lines)
   */
  renderCursor(x, y) {
    if (!this.container) {
      throw new Error('Cannot render cursor: container not set');
    }

    // Validate coordinates
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Invalid coordinates: x and y must be numbers');
    }

    // Create cursor element if it doesn't exist
    if (!this.cursorElement) {
      this.cursorElement = document.createElement('div');
      this.cursorElement.className = 'player-cursor';
      this.cursorElement.style.position = 'absolute';
      this.cursorElement.style.fontFamily = 'Courier New, monospace';
      this.cursorElement.style.zIndex = '2'; // Above map (0) and coins (1)
      this.cursorElement.style.width = `${this.characterWidth}px`;
      this.cursorElement.style.height = `${this.characterHeight}px`;
      this.cursorElement.style.transition =
        'left 0.15s ease-out, top 0.15s ease-out';
      this.cursorElement.textContent = '█'; // Block character for cursor
      this.container.appendChild(this.cursorElement);
    }

    // Update cursor position
    this.cursorElement.style.left = `${x * this.characterWidth}px`;
    this.cursorElement.style.top = `${y * this.characterHeight}px`;
  }

  /**
   * Remove cursor from the container
   */
  clearCursor() {
    if (this.cursorElement && this.cursorElement.parentNode) {
      this.cursorElement.parentNode.removeChild(this.cursorElement);
      this.cursorElement = null;
    }
  }

  /**
   * Get the character size configuration
   * @returns {Object} Character dimensions
   */
  getCharacterSize() {
    return {
      width: this.characterWidth,
      height: this.characterHeight,
    };
  }

  /**
   * Set custom character size (for different zoom levels)
   * @param {number} width - Character width in pixels
   * @param {number} height - Character height in pixels
   */
  setCharacterSize(width, height) {
    this.characterWidth = width;
    this.characterHeight = height;

    // Update cursor element size if it exists
    if (this.cursorElement) {
      this.cursorElement.style.width = `${width}px`;
      this.cursorElement.style.height = `${height}px`;
    }
  }
}
