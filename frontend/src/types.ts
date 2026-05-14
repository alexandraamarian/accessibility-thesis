/**
 * Core type definitions for the Adaptive Accessibility System
 * These interfaces define the contracts between behavior detection,
 * adaptation engine, and backend analytics.
 */

/**
 * A sliding-window signal snapshot computed every 2.5 seconds
 */
export interface SignalSnapshot {
  /** Pinch/ctrl+scroll events in last 60s window */
  zoomCount: number;

  /** 0-1, failed taps / total in last 30s window */
  missedTapRate: number;

  /** Average section dwell time in last 90s window */
  avgDwellSeconds: number;

  /** 0-1, upward direction changes / total in 45s window */
  scrollReversalRate: number;

  /** px std-dev of tap positions in last 8s window */
  tremorScore: number;

  /** Rapid repeated clicks in same area (30px radius) in 2s window */
  rageClickCount: number;

  /** Cursor stopped over interactive element score in 10s window */
  mouseHesitationScore: number;

  /** Time since last interaction in seconds */
  idleSeconds: number;

  /** Estimated words per minute in 90s window */
  readingSpeed: number;

  /** Total taps recorded */
  totalTaps: number;

  /** Total scroll direction changes */
  totalScrollChanges: number;

  /** Keyboard navigation events (arrow keys, Page Up/Down, Home/End) */
  keyboardNavCount: number;

  /** Unix timestamp when snapshot was computed */
  timestamp: number;
}

/**
 * The current UI adaptation state
 */
export interface UIState {
  /** Font size in pixels (baseline 16, max 26) */
  fontSize: number;

  /** Button padding in pixels (baseline 12, max 36) */
  buttonPadding: number;

  /** Contrast level: 0=normal (AA) | 1=enhanced | 2=maximum (AAA) */
  contrast: number;

  /** Line height multiplier (baseline 1.65, max 2.2) */
  lineHeight: number;

  /** Whether animations are enabled */
  animations: boolean;

  /** Cursor scale multiplier (1-2) */
  cursorScale: number;

  /** Whether layout is simplified (single-column, no decorative elements) */
  layoutSimplified: boolean;

  /** Whether reading guide is shown */
  readingGuide: boolean;
}

/**
 * An adaptation rule definition
 */
export interface AdaptationRule {
  /** Rule identifier */
  id:
    | 'font_scale'
    | 'button_enlarge'
    | 'contrast_boost'
    | 'spacing_increase'
    | 'motion_reduce'
    | 'cursor_enlarge'
    | 'layout_simplify'
    | 'reading_aid';

  /** Check function to evaluate if rule should trigger */
  check: (signals: SignalSnapshot) => boolean;

  /** Apply function to transform UI state */
  apply: (ui: UIState) => UIState;

  /** Cooldown period in milliseconds */
  cooldown: number;

  /** Maximum number of times rule can be applied */
  maxApplications: number;
}

/**
 * Event log entry for backend
 */
export interface EventLog {
  /** ISO 8601 timestamp */
  timestamp: string;

  /** Type of event */
  eventType:
    | 'signal_snapshot'
    | 'adaptation_applied'
    | 'task_completed'
    | 'questionnaire_completed'
    | 'consent_given'
    | 'demographics_completed'
    | 'device_info'
    | 'warmup_completed'
    | 'study_phase_changed';

  /** Event-specific payload */
  payload: Record<string, unknown>;
}

/**
 * Empty signal snapshot for initialization
 */
export const EMPTY_SNAPSHOT: SignalSnapshot = {
  zoomCount: 0,
  missedTapRate: 0,
  avgDwellSeconds: 0,
  scrollReversalRate: 0,
  tremorScore: 0,
  rageClickCount: 0,
  mouseHesitationScore: 0,
  idleSeconds: 0,
  readingSpeed: 0,
  totalTaps: 0,
  totalScrollChanges: 0,
  keyboardNavCount: 0,
  timestamp: Date.now(),
};
