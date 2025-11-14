/**
 * PlayerRenderer Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PlayerRenderer } from '../../src/rendering/PlayerRenderer.js';

describe('PlayerRenderer', () => {
  let renderer;
  let mockContainer;

  beforeEach(() => {
    // Create a mock DOM container
    mockContainer = document.createElement('div');
    mockContainer.id = 'test-game-area';
    document.body.appendChild(mockContainer);

    renderer = new PlayerRenderer();
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
      expect(charSize.width).toBe(10); // Match MapRenderer
      expect(charSize.height).toBe(16);
    });
  });

  describe('Cursor Rendering', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render cursor at specified position', () => {
      renderer.renderCursor(5, 3);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor).toBeDefined();
      expect(cursor).not.toBeNull();
    });

    it('should position cursor correctly based on character grid', () => {
      renderer.renderCursor(10, 5);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe('100px'); // 10 * 10px
      expect(cursor.style.top).toBe('80px'); // 5 * 16px
    });

    it('should apply correct z-index for layering', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      // Player cursor should be z-index 2 (above map blocks at 0 and coins at 1)
      expect(cursor.style.zIndex).toBe('2');
    });

    it('should apply distinct visual styling', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.classList.contains('player-cursor')).toBe(true);
      expect(cursor.style.position).toBe('absolute');
    });

    it('should render cursor with correct size', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.width).toBe('10px');
      expect(cursor.style.height).toBe('16px');
    });

    it('should update cursor position when re-rendered', () => {
      renderer.renderCursor(5, 3);
      let cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe('50px');
      expect(cursor.style.top).toBe('48px');

      renderer.renderCursor(10, 8);
      cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe('100px');
      expect(cursor.style.top).toBe('128px');
    });

    it('should reuse the same DOM element when updating position', () => {
      renderer.renderCursor(0, 0);
      const firstCursor = mockContainer.querySelector('.player-cursor');

      renderer.renderCursor(5, 5);
      const secondCursor = mockContainer.querySelector('.player-cursor');

      // Should be the same element
      expect(firstCursor).toBe(secondCursor);

      // Should only have one cursor element
      const allCursors = mockContainer.querySelectorAll('.player-cursor');
      expect(allCursors.length).toBe(1);
    });
  });

  describe('CSS Transitions', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should apply CSS transition for smooth movement', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.transition).toContain('left');
      expect(cursor.style.transition).toContain('top');
    });

    it('should use appropriate transition duration', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      // Transition should be set (exact value may vary)
      expect(cursor.style.transition).toBeTruthy();
    });
  });

  describe('Clear Cursor', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should remove cursor from container', () => {
      renderer.renderCursor(5, 5);
      expect(mockContainer.querySelector('.player-cursor')).not.toBeNull();

      renderer.clearCursor();
      expect(mockContainer.querySelector('.player-cursor')).toBeNull();
    });

    it('should not error if cursor is already cleared', () => {
      expect(() => renderer.clearCursor()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw error if rendering without container', () => {
      expect(() => renderer.renderCursor(0, 0)).toThrow(/container/i);
    });

    it('should validate position coordinates', () => {
      renderer.setContainer(mockContainer);

      // Should handle negative coordinates (will be rendered off-screen)
      expect(() => renderer.renderCursor(-1, -1)).not.toThrow();

      // Should handle non-number coordinates
      expect(() => renderer.renderCursor('invalid', 0)).toThrow();
      expect(() => renderer.renderCursor(0, 'invalid')).toThrow();
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

    it('should update cursor position based on new character size', () => {
      renderer.setCharacterSize(12, 20);
      renderer.renderCursor(5, 3);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe('60px'); // 5 * 12px
      expect(cursor.style.top).toBe('60px'); // 3 * 20px
    });
  });

  describe('Integration with GameState', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should render cursor at player position from state', () => {
      const mockPlayerState = { x: 8, y: 4 };
      renderer.renderCursor(mockPlayerState.x, mockPlayerState.y);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe('80px');
      expect(cursor.style.top).toBe('64px');
    });
  });

  describe('Visual Appearance', () => {
    beforeEach(() => {
      renderer.setContainer(mockContainer);
    });

    it('should display cursor character', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      // Cursor should display a character (e.g., █ or similar)
      expect(cursor.textContent).toBeTruthy();
    });

    it('should use monospace font', () => {
      renderer.renderCursor(0, 0);

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.fontFamily).toContain('monospace');
    });
  });
});
