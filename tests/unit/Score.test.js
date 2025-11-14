import { describe, it, expect, beforeEach } from 'vitest';
import { Score } from '../../src/game/Score.js';

describe('Score', () => {
  let score;

  beforeEach(() => {
    score = new Score();
  });

  describe('Initialization', () => {
    it('should create score instance', () => {
      expect(score).toBeDefined();
    });

    it('should start with zero score', () => {
      expect(score.getScore()).toBe(0);
    });

    it('should start with zero coins collected', () => {
      expect(score.getCoinsCollected()).toBe(0);
    });
  });

  describe('Adding Points', () => {
    it('should add points to score', () => {
      score.addPoints(100);
      expect(score.getScore()).toBe(100);
    });

    it('should accumulate points', () => {
      score.addPoints(100);
      score.addPoints(50);
      score.addPoints(25);
      expect(score.getScore()).toBe(175);
    });

    it('should not add negative points', () => {
      score.addPoints(-100);
      expect(score.getScore()).toBe(0);
    });
  });

  describe('Coin Collection', () => {
    it('should track coins collected', () => {
      score.collectCoin(10);
      expect(score.getCoinsCollected()).toBe(1);
    });

    it('should add coin value to score', () => {
      score.collectCoin(10);
      expect(score.getScore()).toBe(10);
    });

    it('should handle multiple coin collections', () => {
      score.collectCoin(10);
      score.collectCoin(15);
      score.collectCoin(10);

      expect(score.getCoinsCollected()).toBe(3);
      expect(score.getScore()).toBe(35);
    });
  });

  describe('Bonus Points', () => {
    it('should add bonus points', () => {
      score.addBonus(500, 'time');
      expect(score.getScore()).toBe(500);
    });

    it('should track bonus type', () => {
      score.addBonus(500, 'time');
      const bonuses = score.getBonuses();
      expect(bonuses).toContainEqual({ type: 'time', value: 500 });
    });

    it('should accumulate multiple bonuses', () => {
      score.addBonus(500, 'time');
      score.addBonus(300, 'perfect');
      score.addBonus(200, 'combo');

      expect(score.getScore()).toBe(1000);
      expect(score.getBonuses().length).toBe(3);
    });
  });

  describe('Reset', () => {
    it('should reset score to zero', () => {
      score.addPoints(100);
      score.collectCoin(10);
      score.reset();

      expect(score.getScore()).toBe(0);
      expect(score.getCoinsCollected()).toBe(0);
    });

    it('should clear bonuses', () => {
      score.addBonus(500, 'time');
      score.reset();

      expect(score.getBonuses().length).toBe(0);
    });
  });

  describe('State', () => {
    it('should export state', () => {
      score.addPoints(100);
      score.collectCoin(10);
      score.addBonus(500, 'time');

      const state = score.getState();
      expect(state).toEqual({
        score: 110,
        coinsCollected: 1,
        bonuses: [{ type: 'time', value: 500 }],
      });
    });

    it('should restore from state', () => {
      score.setState({
        score: 250,
        coinsCollected: 5,
        bonuses: [{ type: 'perfect', value: 1000 }],
      });

      expect(score.getScore()).toBe(250);
      expect(score.getCoinsCollected()).toBe(5);
      expect(score.getBonuses().length).toBe(1);
    });
  });
});
