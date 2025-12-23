/**
 * Standalone Level Entry Point
 *
 * This script initializes the standalone level runner,
 * bypassing the main game menus for rapid level testing.
 */

import { LevelRunner } from './LevelRunner.js';
import { createMazeLevel, createLargerMazeLevel } from './MazeLevel.js';

// Parse URL parameters for level configuration
function parseUrlParams() {
  // eslint-disable-next-line no-undef
  const params = new URLSearchParams(window.location.search);
  return {
    level: params.get('level') || 'small',
    debug: params.get('debug') !== 'false',
  };
}

// Select level based on URL parameter
function selectLevel(levelName) {
  switch (levelName) {
    case 'large':
    case 'larger':
      return createLargerMazeLevel();
    case 'small':
    case 'maze':
    default:
      return createMazeLevel();
  }
}

// Initialize and start the level
function init() {
  const config = parseUrlParams();
  const level = selectLevel(config.level);

  console.log(`[Standalone] Loading level: ${level.name}`);
  console.log(`[Standalone] Dimensions: ${level.width}x${level.height}`);
  console.log(`[Standalone] Coins: ${level.coins.length}`);
  console.log(`[Standalone] Walls: ${level.walls.length}`);

  const runner = new LevelRunner({
    onWin: (result) => {
      console.log('[Standalone] Level complete!', result);
      alert(
        `Level Complete!\n\nMoves: ${result.moves}\nCoins: ${result.coins}\n\nPress R to restart.`
      );
    },
    onLose: (result) => {
      console.log('[Standalone] Level failed!', result);
    },
  });

  runner.init(level);
  runner.start();

  // Expose runner globally for debugging
  window.levelRunner = runner;
  window.currentLevel = level;

  console.log('[Standalone] Level started. Use hjkl to move, R to restart.');
  console.log(
    '[Standalone] Access window.levelRunner and window.currentLevel for debugging.'
  );
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
