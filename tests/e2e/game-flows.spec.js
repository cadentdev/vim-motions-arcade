import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Vim Motions Arcade - Game Flows
 * Tests cover all critical user flows for MVP deployment
 */

// Helper function to clear localStorage before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Clear localStorage to ensure clean state
  await page.evaluate(() => localStorage.clear());
});

test.describe('Tutorial Level 0: How to Quit Vim', () => {
  test.skip('should complete tutorial by typing :q and return to menu', async ({
    page,
  }) => {
    await page.goto('/');

    // Click Start New Game
    await page.click('#btn-start-game');

    // Should show tutorial screen
    const tutorialContent = page.locator('.tutorial-content');
    await expect(tutorialContent).toBeVisible();
    await expect(tutorialContent).toContainText('How to quit vim');
    await expect(tutorialContent).toContainText('Type :q and press Enter');

    // Press : to enter command mode
    await page.keyboard.press(':');

    // Command mode overlay should appear
    const commandOverlay = page.locator('.command-mode-overlay');
    await expect(commandOverlay).toBeVisible();

    // Command input should show ":"
    const commandInput = page.locator('.command-input');
    await expect(commandInput).toContainText(':');

    // Type "q"
    await page.keyboard.type('q');
    await expect(commandInput).toContainText(':q');

    // Press Enter
    await page.keyboard.press('Enter');

    // Should show success feedback
    const feedback = page.locator('.command-feedback.success');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('Success');

    // Wait for transition to actual game (2 second delay in code)
    await page.waitForTimeout(2500);

    // Should now be in the actual game (not tutorial)
    const gameArea = page.locator('#game-area');
    await expect(gameArea).toBeVisible();

    // Tutorial content should be gone
    await expect(tutorialContent).not.toBeVisible();

    // Should have HUD elements (score, timer, mode)
    const hud = page.locator('.hud-container');
    await expect(hud).toBeVisible();
  });

  test.skip('should show tutorial only on first game', async ({ page }) => {
    await page.goto('/');

    // First game - should show tutorial
    await page.click('#btn-start-game');
    await expect(page.locator('.tutorial-content')).toBeVisible();

    // Complete tutorial
    await page.keyboard.press(':');
    await page.keyboard.type('q');
    await page.keyboard.press('Enter');

    // Wait for game to start
    await page.waitForTimeout(2500);

    // Quit the game
    await page.keyboard.press(':');
    await page.keyboard.type('q');
    await page.keyboard.press('Enter');

    // Should be back at main menu (wait for transition)
    await expect(page.locator('#screen-main-menu')).toBeVisible({
      timeout: 5000,
    });

    // Start game again - should NOT show tutorial
    await page.click('#btn-start-game');

    // Should go straight to game, not tutorial
    await expect(page.locator('.tutorial-content')).not.toBeVisible();
    await expect(page.locator('.hud-container')).toBeVisible();
  });

  test('should allow Escape to cancel command mode in tutorial', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');

    // Press : to enter command mode
    await page.keyboard.press(':');
    const commandOverlay = page.locator('.command-mode-overlay');
    await expect(commandOverlay).toBeVisible();

    // Press Escape to cancel
    await page.keyboard.press('Escape');
    await expect(commandOverlay).not.toBeVisible();

    // Tutorial should still be showing
    await expect(page.locator('.tutorial-content')).toBeVisible();
  });
});

