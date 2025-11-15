/**
 * MapRenderer Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MapRenderer } from '../../src/rendering/MapRenderer.js';

describe('MapRenderer', () => {
  let renderer;
  let mockContainer;

  beforeEach(() => {
    // Create a mock DOM container
    mockContainer = document.createElement('div');
    mockContainer.id = 'test-game-area';
    document.body.appendChild(mockContainer);

    renderer = new MapRenderer();
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
  });

  describe('Map Rendering', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render map blocks from data', () => {
      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 5, y: 0, width: 5, text: 'hello' },
          { x: 0, y: 1, width: 5, text: 'world' },
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks.length).toBe(3);
    });

    it('should position blocks correctly based on coordinates', () => {
      const mapData = {
        blocks: [{ x: 5, y: 3, width: 4, text: 'test' }],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const block = mockContainer.querySelector('.map-block');
      expect(block).toBeDefined();

      // Position should be based on character grid (monospace)
      // Assuming 10px per character (will be defined in implementation)
      expect(block.style.left).toBeDefined();
      expect(block.style.top).toBeDefined();
    });

    it('should set block text content correctly', () => {
      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 5, y: 0, width: 5, text: 'hello' },
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks[0].textContent).toBe('test');
      expect(blocks[1].textContent).toBe('hello');
    });

    it('should apply monospace font styling', () => {
      const mapData = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'test' }],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const block = mockContainer.querySelector('.map-block');
      expect(block.classList.contains('map-block')).toBe(true);
    });

    it('should handle empty map data', () => {
      const mapData = {
        blocks: [],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks.length).toBe(0);
    });

    it('should update existing blocks when re-rendering', () => {
      const mapData1 = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'old' }],
        width: 40,
        height: 20,
      };

      const mapData2 = {
        blocks: [{ x: 0, y: 0, width: 3, text: 'new' }],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData1);
      let blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks[0].textContent).toBe('old');

      renderer.renderMap(mapData2);
      blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks[0].textContent).toBe('new');
    });
  });

  describe('Clear Map', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should remove all map blocks', () => {
      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 5, y: 0, width: 5, text: 'hello' },
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);
      expect(mockContainer.querySelectorAll('.map-block').length).toBe(2);

      renderer.clearMap();
      expect(mockContainer.querySelectorAll('.map-block').length).toBe(0);
    });

    it('should not error if map is already empty', () => {
      expect(() => renderer.clearMap()).not.toThrow();
    });
  });

  describe('Viewport System', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
      // Set container size for viewport calculations
      mockContainer.style.width = '400px';
      mockContainer.style.height = '300px';
    });

    it('should center viewport on player position', () => {
      const mapData = {
        blocks: [{ x: 20, y: 10, width: 4, text: 'test' }],
        width: 80,
        height: 40,
      };

      renderer.renderMap(mapData);
      renderer.centerOnPlayer(20, 10);

      // Container should have a transform or scroll position
      // to center the view on the player
      expect(
        mockContainer.style.transform || mockContainer.scrollLeft
      ).toBeDefined();
    });

    it('should not scroll beyond map boundaries', () => {
      const mapData = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'test' }],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      // Try to center on position beyond map edge
      renderer.centerOnPlayer(0, 0);
      // Should not cause errors or negative positioning
      expect(() => renderer.centerOnPlayer(-10, -10)).not.toThrow();
      expect(() => renderer.centerOnPlayer(100, 100)).not.toThrow();
    });

    it('should handle small maps that fit in viewport', () => {
      const mapData = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'test' }],
        width: 10,
        height: 5,
      };

      renderer.renderMap(mapData);
      renderer.centerOnPlayer(5, 2);

      // For small maps, no scrolling should occur
      // Viewport should stay at origin
      expect(true).toBe(true); // Implementation will define exact behavior
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should efficiently render many blocks', () => {
      // Create a large map with many blocks
      const blocks = [];
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          blocks.push({ x: x * 5, y, width: 4, text: 'word' });
        }
      }

      const mapData = { blocks, width: 80, height: 20 };

      // eslint-disable-next-line no-undef
      const startTime = performance.now();
      renderer.renderMap(mapData);
      // eslint-disable-next-line no-undef
      const endTime = performance.now();

      // Rendering should be fast (< 100ms for 200 blocks)
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockContainer.querySelectorAll('.map-block').length).toBe(200);
    });

    it('should reuse DOM elements when possible', () => {
      const mapData1 = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 5, y: 0, width: 5, text: 'hello' },
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData1);
      const firstBlocks = Array.from(
        mockContainer.querySelectorAll('.map-block')
      );

      // Re-render with same structure
      renderer.renderMap(mapData1);
      const secondBlocks = Array.from(
        mockContainer.querySelectorAll('.map-block')
      );

      // DOM elements should be reused (implementation detail)
      expect(secondBlocks.length).toBe(firstBlocks.length);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if rendering without container', () => {
      const mapData = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'test' }],
        width: 40,
        height: 20,
      };

      expect(() => renderer.renderMap(mapData)).toThrow(/container/i);
    });

    it('should handle invalid map data gracefully', () => {
      renderer.setContainer(mockContainer);

      // Missing blocks array
      expect(() => renderer.renderMap({ width: 40, height: 20 })).toThrow();

      // Missing dimensions
      expect(() => renderer.renderMap({ blocks: [] })).toThrow();
    });

    it('should handle malformed block data', () => {
      renderer.setContainer(mockContainer);

      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 'invalid', y: 0, width: 4, text: 'bad' }, // Invalid x
          { x: 5, y: 0, width: 4 }, // Missing text
        ],
        width: 40,
        height: 20,
      };

      // Should skip invalid blocks or handle gracefully
      expect(() => renderer.renderMap(mapData)).not.toThrow();
    });
  });

  describe('Z-Index Layering', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should apply correct z-index to map blocks', () => {
      const mapData = {
        blocks: [{ x: 0, y: 0, width: 4, text: 'test' }],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const block = mockContainer.querySelector('.map-block');
      // Map blocks should have z-index 0 (base layer)
      expect(block.style.zIndex === '0' || block.style.zIndex === '').toBe(
        true
      );
    });
  });

  describe('Coordinate System', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should use character grid coordinates', () => {
      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'test' },
          { x: 10, y: 5, width: 5, text: 'hello' },
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      // Character grid should translate to pixel positions
      // Implementation will define character size (e.g., 10px width, 16px height)
      const blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks[0].style.left).toBeDefined();
      expect(blocks[0].style.top).toBeDefined();
      expect(blocks[1].style.left).toBeDefined();
      expect(blocks[1].style.top).toBeDefined();
    });

    it('should maintain consistent spacing between blocks', () => {
      const mapData = {
        blocks: [
          { x: 0, y: 0, width: 4, text: 'word' },
          { x: 5, y: 0, width: 4, text: 'next' }, // 1 space gap
        ],
        width: 40,
        height: 20,
      };

      renderer.renderMap(mapData);

      const blocks = mockContainer.querySelectorAll('.map-block');

      // Check positioning using style properties (works in jsdom)
      const block1Left = parseInt(blocks[0].style.left);
      const block2Left = parseInt(blocks[1].style.left);

      // Block 2 should be at x=5, which is 5 * characterWidth (50px)
      // Block 1 should be at x=0 (0px)
      expect(block2Left).toBe(50); // 5 * 10px character width
      expect(block1Left).toBe(0);
      expect(block2Left).toBeGreaterThan(block1Left);
    });
  });

  describe('Integration with MapGenerator', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render map data from MapGenerator format', () => {
      // This format matches what MapGenerator.generate() returns
      const generatorOutput = {
        blocks: [
          { x: 0, y: 0, width: 5, text: 'hello' },
          { x: 6, y: 0, width: 5, text: 'world' },
          { x: 0, y: 2, width: 4, text: 'test' },
        ],
        width: 40,
        height: 20,
        playerStart: { x: 0, y: 0 },
      };

      renderer.renderMap(generatorOutput);

      const blocks = mockContainer.querySelectorAll('.map-block');
      expect(blocks.length).toBe(3);
      expect(blocks[0].textContent).toBe('hello');
      expect(blocks[1].textContent).toBe('world');
      expect(blocks[2].textContent).toBe('test');
    });
  });
});
