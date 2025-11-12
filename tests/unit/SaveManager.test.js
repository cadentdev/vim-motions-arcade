import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SaveManager } from '../../src/storage/SaveManager.js';

describe('SaveManager', () => {
  let saveManager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    saveManager = new SaveManager();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Save Game', () => {
    it('should save game state to localStorage', () => {
      const gameState = {
        level: 1,
        score: 100,
        unlockedMotions: { h: true, j: true, k: true, l: true },
        xp: 50,
      };

      saveManager.saveGame(gameState);
      const saved = localStorage.getItem('vim-arcade-save');
      expect(saved).not.toBeNull();
    });

    it('should save complete game state structure', () => {
      const gameState = {
        level: 3,
        score: 500,
        unlockedMotions: { h: true, j: true, k: true, l: true, w: true },
        xp: 250,
        timestamp: Date.now(),
      };

      saveManager.saveGame(gameState);
      const loaded = saveManager.loadGame();

      expect(loaded.level).toBe(3);
      expect(loaded.score).toBe(500);
      expect(loaded.xp).toBe(250);
      expect(loaded.unlockedMotions.w).toBe(true);
    });
  });

  describe('Load Game', () => {
    it('should load saved game state', () => {
      const gameState = {
        level: 2,
        score: 250,
        unlockedMotions: { h: true, j: true, k: true, l: true },
        xp: 100,
      };

      saveManager.saveGame(gameState);
      const loaded = saveManager.loadGame();

      expect(loaded).toEqual(gameState);
    });

    it('should return null when no save exists', () => {
      const loaded = saveManager.loadGame();
      expect(loaded).toBeNull();
    });

    it('should handle corrupted save data gracefully', () => {
      localStorage.setItem('vim-arcade-save', 'invalid-json');
      const loaded = saveManager.loadGame();
      expect(loaded).toBeNull();
    });
  });

  describe('Has Save', () => {
    it('should return true when save exists', () => {
      const gameState = { level: 1, score: 0, unlockedMotions: {}, xp: 0 };
      saveManager.saveGame(gameState);
      expect(saveManager.hasSave()).toBe(true);
    });

    it('should return false when no save exists', () => {
      expect(saveManager.hasSave()).toBe(false);
    });
  });

  describe('Delete Save', () => {
    it('should delete existing save', () => {
      const gameState = { level: 1, score: 0, unlockedMotions: {}, xp: 0 };
      saveManager.saveGame(gameState);
      expect(saveManager.hasSave()).toBe(true);

      saveManager.deleteSave();
      expect(saveManager.hasSave()).toBe(false);
    });
  });
});
