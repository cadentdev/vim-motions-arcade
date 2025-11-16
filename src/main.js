/**
 * Vim Motions Arcade - Main Entry Point
 */

import { ScreenManager } from './game/ScreenManager.js';
import { SaveManager } from './storage/SaveManager.js';
import { Leaderboard } from './storage/Leaderboard.js';
import { GameCoordinator } from './game/GameCoordinator.js';
import { CommandMode } from './input/modes/CommandMode.js';
import { CommandModeUI } from './ui/CommandModeUI.js';
import { TutorialLevel } from './game/TutorialLevel.js';
import { renderVersion } from './ui/VersionDisplay.js';
import { MenuNavigator } from './input/MenuNavigator.js';

console.log('Vim Motions Arcade - Initializing...');

// Initialize managers
const screenManager = new ScreenManager();
const saveManager = new SaveManager();
const leaderboard = new Leaderboard();

// Game instance (created when starting a game)
let gameCoordinator = null;
let commandMode = null;
let commandModeUI = null;
let tutorialLevel = null;
let commandModeKeyHandler = null;
let tutorialKeyHandler = null;

// Menu navigation
let menuNavigator = null;

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
    renderVersion(elements.screenMainMenu);
    setupMenuNavigator();
  });

  screenManager.onScreenExit('MAIN_MENU', () => {
    hideScreen(elements.screenMainMenu);
    if (menuNavigator) {
      menuNavigator.disable();
    }
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
 * Set up keyboard navigation for main menu
 */
function setupMenuNavigator() {
  const buttons = [elements.btnStartGame, elements.btnContinueGame];

  menuNavigator = new MenuNavigator(buttons, {
    onActivate: (button) => {
      // Trigger click on the activated button
      button.click();
    },
  });

  // Enable first, then set initial focus based on save game state
  menuNavigator.enable();

  // Focus "Continue Game" if there's a save, otherwise "Start New Game"
  const initialIndex = saveManager.hasSave() ? 1 : 0;
  menuNavigator.setFocus(initialIndex);
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

  // Check if tutorial has been completed
  tutorialLevel = new TutorialLevel(saveManager);

  if (!tutorialLevel.isCompleted()) {
    // Show tutorial level
    startTutorialLevel();
  } else {
    // Start normal game at level 1
    startGame(1);
  }
}

/**
 * Handle Continue Game button click
 */
function handleContinueGame() {
  console.log('Continuing game...');
  const savedGame = saveManager.loadGame();
  if (savedGame) {
    console.log('Loaded save:', savedGame);
    const level = savedGame.level?.current || 1;
    startGame(level);
  }
}

/**
 * Handle Next Level button click
 */
function handleNextLevel() {
  console.log('Next level...');
  const currentLevel = gameCoordinator?.getGameState()?.level?.current || 1;
  startGame(currentLevel); // For MVP, restart same level
}

/**
 * Handle Retry button click
 */
function handleRetry() {
  console.log('Retrying level...');
  const currentLevel = gameCoordinator?.getGameState()?.level?.current || 1;
  startGame(currentLevel);
}

/**
 * Handle Return to Menu button clicks
 */
function handleReturnToMenu() {
  console.log('Returning to main menu...');
  cleanupGame();
  screenManager.switchTo('MAIN_MENU');
}

/**
 * Start the tutorial level
 */
function startTutorialLevel() {
  console.log('Starting tutorial level...');
  screenManager.switchTo('PLAYING');

  // Clear game area and show tutorial
  const gameArea = elements.screenPlaying.querySelector('#game-area');
  gameArea.innerHTML = '';

  // Create tutorial content
  const tutorialContent = document.createElement('div');
  tutorialContent.className = 'tutorial-content';
  tutorialContent.style.cssText = `
    max-width: 800px;
    margin: 100px auto;
    padding: 40px;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #00ff00;
    border-radius: 8px;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 18px;
    line-height: 1.8;
    white-space: pre-wrap;
  `;

  const content = tutorialLevel.getContent();
  tutorialContent.textContent = content.instructions;
  gameArea.appendChild(tutorialContent);

  // Set up command mode for tutorial
  setupCommandModeForTutorial(gameArea);
}

/**
 * Setup command mode for tutorial
 */
function setupCommandModeForTutorial(container) {
  // Create command mode UI
  commandModeUI = new CommandModeUI(container);
  commandMode = new CommandMode({});

  // Set up keyboard listener for tutorial
  tutorialKeyHandler = (event) => {
    // Handle colon to enter command mode
    if (event.key === ':' && !commandMode.isActive) {
      event.preventDefault();
      commandMode.activate();
      commandModeUI.show();
      return;
    }

    // If command mode is active
    if (commandMode.isActive) {
      event.preventDefault();

      if (event.key === 'Escape') {
        commandMode.cancel();
        commandModeUI.hide();
      } else if (event.key === 'Enter') {
        const result = commandMode.submit();

        if (result.success && result.action === 'quit') {
          // Tutorial complete!
          tutorialLevel.markComplete();
          commandModeUI.showFeedback(
            "Success! You've learned how to quit vim. Starting the game...",
            'success',
            2000
          );

          // Start actual game after brief delay
          setTimeout(() => {
            cleanupGame();
            startGame(1);
          }, 2000);
        } else if (!result.success) {
          commandModeUI.showFeedback(result.error, 'error', 3000);
        }

        commandModeUI.hide();
      } else if (event.key === 'Backspace') {
        commandMode.backspace();
        commandModeUI.updateInput(commandMode.getBuffer());
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        commandMode.addChar(event.key);
        commandModeUI.updateInput(commandMode.getBuffer());
      }
    }
  };

  document.addEventListener('keydown', tutorialKeyHandler);
}

/**
 * Start a normal game at specified level
 */
function startGame(level) {
  console.log(`Starting game at level ${level}...`);
  screenManager.switchTo('PLAYING');

  const gameArea = elements.screenPlaying.querySelector('#game-area');
  gameArea.innerHTML = ''; // Clear placeholder

  // Create game coordinator
  gameCoordinator = new GameCoordinator({
    onWin: handleGameWin,
    onLose: handleGameLose,
    onQuit: handleGameQuit,
  });

  // Start the game
  gameCoordinator.startNewGame(gameArea, level);

  // Set up command mode
  setupCommandMode(gameArea);
}

/**
 * Setup command mode during normal gameplay
 */
function setupCommandMode(container) {
  if (!gameCoordinator) return;

  const gameState = gameCoordinator.getGameState();
  commandModeUI = new CommandModeUI(container);
  commandMode = new CommandMode(gameState);

  // Override the InputManager's command mode callback
  const inputManager = gameCoordinator.inputManager;

  inputManager.callbacks.onCommandMode = () => {
    commandMode.activate();
    commandModeUI.show();

    // Pause the game
    gameCoordinator.pause();
  };

  // Set up command mode keyboard handling
  commandModeKeyHandler = (event) => {
    if (!commandMode.isActive) return;

    event.preventDefault();

    if (event.key === 'Escape') {
      commandMode.cancel();
      commandModeUI.hide();
      gameCoordinator.resume();
    } else if (event.key === 'Enter') {
      const result = commandMode.submit();

      if (result.success && result.action === 'quit') {
        commandModeUI.showFeedback(
          'Returning to main menu...',
          'success',
          1000
        );
        setTimeout(() => {
          cleanupGame();
          screenManager.switchTo('MAIN_MENU');
        }, 1000);
      } else if (result.success) {
        commandModeUI.showFeedback(result.message, 'success');
        commandModeUI.hide();
        gameCoordinator.resume();
      } else {
        commandModeUI.showFeedback(result.error, 'error', 3000);
        commandModeUI.hide();
        gameCoordinator.resume();
      }
    } else if (event.key === 'Backspace') {
      commandMode.backspace();
      commandModeUI.updateInput(commandMode.getBuffer());
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      commandMode.addChar(event.key);
      commandModeUI.updateInput(commandMode.getBuffer());
    }
  };

  document.addEventListener('keydown', commandModeKeyHandler);
}

/**
 * Handle game win
 */
function handleGameWin(result) {
  console.log('Game won!', result);

  // Save score to leaderboard
  leaderboard.addScore({
    score: result.score,
    level: result.level,
    date: new Date().toISOString(),
  });

  // Update end screen
  elements.finalScore.textContent = `Score: ${result.score}`;

  // Switch to level complete screen
  screenManager.switchTo('LEVEL_COMPLETE');
}

/**
 * Handle game lose
 */
function handleGameLose(result) {
  console.log('Game lost!', result);

  // Update end screen
  elements.failedScore.textContent = `Score: ${result.score}`;

  // Switch to level failed screen
  screenManager.switchTo('LEVEL_FAILED');
}

/**
 * Handle game quit (via :q command)
 */
function handleGameQuit() {
  console.log('Game quit via command');
  cleanupGame();
  screenManager.switchTo('MAIN_MENU');
}

/**
 * Clean up game resources
 */
function cleanupGame() {
  // Remove event listeners
  if (commandModeKeyHandler) {
    document.removeEventListener('keydown', commandModeKeyHandler);
    commandModeKeyHandler = null;
  }

  if (tutorialKeyHandler) {
    document.removeEventListener('keydown', tutorialKeyHandler);
    tutorialKeyHandler = null;
  }

  if (gameCoordinator) {
    gameCoordinator.cleanup();
    gameCoordinator = null;
  }

  if (commandModeUI) {
    commandModeUI.destroy();
    commandModeUI = null;
  }

  commandMode = null;
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
  // Expose game coordinator for E2E testing (use getter to access current instance)
  get gameCoordinator() {
    return gameCoordinator;
  },
  // Expose TutorialLevel for E2E testing
  TutorialLevel,
};
