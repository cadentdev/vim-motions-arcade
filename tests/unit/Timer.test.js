import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Timer } from '../../src/game/Timer.js';

describe('Timer', () => {
  let timer;

  beforeEach(() => {
    vi.useFakeTimers();
    timer = new Timer(60);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should create timer instance', () => {
      expect(timer).toBeDefined();
    });

    it('should set initial time', () => {
      expect(timer.getTime()).toBe(60);
    });

    it('should not be running initially', () => {
      expect(timer.isRunning()).toBe(false);
    });

    it('should not be expired initially', () => {
      expect(timer.isExpired()).toBe(false);
    });
  });

  describe('Start/Stop', () => {
    it('should start timer', () => {
      timer.start();
      expect(timer.isRunning()).toBe(true);
    });

    it('should stop timer', () => {
      timer.start();
      timer.stop();
      expect(timer.isRunning()).toBe(false);
    });

    it('should pause timer', () => {
      timer.start();
      timer.pause();
      expect(timer.isRunning()).toBe(false);
    });

    it('should resume timer', () => {
      timer.start();
      timer.pause();
      timer.resume();
      expect(timer.isRunning()).toBe(true);
    });
  });

  describe('Countdown', () => {
    it('should countdown when running', () => {
      timer.start();
      const initialTime = timer.getTime();

      vi.advanceTimersByTime(1000); // Advance 1 second
      timer.update(1000); // Update with delta time

      expect(timer.getTime()).toBeLessThan(initialTime);
    });

    it('should decrease by correct amount', () => {
      timer.start();

      timer.update(2500); // 2.5 seconds

      expect(timer.getTime()).toBe(57.5);
    });

    it('should not countdown when paused', () => {
      timer.start();
      timer.pause();
      const timeWhenPaused = timer.getTime();

      timer.update(1000);

      expect(timer.getTime()).toBe(timeWhenPaused);
    });

    it('should not go below zero', () => {
      timer.start();

      timer.update(70000); // 70 seconds (more than initial 60)

      expect(timer.getTime()).toBe(0);
    });
  });

  describe('Expiration', () => {
    it('should mark as expired when time reaches zero', () => {
      timer.start();

      timer.update(60000); // Exactly 60 seconds

      expect(timer.isExpired()).toBe(true);
    });

    it('should call callback on expiration', () => {
      const callback = vi.fn();
      timer.onExpire(callback);
      timer.start();

      timer.update(60000);

      expect(callback).toHaveBeenCalled();
    });

    it('should call callback only once', () => {
      const callback = vi.fn();
      timer.onExpire(callback);
      timer.start();

      timer.update(60000);
      timer.update(1000); // Continue updating after expiration

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Time Formatting', () => {
    it('should format time as MM:SS', () => {
      expect(timer.getFormattedTime()).toBe('01:00');
    });

    it('should format partial seconds', () => {
      timer.start();
      timer.update(30500); // 29.5 seconds remaining (60 - 30.5)
      expect(timer.getFormattedTime()).toBe('00:29'); // Floors to 29
    });

    it('should pad single digit seconds', () => {
      const shortTimer = new Timer(5);
      expect(shortTimer.getFormattedTime()).toBe('00:05');
    });

    it('should handle hours if needed', () => {
      const longTimer = new Timer(3661); // 1 hour, 1 minute, 1 second
      expect(longTimer.getFormattedTime()).toBe('61:01');
    });
  });

  describe('Reset', () => {
    it('should reset to initial time', () => {
      timer.start();
      timer.update(10000);
      timer.reset();

      expect(timer.getTime()).toBe(60);
      expect(timer.isExpired()).toBe(false);
    });

    it('should stop timer when reset', () => {
      timer.start();
      timer.reset();

      expect(timer.isRunning()).toBe(false);
    });
  });

  describe('State', () => {
    it('should export state', () => {
      timer.start();
      timer.update(10000);

      const state = timer.getState();
      expect(state).toEqual({
        time: 50,
        initialTime: 60,
        running: true,
        expired: false,
      });
    });

    it('should restore from state', () => {
      timer.setState({
        time: 30,
        initialTime: 60,
        running: false,
        expired: false,
      });

      expect(timer.getTime()).toBe(30);
      expect(timer.isRunning()).toBe(false);
    });
  });
});
