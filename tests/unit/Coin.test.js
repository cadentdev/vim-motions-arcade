import { describe, it, expect, beforeEach } from 'vitest';
import { Coin } from '../../src/entities/Coin.js';

describe('Coin', () => {
  let coin;

  beforeEach(() => {
    coin = new Coin(10, 5, 10);
  });

  describe('Initialization', () => {
    it('should create coin instance', () => {
      expect(coin).toBeDefined();
    });

    it('should set position', () => {
      expect(coin.x).toBe(10);
      expect(coin.y).toBe(5);
    });

    it('should set value', () => {
      expect(coin.value).toBe(10);
    });

    it('should not be collected initially', () => {
      expect(coin.isCollected()).toBe(false);
    });

    it('should have default value if not specified', () => {
      const defaultCoin = new Coin(0, 0);
      expect(defaultCoin.value).toBe(10); // Default coin value
    });
  });

  describe('Collection', () => {
    it('should mark coin as collected', () => {
      coin.collect();
      expect(coin.isCollected()).toBe(true);
    });

    it('should not collect an already collected coin', () => {
      coin.collect();
      const result = coin.collect();
      expect(result).toBe(0); // Returns 0, not false
    });

    it('should return value on first collection', () => {
      const value = coin.collect();
      expect(value).toBe(10);
    });

    it('should return 0 on subsequent collections', () => {
      coin.collect();
      const value = coin.collect();
      expect(value).toBe(0);
    });
  });

  describe('Position', () => {
    it('should get position', () => {
      const pos = coin.getPosition();
      expect(pos).toEqual({ x: 10, y: 5 });
    });

    it('should check if position matches', () => {
      expect(coin.isAt(10, 5)).toBe(true);
      expect(coin.isAt(10, 6)).toBe(false);
      expect(coin.isAt(9, 5)).toBe(false);
    });
  });

  describe('State', () => {
    it('should export state', () => {
      const state = coin.getState();
      expect(state).toEqual({
        x: 10,
        y: 5,
        value: 10,
        collected: false,
      });
    });

    it('should restore from state', () => {
      const newCoin = new Coin(0, 0, 0);
      newCoin.setState({ x: 15, y: 20, value: 25, collected: true });

      expect(newCoin.x).toBe(15);
      expect(newCoin.y).toBe(20);
      expect(newCoin.value).toBe(25);
      expect(newCoin.isCollected()).toBe(true);
    });
  });
});
