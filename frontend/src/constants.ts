import { UIState } from './types';

/**
 * Default UI state (baseline before any adaptation)
 */
export const DEFAULT_UI: UIState = {
  fontSize: 16, // px
  buttonPadding: 12, // px
  contrast: 0, // WCAG AA level
  lineHeight: 1.65, // multiplier
  animations: true,
  cursorScale: 1, // no scaling
  layoutSimplified: false,
  readingGuide: false,
};

/**
 * Threshold constants for adaptation rules
 * Each threshold is justified by peer-reviewed research:
 * - Nielsen (1993): repetitive corrective action patterns
 * - Fitts (1954): target size and error rate
 * - Rayner et al. (2016): reading speed and comprehension
 * - Buscher et al. (2012): scroll behavior as reading signal
 * - Wobbrock et al. (2008): motor impairment thresholds
 * - Hurst et al. (2013): rage click detection for cursor enlargement
 * - Gajos et al. (2010): layout simplification triggers
 * - Dickinson et al. (2002): reading aid thresholds
 */
export const THRESHOLDS = {
  /** 3 zoom events in 60s window (Nielsen 1993) */
  zoomCount: 3,

  /** 35% missed tap rate in 30s window (Fitts 1954, Apple HIG 44dp) */
  missedTapRate: 0.35,

  /** 7 seconds average dwell time in 90s window (Rayner et al. 2016) */
  avgDwellSeconds: 7,

  /** 30% scroll reversal rate in 45s window (Buscher et al. 2012) */
  scrollReversalRate: 0.30,

  /** 18px tremor score for spacing_increase (Wobbrock et al. 2008) */
  tremorScore: 18,

  /** 27px tremor score for motion_reduce (higher threshold) */
  tremorScoreHigh: 27,

  /** 3 rage click clusters in 2s window (Hurst et al. 2013) */
  rageClickCount: 3,

  /** Hesitation score >= 3 over interactive elements in 10s (Gajos et al. 2010) */
  mouseHesitationScore: 3,

  /** 30 seconds idle time (Gajos et al. 2010) */
  idleSeconds: 30,

  /** Below 100 words per minute reading speed (Dickinson et al. 2002) */
  readingSpeed: 100,
} as const;

/**
 * System timing constants
 */
export const SIGNAL_COMPUTE_INTERVAL = 2500; // ms - compute signals every 2.5s
export const EVENT_FLUSH_INTERVAL = 8000; // ms - flush events to backend every 8s

/**
 * Sliding window durations (milliseconds)
 */
export const WINDOWS = {
  zoom: 60_000, // 60s
  missedTap: 30_000, // 30s
  dwell: 90_000, // 90s
  scrollReversal: 45_000, // 45s
  tremor: 8_000, // 8s
  rageClick: 5_000, // 5s (must exceed 2.5s compute interval)
  mouseHesitation: 10_000, // 10s
  idle: 60_000, // 60s
  readingSpeed: 90_000, // 90s
} as const;
