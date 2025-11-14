/**
 * GameState Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/GameState.js';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('Initialization', () => {
    it('should initialize with default player state', () => {
      expect(gameState.player).toBeDefined();
      expect(gameState.player.x).toBe(0);
      expect(gameState.player.y).toBe(0);
      expect(gameState.player.mode).toBe('normal');
    });

    it('should initialize with default level state', () => {
      expect(gameState.level).toBeDefined();
      expect(gameState.level.current).toBe(1);
      expect(gameState.level.coins).toEqual([]);
      expect(gameState.level.totalCoins).toBe(0);
      expect(gameState.level.collectedCoins).toBe(0);
    });

    it('should initialize with default score and timer', () => {
      expect(gameState.score).toBe(0);
      expect(gameState.timer).toBe(60);
    });

    it('should initialize with default health', () => {
      expect(gameState.health).toBe(3);
    });

    it('should initialize with basic motions unlocked', () => {
      expect(gameState.unlockedMotions).toBeDefined();
      expect(gameState.unlockedMotions.h).toBe(true);
      expect(gameState.unlockedMotions.j).toBe(true);
      expect(gameState.unlockedMotions.k).toBe(true);
      expect(gameState.unlockedMotions.l).toBe(true);
      // Advanced motions should be locked
      expect(gameState.unlockedMotions.w).toBe(false);
      expect(gameState.unlockedMotions.b).toBe(false);
      expect(gameState.unlockedMotions.e).toBe(false);
    });

    it('should initialize with default progression state', () => {
      expect(gameState.xp).toBe(0);
      expect(gameState.playerLevel).toBe(1);
    });

    it('should initialize with game state flags', () => {
      expect(gameState.isPaused).toBe(false);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.isLevelComplete).toBe(false);
    });
  });

  describe('State Updates', () => {
    it('should update player position', () => {
      gameState.updatePlayerPosition(5, 10);
      expect(gameState.player.x).toBe(5);
      expect(gameState.player.y).toBe(10);
    });

    it('should update player mode', () => {
      gameState.updatePlayerMode('visual');
      expect(gameState.player.mode).toBe('visual');
    });

    it('should update score', () => {
      gameState.addScore(100);
      expect(gameState.score).toBe(100);
      gameState.addScore(50);
      expect(gameState.score).toBe(150);
    });

    it('should update timer', () => {
      gameState.updateTimer(45);
      expect(gameState.timer).toBe(45);
    });

    it('should update health', () => {
      gameState.updateHealth(2);
      expect(gameState.health).toBe(2);
    });

    it('should not allow negative health', () => {
      gameState.updateHealth(-1);
      expect(gameState.health).toBe(0);
    });
  });

  describe('Level Management', () => {
    it('should initialize level with coins', () => {
      const coins = [
        { x: 0, y: 0, collected: false },
        { x: 5, y: 5, collected: false },
        { x: 10, y: 10, collected: false },
      ];
      gameState.initializeLevel(1, coins);
      expect(gameState.level.current).toBe(1);
      expect(gameState.level.coins).toEqual(coins);
      expect(gameState.level.totalCoins).toBe(3);
      expect(gameState.level.collectedCoins).toBe(0);
    });

    it('should mark a coin as collected', () => {
      const coins = [
        { x: 0, y: 0, collected: false },
        { x: 5, y: 5, collected: false },
      ];
      gameState.initializeLevel(1, coins);

      gameState.collectCoin(0);
      expect(gameState.level.coins[0].collected).toBe(true);
      expect(gameState.level.collectedCoins).toBe(1);
    });

    it('should not double-collect a coin', () => {
      const coins = [{ x: 0, y: 0, collected: false }];
      gameState.initializeLevel(1, coins);

      gameState.collectCoin(0);
      gameState.collectCoin(0); // Try to collect again
      expect(gameState.level.collectedCoins).toBe(1); // Should still be 1
    });

    it('should check if all coins are collected', () => {
      const coins = [
        { x: 0, y: 0, collected: false },
        { x: 5, y: 5, collected: false },
      ];
      gameState.initializeLevel(1, coins);

      expect(gameState.areAllCoinsCollected()).toBe(false);
      gameState.collectCoin(0);
      expect(gameState.areAllCoinsCollected()).toBe(false);
      gameState.collectCoin(1);
      expect(gameState.areAllCoinsCollected()).toBe(true);
    });
  });

  describe('Motion Unlocking', () => {
    it('should unlock a motion', () => {
      expect(gameState.unlockedMotions.w).toBe(false);
      gameState.unlockMotion('w');
      expect(gameState.unlockedMotions.w).toBe(true);
    });

    it('should check if a motion is unlocked', () => {
      expect(gameState.isMotionUnlocked('h')).toBe(true);
      expect(gameState.isMotionUnlocked('w')).toBe(false);
      gameState.unlockMotion('w');
      expect(gameState.isMotionUnlocked('w')).toBe(true);
    });
  });

  describe('Game State Flags', () => {
    it('should pause the game', () => {
      gameState.pause();
      expect(gameState.isPaused).toBe(true);
    });

    it('should resume the game', () => {
      gameState.pause();
      gameState.resume();
      expect(gameState.isPaused).toBe(false);
    });

    it('should mark game as over', () => {
      gameState.setGameOver();
      expect(gameState.isGameOver).toBe(true);
    });

    it('should mark level as complete', () => {
      gameState.setLevelComplete();
      expect(gameState.isLevelComplete).toBe(true);
    });
  });

  describe('State Reset', () => {
    it('should reset level state when starting new level', () => {
      // Set up some state
      gameState.updatePlayerPosition(10, 10);
      gameState.addScore(100);
      const coins = [{ x: 0, y: 0, collected: false }];
      gameState.initializeLevel(1, coins);
      gameState.collectCoin(0);
      gameState.setLevelComplete();

      // Start new level
      const newCoins = [
        { x: 5, y: 5, collected: false },
        { x: 10, y: 10, collected: false },
      ];
      gameState.initializeLevel(2, newCoins);

      // Level state should reset
      expect(gameState.level.current).toBe(2);
      expect(gameState.level.coins).toEqual(newCoins);
      expect(gameState.level.collectedCoins).toBe(0);
      expect(gameState.isLevelComplete).toBe(false);

      // Persistent state should remain
      expect(gameState.score).toBe(100); // Score persists across levels
    });

    it('should fully reset game state', () => {
      // Set up some state
      gameState.updatePlayerPosition(10, 10);
      gameState.addScore(100);
      gameState.updateHealth(1);
      gameState.unlockMotion('w');

      gameState.reset();

      // Everything should be back to default
      expect(gameState.player.x).toBe(0);
      expect(gameState.player.y).toBe(0);
      expect(gameState.score).toBe(0);
      expect(gameState.health).toBe(3);
      expect(gameState.unlockedMotions.w).toBe(false);
      expect(gameState.level.current).toBe(1);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      gameState.updatePlayerPosition(5, 10);
      gameState.addScore(150);
      gameState.unlockMotion('w');

      const json = gameState.toJSON();
      expect(json.player.x).toBe(5);
      expect(json.player.y).toBe(10);
      expect(json.score).toBe(150);
      expect(json.unlockedMotions.w).toBe(true);
    });

    it('should restore from JSON', () => {
      const savedState = {
        player: { x: 5, y: 10, mode: 'normal' },
        level: {
          current: 2,
          coins: [{ x: 0, y: 0, collected: true }],
          totalCoins: 1,
          collectedCoins: 1,
        },
        score: 150,
        timer: 45,
        health: 2,
        unlockedMotions: {
          h: true,
          j: true,
          k: true,
          l: true,
          w: true,
          b: false,
          e: false,
        },
        xp: 100,
        playerLevel: 2,
        isPaused: false,
        isGameOver: false,
        isLevelComplete: false,
      };

      gameState.fromJSON(savedState);
      expect(gameState.player.x).toBe(5);
      expect(gameState.player.y).toBe(10);
      expect(gameState.score).toBe(150);
      expect(gameState.health).toBe(2);
      expect(gameState.unlockedMotions.w).toBe(true);
      expect(gameState.level.current).toBe(2);
    });
  });
});