test.describe('Menu Navigation', () => {
  test.skip('should navigate from main menu to game and back', async ({
    page,
  }) => {
    await page.goto('/');

    // Complete tutorial first
    await page.click('#btn-start-game');
    await page.keyboard.press(':');
    await page.keyboard.type('q');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    // Should be in game
    await expect(page.locator('#screen-playing')).toBeVisible();
    await expect(page.locator('#screen-main-menu')).not.toBeVisible();

    // Quit back to menu with :q
    await page.keyboard.press(':');
    await page.keyboard.type('q');
    await page.keyboard.press('Enter');

    // Should be back at main menu (wait for transition)
    await expect(page.locator('#screen-main-menu')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('#screen-playing')).not.toBeVisible();
  });

  test('should show correct button states on menu', async ({ page }) => {
    await page.goto('/');

    // Continue button should be disabled (no save exists)
    const continueBtn = page.locator('#btn-continue-game');
    await expect(continueBtn).toBeDisabled();

    // Start button should be enabled
    const startBtn = page.locator('#btn-start-game');
    await expect(startBtn).toBeEnabled();
  });

  test('should navigate menu with vim keys (j/k) and activate with Enter', async ({
    page,
  }) => {
    await page.goto('/');

    // Create a save so Continue button is enabled and we have 2 navigable buttons
    await page.evaluate(() => {
      localStorage.setItem(
        'vim-arcade-save',
        JSON.stringify({
          level: { current: 1 },
          score: 50,
          tutorialCompleted: false,
        })
      );
    });

    // Reload to apply the save
    await page.reload();

    const startBtn = page.locator('#btn-start-game');
    const continueBtn = page.locator('#btn-continue-game');

    // Both buttons should be enabled
    await expect(startBtn).toBeEnabled();
    await expect(continueBtn).toBeEnabled();

    // Continue button should initially have focus (since save exists)
    await expect(continueBtn).toHaveClass(/focused/);
    await expect(startBtn).not.toHaveClass(/focused/);

    // Press k to move up
    await page.keyboard.press('k');

    // Start button should now have focus
    await expect(startBtn).toHaveClass(/focused/);
    await expect(continueBtn).not.toHaveClass(/focused/);

    // Press j to move back down
    await page.keyboard.press('j');

    // Continue button should have focus again
    await expect(continueBtn).toHaveClass(/focused/);
    await expect(startBtn).not.toHaveClass(/focused/);

    // Press k one more time to move back to Start
    await page.keyboard.press('k');
    await expect(startBtn).toHaveClass(/focused/);

    // Press Enter to activate Start Game
    await page.keyboard.press('Enter');

    // Should navigate to tutorial/game
    await page.waitForTimeout(500);
    await expect(page.locator('.tutorial-content')).toBeVisible();
  });

  test('should skip disabled Continue button when navigating', async ({
    page,
  }) => {
    await page.goto('/');

    const startBtn = page.locator('#btn-start-game');
    const continueBtn = page.locator('#btn-continue-game');

    // Continue button should be disabled (no save exists)
    await expect(continueBtn).toBeDisabled();

    // Start button should initially have focus
    await expect(startBtn).toHaveClass(/focused/);

    // Press j to move down - should skip disabled Continue button
    // (When Continue is disabled, there's only 1 active button, so j shouldn't move)
    await page.keyboard.press('j');

    // Since Continue is disabled and there are only 2 buttons,
    // we should still be on Start (can't move to disabled button)
    await expect(startBtn).toHaveClass(/focused/);
    await expect(continueBtn).not.toHaveClass(/focused/);

    // Press k to try moving up - should also stay on Start
    await page.keyboard.press('k');
    await expect(startBtn).toHaveClass(/focused/);
  });

  test('should focus Continue button when save exists', async ({ page }) => {
    await page.goto('/');

    // Create a save in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'vim-arcade-save',
        JSON.stringify({
          level: { current: 1 },
          score: 50,
          tutorialCompleted: true,
        })
      );
    });

    // Reload to trigger save detection and menu navigator setup
    await page.reload();

    const continueBtn = page.locator('#btn-continue-game');

    // Continue button should be enabled now
    await expect(continueBtn).toBeEnabled();

    // Continue button should have initial focus (since save exists)
    await expect(continueBtn).toHaveClass(/focused/);
  });

  test('should activate focused button when Enter is pressed', async ({
    page,
  }) => {
    await page.goto('/');

    const startBtn = page.locator('#btn-start-game');

    // Start button should have focus
    await expect(startBtn).toHaveClass(/focused/);

    // Press Enter to activate the focused button
    await page.keyboard.press('Enter');

    // Should navigate to tutorial (verifying Enter activated the Start button)
    await page.waitForTimeout(500);
    await expect(page.locator('.tutorial-content')).toBeVisible();
  });

  test('should not allow navigation past boundaries', async ({ page }) => {
    await page.goto('/');

    const startBtn = page.locator('#btn-start-game');

    // Start button should have focus
    await expect(startBtn).toHaveClass(/focused/);

    // Press k multiple times (trying to go up past first button)
    await page.keyboard.press('k');
    await page.keyboard.press('k');
    await page.keyboard.press('k');

    // Should still be on Start button (no wrapping)
    await expect(startBtn).toHaveClass(/focused/);
  });
});

