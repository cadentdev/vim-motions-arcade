/**
 * MapGenerator - Procedurally generates document-like maps
 */
export class MapGenerator {
  constructor(options = {}) {
    this.width = options.width || 40;
    this.height = options.height || 20;
    this.difficulty = options.difficulty || 1;
    this.seed = options.seed || null;
    this.rng = this._createRNG(this.seed);
  }

  /**
   * Generate a new map
   * @returns {Object} Map object with blocks and coin positions
   */
  generate() {
    const blocks = [];
    const coinPositions = [];

    // Generate "document" with word-like blocks
    let currentY = 0;

    while (currentY < this.height) {
      // Decide if this line should be blank (paragraph break)
      if (this._random() < 0.2 && currentY > 0) {
        // Blank line
        currentY++;
        continue;
      }

      // Generate words on this line
      let currentX = 0;
      const wordsOnLine =
        2 + Math.floor(this._random() * (4 + this.difficulty));

      for (let w = 0; w < wordsOnLine; w++) {
        // Random word width (3-10 characters)
        const wordWidth = 3 + Math.floor(this._random() * 8);

        // Check if word fits on line
        if (currentX + wordWidth >= this.width) {
          break;
        }

        // Create block
        const block = {
          x: currentX,
          y: currentY,
          width: wordWidth,
          text: this._generateWordText(wordWidth),
        };

        blocks.push(block);

        // Add coin positions at word boundaries
        coinPositions.push({ x: currentX, y: currentY }); // Start of word
        coinPositions.push({ x: currentX + wordWidth - 1, y: currentY }); // End of word

        // Space between words (1-2 characters)
        currentX += wordWidth + 1 + Math.floor(this._random() * 2);
      }

      currentY++;
    }

    return {
      width: this.width,
      height: this.height,
      blocks,
      coinPositions,
    };
  }

  /**
   * Generate random text for a word block
   * @private
   * @param {number} length - Length of the word
   * @returns {string} Random word text
   */
  _generateWordText(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += chars[Math.floor(this._random() * chars.length)];
    }
    return text;
  }

  /**
   * Create a random number generator (optionally seeded)
   * @private
   * @param {number|null} seed - Optional seed for deterministic generation
   * @returns {Object} RNG object with next() method
   */
  _createRNG(seed) {
    if (seed !== null) {
      // Simple seeded RNG (Mulberry32)
      let state = seed;
      return {
        next: () => {
          state |= 0;
          state = (state + 0x6d2b79f5) | 0;
          let t = Math.imul(state ^ (state >>> 15), 1 | state);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
      };
    } else {
      // Use Math.random
      return {
        next: () => Math.random(),
      };
    }
  }

  /**
   * Get next random number from RNG
   * @private
   * @returns {number} Random number between 0 and 1
   */
  _random() {
    return this.rng.next();
  }
}
