import { describe, it, expect } from 'vitest';
import { clamp, isColliding, formatTime } from '../../src/utils/helpers.js';

describe('clamp', () => {
  it('should return value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should return min when value is below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should return max when value is above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle negative ranges', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-15, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });
});

describe('isColliding', () => {
  it('should detect collision when rectangles overlap', () => {
    const rect1 = { x: 0, y: 0, width: 10, height: 10 };
    const rect2 = { x: 5, y: 5, width: 10, height: 10 };
    expect(isColliding(rect1, rect2)).toBe(true);
  });

  it('should return false when rectangles do not overlap', () => {
    const rect1 = { x: 0, y: 0, width: 10, height: 10 };
    const rect2 = { x: 20, y: 20, width: 10, height: 10 };
    expect(isColliding(rect1, rect2)).toBe(false);
  });

  it('should detect collision when rectangles touch edges', () => {
    const rect1 = { x: 0, y: 0, width: 10, height: 10 };
    const rect2 = { x: 10, y: 0, width: 10, height: 10 };
    expect(isColliding(rect1, rect2)).toBe(false);
  });

  it('should detect collision when one rectangle contains another', () => {
    const rect1 = { x: 0, y: 0, width: 100, height: 100 };
    const rect2 = { x: 25, y: 25, width: 10, height: 10 };
    expect(isColliding(rect1, rect2)).toBe(true);
  });
});

describe('formatTime', () => {
  it('should format time correctly for single digit seconds', () => {
    expect(formatTime(5)).toBe('00:05');
  });

  it('should format time correctly for double digit seconds', () => {
    expect(formatTime(45)).toBe('00:45');
  });

  it('should format time correctly with minutes', () => {
    expect(formatTime(125)).toBe('02:05');
  });

  it('should format time correctly for exactly one minute', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('should handle zero seconds', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('should handle large time values', () => {
    expect(formatTime(3665)).toBe('61:05');
  });
});