test.describe('Movement System', () => {
  test.skip('should move cursor with hjkl keys', async ({ page }) => {
    await page.goto('/');

    // Mark tutorial as completed in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'vim-arcade-save',
        JSON.stringify({ tutorialCompleted: true })
      );
    });

    // Reload page to pick up the tutorial completion
    await page.reload();

    // Start game
    await page.click('#btn-start-game');
    await page.waitForTimeout(1000);

    // Get initial cursor position by checking the player element
    const player = page.locator('.player-cursor').first();
    await expect(player).toBeVisible();

    // Press h (left) - cursor should move
    await page.keyboard.press('h');
    await page.waitForTimeout(200);

    // Press j (down)
    await page.keyboard.press('j');
    await page.waitForTimeout(200);

    // Press k (up)
    await page.keyboard.press('k');
    await page.waitForTimeout(200);

    // Press l (right)
    await page.keyboard.press('l');
    await page.waitForTimeout(200);

    // Player should still be visible (basic movement works)
    await expect(player).toBeVisible();
  });
});

test.describe('Win Condition Flow', () => {
  test.skip('should show level complete screen when all coins collected', async ({
    page,
  }) => {
    await page.goto('/');

    // Start game
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500); // Wait for tutorial to complete

    // For testing, we'll use page.evaluate to simulate collecting all coins
    // In a real scenario, we'd navigate and collect them
    await page.evaluate(() => {
      // Access the game coordinator through window.game
      const gameCoordinator = window.game?.gameCoordinator;
      const gameState = gameCoordinator?.getGameState();
      if (gameState) {
        // Collect all coins
        gameState.level.coins.forEach((coin, index) => {
          gameState.collectCoin(index);
        });
      }
    });

    // Wait for win condition to trigger
    await page.waitForTimeout(1000);

    // Should show level complete screen
    const completeScreen = page.locator('#screen-level-complete');
    await expect(completeScreen).toBeVisible();

    // Should show score
    const scoreDisplay = page.locator('#final-score');
    await expect(scoreDisplay).toBeVisible();
    await expect(scoreDisplay).toContainText('Score:');
  });

  test.skip('should allow returning to menu from level complete screen', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate win
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.level.coins.forEach((_, index) => {
          gameState.collectCoin(index);
        });
      }
    });

    // Wait for level complete screen to be visible
    const completeScreen = page.locator('#screen-level-complete');
    await expect(completeScreen).toBeVisible({ timeout: 10000 });

    // Wait for Main Menu button to be visible and click it
    const menuButton = page.locator('#btn-menu-complete');
    await expect(menuButton).toBeVisible({ timeout: 5000 });
    await menuButton.click();

    // Should return to main menu
    await expect(page.locator('#screen-main-menu')).toBeVisible({
      timeout: 5000,
    });
    await expect(completeScreen).not.toBeVisible();
  });

  test.skip('should allow restarting from level complete screen', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate win
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.level.coins.forEach((_, index) => {
          gameState.collectCoin(index);
        });
      }
    });

    // Wait for level complete screen to be visible
    const completeScreen = page.locator('#screen-level-complete');
    await expect(completeScreen).toBeVisible({ timeout: 10000 });

    // Wait for Next Level button to be visible and click it
    const nextLevelButton = page.locator('#btn-next-level');
    await expect(nextLevelButton).toBeVisible({ timeout: 5000 });
    await nextLevelButton.click();

    // Should return to playing screen
    await expect(page.locator('#screen-playing')).toBeVisible({
      timeout: 5000,
    });
    await expect(completeScreen).not.toBeVisible();

    // HUD should be visible
    await expect(page.locator('.hud-container')).toBeVisible();
  });
});

test.describe('Lose Condition Flow', () => {
  test.skip('should show level failed screen when timer expires', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate timer expiring
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.timer = 0;
      }
    });

    // Wait for lose condition to trigger
    await page.waitForTimeout(1000);

    // Should show level failed screen
    const failedScreen = page.locator('#screen-level-failed');
    await expect(failedScreen).toBeVisible();

    // Should show score
    const scoreDisplay = page.locator('#failed-score');
    await expect(scoreDisplay).toBeVisible();
    await expect(scoreDisplay).toContainText('Score:');
  });

  test.skip('should allow retry from level failed screen', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate timer expiring
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.timer = 0;
      }
    });

    // Wait for level failed screen to be visible
    const failedScreen = page.locator('#screen-level-failed');
    await expect(failedScreen).toBeVisible({ timeout: 10000 });

    // Wait for Retry button to be visible and click it
    const retryButton = page.locator('#btn-retry');
    await expect(retryButton).toBeVisible({ timeout: 5000 });
    await retryButton.click();

    // Should return to playing screen
    await expect(page.locator('#screen-playing')).toBeVisible({
      timeout: 5000,
    });
    await expect(failedScreen).not.toBeVisible();

    // HUD should be visible
    await expect(page.locator('.hud-container')).toBeVisible();
  });

  test.skip('should allow returning to menu from level failed screen', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate timer expiring
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.timer = 0;
      }
    });

    // Wait for level failed screen to be visible
    const failedScreen = page.locator('#screen-level-failed');
    await expect(failedScreen).toBeVisible({ timeout: 10000 });

    // Wait for Main Menu button to be visible and click it
    const menuButton = page.locator('#btn-menu-failed');
    await expect(menuButton).toBeVisible({ timeout: 5000 });
    await menuButton.click();

    // Should return to main menu
    await expect(page.locator('#screen-main-menu')).toBeVisible({
      timeout: 5000,
    });
    await expect(failedScreen).not.toBeVisible();
  });
});

