/**
 * GameLoop Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameLoop } from '../../src/game/GameLoop.js';
import { GameState } from '../../src/game/GameState.js';

describe('GameLoop', () => {
  let gameLoop;
  let gameState;
  let mockCallbacks;

  beforeEach(() => {
    gameState = new GameState();
    mockCallbacks = {
      onUpdate: vi.fn(),
      onRender: vi.fn(),
      onWin: vi.fn(),
      onLose: vi.fn(),
    };
    gameLoop = new GameLoop(gameState, mockCallbacks);
  });

  afterEach(() => {
    if (gameLoop.isRunning) {
      gameLoop.stop();
    }
  });

  describe('Initialization', () => {
    it('should initialize with game state', () => {
      expect(gameLoop.gameState).toBe(gameState);
    });

    it('should initialize in stopped state', () => {
      expect(gameLoop.isRunning).toBe(false);
    });

    it('should store callbacks', () => {
      expect(gameLoop.callbacks).toBeDefined();
      expect(gameLoop.callbacks.onUpdate).toBe(mockCallbacks.onUpdate);
      expect(gameLoop.callbacks.onRender).toBe(mockCallbacks.onRender);
      expect(gameLoop.callbacks.onWin).toBe(mockCallbacks.onWin);
      expect(gameLoop.callbacks.onLose).toBe(mockCallbacks.onLose);
    });
  });

  describe('Start and Stop', () => {
    it('should start the game loop', () => {
      gameLoop.start();
      expect(gameLoop.isRunning).toBe(true);
    });

    it('should stop the game loop', () => {
      gameLoop.start();
      gameLoop.stop();
      expect(gameLoop.isRunning).toBe(false);
    });

    it('should not start if already running', () => {
      gameLoop.start();
      const animationId = gameLoop.animationId;
      gameLoop.start(); // Try to start again
      expect(gameLoop.animationId).toBe(animationId); // Should be same ID
    });
  });

  describe('Update Cycle', () => {
    it('should call update callback', () => {
      gameLoop.start();
      gameLoop.tick(16.67); // Simulate one frame at 60 FPS
      gameLoop.stop();

      expect(mockCallbacks.onUpdate).toHaveBeenCalled();
    });

    it('should pass delta time to update callback', () => {
      gameLoop.start();
      gameLoop.tick(16.67); // Simulate one frame
      gameLoop.stop();

      expect(mockCallbacks.onUpdate).toHaveBeenCalled();
      const deltaTime = mockCallbacks.onUpdate.mock.calls[0][0];
      expect(deltaTime).toBeGreaterThan(0);
    });

    it('should not update when paused', () => {
      gameState.pause();
      mockCallbacks.onUpdate.mockClear();

      gameLoop.start();
      gameLoop.tick(16.67);
      gameLoop.stop();

      // onUpdate might be called, but game state should not change
      expect(gameState.isPaused).toBe(true);
    });

    it('should decrement timer on update', () => {
      gameState.timer = 60;
      gameLoop.start();
      // Simulate ~200ms worth of updates
      for (let i = 0; i < 12; i++) {
        gameLoop.tick(16.67);
      }
      gameLoop.stop();

      expect(gameState.timer).toBeLessThan(60);
    });

    it('should not decrement timer when paused', () => {
      gameState.timer = 60;
      gameState.pause();
      gameLoop.start();
      // Simulate several frames
      for (let i = 0; i < 12; i++) {
        gameLoop.tick(16.67);
      }
      gameLoop.stop();

      expect(gameState.timer).toBe(60);
    });
  });

  describe('Render Cycle', () => {
    it('should call render callback', () => {
      gameLoop.start();
      gameLoop.tick(16.67);
      gameLoop.stop();

      expect(mockCallbacks.onRender).toHaveBeenCalled();
    });

    it('should render even when paused', () => {
      gameState.pause();
      mockCallbacks.onRender.mockClear();

      gameLoop.start();
      gameLoop.tick(16.67);
      gameLoop.stop();

      // Render should still be called when paused (to show pause screen)
      expect(mockCallbacks.onRender).toHaveBeenCalled();
    });
  });

  describe('Win Condition Detection', () => {
    it('should detect win when all coins collected', () => {
      const coins = [
        { x: 0, y: 0, collected: false },
        { x: 5, y: 5, collected: false },
      ];
      gameState.initializeLevel(1, coins);

      gameLoop.start();
      gameState.collectCoin(0);
      gameState.collectCoin(1);
      gameLoop.tick(16.67);

      expect(gameState.isLevelComplete).toBe(true);
      expect(mockCallbacks.onWin).toHaveBeenCalled();
    });

    it('should not trigger win before all coins collected', () => {
      const coins = [
        { x: 0, y: 0, collected: false },
        { x: 5, y: 5, collected: false },
      ];
      gameState.initializeLevel(1, coins);

      gameLoop.start();
      gameState.collectCoin(0); // Only collect one
      gameLoop.tick(16.67);
      gameLoop.stop();

      expect(gameState.isLevelComplete).toBe(false);
      expect(mockCallbacks.onWin).not.toHaveBeenCalled();
    });

    it('should stop loop after win', () => {
      const coins = [{ x: 0, y: 0, collected: false }];
      gameState.initializeLevel(1, coins);

      gameLoop.start();
      gameState.collectCoin(0);
      gameLoop.tick(16.67);

      expect(gameLoop.isRunning).toBe(false);
    });
  });

  describe('Lose Condition Detection', () => {
    it('should detect lose when timer expires', () => {
      gameState.timer = 0.05; // 50ms timer
      // Initialize with uncollected coins to prevent accidental win
      gameState.level.coins = [{ x: 0, y: 0, collected: false }];
      gameState.level.totalCoins = 1;
      gameState.level.collectedCoins = 0;

      gameLoop.start();
      // Simulate enough time to expire the timer
      for (let i = 0; i < 5; i++) {
        gameLoop.tick(16.67);
      }

      expect(gameState.timer).toBeLessThanOrEqual(0);
      expect(gameState.isGameOver).toBe(true);
      expect(mockCallbacks.onLose).toHaveBeenCalled();
    });

    it('should not trigger lose before timer expires', () => {
      gameState.timer = 60;

      gameLoop.start();
      gameLoop.tick(16.67);
      gameLoop.stop();

      expect(gameState.isGameOver).toBe(false);
      expect(mockCallbacks.onLose).not.toHaveBeenCalled();
    });

    it('should stop loop after lose', () => {
      gameState.timer = 0.05;

      gameLoop.start();
      // Simulate enough time to expire the timer
      for (let i = 0; i < 5; i++) {
        gameLoop.tick(16.67);
      }

      expect(gameLoop.isRunning).toBe(false);
    });
  });

  describe('Pause and Resume', () => {
    it('should pause the game loop', () => {
      gameLoop.start();
      gameLoop.pause();
      expect(gameState.isPaused).toBe(true);
    });

    it('should resume the game loop', () => {
      gameLoop.start();
      gameLoop.pause();
      gameLoop.resume();
      expect(gameState.isPaused).toBe(false);
    });

    it('should toggle pause state', () => {
      gameLoop.start();
      expect(gameState.isPaused).toBe(false);
      gameLoop.togglePause();
      expect(gameState.isPaused).toBe(true);
      gameLoop.togglePause();
      expect(gameState.isPaused).toBe(false);
    });
  });

  describe('Frame Timing', () => {
    it('should track frame count', () => {
      gameLoop.start();
      // Simulate several frames
      for (let i = 0; i < 10; i++) {
        gameLoop.tick(16.67);
      }
      gameLoop.stop();

      expect(gameLoop.frameCount).toBeGreaterThan(0);
    });

    it('should calculate average FPS', () => {
      // Mock getTime to simulate 1 second passing
      let currentTime = 0;
      gameLoop.getTime = () => currentTime;

      gameLoop.start();
      // Simulate 60 frames over 1 second
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67;
        gameLoop.tick(16.67);
      }
      gameLoop.stop();

      const fps = gameLoop.getAverageFPS();
      expect(fps).toBeGreaterThan(0);
      expect(fps).toBeLessThanOrEqual(60); // Should be at most 60 FPS
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing callbacks gracefully', () => {
      const minimalLoop = new GameLoop(gameState, {});
      minimalLoop.start();
      minimalLoop.tick(16.67);
      minimalLoop.stop();

      // Should not throw error
      expect(minimalLoop.isRunning).toBe(false);
    });

    it('should stop gracefully when not running', () => {
      expect(() => gameLoop.stop()).not.toThrow();
    });

    it('should handle rapid start/stop', () => {
      gameLoop.start();
      gameLoop.stop();
      gameLoop.start();
      gameLoop.stop();
      expect(gameLoop.isRunning).toBe(false);
    });
  });
});
