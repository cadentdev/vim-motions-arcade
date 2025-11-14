import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommandModeUI } from '../../src/ui/CommandModeUI.js';

describe('CommandModeUI', () => {
  let commandModeUI;
  let container;

  beforeEach(() => {
    // Create a container for the UI
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);

    commandModeUI = new CommandModeUI(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Initialization', () => {
    it('should create command mode overlay element', () => {
      const overlay = container.querySelector('.command-mode-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should create command input display', () => {
      const input = container.querySelector('.command-input');
      expect(input).toBeTruthy();
    });

    it('should create feedback message display', () => {
      const feedback = container.querySelector('.command-feedback');
      expect(feedback).toBeTruthy();
    });

    it('should be hidden by default', () => {
      const overlay = container.querySelector('.command-mode-overlay');
      expect(overlay.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Show/Hide', () => {
    it('should show overlay when show() is called', () => {
      commandModeUI.show();
      const overlay = container.querySelector('.command-mode-overlay');
      expect(overlay.classList.contains('hidden')).toBe(false);
    });

    it('should hide overlay when hide() is called', () => {
      commandModeUI.show();
      commandModeUI.hide();
      const overlay = container.querySelector('.command-mode-overlay');
      expect(overlay.classList.contains('hidden')).toBe(true);
    });

    it('should clear input when hidden', () => {
      commandModeUI.show();
      commandModeUI.updateInput('test');
      commandModeUI.hide();
      const input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':');
    });
  });

  describe('Input Display', () => {
    it('should display command buffer with colon prefix', () => {
      commandModeUI.show();
      commandModeUI.updateInput('quit');
      const input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':quit');
    });

    it('should show just colon when buffer is empty', () => {
      commandModeUI.show();
      commandModeUI.updateInput('');
      const input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':');
    });

    it('should update display when buffer changes', () => {
      commandModeUI.show();
      commandModeUI.updateInput('h');
      let input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':h');

      commandModeUI.updateInput('help');
      input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':help');
    });
  });

  describe('Feedback Messages', () => {
    it('should display success message', () => {
      commandModeUI.showFeedback('Command executed', 'success');
      const feedback = container.querySelector('.command-feedback');
      expect(feedback.textContent).toBe('Command executed');
      expect(feedback.classList.contains('success')).toBe(true);
    });

    it('should display error message', () => {
      commandModeUI.showFeedback('Unknown command', 'error');
      const feedback = container.querySelector('.command-feedback');
      expect(feedback.textContent).toBe('Unknown command');
      expect(feedback.classList.contains('error')).toBe(true);
    });

    it('should clear previous feedback when showing new', () => {
      commandModeUI.showFeedback('First message', 'success');
      commandModeUI.showFeedback('Second message', 'error');
      const feedback = container.querySelector('.command-feedback');
      expect(feedback.textContent).toBe('Second message');
      expect(feedback.classList.contains('success')).toBe(false);
      expect(feedback.classList.contains('error')).toBe(true);
    });

    it('should clear feedback after specified duration', () => {
      vi.useFakeTimers();
      commandModeUI.showFeedback('Test message', 'success', 1000);

      const feedback = container.querySelector('.command-feedback');
      expect(feedback.textContent).toBe('Test message');

      vi.advanceTimersByTime(1000);
      expect(feedback.textContent).toBe('');

      vi.useRealTimers();
    });

    it('should hide feedback display when cleared', () => {
      commandModeUI.showFeedback('Test', 'success');
      const feedback = container.querySelector('.command-feedback');
      expect(feedback.classList.contains('hidden')).toBe(false);

      commandModeUI.clearFeedback();
      expect(feedback.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should handle full command input flow', () => {
      // Start command mode
      commandModeUI.show();
      expect(commandModeUI.isVisible()).toBe(true);

      // Type command
      commandModeUI.updateInput('q');
      let input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':q');

      commandModeUI.updateInput('qu');
      input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':qu');

      commandModeUI.updateInput('qui');
      input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':qui');

      commandModeUI.updateInput('quit');
      input = container.querySelector('.command-input');
      expect(input.textContent).toBe(':quit');

      // Show feedback
      commandModeUI.showFeedback('Returning to main menu...', 'success');
      const feedback = container.querySelector('.command-feedback');
      expect(feedback.textContent).toBe('Returning to main menu...');

      // Exit command mode
      commandModeUI.hide();
      expect(commandModeUI.isVisible()).toBe(false);
    });
  });
});
