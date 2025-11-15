/**
 * EndScreenManager - Manage level complete and failed end screens
 *
 * Handles displaying end screens, updating scores, and wiring up button callbacks.
 */
export class EndScreenManager {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;

    // Get screen elements from DOM
    this.levelCompleteScreen = document.getElementById('screen-level-complete');
    this.levelFailedScreen = document.getElementById('screen-level-failed');

    // Get button elements
    this.btnNextLevel = document.getElementById('btn-next-level');
    this.btnRetry = document.getElementById('btn-retry');
    this.btnMenuComplete = document.getElementById('btn-menu-complete');
    this.btnMenuFailed = document.getElementById('btn-menu-failed');

    // Get score display elements
    this.finalScoreDisplay = document.getElementById('final-score');
    this.failedScoreDisplay = document.getElementById('failed-score');

    // Track current score for button callbacks
    this.currentScore = 0;

    // Bound event handlers (for proper cleanup)
    this.handleNextLevel = this.handleNextLevel.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleMainMenuComplete = this.handleMainMenuComplete.bind(this);
    this.handleMainMenuFailed = this.handleMainMenuFailed.bind(this);
  }

  /**
   * Show level complete screen with score
   * @param {number} score - Final score to display
   */
  showLevelComplete(score) {
    if (typeof score !== 'number') {
      throw new Error('Score must be a number');
    }

    this.currentScore = score;

    // Hide failed screen
    if (this.levelFailedScreen) {
      this.levelFailedScreen.style.display = 'none';
    }

    // Update score display
    if (this.finalScoreDisplay) {
      this.finalScoreDisplay.textContent = `Score: ${score}`;
    }

    // Attach event listeners
    this.attachCompleteScreenListeners();

    // Show complete screen
    if (this.levelCompleteScreen) {
      this.levelCompleteScreen.style.display = 'block';
    }
  }

  /**
   * Show level failed screen with score
   * @param {number} score - Final score to display
   */
  showLevelFailed(score) {
    if (typeof score !== 'number') {
      throw new Error('Score must be a number');
    }

    this.currentScore = score;

    // Hide complete screen
    if (this.levelCompleteScreen) {
      this.levelCompleteScreen.style.display = 'none';
    }

    // Update score display
    if (this.failedScoreDisplay) {
      this.failedScoreDisplay.textContent = `Score: ${score}`;
    }

    // Attach event listeners
    this.attachFailedScreenListeners();

    // Show failed screen
    if (this.levelFailedScreen) {
      this.levelFailedScreen.style.display = 'block';
    }
  }

  /**
   * Hide both end screens
   */
  hide() {
    if (this.levelCompleteScreen) {
      this.levelCompleteScreen.style.display = 'none';
    }
    if (this.levelFailedScreen) {
      this.levelFailedScreen.style.display = 'none';
    }

    this.detachEventListeners();
  }

  /**
   * Attach event listeners for level complete screen
   */
  attachCompleteScreenListeners() {
    // Detach first to avoid duplicates
    this.detachCompleteScreenListeners();

    if (this.btnNextLevel) {
      this.btnNextLevel.addEventListener('click', this.handleNextLevel);
    }
    if (this.btnMenuComplete) {
      this.btnMenuComplete.addEventListener(
        'click',
        this.handleMainMenuComplete
      );
    }
  }

  /**
   * Attach event listeners for level failed screen
   */
  attachFailedScreenListeners() {
    // Detach first to avoid duplicates
    this.detachFailedScreenListeners();

    if (this.btnRetry) {
      this.btnRetry.addEventListener('click', this.handleRetry);
    }
    if (this.btnMenuFailed) {
      this.btnMenuFailed.addEventListener('click', this.handleMainMenuFailed);
    }
  }

  /**
   * Detach event listeners for level complete screen
   */
  detachCompleteScreenListeners() {
    if (this.btnNextLevel) {
      this.btnNextLevel.removeEventListener('click', this.handleNextLevel);
    }
    if (this.btnMenuComplete) {
      this.btnMenuComplete.removeEventListener(
        'click',
        this.handleMainMenuComplete
      );
    }
  }

  /**
   * Detach event listeners for level failed screen
   */
  detachFailedScreenListeners() {
    if (this.btnRetry) {
      this.btnRetry.removeEventListener('click', this.handleRetry);
    }
    if (this.btnMenuFailed) {
      this.btnMenuFailed.removeEventListener(
        'click',
        this.handleMainMenuFailed
      );
    }
  }

  /**
   * Detach all event listeners
   */
  detachEventListeners() {
    this.detachCompleteScreenListeners();
    this.detachFailedScreenListeners();
  }

  /**
   * Handle Next Level button click
   */
  handleNextLevel() {
    if (this.callbacks.onNextLevel) {
      this.callbacks.onNextLevel({ score: this.currentScore });
    }
  }

  /**
   * Handle Retry button click
   */
  handleRetry() {
    if (this.callbacks.onRetry) {
      this.callbacks.onRetry({ score: this.currentScore });
    }
  }

  /**
   * Handle Main Menu button click (from complete screen)
   */
  handleMainMenuComplete() {
    if (this.callbacks.onMainMenu) {
      this.callbacks.onMainMenu({ score: this.currentScore });
    }
  }

  /**
   * Handle Main Menu button click (from failed screen)
   */
  handleMainMenuFailed() {
    if (this.callbacks.onMainMenu) {
      this.callbacks.onMainMenu({ score: this.currentScore });
    }
  }
}
