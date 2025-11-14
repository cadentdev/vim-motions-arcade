/**
 * CoinRenderer - Coin visualization system
 *
 * Renders coins as DOM elements with visibility management based on collection state.
 * Provides character-grid-based positioning aligned with MapRenderer and PlayerRenderer.
 */
export class CoinRenderer {
  constructor() {
    this.container = null;
    this.coinElements = []; // Array of DOM elements for each coin
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
   * Render coins from array
   * @param {Array} coins - Array of coin objects {x, y, collected}
   */
  renderCoins(coins) {
    if (!this.container) {
      throw new Error('Cannot render coins: container not set');
    }

    // Validate coin data
    if (!Array.isArray(coins)) {
      throw new Error('Coins must be an array');
    }

    // Validate each coin has required properties
    coins.forEach((coin, index) => {
      if (
        typeof coin.x !== 'number' ||
        typeof coin.y !== 'number' ||
        typeof coin.collected !== 'boolean'
      ) {
        throw new Error(
          `Invalid coin at index ${index}: must have x (number), y (number), and collected (boolean)`
        );
      }
    });

    // Remove excess elements if we have more than needed
    while (this.coinElements.length > coins.length) {
      const element = this.coinElements.pop();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    // Create or update coin elements
    coins.forEach((coin, index) => {
      let element = this.coinElements[index];

      // Create new element if needed
      if (!element) {
        element = document.createElement('div');
        element.className = 'coin';
        element.style.position = 'absolute';
        element.style.fontFamily = 'Courier New, monospace';
        element.style.zIndex = '1'; // Above map (0), below player (2)
        element.style.width = `${this.characterWidth}px`;
        element.style.height = `${this.characterHeight}px`;
        element.textContent = '◆'; // Diamond character for coin
        this.container.appendChild(element);
        this.coinElements[index] = element;
      }

      // Update position
      element.style.left = `${coin.x * this.characterWidth}px`;
      element.style.top = `${coin.y * this.characterHeight}px`;

      // Update visibility based on collected state
      if (coin.collected) {
        element.style.display = 'none';
      } else {
        element.style.display = 'block';
      }
    });
  }

  /**
   * Remove all coins from the container
   */
  clearCoins() {
    this.coinElements.forEach((element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.coinElements = [];
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

    // Update existing coin elements
    this.coinElements.forEach((element) => {
      if (element) {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      }
    });
  }
}
