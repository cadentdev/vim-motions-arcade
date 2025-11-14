/**
 * Vim Motions Arcade - Main Entry Point
 */

import { ScreenManager } from './game/ScreenManager.js';
import { SaveManager } from './storage/SaveManager.js';
import { Leaderboard } from './storage/Leaderboard.js';

console.log('Vim Motions Arcade - Initializing...');

// Initialize managers
const screenManager = new ScreenManager();
const saveManager = new SaveManager();
const leaderboard = new Leaderboard();

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
function init() {
  console.log('Initializing game...');

  // Cache DOM elements
  cacheElements();

  // Set up screen manager callbacks
  setupScreenCallbacks();

  // Wire up event listeners
  setupEventListeners();

  // Initialize the main menu
  showMainMenu();

  console.log('Game initialized successfully!');
}

/**
 * Cache all DOM element references
 */
function cacheElements() {
  elements = {
    // Screens
    screenMainMenu: document.getElementById('screen-main-menu'),
    screenPlaying: document.getElementById('screen-playing'),
    screenLevelComplete: document.getElementById('screen-level-complete'),
    screenLevelFailed: document.getElementById('screen-level-failed'),

    // Main Menu buttons
    btnStartGame: document.getElementById('btn-start-game'),
    btnContinueGame: document.getElementById('btn-continue-game'),

    // Leaderboard
    leaderboardList: document.getElementById('leaderboard-list'),

    // End screen buttons
    btnNextLevel: document.getElementById('btn-next-level'),
    btnMenuComplete: document.getElementById('btn-menu-complete'),
    btnRetry: document.getElementById('btn-retry'),
    btnMenuFailed: document.getElementById('btn-menu-failed'),

    // Score displays
    finalScore: document.getElementById('final-score'),
    failedScore: document.getElementById('failed-score'),
  };
}

/**
 * Set up ScreenManager callbacks for showing/hiding screens
 */
function setupScreenCallbacks() {
  // Main Menu screen
  screenManager.onScreenEnter('MAIN_MENU', () => {
    showScreen(elements.screenMainMenu);
    updateContinueButton();
    renderLeaderboard();
  });

  screenManager.onScreenExit('MAIN_MENU', () => {
    hideScreen(elements.screenMainMenu);
  });

  // Playing screen
  screenManager.onScreenEnter('PLAYING', () => {
    showScreen(elements.screenPlaying);
  });

  screenManager.onScreenExit('PLAYING', () => {
    hideScreen(elements.screenPlaying);
  });

  // Level Complete screen
  screenManager.onScreenEnter('LEVEL_COMPLETE', () => {
    showScreen(elements.screenLevelComplete);
  });

  screenManager.onScreenExit('LEVEL_COMPLETE', () => {
    hideScreen(elements.screenLevelComplete);
  });

  // Level Failed screen
  screenManager.onScreenEnter('LEVEL_FAILED', () => {
    showScreen(elements.screenLevelFailed);
  });

  screenManager.onScreenExit('LEVEL_FAILED', () => {
    hideScreen(elements.screenLevelFailed);
  });
}

/**
 * Set up event listeners for all interactive elements
 */
function setupEventListeners() {
  // Main Menu buttons
  elements.btnStartGame.addEventListener('click', handleStartGame);
  elements.btnContinueGame.addEventListener('click', handleContinueGame);

  // End screen buttons
  elements.btnNextLevel.addEventListener('click', handleNextLevel);
  elements.btnMenuComplete.addEventListener('click', handleReturnToMenu);
  elements.btnRetry.addEventListener('click', handleRetry);
  elements.btnMenuFailed.addEventListener('click', handleReturnToMenu);
}

/**
 * Show the main menu
 */
function showMainMenu() {
  screenManager.switchTo('MAIN_MENU');
}

/**
 * Update Continue button state based on save file
 */
function updateContinueButton() {
  const hasSave = saveManager.hasSave();
  elements.btnContinueGame.disabled = !hasSave;
}

/**
 * Render the leaderboard
 */
function renderLeaderboard() {
  const scores = leaderboard.getTopScores();

  if (scores.length === 0) {
    elements.leaderboardList.innerHTML =
      '<p class="empty-message">No scores yet. Be the first to play!</p>';
    return;
  }

  elements.leaderboardList.innerHTML = scores
    .map(
      (entry) => `
      <div class="leaderboard-entry">
        <div class="leaderboard-rank">#${entry.rank}</div>
        <div class="leaderboard-score">${entry.score.toLocaleString()} pts</div>
        <div class="leaderboard-level">Level ${entry.level}</div>
        <div class="leaderboard-date">${formatDate(entry.date)}</div>
      </div>
    `
    )
    .join('');
}

/**
 * Format a date string for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Handle Start Game button click
 */
function handleStartGame() {
  console.log('Starting new game...');
  screenManager.switchTo('PLAYING');
  // TODO: Initialize new game state
}

/**
 * Handle Continue Game button click
 */
function handleContinueGame() {
  console.log('Continuing game...');
  const savedGame = saveManager.loadGame();
  if (savedGame) {
    console.log('Loaded save:', savedGame);
    screenManager.switchTo('PLAYING');
    // TODO: Load game state and resume
  }
}

/**
 * Handle Next Level button click
 */
function handleNextLevel() {
  console.log('Next level...');
  screenManager.switchTo('PLAYING');
  // TODO: Load next level
}

/**
 * Handle Retry button click
 */
function handleRetry() {
  console.log('Retrying level...');
  screenManager.switchTo('PLAYING');
  // TODO: Restart current level
}

/**
 * Handle Return to Menu button clicks
 */
function handleReturnToMenu() {
  console.log('Returning to main menu...');
  screenManager.switchTo('MAIN_MENU');
}

/**
 * Show a screen element
 */
function showScreen(element) {
  element.style.display = 'block';
  element.classList.add('active');
}

/**
 * Hide a screen element
 */
function hideScreen(element) {
  element.style.display = 'none';
  element.classList.remove('active');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// For development/debugging - expose to window
window.game = {
  screenManager,
  saveManager,
  leaderboard,
  // Helper function to add test scores
  addTestScore: (score, level) => {
    leaderboard.addScore({
      score,
      level,
      date: new Date().toISOString(),
    });
    renderLeaderboard();
  },
};
