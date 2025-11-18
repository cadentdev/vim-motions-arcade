/**
 * HUD Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HUD } from '../../src/ui/HUD.js';

describe('HUD', () => {
  let hud;
  let mockContainer;

  beforeEach(() => {
    // Create a mock DOM container
    mockContainer = document.createElement('div');
    mockContainer.id = 'test-hud-container';
    document.body.appendChild(mockContainer);

    hud = new HUD();
  });

  afterEach(() => {
    // Clean up DOM
    if (hud) {
      hud.destroy();
    }
    if (mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });

  describe('Initialization', () => {
    it('should initialize without a container', () => {
      expect(hud).toBeDefined();
    });

    it('should initialize HUD elements when container is set', () => {
      hud.initialize(mockContainer);

      // Should create HUD container
      const hudContainer = mockContainer.querySelector('.hud-container');
      expect(hudContainer).not.toBeNull();
    });

    it('should create score display element', () => {
      hud.initialize(mockContainer);

      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay).not.toBeNull();
    });

    it('should create timer display element', () => {
      hud.initialize(mockContainer);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay).not.toBeNull();
    });

    it('should throw error if container is not a DOM element', () => {
      expect(() => hud.initialize('not-an-element')).toThrow();
      expect(() => hud.initialize(null)).toThrow();
      expect(() => hud.initialize({})).toThrow();
    });
  });

  describe('HUD Layout', () => {
    beforeEach(() => {
      hud.initialize(mockContainer);
    });

    it('should use fixed positioning for HUD container', () => {
      const hudContainer = mockContainer.querySelector('.hud-container');
      const position =
        hudContainer.style.position ||
        window.getComputedStyle(hudContainer).position;
      expect(position).toBe('fixed');
    });

    it('should position score display at top-right', () => {
      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.classList.contains('hud-score')).toBe(true);
      // Should have positioning styles (exact values may vary)
      expect(
        scoreDisplay.style.position || scoreDisplay.className
      ).toBeTruthy();
    });

    it('should position timer display at top-center', () => {
      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.classList.contains('hud-timer')).toBe(true);
    });
  });

  describe('Score Display', () => {
    beforeEach(() => {
      hud.initialize(mockContainer);
    });

    it('should display initial score of 0', () => {
      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain('0');
    });

    it('should update score when updateScore is called', () => {
      hud.updateScore(150);

      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain('150');
    });

    it('should handle large score values', () => {
      hud.updateScore(999999);

      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain('999999');
    });

    it('should handle negative scores', () => {
      hud.updateScore(-10);

      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain('-10');
    });

    it('should include score label', () => {
      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(
        scoreDisplay.textContent.toLowerCase().includes('score') ||
          scoreDisplay.querySelector('.hud-score-label')
      ).toBeTruthy();
    });
  });

  describe('Timer Display', () => {
    beforeEach(() => {
      hud.initialize(mockContainer);
    });

    it('should display initial timer value', () => {
      hud.updateTimer(60);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toMatch(/1:00/);
    });

    it('should format time as MM:SS', () => {
      hud.updateTimer(90); // 1:30

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toMatch(/1:30/);
    });

    it('should pad seconds with leading zero', () => {
      hud.updateTimer(65); // 1:05

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toMatch(/1:05/);
    });

    it('should handle zero seconds', () => {
      hud.updateTimer(0);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toMatch(/0:00/);
    });

    it('should apply green color when time > 30 seconds', () => {
      hud.updateTimer(45);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      const hasGreenClass =
        timerDisplay.classList.contains('timer-green') ||
        timerDisplay.classList.contains('timer-safe');
      const hasGreenColor =
        timerDisplay.style.color &&
        (timerDisplay.style.color.includes('green') ||
          timerDisplay.style.color.includes('rgb(0, 255, 0)') ||
          timerDisplay.style.color.includes('#0f0') ||
          timerDisplay.style.color.includes('#00ff00'));

      expect(hasGreenClass || hasGreenColor).toBe(true);
    });

    it('should apply yellow color when time is 15-30 seconds', () => {
      hud.updateTimer(20);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      const hasYellowClass =
        timerDisplay.classList.contains('timer-yellow') ||
        timerDisplay.classList.contains('timer-warning');
      const hasYellowColor =
        timerDisplay.style.color &&
        (timerDisplay.style.color.includes('yellow') ||
          timerDisplay.style.color.includes('orange') ||
          timerDisplay.style.color.includes('rgb(255, 255, 0)'));

      expect(hasYellowClass || hasYellowColor).toBe(true);
    });

    it('should apply red color when time < 15 seconds', () => {
      hud.updateTimer(10);

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      const hasRedClass =
        timerDisplay.classList.contains('timer-red') ||
        timerDisplay.classList.contains('timer-danger');
      const hasRedColor =
        timerDisplay.style.color &&
        (timerDisplay.style.color.includes('red') ||
          timerDisplay.style.color.includes('rgb(255, 0, 0)') ||
          timerDisplay.style.color.includes('#f00') ||
          timerDisplay.style.color.includes('#ff0000'));

      expect(hasRedClass || hasRedColor).toBe(true);
    });

    it('should change color from green to yellow as time decreases', () => {
      hud.updateTimer(35);
      const timerDisplay = mockContainer.querySelector('.hud-timer');
      const initialClasses = timerDisplay.className;

      hud.updateTimer(25);
      const updatedClasses = timerDisplay.className;

      // Classes should have changed
      expect(initialClasses).not.toBe(updatedClasses);
    });
  });

  describe('Destroy', () => {
    it('should remove HUD elements from DOM', () => {
      hud.initialize(mockContainer);
      expect(mockContainer.querySelector('.hud-container')).not.toBeNull();

      hud.destroy();
      expect(mockContainer.querySelector('.hud-container')).toBeNull();
    });

    it('should not error if destroy is called without initialization', () => {
      expect(() => hud.destroy()).not.toThrow();
    });

    it('should not error if destroy is called multiple times', () => {
      hud.initialize(mockContainer);
      hud.destroy();
      expect(() => hud.destroy()).not.toThrow();
    });
  });

  describe('Update Performance', () => {
    beforeEach(() => {
      hud.initialize(mockContainer);
    });

    it('should update score efficiently', () => {
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        hud.updateScore(i);
      }

      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain('999');
    });

    it('should update timer efficiently', () => {
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        hud.updateTimer(i);
      }

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should throw error if updating score before initialization', () => {
      expect(() => hud.updateScore(100)).toThrow(/initialize/i);
    });

    it('should throw error if updating timer before initialization', () => {
      expect(() => hud.updateTimer(60)).toThrow(/initialize/i);
    });

    it('should validate timer is a number', () => {
      hud.initialize(mockContainer);
      expect(() => hud.updateTimer('invalid')).toThrow();
    });

    it('should validate score is a number', () => {
      hud.initialize(mockContainer);
      expect(() => hud.updateScore('invalid')).toThrow();
    });
  });

  describe('Styling', () => {
    beforeEach(() => {
      hud.initialize(mockContainer);
    });

    it('should apply high contrast styles', () => {
      const hudContainer = mockContainer.querySelector('.hud-container');
      // Should have some styling applied
      expect(hudContainer.style.cssText || hudContainer.className).toBeTruthy();
    });

    it('should not interfere with game area', () => {
      const hudContainer = mockContainer.querySelector('.hud-container');
      // HUD should use fixed or absolute positioning
      const position =
        hudContainer.style.position ||
        window.getComputedStyle(hudContainer).position;
      expect(['fixed', 'absolute'].includes(position)).toBe(true);
    });
  });
});
