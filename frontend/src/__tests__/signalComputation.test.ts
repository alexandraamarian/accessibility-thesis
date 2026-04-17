import { describe, it, expect } from 'vitest';
import {
  computeTremorScore,
  computeMissedTapRate,
  computeAvgDwellTime,
  computeScrollReversalRate,
} from '../utils/signalComputation';

describe('Signal Computation', () => {
  describe('computeTremorScore', () => {
    it('returns 0 for less than 2 taps', () => {
      expect(computeTremorScore([])).toBe(0);
      expect(computeTremorScore([{ x: 10, y: 10, missed: false }])).toBe(0);
    });

    it('computes standard deviation of tap positions', () => {
      const taps = [
        { x: 0, y: 0, missed: false },
        { x: 10, y: 0, missed: false },
        { x: 0, y: 10, missed: false },
      ];
      const score = computeTremorScore(taps);
      // Mean: x=3.33, y=3.33
      // Sample variance (n-1): x=33.33, y=33.33
      // sqrt(33.33 + 33.33) ≈ 8.16
      expect(score).toBeCloseTo(8.16, 1);
    });

    it('handles perfect precision (all taps at same position)', () => {
      const taps = [
        { x: 100, y: 100, missed: false },
        { x: 100, y: 100, missed: false },
        { x: 100, y: 100, missed: false },
      ];
      expect(computeTremorScore(taps)).toBe(0);
    });
  });

  describe('computeMissedTapRate', () => {
    it('returns 0 for no taps', () => {
      expect(computeMissedTapRate([])).toBe(0);
    });

    it('computes ratio of missed taps', () => {
      const taps = [
        { x: 0, y: 0, missed: true },
        { x: 10, y: 10, missed: false },
        { x: 20, y: 20, missed: true },
        { x: 30, y: 30, missed: false },
      ];
      expect(computeMissedTapRate(taps)).toBe(0.5); // 2 missed / 4 total
    });

    it('returns 1 for all missed taps', () => {
      const taps = [
        { x: 0, y: 0, missed: true },
        { x: 10, y: 10, missed: true },
      ];
      expect(computeMissedTapRate(taps)).toBe(1.0);
    });

    it('returns 0 for no missed taps', () => {
      const taps = [
        { x: 0, y: 0, missed: false },
        { x: 10, y: 10, missed: false },
      ];
      expect(computeMissedTapRate(taps)).toBe(0);
    });
  });

  describe('computeAvgDwellTime', () => {
    it('returns 0 for no dwell events', () => {
      expect(computeAvgDwellTime([])).toBe(0);
    });

    it('computes average dwell time in seconds', () => {
      const dwells = [
        { sectionId: 'a', enterTime: 1000, exitTime: 3000 }, // 2s
        { sectionId: 'b', enterTime: 5000, exitTime: 11000 }, // 6s
        { sectionId: 'c', enterTime: 15000, exitTime: 19000 }, // 4s
      ];
      expect(computeAvgDwellTime(dwells)).toBe(4.0); // (2 + 6 + 4) / 3
    });
  });

  describe('computeScrollReversalRate', () => {
    it('returns 0 for less than 2 scroll events', () => {
      expect(computeScrollReversalRate([])).toBe(0);
      expect(computeScrollReversalRate(['down'])).toBe(0);
    });

    it('computes ratio of upward direction changes', () => {
      const scrolls = ['down', 'down', 'up', 'up', 'down', 'up'];
      // Changes: down->up (reversal), up->down, down->up (reversal)
      // 2 reversals / 3 total changes = 0.666
      expect(computeScrollReversalRate(scrolls)).toBeCloseTo(0.666, 2);
    });

    it('returns 0 for continuous downward scroll', () => {
      const scrolls = ['down', 'down', 'down', 'down'];
      expect(computeScrollReversalRate(scrolls)).toBe(0);
    });

    it('returns high ratio when many reversals occur', () => {
      const scrolls = ['down', 'up', 'down', 'up'];
      // Changes: down->up (reversal), up->down (not reversal), down->up (reversal)
      // 2 reversals / 3 total changes = 0.666...
      expect(computeScrollReversalRate(scrolls)).toBeCloseTo(0.67, 1);
    });
  });
});
