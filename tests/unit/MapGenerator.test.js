import { describe, it, expect, beforeEach } from 'vitest';
import { MapGenerator } from '../../src/map/MapGenerator.js';

describe('MapGenerator', () => {
  let mapGenerator;

  beforeEach(() => {
    mapGenerator = new MapGenerator();
  });

  describe('Initialization', () => {
    it('should create map generator instance', () => {
      expect(mapGenerator).toBeDefined();
    });

    it('should have default map dimensions', () => {
      const map = mapGenerator.generate();
      expect(map.width).toBeGreaterThan(0);
      expect(map.height).toBeGreaterThan(0);
    });
  });

  describe('Map Structure', () => {
    it('should generate map with blocks', () => {
      const map = mapGenerator.generate();
      expect(map.blocks).toBeDefined();
      expect(Array.isArray(map.blocks)).toBe(true);
    });

    it('should create blocks with position and width', () => {
      const map = mapGenerator.generate();
      if (map.blocks.length > 0) {
        const block = map.blocks[0];
        expect(block).toHaveProperty('x');
        expect(block).toHaveProperty('y');
        expect(block).toHaveProperty('width');
      }
    });

    it('should create blocks with text content', () => {
      const map = mapGenerator.generate();
      if (map.blocks.length > 0) {
        const block = map.blocks[0];
        expect(block).toHaveProperty('text');
        expect(typeof block.text).toBe('string');
      }
    });

    it('should have spacing between blocks', () => {
      const map = mapGenerator.generate();
      // Check that blocks on same line have gaps
      const blocksOnLine0 = map.blocks.filter((b) => b.y === 0);
      if (blocksOnLine0.length > 1) {
        for (let i = 1; i < blocksOnLine0.length; i++) {
          const prev = blocksOnLine0[i - 1];
          const curr = blocksOnLine0[i];
          // Current block should start after previous block ends
          expect(curr.x).toBeGreaterThan(prev.x + prev.width);
        }
      }
    });
  });

  describe('Map Dimensions', () => {
    it('should allow custom map width', () => {
      const customGen = new MapGenerator({ width: 60 });
      const map = customGen.generate();
      expect(map.width).toBe(60);
    });

    it('should allow custom map height', () => {
      const customGen = new MapGenerator({ height: 30 });
      const map = customGen.generate();
      expect(map.height).toBe(30);
    });

    it('should not place blocks outside map boundaries', () => {
      const map = mapGenerator.generate();
      map.blocks.forEach((block) => {
        expect(block.x).toBeGreaterThanOrEqual(0);
        expect(block.y).toBeGreaterThanOrEqual(0);
        expect(block.x + block.width).toBeLessThanOrEqual(map.width);
        expect(block.y).toBeLessThan(map.height);
      });
    });
  });

  describe('Procedural Generation', () => {
    it('should generate different maps each time', () => {
      const map1 = mapGenerator.generate();
      const map2 = mapGenerator.generate();

      // Maps should be different (at least in block count or positions)
      const different =
        map1.blocks.length !== map2.blocks.length ||
        map1.blocks[0].x !== map2.blocks[0].x;

      expect(different).toBe(true);
    });

    it('should generate deterministic maps with seed', () => {
      const gen1 = new MapGenerator({ seed: 12345 });
      const gen2 = new MapGenerator({ seed: 12345 });

      const map1 = gen1.generate();
      const map2 = gen2.generate();

      // Same seed should produce identical maps
      expect(map1.blocks.length).toBe(map2.blocks.length);
      expect(map1.blocks[0].x).toBe(map2.blocks[0].x);
      expect(map1.blocks[0].y).toBe(map2.blocks[0].y);
    });
  });

  describe('Document-like Structure', () => {
    it('should have multiple lines', () => {
      const map = mapGenerator.generate();
      const uniqueYValues = new Set(map.blocks.map((b) => b.y));
      expect(uniqueYValues.size).toBeGreaterThan(1);
    });

    it('should include blank lines for paragraph breaks', () => {
      const map = mapGenerator.generate();
      // Check that not every line has blocks
      const linesWithBlocks = new Set(map.blocks.map((b) => b.y));
      expect(linesWithBlocks.size).toBeLessThan(map.height);
    });

    it('should vary block widths like words', () => {
      const map = mapGenerator.generate();
      if (map.blocks.length > 5) {
        const widths = map.blocks.slice(0, 5).map((b) => b.width);
        const uniqueWidths = new Set(widths);
        // Should have at least some variation in word lengths
        expect(uniqueWidths.size).toBeGreaterThan(1);
      }
    });
  });

  describe('Level Difficulty', () => {
    it('should accept difficulty parameter', () => {
      const easyGen = new MapGenerator({ difficulty: 1, seed: 12345 });
      const hardGen = new MapGenerator({ difficulty: 5, seed: 12345 });

      const easyMap = easyGen.generate();
      const hardMap = hardGen.generate();

      // Higher difficulty should influence map generation
      // (using same seed ensures deterministic comparison)
      // At minimum, difficulty setting should be accepted without errors
      expect(hardMap.blocks.length).toBeGreaterThan(0);
      expect(easyMap.blocks.length).toBeGreaterThan(0);
    });
  });

  describe('Coin Placement Hints', () => {
    it('should provide coin placement suggestions', () => {
      const map = mapGenerator.generate();
      expect(map).toHaveProperty('coinPositions');
      expect(Array.isArray(map.coinPositions)).toBe(true);
    });

    it('should suggest coins at word boundaries', () => {
      const map = mapGenerator.generate();
      if (map.coinPositions.length > 0) {
        const coinPos = map.coinPositions[0];
        expect(coinPos).toHaveProperty('x');
        expect(coinPos).toHaveProperty('y');
      }
    });
  });
});
