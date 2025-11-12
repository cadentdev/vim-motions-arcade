import { describe, it, expect, beforeEach } from 'vitest';
import { ScreenManager } from '../../src/game/ScreenManager.js';

describe('ScreenManager', () => {
  let screenManager;

  beforeEach(() => {
    // This will fail until we create the ScreenManager class
    screenManager = new ScreenManager();
  });

  describe('Screen States', () => {
    it('should initialize with MAIN_MENU state', () => {
      expect(screenManager.currentScreen).toBe('MAIN_MENU');
    });

    it('should have all required screen states defined', () => {
      const expectedStates = [
        'MAIN_MENU',
        'PLAYING',
        'LEVEL_COMPLETE',
        'LEVEL_FAILED',
      ];
      expectedStates.forEach((state) => {
        expect(screenManager.SCREENS).toHaveProperty(state);
      });
    });
  });

  describe('Screen Transitions', () => {
    it('should transition from MAIN_MENU to PLAYING', () => {
      screenManager.switchTo('PLAYING');
      expect(screenManager.currentScreen).toBe('PLAYING');
    });

    it('should transition from PLAYING to LEVEL_COMPLETE', () => {
      screenManager.switchTo('PLAYING');
      screenManager.switchTo('LEVEL_COMPLETE');
      expect(screenManager.currentScreen).toBe('LEVEL_COMPLETE');
    });

    it('should transition from PLAYING to LEVEL_FAILED', () => {
      screenManager.switchTo('PLAYING');
      screenManager.switchTo('LEVEL_FAILED');
      expect(screenManager.currentScreen).toBe('LEVEL_FAILED');
    });

    it('should transition from LEVEL_COMPLETE back to MAIN_MENU', () => {
      screenManager.switchTo('PLAYING');
      screenManager.switchTo('LEVEL_COMPLETE');
      screenManager.switchTo('MAIN_MENU');
      expect(screenManager.currentScreen).toBe('MAIN_MENU');
    });

    it('should throw error for invalid screen transition', () => {
      expect(() => {
        screenManager.switchTo('INVALID_SCREEN');
      }).toThrow();
    });
  });

  describe('Screen Callbacks', () => {
    it('should call onEnter callback when entering a screen', () => {
      let entered = false;
      screenManager.onScreenEnter('PLAYING', () => {
        entered = true;
      });
      screenManager.switchTo('PLAYING');
      expect(entered).toBe(true);
    });

    it('should call onExit callback when leaving a screen', () => {
      let exited = false;
      screenManager.switchTo('PLAYING');
      screenManager.onScreenExit('PLAYING', () => {
        exited = true;
      });
      screenManager.switchTo('MAIN_MENU');
      expect(exited).toBe(true);
    });
  });

  describe('Event Listener Management', () => {
    it('should clean up event listeners when switching screens', () => {
      const mockCleanup = { called: false };
      screenManager.switchTo('PLAYING');
      screenManager.registerCleanup(() => {
        mockCleanup.called = true;
      });
      screenManager.switchTo('MAIN_MENU');
      expect(mockCleanup.called).toBe(true);
    });
  });
});
