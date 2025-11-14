/**
 * GameCoordinator Tests
 */
/* global KeyboardEvent */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameCoordinator } from '../../src/game/GameCoordinator.js';

describe('GameCoordinator', () => {
  let coordinator;
  let mockContainer;
  let mockCallbacks;

  beforeEach(() => {
    // Create mock DOM containers
    mockContainer = document.createElement('div');
    mockContainer.id = 'test-game-container';
    document.body.appendChild(mockContainer);

    mockCallbacks = {
      onWin: vi.fn(),
      onLose: vi.fn(),
      onStateChange: vi.fn(),
    };

    coordinator = new GameCoordinator(mockCallbacks);
  });

  afterEach(() => {
    // Clean up
    if (coordinator) {
      coordinator.cleanup();
    }
    if (mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });

  describe('Initialization', () => {
    it('should initialize without a container', () => {
      expect(coordinator).toBeDefined();
    });

    it('should accept callbacks during construction', () => {
      expect(coordinator.callbacks).toBeDefined();
      expect(coordinator.callbacks.onWin).toBe(mockCallbacks.onWin);
    });

    it('should work without callbacks', () => {
      const coord = new GameCoordinator();
      expect(coord).toBeDefined();
      expect(() => coord.cleanup()).not.toThrow();
    });

    it('should not be running initially', () => {
      expect(coordinator.isRunning).toBe(false);
    });
  });

  describe('Start New Game', () => {
    it('should initialize all game systems', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Should create GameState
      expect(coordinator.gameState).toBeDefined();

      // Should create GameLoop
      expect(coordinator.gameLoop).toBeDefined();

      // Should create renderers
      expect(coordinator.mapRenderer).toBeDefined();
      expect(coordinator.playerRenderer).toBeDefined();
      expect(coordinator.coinRenderer).toBeDefined();

      // Should create HUD
      expect(coordinator.hud).toBeDefined();

      // Should create InputManager
      expect(coordinator.inputManager).toBeDefined();
    });

    it('should set up the game container', () => {
      coordinator.startNewGame(mockContainer, 1);

      expect(coordinator.container).toBe(mockContainer);
    });

    it('should initialize GameState with level', () => {
      coordinator.startNewGame(mockContainer, 1);

      expect(coordinator.gameState.level.current).toBe(1);
    });

    it('should generate map and coins for the level', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Map should be generated
      expect(coordinator.gameState.map).toBeDefined();

      // Coins should be placed
      expect(coordinator.gameState.level.coins.length).toBeGreaterThan(0);
      expect(coordinator.gameState.level.totalCoins).toBeGreaterThan(0);
    });

    it('should render initial game state', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Map should be rendered
      const mapBlocks = mockContainer.querySelectorAll('.map-block');
      expect(mapBlocks.length).toBeGreaterThan(0);

      // Player cursor should be rendered
      const playerCursor = mockContainer.querySelectorAll('.player-cursor');
      expect(playerCursor.length).toBe(1);

      // Coins should be rendered
      const coins = mockContainer.querySelectorAll('.coin');
      expect(coins.length).toBeGreaterThan(0);

      // HUD should be rendered
      const hud = mockContainer.querySelectorAll('.hud-container');
      expect(hud.length).toBe(1);
    });

    it('should enable input handling', () => {
      coordinator.startNewGame(mockContainer, 1);

      expect(coordinator.inputManager.isEnabled).toBe(true);
    });

    it('should start the game loop', () => {
      coordinator.startNewGame(mockContainer, 1);

      expect(coordinator.gameLoop.isRunning).toBe(true);
      expect(coordinator.isRunning).toBe(true);
    });

    it('should throw error if container is invalid', () => {
      expect(() => coordinator.startNewGame(null, 1)).toThrow(/container/i);
      expect(() => coordinator.startNewGame('invalid', 1)).toThrow(
        /container/i
      );
    });
  });

  describe('Game Loop Integration', () => {
    beforeEach(() => {
      coordinator.startNewGame(mockContainer, 1);
    });

    it('should update HUD on each frame', () => {
      const initialScore = coordinator.gameState.score;

      // Simulate a frame
      coordinator.gameLoop.tick();

      // HUD should reflect current state
      const scoreDisplay = mockContainer.querySelector('.hud-score');
      expect(scoreDisplay.textContent).toContain(initialScore.toString());

      const timerDisplay = mockContainer.querySelector('.hud-timer');
      expect(timerDisplay.textContent).toBeTruthy();
    });

    it('should re-render player position when moved', () => {
      const initialX = coordinator.gameState.player.x;
      const initialY = coordinator.gameState.player.y;

      // Move player (simulate input)
      coordinator.gameState.updatePlayerPosition(initialX + 1, initialY);
      coordinator.update(); // Manual update

      const cursor = mockContainer.querySelector('.player-cursor');
      expect(cursor.style.left).toBe(
        `${(initialX + 1) * coordinator.playerRenderer.characterWidth}px`
      );
    });
  });

  describe('Win Condition Handling', () => {
    it('should call onWin callback when all coins are collected', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Collect all coins
      coordinator.gameState.level.coins.forEach((coin, index) => {
        coordinator.gameState.collectCoin(index);
      });

      // Trigger game loop check
      coordinator.gameLoop.checkGameConditions();

      expect(mockCallbacks.onWin).toHaveBeenCalled();
    });

    it('should stop game loop on win', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Collect all coins
      coordinator.gameState.level.coins.forEach((coin, index) => {
        coordinator.gameState.collectCoin(index);
      });

      coordinator.gameLoop.checkGameConditions();

      expect(coordinator.gameLoop.isRunning).toBe(false);
      expect(coordinator.isRunning).toBe(false);
    });

    it('should pass final score to onWin callback', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Collect all coins
      coordinator.gameState.level.coins.forEach((coin, index) => {
        coordinator.gameState.collectCoin(index);
        coordinator.gameState.score += 10; // Simulate scoring
      });

      coordinator.gameLoop.checkGameConditions();

      expect(mockCallbacks.onWin).toHaveBeenCalledWith(
        expect.objectContaining({
          score: expect.any(Number),
          level: 1,
        })
      );
    });
  });

  describe('Lose Condition Handling', () => {
    it('should call onLose callback when timer expires', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Expire timer
      coordinator.gameState.timer = 0;

      // Trigger game loop check
      coordinator.gameLoop.checkGameConditions();

      expect(mockCallbacks.onLose).toHaveBeenCalled();
    });

    it('should stop game loop on lose', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Expire timer
      coordinator.gameState.timer = 0;

      coordinator.gameLoop.checkGameConditions();

      expect(coordinator.gameLoop.isRunning).toBe(false);
      expect(coordinator.isRunning).toBe(false);
    });

    it('should pass final stats to onLose callback', () => {
      coordinator.startNewGame(mockContainer, 1);

      coordinator.gameState.score = 50;
      coordinator.gameState.timer = 0;

      coordinator.gameLoop.checkGameConditions();

      expect(mockCallbacks.onLose).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 50,
          coinsCollected: expect.any(Number),
        })
      );
    });
  });

  describe('Input Handling', () => {
    beforeEach(() => {
      coordinator.startNewGame(mockContainer, 1);
    });

    it('should handle movement input', () => {
      const initialX = coordinator.gameState.player.x;

      // Simulate 'l' key press (move right)
      coordinator.inputManager.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'l' })
      );

      // Player should have moved
      expect(coordinator.gameState.player.x).toBeGreaterThan(initialX);
    });

    it('should disable input when game is not running', () => {
      coordinator.cleanup();

      expect(coordinator.inputManager.isEnabled).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should stop the game loop', () => {
      coordinator.startNewGame(mockContainer, 1);
      expect(coordinator.gameLoop.isRunning).toBe(true);

      coordinator.cleanup();

      expect(coordinator.gameLoop.isRunning).toBe(false);
    });

    it('should disable input handling', () => {
      coordinator.startNewGame(mockContainer, 1);
      expect(coordinator.inputManager.isEnabled).toBe(true);

      coordinator.cleanup();

      expect(coordinator.inputManager.isEnabled).toBe(false);
    });

    it('should clear all renderers', () => {
      coordinator.startNewGame(mockContainer, 1);

      // Verify elements exist
      expect(
        mockContainer.querySelectorAll('.map-block').length
      ).toBeGreaterThan(0);
      expect(mockContainer.querySelectorAll('.coin').length).toBeGreaterThan(0);
      expect(mockContainer.querySelectorAll('.player-cursor').length).toBe(1);

      coordinator.cleanup();

      // Elements should be removed
      expect(mockContainer.querySelectorAll('.map-block').length).toBe(0);
      expect(mockContainer.querySelectorAll('.coin').length).toBe(0);
      expect(mockContainer.querySelectorAll('.player-cursor').length).toBe(0);
    });

    it('should remove HUD', () => {
      coordinator.startNewGame(mockContainer, 1);
      expect(
        mockContainer.querySelectorAll('.hud-container').length
      ).toBeGreaterThan(0);

      coordinator.cleanup();

      expect(mockContainer.querySelectorAll('.hud-container').length).toBe(0);
    });

    it('should not error if cleanup is called without starting game', () => {
      expect(() => coordinator.cleanup()).not.toThrow();
    });

    it('should not error if cleanup is called multiple times', () => {
      coordinator.startNewGame(mockContainer, 1);
      coordinator.cleanup();
      expect(() => coordinator.cleanup()).not.toThrow();
    });
  });

  describe('Pause/Resume', () => {
    beforeEach(() => {
      coordinator.startNewGame(mockContainer, 1);
    });

    it('should pause the game loop', () => {
      coordinator.pause();

      expect(coordinator.gameLoop.isRunning).toBe(false);
      expect(coordinator.isRunning).toBe(false);
    });

    it('should disable input when paused', () => {
      coordinator.pause();

      expect(coordinator.inputManager.isEnabled).toBe(false);
    });

    it('should resume the game loop', () => {
      coordinator.pause();
      coordinator.resume();

      expect(coordinator.gameLoop.isRunning).toBe(true);
      expect(coordinator.isRunning).toBe(true);
    });

    it('should enable input when resumed', () => {
      coordinator.pause();
      coordinator.resume();

      expect(coordinator.inputManager.isEnabled).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should track running state', () => {
      expect(coordinator.isRunning).toBe(false);

      coordinator.startNewGame(mockContainer, 1);
      expect(coordinator.isRunning).toBe(true);

      coordinator.cleanup();
      expect(coordinator.isRunning).toBe(false);
    });

    it('should provide access to current game state', () => {
      coordinator.startNewGame(mockContainer, 1);

      const state = coordinator.getGameState();
      expect(state).toBeDefined();
      expect(state.player).toBeDefined();
      expect(state.level).toBeDefined();
      expect(state.score).toBeDefined();
    });
  });
});
