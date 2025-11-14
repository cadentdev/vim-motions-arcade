/**
 * MapRenderer - DOM-based map rendering system
 *
 * Renders map blocks as DOM elements with monospace font alignment.
 * Provides viewport/camera system for centering view on player.
 */
export class MapRenderer {
  constructor() {
    this.container = null;
    this.blockElements = new Map(); // Cache DOM elements by block key
    this.characterWidth = 10; // pixels per character (monospace)
    this.characterHeight = 16; // pixels per line
    this.viewportWidth = 0;
    this.viewportHeight = 0;
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

    // Calculate viewport dimensions
    const rect = container.getBoundingClientRect();
    this.viewportWidth = rect.width || 400;
    this.viewportHeight = rect.height || 300;
  }

  /**
   * Render map blocks from data
   * @param {Object} mapData - Map data from MapGenerator
   * @param {Array} mapData.blocks - Array of block objects
   * @param {number} mapData.width - Map width in characters
   * @param {number} mapData.height - Map height in lines
   */
  renderMap(mapData) {
    if (!this.container) {
      throw new Error('Cannot render map: container not set');
    }

    if (!mapData || !Array.isArray(mapData.blocks)) {
      throw new Error('Invalid map data: blocks array is required');
    }

    if (
      typeof mapData.width !== 'number' ||
      typeof mapData.height !== 'number'
    ) {
      throw new Error('Invalid map data: width and height are required');
    }

    // Clear existing blocks that are no longer in the map
    this.clearMap();

    // Render each block
    mapData.blocks.forEach((block, index) => {
      this.renderBlock(block, index);
    });
  }

  /**
   * Render a single block
   * @param {Object} block - Block data
   * @param {number} index - Block index for keying
   */
  renderBlock(block, index) {
    // Validate block data
    if (
      typeof block.x !== 'number' ||
      typeof block.y !== 'number' ||
      typeof block.width !== 'number'
    ) {
      // Skip invalid blocks
      return;
    }

    const key = `block-${index}`;
    let element = this.blockElements.get(key);

    // Create element if it doesn't exist
    if (!element) {
      element = document.createElement('div');
      element.className = 'map-block';
      element.style.position = 'absolute';
      element.style.fontFamily = 'Courier New, monospace';
      element.style.whiteSpace = 'pre';
      element.style.zIndex = '0';
      this.container.appendChild(element);
      this.blockElements.set(key, element);
    }

    // Update element content and position
    element.textContent = block.text || '';
    element.style.left = `${block.x * this.characterWidth}px`;
    element.style.top = `${block.y * this.characterHeight}px`;
  }

  /**
   * Clear all map blocks from the container
   */
  clearMap() {
    // Remove all cached block elements
    this.blockElements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    this.blockElements.clear();
  }

  /**
   * Center viewport on player position
   * @param {number} playerX - Player X coordinate (in characters)
   * @param {number} playerY - Player Y coordinate (in lines)
   */
  centerOnPlayer(playerX, playerY) {
    if (!this.container) {
      return;
    }

    // Calculate the pixel position of the player
    const playerPixelX = playerX * this.characterWidth;
    const playerPixelY = playerY * this.characterHeight;

    // Calculate the scroll position to center the player in the viewport
    const targetScrollX = playerPixelX - this.viewportWidth / 2;
    const targetScrollY = playerPixelY - this.viewportHeight / 2;

    // Apply scroll (using transform for smooth scrolling)
    // Clamp to map boundaries (prevent scrolling beyond edges)
    const clampedX = Math.max(0, targetScrollX);
    const clampedY = Math.max(0, targetScrollY);

    // Use CSS transform for smooth, GPU-accelerated scrolling
    this.container.style.transform = `translate(${-clampedX}px, ${-clampedY}px)`;
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
  }
}
