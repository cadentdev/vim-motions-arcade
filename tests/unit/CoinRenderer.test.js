/**
 * CoinRenderer Tests
 */
/* global performance */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CoinRenderer } from '../../src/rendering/CoinRenderer.js';

describe('CoinRenderer', () => {
  let renderer;
  let mockContainer;

  beforeEach(() => {
    // Create a mock DOM container
    mockContainer = document.createElement('div');
    mockContainer.id = 'test-game-area';
    document.body.appendChild(mockContainer);

    renderer = new CoinRenderer();
  });

  afterEach(() => {
    // Clean up DOM
    if (mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });

  describe('Initialization', () => {
    it('should initialize without a container', () => {
      expect(renderer).toBeDefined();
      expect(renderer.container).toBeNull();
    });

    it('should set container when provided', () => {
      renderer.setContainer(mockContainer);
      expect(renderer.container).toBe(mockContainer);
    });

    it('should throw error if container is not a DOM element', () => {
      expect(() => renderer.setContainer('not-an-element')).toThrow();
      expect(() => renderer.setContainer(null)).toThrow();
      expect(() => renderer.setContainer({})).toThrow();
    });

    it('should initialize with default character size', () => {
      const charSize = renderer.getCharacterSize();
      expect(charSize.width).toBe(10); // Match MapRenderer & PlayerRenderer
      expect(charSize.height).toBe(16);
    });
  });

  describe('Coin Rendering', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render coins from array', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: false },
      ];

      renderer.renderCoins(coins);

      const coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(2);
    });

    it('should position coins correctly based on character grid', () => {
      const coins = [{ x: 10, y: 5, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      expect(coinElement.style.left).toBe('100px'); // 10 * 10px
      expect(coinElement.style.top).toBe('80px'); // 5 * 16px
    });

    it('should apply correct z-index for layering', () => {
      const coins = [{ x: 0, y: 0, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      // Coins should be z-index 1 (above map at 0, below player at 2)
      expect(coinElement.style.zIndex).toBe('1');
    });

    it('should apply distinct visual styling', () => {
      const coins = [{ x: 0, y: 0, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      expect(coinElement.classList.contains('coin')).toBe(true);
      expect(coinElement.style.position).toBe('absolute');
    });

    it('should render coins with correct size', () => {
      const coins = [{ x: 0, y: 0, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      expect(coinElement.style.width).toBe('10px');
      expect(coinElement.style.height).toBe('16px');
    });

    it('should display coin character or symbol', () => {
      const coins = [{ x: 0, y: 0, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      // Coin should display a character (e.g., ◆, ●, $, or similar)
      expect(coinElement.textContent).toBeTruthy();
    });

    it('should use monospace font', () => {
      const coins = [{ x: 0, y: 0, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      expect(coinElement.style.fontFamily).toContain('monospace');
    });
  });

  describe('Collected Coins', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should hide collected coins', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: true }, // This one is collected
      ];

      renderer.renderCoins(coins);

      const coinElements = mockContainer.querySelectorAll('.coin');
      // Second coin should be hidden (display: none or visibility: hidden)
      expect(
        coinElements[1].style.display === 'none' ||
          coinElements[1].style.visibility === 'hidden'
      ).toBe(true);
    });

    it('should show uncollected coins', () => {
      const coins = [{ x: 5, y: 3, collected: false }];

      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      // Should be visible (not display: none or visibility: hidden)
      expect(coinElement.style.display).not.toBe('none');
      expect(coinElement.style.visibility).not.toBe('hidden');
    });

    it('should update coin visibility when collection state changes', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: false },
      ];

      renderer.renderCoins(coins);
      let coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements[1].style.display).not.toBe('none');

      // Update second coin to collected
      coins[1].collected = true;
      renderer.renderCoins(coins);

      coinElements = mockContainer.querySelectorAll('.coin');
      expect(
        coinElements[1].style.display === 'none' ||
          coinElements[1].style.visibility === 'hidden'
      ).toBe(true);
    });
  });

  describe('DOM Element Management', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should reuse existing DOM elements when re-rendering', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: false },
      ];

      renderer.renderCoins(coins);
      const firstRenderElements = mockContainer.querySelectorAll('.coin');
      const firstElement = firstRenderElements[0];

      // Re-render with same coins
      renderer.renderCoins(coins);
      const secondRenderElements = mockContainer.querySelectorAll('.coin');

      // Should reuse the same DOM element
      expect(secondRenderElements[0]).toBe(firstElement);
      expect(secondRenderElements.length).toBe(2);
    });

    it('should handle empty coin array', () => {
      const coins = [];

      renderer.renderCoins(coins);

      const coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(0);
    });

    it('should clear coins when rendering empty array after coins exist', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: false },
      ];

      renderer.renderCoins(coins);
      let coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(2);

      // Render empty array
      renderer.renderCoins([]);
      coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(0);
    });
  });

  describe('Clear Coins', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should remove all coins from container', () => {
      const coins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: false },
      ];

      renderer.renderCoins(coins);
      expect(mockContainer.querySelectorAll('.coin').length).toBe(2);

      renderer.clearCoins();
      expect(mockContainer.querySelectorAll('.coin').length).toBe(0);
    });

    it('should not error if coins are already cleared', () => {
      expect(() => renderer.clearCoins()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw error if rendering without container', () => {
      const coins = [{ x: 0, y: 0, collected: false }];
      expect(() => renderer.renderCoins(coins)).toThrow(/container/i);
    });

    it('should validate coin data structure', () => {
      renderer.setContainer(mockContainer);

      // Should handle malformed coin objects gracefully
      const invalidCoins = [
        { x: 5 }, // Missing y and collected
        { y: 3 }, // Missing x and collected
        {},
      ];

      // Should either skip invalid coins or throw error
      expect(() => renderer.renderCoins(invalidCoins)).toThrow();
    });
  });

  describe('Character Size Configuration', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should allow custom character size', () => {
      renderer.setCharacterSize(12, 20);

      const charSize = renderer.getCharacterSize();
      expect(charSize.width).toBe(12);
      expect(charSize.height).toBe(20);
    });

    it('should update coin positions based on new character size', () => {
      const coins = [{ x: 5, y: 3, collected: false }];

      renderer.setCharacterSize(12, 20);
      renderer.renderCoins(coins);

      const coinElement = mockContainer.querySelector('.coin');
      expect(coinElement.style.left).toBe('60px'); // 5 * 12px
      expect(coinElement.style.top).toBe('60px'); // 3 * 20px
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should handle many coins efficiently', () => {
      const coins = [];
      for (let i = 0; i < 100; i++) {
        coins.push({ x: i, y: i, collected: false });
      }

      const startTime = performance.now();
      renderer.renderCoins(coins);
      const endTime = performance.now();

      const coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(100);

      // Should render in reasonable time (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Integration with GameState', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render coins from GameState format', () => {
      // GameState stores coins as array with x, y, collected properties
      const gameStateCoins = [
        { x: 5, y: 3, collected: false },
        { x: 10, y: 8, collected: true },
        { x: 15, y: 12, collected: false },
      ];

      renderer.renderCoins(gameStateCoins);

      const coinElements = mockContainer.querySelectorAll('.coin');
      expect(coinElements.length).toBe(3);

      // First coin should be visible
      expect(coinElements[0].style.display).not.toBe('none');

      // Second coin should be hidden (collected)
      expect(
        coinElements[1].style.display === 'none' ||
          coinElements[1].style.visibility === 'hidden'
      ).toBe(true);

      // Third coin should be visible
      expect(coinElements[2].style.display).not.toBe('none');
    });
  });
});