test.describe('Leaderboard System', () => {
  test.skip('should display score in leaderboard after winning', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Simulate win with some score
    await page.evaluate(() => {
      const gameState = window.game.gameCoordinator?.getGameState();
      if (gameState) {
        gameState.score = 150;
        gameState.level.coins.forEach((_, index) => {
          gameState.collectCoin(index);
        });
      }
    });

    // Wait for level complete screen to be visible
    const completeScreen = page.locator('#screen-level-complete');
    await expect(completeScreen).toBeVisible({ timeout: 10000 });

    // Wait for Main Menu button to be visible and click it
    const menuButton = page.locator('#btn-menu-complete');
    await expect(menuButton).toBeVisible({ timeout: 5000 });
    await menuButton.click();

    // Wait for main menu to be visible
    await expect(page.locator('#screen-main-menu')).toBeVisible({
      timeout: 5000,
    });

    // Check leaderboard
    const leaderboard = page.locator('#leaderboard-list');
    await expect(leaderboard).toBeVisible();

    // Should contain the score we just earned
    await expect(leaderboard).toContainText('150');
    await expect(leaderboard).toContainText('pts');
  });

  test('should show empty message when no scores exist', async ({ page }) => {
    await page.goto('/');

    // Leaderboard should show empty message
    const leaderboard = page.locator('#leaderboard-list');
    await expect(leaderboard).toContainText('No scores yet');
  });
});

test.describe('Game State Persistence', () => {
  test.skip('should enable continue button when save exists', async ({
    page,
  }) => {
    await page.goto('/');

    // Create a save in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'vim-arcade-save',
        JSON.stringify({
          level: { current: 1 },
          score: 50,
          tutorialCompleted: true,
        })
      );
    });

    // Reload to trigger save detection
    await page.reload();

    // Continue button should now be enabled
    const continueBtn = page.locator('#btn-continue-game');
    await expect(continueBtn).toBeEnabled();
  });
});

test.describe('Command Mode', () => {
  test.skip('should handle :help command', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Enter command mode
    await page.keyboard.press(':');

    // Type help
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');

    // Should show help feedback
    const feedback = page.locator('.command-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('Available commands');
  });

  test.skip('should show error for unknown command', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Enter command mode
    await page.keyboard.press(':');

    // Type invalid command
    await page.keyboard.type('invalid');
    await page.keyboard.press('Enter');

    // Should show error feedback
    const feedback = page.locator('.command-feedback.error');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('Unknown command');
  });

  test('should handle backspace in command mode', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // Enter command mode
    await page.keyboard.press(':');

    // Type some characters
    await page.keyboard.type('abc');

    // Check command input shows :abc
    const commandInput = page.locator('.command-input');
    await expect(commandInput).toContainText(':abc');

    // Press backspace
    await page.keyboard.press('Backspace');
    await expect(commandInput).toContainText(':ab');

    await page.keyboard.press('Backspace');
    await expect(commandInput).toContainText(':a');
  });
});

test.describe('HUD Display', () => {
  test.skip('should display HUD elements during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start-game');
    await page.waitForTimeout(2500);

    // HUD should be visible
    const hud = page.locator('.hud-container');
    await expect(hud).toBeVisible();

    // Should show score
    const score = page.locator('.hud-score');
    await expect(score).toBeVisible();
    await expect(score).toContainText('Score');

    // Should show timer
    const timer = page.locator('.hud-timer');
    await expect(timer).toBeVisible();

    // Should show status bar with mode indicator
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toBeVisible();
    await expect(statusBar).toContainText('NORMAL');
  });
});

