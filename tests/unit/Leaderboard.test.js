import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Leaderboard } from '../../src/storage/Leaderboard.js';

describe('Leaderboard', () => {
  let leaderboard;

  beforeEach(() => {
    localStorage.clear();
    leaderboard = new Leaderboard();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Add Score', () => {
    it('should add a score entry', () => {
      leaderboard.addScore({
        score: 1000,
        level: 5,
        date: new Date().toISOString(),
      });

      const scores = leaderboard.getTopScores();
      expect(scores).toHaveLength(1);
      expect(scores[0].score).toBe(1000);
    });

    it('should sort scores in descending order', () => {
      leaderboard.addScore({ score: 500, level: 3, date: '2024-01-01' });
      leaderboard.addScore({ score: 1000, level: 5, date: '2024-01-02' });
      leaderboard.addScore({ score: 750, level: 4, date: '2024-01-03' });

      const scores = leaderboard.getTopScores();
      expect(scores[0].score).toBe(1000);
      expect(scores[1].score).toBe(750);
      expect(scores[2].score).toBe(500);
    });

    it('should limit to top 10 scores', () => {
      // Add 15 scores
      for (let i = 0; i < 15; i++) {
        leaderboard.addScore({
          score: (i + 1) * 100,
          level: i + 1,
          date: new Date().toISOString(),
        });
      }

      const scores = leaderboard.getTopScores();
      expect(scores).toHaveLength(10);
      expect(scores[0].score).toBe(1500); // Highest score
      expect(scores[9].score).toBe(600); // 10th highest
    });
  });

  describe('Get Top Scores', () => {
    it('should return empty array when no scores exist', () => {
      const scores = leaderboard.getTopScores();
      expect(scores).toEqual([]);
    });

    it('should return scores with rank numbers', () => {
      leaderboard.addScore({ score: 1000, level: 5, date: '2024-01-01' });
      leaderboard.addScore({ score: 500, level: 3, date: '2024-01-02' });

      const scores = leaderboard.getTopScores();
      expect(scores[0].rank).toBe(1);
      expect(scores[1].rank).toBe(2);
    });

    it('should return limited number of scores', () => {
      for (let i = 0; i < 20; i++) {
        leaderboard.addScore({
          score: i * 100,
          level: i,
          date: new Date().toISOString(),
        });
      }

      const top5 = leaderboard.getTopScores(5);
      expect(top5).toHaveLength(5);
    });
  });

  describe('Clear Leaderboard', () => {
    it('should clear all scores', () => {
      leaderboard.addScore({ score: 1000, level: 5, date: '2024-01-01' });
      leaderboard.addScore({ score: 500, level: 3, date: '2024-01-02' });

      expect(leaderboard.getTopScores()).toHaveLength(2);

      leaderboard.clearLeaderboard();

      expect(leaderboard.getTopScores()).toHaveLength(0);
    });
  });

  describe('Get Player Rank', () => {
    it('should return player rank for a given score', () => {
      leaderboard.addScore({ score: 1000, level: 5, date: '2024-01-01' });
      leaderboard.addScore({ score: 500, level: 3, date: '2024-01-02' });
      leaderboard.addScore({ score: 750, level: 4, date: '2024-01-03' });

      const rank = leaderboard.getPlayerRank(800);
      expect(rank).toBe(2); // Would be 2nd place
    });

    it('should return last place + 1 for score lower than all', () => {
      leaderboard.addScore({ score: 1000, level: 5, date: '2024-01-01' });
      leaderboard.addScore({ score: 500, level: 3, date: '2024-01-02' });

      const rank = leaderboard.getPlayerRank(100);
      expect(rank).toBe(3);
    });
  });
});
