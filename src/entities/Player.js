/**
 * Player - Represents the player cursor block
 */
export class Player {
  constructor(position, map) {
    this.map = map;

    // Set starting position
    if (position) {
      this.x = position.x;
      this.y = position.y;
    } else {
      this.x = 0;
      this.y = 0;
    }

    this.mode = 'normal';
    this.movementSpeed = 150; // ms for movement animation
    this.movementHistory = [];
  }

  /**
   * Get current position
   * @returns {Object} Position {x, y}
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Set position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Move player in a direction
   * @param {string} direction - Direction key (h, j, k, l)
   * @returns {Object} Movement result
   */
  move(direction) {
    let newX = this.x;
    let newY = this.y;
    let success = false;

    switch (direction) {
      case 'h': // left
        if (this.x > 0) {
          newX = this.x - 1;
          success = true;
        }
        break;

      case 'l': // right
        if (this.x < this.map.width - 1) {
          newX = this.x + 1;
          success = true;
        }
        break;

      case 'k': // up
        if (this.y > 0) {
          newY = this.y - 1;
          success = true;
        }
        break;

      case 'j': // down
        if (this.y < this.map.height - 1) {
          newY = this.y + 1;
          success = true;
        }
        break;

      default:
        return {
          success: false,
          error: `Invalid movement key: ${direction}`,
          newPosition: { x: this.x, y: this.y },
        };
    }

    // Update position if movement was valid
    if (success) {
      this.x = newX;
      this.y = newY;
      this.movementHistory.push(direction);
    }

    return {
      success,
      newPosition: { x: this.x, y: this.y },
      direction,
    };
  }

  /**
   * Get movement history
   * @returns {Array<string>} Array of movement keys
   */
  getMovementHistory() {
    return this.movementHistory;
  }

  /**
   * Clear movement history
   */
  clearMovementHistory() {
    this.movementHistory = [];
  }

  /**
   * Check if player is standing on a block
   * @returns {boolean} True if on a block
   */
  isOnBlock() {
    return this.getCurrentBlock() !== null;
  }

  /**
   * Get the block player is currently on
   * @returns {Object|null} Block object or null
   */
  getCurrentBlock() {
    if (!this.map || !this.map.blocks) {
      return null;
    }

    // Find block at current position
    const block = this.map.blocks.find((b) => {
      return this.y === b.y && this.x >= b.x && this.x < b.x + b.width;
    });

    return block || null;
  }

  /**
   * Get character position within current block
   * @returns {number} Character index within block, or -1 if not on a block
   */
  getCharacterPositionInBlock() {
    const block = this.getCurrentBlock();
    if (!block) {
      return -1;
    }

    return this.x - block.x;
  }

  /**
   * Get movement speed
   * @returns {number} Movement speed in milliseconds
   */
  getMovementSpeed() {
    return this.movementSpeed;
  }

  /**
   * Set movement speed
   * @param {number} speed - Speed in milliseconds
   */
  setMovementSpeed(speed) {
    this.movementSpeed = speed;
  }

  /**
   * Get player state
   * @returns {Object} Player state
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      mode: this.mode,
    };
  }

  /**
   * Restore player state
   * @param {Object} state - State object
   */
  setState(state) {
    this.x = state.x;
    this.y = state.y;
    this.mode = state.mode || 'normal';
  }
}
