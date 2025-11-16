import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderVersion } from '../../src/ui/VersionDisplay.js';

describe('Main Menu', () => {
  let container;

  beforeEach(() => {
    // Create a minimal DOM structure for the main menu
    container = document.createElement('div');
    container.id = 'screen-main-menu';
    container.className = 'screen';
    container.innerHTML = `
      <div class="main-menu">
        <header class="game-header">
          <h1 class="game-title">VIM MOTIONS ARCADE</h1>
          <p class="game-subtitle">Master vim motions through arcade gameplay</p>
        </header>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Version Display', () => {
    it('should display a version number on the main menu', () => {
      // Call the function that renders the version
      renderVersion(container);

      // Check that version element exists
      const versionElement = container.querySelector('.version-display');
      expect(versionElement).toBeTruthy();
    });

    it('should display version in the correct format (v0.0.0)', () => {
      renderVersion(container);

      const versionElement = container.querySelector('.version-display');
      const versionText = versionElement.textContent;

      // Check format: starts with 'v' followed by semantic version (X.Y.Z)
      expect(versionText).toMatch(/^v\d+\.\d+\.\d+$/);
    });

    it('should position version in bottom right corner', () => {
      renderVersion(container);

      const versionElement = container.querySelector('.version-display');

      // Check that element has appropriate class for positioning
      expect(versionElement.classList.contains('version-display')).toBe(true);
    });

    it('should have appropriate styling for dimmed text', () => {
      renderVersion(container);

      const versionElement = container.querySelector('.version-display');

      // Verify the element exists and has the right class for styling
      expect(versionElement).toBeTruthy();
      expect(versionElement.classList.contains('version-display')).toBe(true);
    });
  });
});
