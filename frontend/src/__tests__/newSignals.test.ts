import { describe, it, expect } from 'vitest';
import {
  computeRageClickCount,
  computeMouseHesitationScore,
  computeReadingSpeed,
} from '../utils/signalComputation';

describe('Rage Click Detection', () => {
  it('returns 0 for fewer than 3 clicks', () => {
    const clicks = [
      { x: 100, y: 100, timestamp: 1000 },
      { x: 102, y: 101, timestamp: 1100 },
    ];
    expect(computeRageClickCount(clicks)).toBe(0);
  });

  it('detects a single rage click cluster (3+ clicks within 30px)', () => {
    const clicks = [
      { x: 100, y: 100, timestamp: 1000 },
      { x: 105, y: 102, timestamp: 1100 },
      { x: 98, y: 103, timestamp: 1200 },
    ];
    expect(computeRageClickCount(clicks)).toBe(1);
  });

  it('detects multiple rage click clusters', () => {
    const clicks = [
      // Cluster 1 at (100, 100)
      { x: 100, y: 100, timestamp: 1000 },
      { x: 105, y: 102, timestamp: 1100 },
      { x: 98, y: 103, timestamp: 1200 },
      // Cluster 2 at (500, 500)
      { x: 500, y: 500, timestamp: 1300 },
      { x: 502, y: 498, timestamp: 1400 },
      { x: 501, y: 503, timestamp: 1500 },
    ];
    expect(computeRageClickCount(clicks)).toBe(2);
  });

  it('does not count clicks spread beyond 30px radius', () => {
    const clicks = [
      { x: 100, y: 100, timestamp: 1000 },
      { x: 150, y: 150, timestamp: 1100 },
      { x: 200, y: 200, timestamp: 1200 },
    ];
    expect(computeRageClickCount(clicks)).toBe(0);
  });

  it('returns 0 for empty array', () => {
    expect(computeRageClickCount([])).toBe(0);
  });
});

describe('Mouse Hesitation Score', () => {
  it('returns count of hesitation events', () => {
    const hesitations = [
      { duration: 3500 },
      { duration: 4000 },
    ];
    expect(computeMouseHesitationScore(hesitations)).toBe(2);
  });

  it('returns 0 for no hesitations', () => {
    expect(computeMouseHesitationScore([])).toBe(0);
  });
});

describe('Reading Speed', () => {
  it('computes words per minute from dwell events (capped to prevent inflation)', () => {
    const dwells = [
      { sectionId: 'intro', enterTime: 0, exitTime: 10000 }, // 10s
    ];
    const charCounts = { intro: 500 }; // 500 chars but capped to 10s * 16.7 = 167
    // min(500, 167) = 167 chars / 10s = 16.7 chars/s => (16.7/5)*60 ≈ 200.4 wpm
    const result = computeReadingSpeed(dwells, charCounts);
    expect(result).toBeCloseTo(200.4, 0);
  });

  it('handles multiple sections with character capping', () => {
    const dwells = [
      { sectionId: 'intro', enterTime: 0, exitTime: 10000 }, // 10s, 200 chars
      { sectionId: 'body', enterTime: 10000, exitTime: 30000 }, // 20s, 400 chars
    ];
    const charCounts = { intro: 200, body: 400 };
    // intro: min(200, 167) = 167; body: min(400, 334) = 334
    // total: 501 chars / 30s = 16.7 chars/s => (16.7/5)*60 ≈ 200.4 wpm
    const result = computeReadingSpeed(dwells, charCounts);
    expect(result).toBeCloseTo(200.4, 0);
  });

  it('returns 0 for no dwells', () => {
    expect(computeReadingSpeed([], {})).toBe(0);
  });

  it('handles sections with no char count', () => {
    const dwells = [
      { sectionId: 'unknown', enterTime: 0, exitTime: 10000 },
    ];
    expect(computeReadingSpeed(dwells, {})).toBe(0);
  });

  it('handles zero duration dwell', () => {
    const dwells = [
      { sectionId: 'intro', enterTime: 1000, exitTime: 1000 },
    ];
    const charCounts = { intro: 500 };
    expect(computeReadingSpeed(dwells, charCounts)).toBe(0);
  });
});
