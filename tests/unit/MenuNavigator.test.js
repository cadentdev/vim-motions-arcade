/**
 * MenuNavigator Tests
 */
/* global KeyboardEvent */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MenuNavigator } from '../../src/input/MenuNavigator.js';

describe('MenuNavigator', () => {
  let menuNavigator;
  let buttons;
  let mockCallbacks;

  beforeEach(() => {
    // Create mock DOM buttons
    buttons = [
      document.createElement('button'),
      document.createElement('button'),
    ];
    buttons[0].id = 'start-game';
    buttons[0].textContent = 'Start New Game';
    buttons[1].id = 'continue-game';
    buttons[1].textContent = 'Continue Game';

    // Add buttons to document
    buttons.forEach((button) => document.body.appendChild(button));

    mockCallbacks = {
      onActivate: vi.fn(),
    };

    menuNavigator = new MenuNavigator(buttons, mockCallbacks);
  });

  afterEach(() => {
    // Clean up event listeners
    if (menuNavigator) {
      menuNavigator.disable();
    }
    // Clean up DOM
    buttons.forEach((button) => button.remove());
  });

  describe('Initialization', () => {
    it('should initialize in disabled state', () => {
      expect(menuNavigator.isEnabled).toBe(false);
    });

    it('should accept buttons and callbacks during construction', () => {
      expect(menuNavigator.buttons).toBeDefined();
      expect(menuNavigator.buttons.length).toBe(2);
      expect(menuNavigator.callbacks).toBeDefined();
    });

    it('should focus first enabled button by default', () => {
      menuNavigator.enable();
      expect(menuNavigator.currentIndex).toBe(0);
    });
  });

  describe('Basic Navigation with j/k keys', () => {
    beforeEach(() => {
      menuNavigator.enable();
    });

    it('should move focus down with j key', () => {
      expect(menuNavigator.currentIndex).toBe(0);

      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      expect(menuNavigator.currentIndex).toBe(1);
    });

    it('should move focus up with k key', () => {
      // Move to second button first
      menuNavigator.currentIndex = 1;

      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      expect(menuNavigator.currentIndex).toBe(0);
    });

    it('should prevent default browser behavior for j/k keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'j' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not process j/k keys when disabled', () => {
      menuNavigator.disable();

      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      expect(menuNavigator.currentIndex).toBe(0);
    });
  });

  describe('Boundary Behavior (no loop)', () => {
    beforeEach(() => {
      menuNavigator.enable();
    });

    it('should not move down past last button', () => {
      // Navigate to last button
      menuNavigator.currentIndex = 1;
      expect(menuNavigator.currentIndex).toBe(1);

      // Try to move down
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      // Should still be on last button
      expect(menuNavigator.currentIndex).toBe(1);
    });

    it('should not move up past first button', () => {
      // Start at first button (default)
      expect(menuNavigator.currentIndex).toBe(0);

      // Try to move up
      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      // Should still be on first button
      expect(menuNavigator.currentIndex).toBe(0);
    });

    it('should not wrap around from bottom to top with j', () => {
      menuNavigator.currentIndex = 1; // Last button

      // Press j multiple times
      for (let i = 0; i < 5; i++) {
        const event = new KeyboardEvent('keydown', { key: 'j' });
        document.dispatchEvent(event);
      }

      // Should still be on last button
      expect(menuNavigator.currentIndex).toBe(1);
    });

    it('should not wrap around from top to bottom with k', () => {
      expect(menuNavigator.currentIndex).toBe(0); // First button

      // Press k multiple times
      for (let i = 0; i < 5; i++) {
        const event = new KeyboardEvent('keydown', { key: 'k' });
        document.dispatchEvent(event);
      }

      // Should still be on first button
      expect(menuNavigator.currentIndex).toBe(0);
    });
  });

  describe('Enter Key Activation', () => {
    beforeEach(() => {
      menuNavigator.enable();
    });

    it('should trigger onActivate callback when Enter is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onActivate).toHaveBeenCalledWith(buttons[0]);
    });

    it('should activate the currently focused button', () => {
      // Navigate to second button
      menuNavigator.currentIndex = 1;

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onActivate).toHaveBeenCalledWith(buttons[1]);
    });

    it('should prevent default browser behavior for Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not activate when disabled', () => {
      menuNavigator.disable();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(mockCallbacks.onActivate).not.toHaveBeenCalled();
    });

    it('should handle missing onActivate callback gracefully', () => {
      const navigator = new MenuNavigator(buttons, {});
      navigator.enable();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Disabled Button Handling', () => {
    beforeEach(() => {
      // Add a third button for more complex scenarios
      const thirdButton = document.createElement('button');
      thirdButton.id = 'settings';
      thirdButton.textContent = 'Settings';
      document.body.appendChild(thirdButton);
      buttons.push(thirdButton);

      menuNavigator = new MenuNavigator(buttons, mockCallbacks);
      menuNavigator.enable();
    });

    it('should skip disabled button when moving down', () => {
      // Disable the middle button
      buttons[1].disabled = true;

      expect(menuNavigator.currentIndex).toBe(0);

      // Press j to move down
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      // Should skip disabled button and go to third button
      expect(menuNavigator.currentIndex).toBe(2);
    });

    it('should skip disabled button when moving up', () => {
      // Start at third button
      menuNavigator.currentIndex = 2;
      // Disable the middle button
      buttons[1].disabled = true;

      // Press k to move up
      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      // Should skip disabled button and go to first button
      expect(menuNavigator.currentIndex).toBe(0);
    });

    it('should skip multiple disabled buttons when moving down', () => {
      // Disable middle buttons
      buttons[1].disabled = true;

      expect(menuNavigator.currentIndex).toBe(0);

      // Press j to move down
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      // Should skip to next enabled button
      expect(menuNavigator.currentIndex).toBe(2);
    });

    it('should not move if all buttons below are disabled', () => {
      // Disable buttons below current
      buttons[1].disabled = true;
      buttons[2].disabled = true;

      expect(menuNavigator.currentIndex).toBe(0);

      // Try to move down
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      // Should stay on first button
      expect(menuNavigator.currentIndex).toBe(0);
    });

    it('should not move if all buttons above are disabled', () => {
      // Start at last button
      menuNavigator.currentIndex = 2;
      // Disable buttons above current
      buttons[0].disabled = true;
      buttons[1].disabled = true;

      // Try to move up
      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      // Should stay on last button
      expect(menuNavigator.currentIndex).toBe(2);
    });

    it('should not activate disabled button', () => {
      // Disable first button
      buttons[0].disabled = true;

      // Try to activate
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      // Should not trigger callback
      expect(mockCallbacks.onActivate).not.toHaveBeenCalled();
    });
  });

  describe('Visual Feedback', () => {
    beforeEach(() => {
      menuNavigator.enable();
    });

    it('should add focused class to current button', () => {
      expect(buttons[0].classList.contains('focused')).toBe(true);
      expect(buttons[1].classList.contains('focused')).toBe(false);
    });

    it('should move focused class when navigating down', () => {
      const event = new KeyboardEvent('keydown', { key: 'j' });
      document.dispatchEvent(event);

      expect(buttons[0].classList.contains('focused')).toBe(false);
      expect(buttons[1].classList.contains('focused')).toBe(true);
    });

    it('should move focused class when navigating up', () => {
      // Navigate to second button first
      menuNavigator.currentIndex = 1;
      buttons[1].classList.add('focused');
      buttons[0].classList.remove('focused');

      const event = new KeyboardEvent('keydown', { key: 'k' });
      document.dispatchEvent(event);

      expect(buttons[0].classList.contains('focused')).toBe(true);
      expect(buttons[1].classList.contains('focused')).toBe(false);
    });

    it('should add active class when Enter is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(buttons[0].classList.contains('active')).toBe(true);
    });

    it('should remove active class after a short delay', (done) => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(buttons[0].classList.contains('active')).toBe(true);

      // Check after 200ms
      setTimeout(() => {
        expect(buttons[0].classList.contains('active')).toBe(false);
        done();
      }, 200);
    });

    it('should remove focused class from all buttons when disabled', () => {
      buttons[0].classList.add('focused');

      menuNavigator.disable();

      expect(buttons[0].classList.contains('focused')).toBe(false);
      expect(buttons[1].classList.contains('focused')).toBe(false);
    });
  });
});
