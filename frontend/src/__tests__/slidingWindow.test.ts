import { describe, it, expect } from 'vitest';
import { SlidingWindow } from '../utils/slidingWindow';

describe('SlidingWindow', () => {
  it('stores events within the window duration', () => {
    const window = new SlidingWindow<number>(5000); // 5 second window
    const now = 10000;

    window.add(1, now - 4000); // 6s ago -> inside window
    window.add(2, now - 3000); // 7s ago -> inside window
    window.add(3, now - 1000); // 9s ago -> inside window

    expect(window.getAll(now)).toEqual([1, 2, 3]);
    expect(window.count(now)).toBe(3);
  });

  it('prunes events older than window duration', () => {
    const window = new SlidingWindow<string>(5000); // 5 second window
    const now = 10000;

    window.add('old', now - 6000); // Outside window (6s ago)
    window.add('recent', now - 2000); // Inside window (2s ago)

    expect(window.getAll(now)).toEqual(['recent']);
    expect(window.count(now)).toBe(1);
  });

  it('handles empty window', () => {
    const window = new SlidingWindow<number>(5000);
    expect(window.getAll()).toEqual([]);
    expect(window.count()).toBe(0);
  });

  it('automatically prunes on add', () => {
    const window = new SlidingWindow<number>(5000);
    const now = 10000;

    window.add(1, now - 6000); // Old event
    window.add(2, now); // Adding new event should prune the old one

    expect(window.getAll(now)).toEqual([2]);
  });

  it('clears all events', () => {
    const window = new SlidingWindow<number>(5000);
    window.add(1);
    window.add(2);
    window.add(3);

    window.clear();
    expect(window.count()).toBe(0);
  });

  it('handles events at window boundary', () => {
    const window = new SlidingWindow<number>(5000);
    const now = 10000;

    window.add(1, now - 5000); // Exactly at boundary -> should be included
    window.add(2, now - 5001); // Just outside boundary -> should be excluded

    const result = window.getAll(now);
    expect(result).toEqual([1]);
  });
});
