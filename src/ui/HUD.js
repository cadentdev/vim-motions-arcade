/**
 * HUD - Heads-Up Display for game information
 *
 * Displays score, timer, and mode indicator as a fixed overlay.
 * Updates in real-time based on GameState changes.
 */
export class HUD {
  constructor() {
    this.container = null;
    this.hudContainer = null;
    this.scoreElement = null;
    this.timerElement = null;
    this.modeElement = null;
    this.initialized = false;
  }

  /**
   * Initialize HUD with DOM container
   * @param {HTMLElement} container - The parent container element
   */
  initialize(container) {
    // eslint-disable-next-line no-undef
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('Container must be a valid DOM element');
    }

    this.container = container;

    // Create HUD container
    this.hudContainer = document.createElement('div');
    this.hudContainer.className = 'hud-container';
    this.hudContainer.style.position = 'fixed';
    this.hudContainer.style.top = '0';
    this.hudContainer.style.left = '0';
    this.hudContainer.style.width = '100%';
    this.hudContainer.style.height = '100%';
    this.hudContainer.style.pointerEvents = 'none'; // Don't block game interaction
    this.hudContainer.style.zIndex = '1000'; // Above game elements

    // Create score display (top-right)
    this.scoreElement = document.createElement('div');
    this.scoreElement.className = 'hud-score';
    this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '10px';
    this.scoreElement.style.right = '10px';
    this.scoreElement.style.fontFamily = 'monospace';
    this.scoreElement.style.fontSize = '18px';
    this.scoreElement.style.color = '#ffffff';
    this.scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.scoreElement.style.padding = '8px 12px';
    this.scoreElement.style.borderRadius = '4px';
    this.scoreElement.textContent = 'Score: 0';

    // Create timer display (top-center)
    this.timerElement = document.createElement('div');
    this.timerElement.className = 'hud-timer';
    this.timerElement.style.position = 'absolute';
    this.timerElement.style.top = '10px';
    this.timerElement.style.left = '50%';
    this.timerElement.style.transform = 'translateX(-50%)';
    this.timerElement.style.fontFamily = 'monospace';
    this.timerElement.style.fontSize = '24px';
    this.timerElement.style.fontWeight = 'bold';
    this.timerElement.style.color = '#00ff00'; // Default green
    this.timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.timerElement.style.padding = '8px 16px';
    this.timerElement.style.borderRadius = '4px';
    this.timerElement.textContent = '0:00';

    // Create mode indicator (bottom-left)
    this.modeElement = document.createElement('div');
    this.modeElement.className = 'hud-mode';
    this.modeElement.style.position = 'absolute';
    this.modeElement.style.bottom = '10px';
    this.modeElement.style.left = '10px';
    this.modeElement.style.fontFamily = 'monospace';
    this.modeElement.style.fontSize = '16px';
    this.modeElement.style.fontWeight = 'bold';
    this.modeElement.style.color = '#ffffff';
    this.modeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.modeElement.style.padding = '6px 10px';
    this.modeElement.style.borderRadius = '4px';
    this.modeElement.textContent = '-- NORMAL --';

    // Append elements to HUD container
    this.hudContainer.appendChild(this.scoreElement);
    this.hudContainer.appendChild(this.timerElement);
    this.hudContainer.appendChild(this.modeElement);

    // Append HUD container to parent
    this.container.appendChild(this.hudContainer);

    this.initialized = true;
  }

  /**
   * Update score display
   * @param {number} score - Current score value
   */
  updateScore(score) {
    if (!this.initialized) {
      throw new Error('HUD must be initialized before updating score');
    }

    if (typeof score !== 'number') {
      throw new Error('Score must be a number');
    }

    this.scoreElement.textContent = `Score: ${score}`;
  }

  /**
   * Update timer display with color coding
   * @param {number} seconds - Remaining time in seconds
   */
  updateTimer(seconds) {
    if (!this.initialized) {
      throw new Error('HUD must be initialized before updating timer');
    }

    if (typeof seconds !== 'number') {
      throw new Error('Timer value must be a number');
    }

    // Format as MM:SS
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedTime = `${minutes}:${secs.toString().padStart(2, '0')}`;

    this.timerElement.textContent = formattedTime;

    // Apply color coding based on time remaining
    if (seconds > 30) {
      // Green: Safe zone
      this.timerElement.style.color = '#00ff00';
      this.timerElement.className = 'hud-timer timer-green';
    } else if (seconds >= 15) {
      // Yellow/Orange: Warning zone
      this.timerElement.style.color = '#ffff00';
      this.timerElement.className = 'hud-timer timer-yellow';
    } else {
      // Red: Danger zone
      this.timerElement.style.color = '#ff0000';
      this.timerElement.className = 'hud-timer timer-red';
    }
  }

  /**
   * Update mode indicator
   * @param {string} mode - Current vim mode (e.g., 'NORMAL', 'INSERT', 'VISUAL')
   */
  updateMode(mode) {
    if (!this.initialized) {
      throw new Error('HUD must be initialized before updating mode');
    }

    // Convert to uppercase for consistency
    const modeUpper = mode.toUpperCase();
    this.modeElement.textContent = `-- ${modeUpper} --`;
  }

  /**
   * Clean up and remove HUD from DOM
   */
  destroy() {
    if (this.hudContainer && this.hudContainer.parentNode) {
      this.hudContainer.parentNode.removeChild(this.hudContainer);
    }

    this.container = null;
    this.hudContainer = null;
    this.scoreElement = null;
    this.timerElement = null;
    this.modeElement = null;
    this.initialized = false;
  }
}
