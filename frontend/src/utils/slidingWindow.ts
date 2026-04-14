/**
 * Generic sliding window data structure for time-series data
 * Automatically prunes events older than the window duration
 */
export class SlidingWindow<T> {
  private events: Array<{ timestamp: number; data: T }> = [];

  constructor(private windowMs: number) {}

  /**
   * Add a new event to the window
   */
  add(data: T, timestamp: number = Date.now()): void {
    this.events.push({ timestamp, data });
    this.prune(timestamp);
  }

  /**
   * Remove events older than the window duration
   */
  private prune(now: number): void {
    const cutoff = now - this.windowMs;
    this.events = this.events.filter((e) => e.timestamp >= cutoff);
  }

  /**
   * Get all events in the current window
   */
  getAll(now: number = Date.now()): T[] {
    this.prune(now);
    return this.events.map((e) => e.data);
  }

  /**
   * Get count of events in the current window
   */
  count(now: number = Date.now()): number {
    this.prune(now);
    return this.events.length;
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }
}