test.describe('Menu Command Mode', () => {
  test('should show status bar on main menu', async ({ page }) => {
    await page.goto('/');

    // Status bar should be visible
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toBeVisible();
    await expect(statusBar).toContainText('NORMAL');
  });

  test('should enter command mode when pressing :', async ({ page }) => {
    await page.goto('/');

    // Press : to enter command mode
    await page.keyboard.press(':');

    // Status bar should show COMMAND mode
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toContainText('COMMAND');

    // Command mode overlay should appear
    const commandOverlay = page.locator('.command-mode-overlay');
    await expect(commandOverlay).toBeVisible();

    // Command input should show ":"
    const commandInput = page.locator('.command-input');
    await expect(commandInput).toContainText(':');
  });

  test('should exit command mode with Escape', async ({ page }) => {
    await page.goto('/');

    // Enter command mode
    await page.keyboard.press(':');

    // Type some characters
    await page.keyboard.type('test');

    // Press Escape
    await page.keyboard.press('Escape');

    // Status bar should show NORMAL mode
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toContainText('NORMAL');

    // Command mode overlay should be hidden
    const commandOverlay = page.locator('.command-mode-overlay');
    await expect(commandOverlay).not.toBeVisible();
  });

  test('should start new game with :new command', async ({ page }) => {
    await page.goto('/');

    // Enter command mode and type :new
    await page.keyboard.press(':');
    await page.keyboard.type('new');

    // Command input should show ":new"
    const commandInput = page.locator('.command-input');
    await expect(commandInput).toContainText(':new');

    // Press Enter
    await page.keyboard.press('Enter');

    // Should navigate to game screen (may show tutorial first)
    // Wait for either tutorial or game to appear
    await page.waitForTimeout(1000);

    // Should not be on main menu anymore
    const mainMenu = page.locator('#screen-main-menu');
    await expect(mainMenu).not.toBeVisible();
  });

  test('should show error for invalid command', async ({ page }) => {
    await page.goto('/');

    // Enter command mode and type invalid command
    await page.keyboard.press(':');
    await page.keyboard.type('invalid');
    await page.keyboard.press('Enter');

    // Status bar should show error
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toHaveClass(/error/);
    await expect(statusBar).toContainText('Unknown command');
  });

  test('should disable j/k navigation when in command mode', async ({
    page,
  }) => {
    await page.goto('/');

    // Create a save so Continue button is enabled (needed for j navigation test)
    await page.evaluate(() => {
      localStorage.setItem(
        'vim-arcade-save',
        JSON.stringify({
          level: { current: 1 },
          score: 50,
          tutorialCompleted: true,
        })
      );
    });
    await page.reload();

    // Initially focus should be on Continue button (since save exists)
    const continueButton = page.locator('#btn-continue-game');
    await expect(continueButton).toHaveClass(/focused/);

    // Move to Start button first
    await page.keyboard.press('k');
    const startButton = page.locator('#btn-start-game');
    await expect(startButton).toHaveClass(/focused/);

    // Enter command mode
    await page.keyboard.press(':');

    // Press j (should not move focus)
    await page.keyboard.type('j');

    // Command input should show ":j" (not navigate)
    const commandInput = page.locator('.command-input');
    await expect(commandInput).toContainText(':j');

    // Exit command mode
    await page.keyboard.press('Escape');

    // Now j should work for navigation (back to Continue button)
    await page.keyboard.press('j');
    await expect(continueButton).toHaveClass(/focused/);
  });

  // Skip: alert() interaction with headless Playwright causes navigation issues
  test.skip('should show help with :help command', async ({ page }) => {
    await page.goto('/');

    // Verify we're on the main menu with status bar
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toContainText('NORMAL');

    // Auto-accept any dialogs that appear
    page.on('dialog', (dialog) => dialog.accept());

    // Enter command mode and type :help
    await page.keyboard.press(':');
    await expect(statusBar).toContainText('COMMAND');

    await page.keyboard.type('help');
    await page.keyboard.press('Enter');

    // Wait for the command to process and mode to switch back
    await page.waitForTimeout(1000);

    // Should return to NORMAL mode after help is shown
    // (and dialog is auto-accepted)
    await expect(statusBar).toContainText('NORMAL');

    // Verify we're still on the main menu (not navigated away)
    const mainMenu = page.locator('#screen-main-menu');
    await expect(mainMenu).toBeVisible();
  });
});
