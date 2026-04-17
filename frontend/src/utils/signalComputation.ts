/**
 * Signal computation utilities for behavior detection
 */

interface TapEvent {
  x: number;
  y: number;
  missed: boolean;
}

interface DwellEvent {
  sectionId: string;
  enterTime: number;
  exitTime: number;
}

interface ClickEvent {
  x: number;
  y: number;
  timestamp: number;
}

interface HesitationEvent {
  duration: number;
}

/**
 * Compute tremor score as standard deviation of tap positions
 * Formula: sqrt(var(x) + var(y))
 */
export function computeTremorScore(taps: TapEvent[]): number {
  if (taps.length < 2) return 0;

  const xs = taps.map((t) => t.x);
  const ys = taps.map((t) => t.y);

  const variance = (values: number[]): number => {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
    // Bessel's correction (n-1) for sample variance
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / (values.length - 1);
  };

  const varX = variance(xs);
  const varY = variance(ys);

  return Math.sqrt(varX + varY);
}

/**
 * Compute missed tap rate
 */
export function computeMissedTapRate(taps: TapEvent[]): number {
  if (taps.length === 0) return 0;

  const missedCount = taps.filter((t) => t.missed).length;
  return missedCount / taps.length;
}

/**
 * Compute average dwell time across sections
 */
export function computeAvgDwellTime(dwells: DwellEvent[]): number {
  if (dwells.length === 0) return 0;

  const durations = dwells.map((d) => (d.exitTime - d.enterTime) / 1000);
  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
}

/**
 * Compute scroll reversal rate
 */
export function computeScrollReversalRate(scrollDirections: string[]): number {
  if (scrollDirections.length < 2) return 0;

  let reversals = 0;
  let totalChanges = 0;

  for (let i = 1; i < scrollDirections.length; i++) {
    if (scrollDirections[i] !== scrollDirections[i - 1]) {
      totalChanges++;
      if (scrollDirections[i] === 'up') {
        reversals++;
      }
    }
  }

  return totalChanges > 0 ? reversals / totalChanges : 0;
}

/**
 * Compute rage click count
 * Clusters clicks within 30px radius, counts clusters with 3+ clicks
 */
export function computeRageClickCount(clicks: ClickEvent[]): number {
  if (clicks.length < 3) return 0;

  const RADIUS = 30;
  let rageCount = 0;
  const used = new Set<number>();

  for (let i = 0; i < clicks.length; i++) {
    if (used.has(i)) continue;

    const cluster = [i];
    for (let j = i + 1; j < clicks.length; j++) {
      if (used.has(j)) continue;
      const dx = clicks[j].x - clicks[i].x;
      const dy = clicks[j].y - clicks[i].y;
      if (Math.sqrt(dx * dx + dy * dy) <= RADIUS) {
        cluster.push(j);
      }
    }

    if (cluster.length >= 3) {
      rageCount++;
      cluster.forEach((idx) => used.add(idx));
    }
  }

  return rageCount;
}

/**
 * Compute mouse hesitation score
 * Sum of hesitation events (cursor paused 3+ seconds over interactive element)
 */
export function computeMouseHesitationScore(hesitations: HesitationEvent[]): number {
  return hesitations.length;
}

/**
 * Compute reading speed in words per minute (wpm)
 * Assumes average word length of 5 characters
 */
export function computeReadingSpeed(
  dwells: DwellEvent[],
  charCounts: Record<string, number>
): number {
  if (dwells.length === 0) return 0;

  let totalChars = 0;
  let totalSeconds = 0;

  // ~200 WPM average reading speed = ~16.7 chars/second (at 5 chars/word)
  // Cap character contribution per dwell to prevent briefly-viewed sections
  // from inflating WPM (e.g., scrolling past a 2000-char section in 1 second
  // would produce 24,000 WPM without this cap)
  const EXPECTED_CHARS_PER_SECOND = 16.7;

  for (const dwell of dwells) {
    const chars = charCounts[dwell.sectionId] || 0;
    const seconds = (dwell.exitTime - dwell.enterTime) / 1000;
    if (seconds > 0 && chars > 0) {
      const maxCharsForDwell = seconds * EXPECTED_CHARS_PER_SECOND;
      totalChars += Math.min(chars, maxCharsForDwell);
      totalSeconds += seconds;
    }
  }

  if (totalSeconds === 0) return 0;

  // Convert chars/second to words/minute (avg 5 chars per word)
  const charsPerSecond = totalChars / totalSeconds;
  return (charsPerSecond / 5) * 60;
}
