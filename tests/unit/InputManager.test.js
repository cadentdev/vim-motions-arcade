/**
 * InputManager Tests
 */
/* global KeyboardEvent */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputManager } from '../../src/input/InputManager.js';

describe('InputManager', () => {
  let inputManager;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onMove: vi.fn(),
      onCommandMode: vi.fn(),
      onEscape: vi.fn(),
    };

    inputManager = new InputManager(mockCallbacks);
  });

  afterEach(() => {
    // Clean up event listeners
    if (inputManager) {
      inputManager.disable();
    }
  });

  describe('Initialization', () => {
    it('should initialize in disabled state', () => {
      expect(inputManager.isEnabled).toBe(false);
    });

    it('should accept callbacks during construction', () => {
      expect(inputManager.callbacks).toBeDefined();
      expect(inputManager.callbacks.onMove).toBe(mockCallbacks.onMove);
    });

    it('should work without callbacks', () => {
      const manager = new InputManager();
      expect(manager.callbacks).toBeDefined();
      expect(() => manager.enable()).not.toThrow();
    });
  });

  describe('Enable/Disable', () => {
    it('should enable input handling', () => {
      inputManager.enable();
      expect(inputManager.isEnabled).toBe(true);
    });

    it('should disable input handling', () => {
      inputManager.enable();
      inputManager.disable();
      expect(inputManager.isEnabled).toBe(false);
    });

    it('should not process input when disabled', () => {
      inputManager.disable();

      const event = new KeyboardEvent('keydown', { key: 'h' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });
  });

  describe('Movement Keys (hjkl)', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should trigger onMove callback for h key (left)', () => {
      const event = new KeyboardEvent('keydown', { key: 'h' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('h');
    });

    it('should trigger onMove callback for j key (down)', () => {
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('j');
    });

    it('should trigger onMove callback for k key (up)', () => {
      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('k');
    });

    it('should trigger onMove callback for l key (right)', () => {
      const event = new KeyboardEvent('keydown', { key: 'l' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('l');
    });

    it('should prevent default browser behavior for movement keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'h' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not trigger onMove for non-movement keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });

    it('should handle uppercase movement keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'H' });
      document.dispatchEvent(event);

      // Uppercase should be converted to lowercase or handled the same way
      expect(mockCallbacks.onMove).toHaveBeenCalledWith('h');
    });
  });

  describe('Command Mode', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should trigger onCommandMode callback for colon key', () => {
      const event = new KeyboardEvent('keydown', { key: ':' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onCommandMode).toHaveBeenCalled();
    });

    it('should prevent default for colon key', () => {
      const event = new KeyboardEvent('keydown', { key: ':' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Escape Key', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should trigger onEscape callback for Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onEscape).toHaveBeenCalled();
    });

    it('should prevent default for Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Modifier Keys', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should ignore keys pressed with Ctrl modifier', () => {
      const event = new KeyboardEvent('keydown', { key: 'h', ctrlKey: true });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });

    it('should ignore keys pressed with Alt modifier', () => {
      const event = new KeyboardEvent('keydown', { key: 'h', altKey: true });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });

    it('should ignore keys pressed with Meta modifier', () => {
      const event = new KeyboardEvent('keydown', { key: 'h', metaKey: true });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });
  });

  describe('Event Listener Management', () => {
    it('should add event listener when enabled', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      inputManager.enable();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('should remove event listener when disabled', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      inputManager.enable();
      inputManager.disable();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('should not add duplicate listeners when enabled multiple times', () => {
      inputManager.enable();
      inputManager.enable();

      const event = new KeyboardEvent('keydown', { key: 'h' });
      document.dispatchEvent(event);

      // Should only be called once, not twice
      expect(mockCallbacks.onMove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback Safety', () => {
    it('should handle missing onMove callback gracefully', () => {
      const manager = new InputManager({ onCommandMode: vi.fn() });
      manager.enable();

      const event = new KeyboardEvent('keydown', { key: 'h' });
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });

    it('should handle missing onCommandMode callback gracefully', () => {
      const manager = new InputManager({ onMove: vi.fn() });
      manager.enable();

      const event = new KeyboardEvent('keydown', { key: ':' });
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });

    it('should handle missing onEscape callback gracefully', () => {
      const manager = new InputManager({ onMove: vi.fn() });
      manager.enable();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Input Blocking', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should allow blocking specific keys', () => {
      inputManager.blockKeys(['h', 'j']);

      const eventH = new KeyboardEvent('keydown', { key: 'h' });
      const eventK = new KeyboardEvent('keydown', { key: 'k' });

      document.dispatchEvent(eventH);
      document.dispatchEvent(eventK);

      expect(mockCallbacks.onMove).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onMove).toHaveBeenCalledWith('k');
    });

    it('should allow unblocking keys', () => {
      inputManager.blockKeys(['h']);
      inputManager.unblockKeys(['h']);

      const event = new KeyboardEvent('keydown', { key: 'h' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('h');
    });

    it('should allow clearing all blocked keys', () => {
      inputManager.blockKeys(['h', 'j', 'k', 'l']);
      inputManager.clearBlockedKeys();

      const event = new KeyboardEvent('keydown', { key: 'h' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onMove).toHaveBeenCalledWith('h');
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(() => {
      inputManager.enable();
    });

    it('should handle rapid key presses', () => {
      for (let i = 0; i < 10; i++) {
        const event = new KeyboardEvent('keydown', { key: 'h' });
        document.dispatchEvent(event);
      }

      expect(mockCallbacks.onMove).toHaveBeenCalledTimes(10);
    });

    it('should handle mixed key sequences', () => {
      const keys = ['h', 'j', 'k', 'l', ':', 'Escape'];

      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);
      });

      expect(mockCallbacks.onMove).toHaveBeenCalledTimes(4);
      expect(mockCallbacks.onCommandMode).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onEscape).toHaveBeenCalledTimes(1);
    });
  });
});
