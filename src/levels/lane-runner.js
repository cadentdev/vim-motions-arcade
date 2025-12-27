/**
 * Lane Runner Entry Point
 *
 * Initializes the lane runner level for j/k training.
 */

import { LaneRunnerLevel } from './LaneRunnerLevel.js';

function init() {
  console.log('[Lane Runner] Initializing j/k training level');

  const level = new LaneRunnerLevel({
    onWin: (result) => {
      console.log('[Lane Runner] Level complete!', result);
    },
    onLose: (result) => {
      console.log('[Lane Runner] Collision at distance:', result.distance);
    },
  });

  level.init();

  // Expose for debugging
  window.laneRunner = level;

  console.log('[Lane Runner] Ready. Press SPACE to start.');
  console.log('[Lane Runner] Use j (down) and k (up) to switch lanes.');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
