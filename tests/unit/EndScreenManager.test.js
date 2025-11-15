/**
 * EndScreenManager Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EndScreenManager } from '../../src/ui/EndScreenManager.js';

describe('EndScreenManager', () => {
  let endScreenManager;
  let mockCallbacks;
  let levelCompleteScreen;
  let levelFailedScreen;

  beforeEach(() => {
    // Create mock DOM elements matching index.html structure
    levelCompleteScreen = document.createElement('div');
    levelCompleteScreen.id = 'screen-level-complete';
    levelCompleteScreen.style.display = 'none';
    levelCompleteScreen.innerHTML = `
      <div class="end-screen">
        <h1>Level Complete!</h1>
        <p id="final-score">Score: 0</p>
        <button id="btn-next-level" class="menu-button primary">Next Level</button>
        <button id="btn-menu-complete" class="menu-button">Main Menu</button>
      </div>
    `;
    document.body.appendChild(levelCompleteScreen);

    levelFailedScreen = document.createElement('div');
    levelFailedScreen.id = 'screen-level-failed';
    levelFailedScreen.style.display = 'none';
    levelFailedScreen.innerHTML = `
      <div class="end-screen">
        <h1>Time's Up!</h1>
        <p id="failed-score">Score: 0</p>
        <button id="btn-retry" class="menu-button primary">Retry</button>
        <button id="btn-menu-failed" class="menu-button">Main Menu</button>
      </div>
    `;
    document.body.appendChild(levelFailedScreen);

    mockCallbacks = {
      onRetry: vi.fn(),
      onNextLevel: vi.fn(),
      onMainMenu: vi.fn(),
    };

    endScreenManager = new EndScreenManager(mockCallbacks);
  });

  afterEach(() => {
    // Clean up
    if (endScreenManager) {
      endScreenManager.detachEventListeners();
    }
    if (levelCompleteScreen.parentNode) {
      levelCompleteScreen.parentNode.removeChild(levelCompleteScreen);
    }
    if (levelFailedScreen.parentNode) {
      levelFailedScreen.parentNode.removeChild(levelFailedScreen);
    }
  });

  describe('Initialization', () => {
    it('should initialize with callbacks', () => {
      expect(endScreenManager).toBeDefined();
      expect(endScreenManager.callbacks).toBeDefined();
    });

    it('should work without callbacks', () => {
      const manager = new EndScreenManager();
      expect(manager).toBeDefined();
      expect(() => manager.showLevelComplete(100)).not.toThrow();
    });

    it('should find end screen elements', () => {
      expect(endScreenManager.levelCompleteScreen).toBeDefined();
      expect(endScreenManager.levelFailedScreen).toBeDefined();
    });
  });

  describe('Show Level Complete', () => {
    it('should display level complete screen', () => {
      endScreenManager.showLevelComplete(150);

      expect(levelCompleteScreen.style.display).not.toBe('none');
    });

    it('should update score display', () => {
      endScreenManager.showLevelComplete(250);

      const scoreDisplay = document.getElementById('final-score');
      expect(scoreDisplay.textContent).toContain('250');
    });

    it('should hide level failed screen', () => {
      levelFailedScreen.style.display = 'block';

      endScreenManager.showLevelComplete(100);

      expect(levelFailedScreen.style.display).toBe('none');
    });

    it('should attach event listeners', () => {
      const nextLevelBtn = document.getElementById('btn-next-level');
      const spy = vi.spyOn(nextLevelBtn, 'addEventListener');

      endScreenManager.showLevelComplete(100);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Show Level Failed', () => {
    it('should display level failed screen', () => {
      endScreenManager.showLevelFailed(75);

      expect(levelFailedScreen.style.display).not.toBe('none');
    });

    it('should update score display', () => {
      endScreenManager.showLevelFailed(125);

      const scoreDisplay = document.getElementById('failed-score');
      expect(scoreDisplay.textContent).toContain('125');
    });

    it('should hide level complete screen', () => {
      levelCompleteScreen.style.display = 'block';

      endScreenManager.showLevelFailed(50);

      expect(levelCompleteScreen.style.display).toBe('none');
    });

    it('should attach event listeners', () => {
      const retryBtn = document.getElementById('btn-retry');
      const spy = vi.spyOn(retryBtn, 'addEventListener');

      endScreenManager.showLevelFailed(50);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Button Clicks - Level Complete', () => {
    beforeEach(() => {
      endScreenManager.showLevelComplete(200);
    });

    it('should call onNextLevel when Next Level button is clicked', () => {
      const nextLevelBtn = document.getElementById('btn-next-level');
      nextLevelBtn.click();

      expect(mockCallbacks.onNextLevel).toHaveBeenCalled();
    });

    it('should call onMainMenu when Main Menu button is clicked', () => {
      const mainMenuBtn = document.getElementById('btn-menu-complete');
      mainMenuBtn.click();

      expect(mockCallbacks.onMainMenu).toHaveBeenCalled();
    });

    it('should pass score to onNextLevel callback', () => {
      endScreenManager.showLevelComplete(300);

      const nextLevelBtn = document.getElementById('btn-next-level');
      nextLevelBtn.click();

      expect(mockCallbacks.onNextLevel).toHaveBeenCalledWith(
        expect.objectContaining({ score: 300 })
      );
    });
  });

  describe('Button Clicks - Level Failed', () => {
    beforeEach(() => {
      endScreenManager.showLevelFailed(80);
    });

    it('should call onRetry when Retry button is clicked', () => {
      const retryBtn = document.getElementById('btn-retry');
      retryBtn.click();

      expect(mockCallbacks.onRetry).toHaveBeenCalled();
    });

    it('should call onMainMenu when Main Menu button is clicked', () => {
      const mainMenuBtn = document.getElementById('btn-menu-failed');
      mainMenuBtn.click();

      expect(mockCallbacks.onMainMenu).toHaveBeenCalled();
    });

    it('should pass score to onRetry callback', () => {
      endScreenManager.showLevelFailed(90);

      const retryBtn = document.getElementById('btn-retry');
      retryBtn.click();

      expect(mockCallbacks.onRetry).toHaveBeenCalledWith(
        expect.objectContaining({ score: 90 })
      );
    });
  });

  describe('Hide Screens', () => {
    it('should hide level complete screen', () => {
      endScreenManager.showLevelComplete(100);
      expect(levelCompleteScreen.style.display).not.toBe('none');

      endScreenManager.hide();

      expect(levelCompleteScreen.style.display).toBe('none');
    });

    it('should hide level failed screen', () => {
      endScreenManager.showLevelFailed(50);
      expect(levelFailedScreen.style.display).not.toBe('none');

      endScreenManager.hide();

      expect(levelFailedScreen.style.display).toBe('none');
    });
  });

  describe('Event Listener Management', () => {
    it('should detach event listeners when hiding', () => {
      endScreenManager.showLevelComplete(100);

      const nextLevelBtn = document.getElementById('btn-next-level');
      const clicksBefore = mockCallbacks.onNextLevel.mock.calls.length;

      endScreenManager.detachEventListeners();
      nextLevelBtn.click();

      // Should not trigger callback after detaching
      expect(mockCallbacks.onNextLevel.mock.calls.length).toBe(clicksBefore);
    });

    it('should not error if detaching without showing', () => {
      expect(() => endScreenManager.detachEventListeners()).not.toThrow();
    });

    it('should handle multiple show/hide cycles', () => {
      endScreenManager.showLevelComplete(100);
      endScreenManager.hide();
      endScreenManager.showLevelComplete(200);
      endScreenManager.hide();

      expect(() => endScreenManager.showLevelFailed(50)).not.toThrow();
    });
  });

  describe('Score Display', () => {
    it('should handle zero score', () => {
      endScreenManager.showLevelComplete(0);

      const scoreDisplay = document.getElementById('final-score');
      expect(scoreDisplay.textContent).toContain('0');
    });

    it('should handle large scores', () => {
      endScreenManager.showLevelComplete(999999);

      const scoreDisplay = document.getElementById('final-score');
      expect(scoreDisplay.textContent).toContain('999999');
    });

    it('should update score when shown multiple times', () => {
      endScreenManager.showLevelComplete(100);
      let scoreDisplay = document.getElementById('final-score');
      expect(scoreDisplay.textContent).toContain('100');

      endScreenManager.showLevelComplete(200);
      scoreDisplay = document.getElementById('final-score');
      expect(scoreDisplay.textContent).toContain('200');
    });
  });

  describe('Screen Visibility', () => {
    it('should show only one screen at a time', () => {
      endScreenManager.showLevelComplete(100);
      expect(levelCompleteScreen.style.display).not.toBe('none');
      expect(levelFailedScreen.style.display).toBe('none');

      endScreenManager.showLevelFailed(50);
      expect(levelCompleteScreen.style.display).toBe('none');
      expect(levelFailedScreen.style.display).not.toBe('none');
    });

    it('should initially have both screens hidden', () => {
      expect(levelCompleteScreen.style.display).toBe('none');
      expect(levelFailedScreen.style.display).toBe('none');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing callbacks gracefully', () => {
      const manager = new EndScreenManager();
      manager.showLevelComplete(100);

      const nextLevelBtn = document.getElementById('btn-next-level');
      expect(() => nextLevelBtn.click()).not.toThrow();
    });

    it('should validate score is a number', () => {
      expect(() => endScreenManager.showLevelComplete('invalid')).toThrow();
      expect(() => endScreenManager.showLevelFailed('invalid')).toThrow();
    });
  });
});
