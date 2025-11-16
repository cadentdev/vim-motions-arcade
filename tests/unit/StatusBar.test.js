import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StatusBar } from '../../src/ui/StatusBar.js';

describe('StatusBar', () => {
  let statusBar;
  let container;

  beforeEach(() => {
    // Create a container for the status bar
    container = document.createElement('div');
    document.body.appendChild(container);
    statusBar = new StatusBar(container);
  });

  afterEach(() => {
    if (statusBar) {
      statusBar.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Initialization', () => {
    it('should create status bar element', () => {
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement).toBeTruthy();
    });

    it('should start with NORMAL mode', () => {
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toContain('NORMAL');
    });

    it('should be visible by default', () => {
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Mode Display', () => {
    it('should display NORMAL mode', () => {
      statusBar.setMode('NORMAL');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toContain('NORMAL');
    });

    it('should display COMMAND mode', () => {
      statusBar.setMode('COMMAND');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toContain('COMMAND');
    });

    it('should format mode text with dashes', () => {
      statusBar.setMode('NORMAL');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('-- NORMAL --');
    });

    it('should update mode when changed', () => {
      statusBar.setMode('NORMAL');
      let statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('-- NORMAL --');

      statusBar.setMode('COMMAND');
      statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('-- COMMAND --');
    });
  });

  describe('Visibility', () => {
    it('should hide status bar', () => {
      statusBar.hide();
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.classList.contains('hidden')).toBe(true);
    });

    it('should show status bar', () => {
      statusBar.hide();
      statusBar.show();
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.classList.contains('hidden')).toBe(false);
    });

    it('should check if visible', () => {
      expect(statusBar.isVisible()).toBe(true);
      statusBar.hide();
      expect(statusBar.isVisible()).toBe(false);
      statusBar.show();
      expect(statusBar.isVisible()).toBe(true);
    });
  });

  describe('Message Display', () => {
    it('should display a message', () => {
      statusBar.showMessage('Test message');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('Test message');
    });

    it('should clear message and return to mode display', () => {
      statusBar.setMode('NORMAL');
      statusBar.showMessage('Test message');
      statusBar.clearMessage();
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('-- NORMAL --');
    });

    it('should display error message', () => {
      statusBar.showError('Error message');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.textContent).toBe('Error message');
      expect(statusBarElement.classList.contains('error')).toBe(true);
    });

    it('should clear error styling when showing normal message', () => {
      statusBar.showError('Error message');
      statusBar.showMessage('Normal message');
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement.classList.contains('error')).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should remove element on destroy', () => {
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement).toBeTruthy();

      statusBar.destroy();
      const afterDestroy = container.querySelector('.status-bar');
      expect(afterDestroy).toBeFalsy();
    });

    it('should handle multiple destroy calls', () => {
      statusBar.destroy();
      statusBar.destroy(); // Should not throw
      const statusBarElement = container.querySelector('.status-bar');
      expect(statusBarElement).toBeFalsy();
    });
  });
});
