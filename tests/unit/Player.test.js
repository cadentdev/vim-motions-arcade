import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../../src/entities/Player.js';

describe('Player', () => {
  let player;
  let mockMap;

  beforeEach(() => {
    // Create a simple mock map for testing
    mockMap = {
      width: 40,
      height: 20,
      blocks: [
        { x: 5, y: 5, width: 4, text: 'word' },
        { x: 10, y: 5, width: 5, text: 'block' },
      ],
    };

    player = new Player({ x: 0, y: 0 }, mockMap);
  });

  describe('Initialization', () => {
    it('should create player instance', () => {
      expect(player).toBeDefined();
    });

    it('should start at specified position', () => {
      expect(player.x).toBe(0);
      expect(player.y).toBe(0);
    });

    it('should have default starting position if not specified', () => {
      const defaultPlayer = new Player(null, mockMap);
      expect(defaultPlayer.x).toBeDefined();
      expect(defaultPlayer.y).toBeDefined();
    });
  });

  describe('Position', () => {
    it('should get current position', () => {
      const pos = player.getPosition();
      expect(pos).toEqual({ x: 0, y: 0 });
    });

    it('should set position', () => {
      player.setPosition(5, 10);
      expect(player.x).toBe(5);
      expect(player.y).toBe(10);
    });
  });

  describe('Movement - h (left)', () => {
    it('should move left when pressing h', () => {
      player.setPosition(10, 10);
      player.move('h');
      expect(player.x).toBe(9);
      expect(player.y).toBe(10);
    });

    it('should not move left beyond boundary', () => {
      player.setPosition(0, 10);
      player.move('h');
      expect(player.x).toBe(0); // Stayed at boundary
    });

    it('should return movement result', () => {
      player.setPosition(10, 10);
      const result = player.move('h');
      expect(result.success).toBe(true);
      expect(result.newPosition).toEqual({ x: 9, y: 10 });
    });
  });

  describe('Movement - l (right)', () => {
    it('should move right when pressing l', () => {
      player.setPosition(10, 10);
      player.move('l');
      expect(player.x).toBe(11);
      expect(player.y).toBe(10);
    });

    it('should not move right beyond boundary', () => {
      player.setPosition(mockMap.width - 1, 10);
      player.move('l');
      expect(player.x).toBe(mockMap.width - 1);
    });
  });

  describe('Movement - k (up)', () => {
    it('should move up when pressing k', () => {
      player.setPosition(10, 10);
      player.move('k');
      expect(player.x).toBe(10);
      expect(player.y).toBe(9);
    });

    it('should not move up beyond boundary', () => {
      player.setPosition(10, 0);
      player.move('k');
      expect(player.y).toBe(0);
    });
  });

  describe('Movement - j (down)', () => {
    it('should move down when pressing j', () => {
      player.setPosition(10, 10);
      player.move('j');
      expect(player.x).toBe(10);
      expect(player.y).toBe(11);
    });

    it('should not move down beyond boundary', () => {
      player.setPosition(10, mockMap.height - 1);
      player.move('j');
      expect(player.y).toBe(mockMap.height - 1);
    });
  });

  describe('Movement Validation', () => {
    it('should reject invalid movement keys', () => {
      player.setPosition(10, 10);
      const result = player.move('x');
      expect(result.success).toBe(false);
      expect(player.x).toBe(10); // Position unchanged
      expect(player.y).toBe(10);
    });

    it('should track movement history', () => {
      player.move('l');
      player.move('j');
      player.move('h');

      const history = player.getMovementHistory();
      expect(history.length).toBe(3);
      expect(history[0]).toBe('l');
      expect(history[1]).toBe('j');
      expect(history[2]).toBe('h');
    });
  });

  describe('Collision Detection', () => {
    it('should detect when on a block', () => {
      player.setPosition(5, 5); // Position of first block
      const onBlock = player.isOnBlock();
      expect(onBlock).toBe(true);
    });

    it('should detect when not on a block', () => {
      player.setPosition(0, 0); // Empty space
      const onBlock = player.isOnBlock();
      expect(onBlock).toBe(false);
    });

    it('should get current block if standing on one', () => {
      player.setPosition(5, 5);
      const block = player.getCurrentBlock();
      expect(block).toBeDefined();
      expect(block.text).toBe('word');
    });

    it('should return null if not on a block', () => {
      player.setPosition(0, 0);
      const block = player.getCurrentBlock();
      expect(block).toBeNull();
    });
  });

  describe('Character Position within Block', () => {
    it('should calculate position within a word block', () => {
      player.setPosition(6, 5); // Second char of "word" block at x:5
      const charPos = player.getCharacterPositionInBlock();
      expect(charPos).toBe(1); // 0-indexed, so second char is index 1
    });

    it('should return -1 if not on a block', () => {
      player.setPosition(0, 0);
      const charPos = player.getCharacterPositionInBlock();
      expect(charPos).toBe(-1);
    });
  });

  describe('Movement Speed', () => {
    it('should have default movement speed', () => {
      const speed = player.getMovementSpeed();
      expect(speed).toBeDefined();
      expect(speed).toBeGreaterThan(0);
    });

    it('should allow setting movement speed', () => {
      player.setMovementSpeed(200);
      expect(player.getMovementSpeed()).toBe(200);
    });
  });

  describe('State', () => {
    it('should export player state', () => {
      player.setPosition(10, 15);
      const state = player.getState();

      expect(state).toEqual({
        x: 10,
        y: 15,
        mode: 'normal',
      });
    });

    it('should restore from state', () => {
      const state = { x: 20, y: 18, mode: 'normal' };
      player.setState(state);

      expect(player.x).toBe(20);
      expect(player.y).toBe(18);
    });
  });
});
