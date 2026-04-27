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
 *
 * Each threshold is an original design decision informed by the broader
 * findings of the cited research. The specific numerical values were
 * selected through iterative pilot testing, not directly sourced from
 * the cited papers. Citations indicate the theoretical foundation, not
 * the origin of the exact value.
 *
 * Theoretical foundations:
 * - Nielsen (1993): usability heuristics and repetitive corrective actions
 * - Fitts (1954): movement time as a function of target size and distance
 * - Rayner et al. (2016): eye movement research on reading comprehension
 * - Buscher et al. (2012): scroll behavior as an indicator of reading difficulty
 * - Wobbrock et al. (2008, 2011): pointing performance models and ability-based design
 * - Hurst et al. (2013): automatic detection of pointing accuracy problems
 * - Gajos et al. (2010): automatically generating personalized interfaces
 * - Dickinson et al. (2002): older adults and web-based reading difficulty
 */
export const THRESHOLDS = {
  /** 3 zoom events in 60s window. Informed by Nielsen (1993) on repetitive corrective actions. */
  zoomCount: 3,

  /** 25% missed tap rate in 30s window. Informed by Fitts (1954) and Apple HIG 44dp touch target. */
  missedTapRate: 0.25,

  /** 5 seconds average dwell time in 90s window. Informed by Rayner et al. (2016) on reading difficulty. */
  avgDwellSeconds: 5,

  /** 35% scroll reversal rate in 45s window. Informed by Buscher et al. (2012) on re-reading patterns. */
  scrollReversalRate: 0.35,

  /** 15px tremor score for spacing_increase. Informed by Wobbrock et al. (2008) on pointing imprecision. */
  tremorScore: 15,

  /** 25px tremor score for motion_reduce (higher severity). Informed by Wobbrock et al. (2011) on ability-based design. */
  tremorScoreHigh: 25,

  /** 2 rage click clusters in 5s window. Informed by Hurst et al. (2013) on pointing accuracy problems. */
  rageClickCount: 2,

  /** Hesitation score >= 1 over interactive elements in 10s. Informed by Gajos et al. (2010) on UI personalization. */
  mouseHesitationScore: 1,

  /** 15 seconds idle time. Informed by Gajos et al. (2010) on engagement-based simplification. */
  idleSeconds: 15,

  /** Below 150 wpm reading speed. Informed by Dickinson et al. (2002) on older adults' reading rates. */
  readingSpeed: 150,
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
