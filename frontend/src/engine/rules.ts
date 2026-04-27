import { AdaptationRule, SignalSnapshot, UIState } from '../types';
import { THRESHOLDS } from '../constants';

/**
 * Adaptation Rules - The heart of the thesis research question
 *
 * Each rule has:
 * - A threshold informed by peer-reviewed research (see constants.ts for details)
 * - Cooldown period (prevents adaptation thrashing)
 * - Maximum applications (prevents infinite escalation)
 *
 * Note: Specific threshold values are original design decisions refined through
 * pilot testing. Citations indicate theoretical foundations, not the source
 * of exact numerical values.
 */

/**
 * Rule 1: Font Scale
 *
 * Trigger: zoom_count >= 3 in 60s window
 * Action: fontSize += 2px (max 26px)
 * Cooldown: 120s
 * Max: 3 applications
 *
 * Foundation: Nielsen (1993) - repetitive corrective actions indicate usability barriers
 */
const fontScaleRule: AdaptationRule = {
  id: 'font_scale',
  check: (signals: SignalSnapshot) => signals.zoomCount >= THRESHOLDS.zoomCount,
  apply: (ui: UIState) => ({
    ...ui,
    fontSize: Math.min(ui.fontSize + 3, 28),
  }),
  cooldown: 30_000,
  maxApplications: 4,
};

/**
 * Rule 2: Button Enlarge
 *
 * Trigger: missedTapRate >= 0.35 in 30s window
 * Action: buttonPadding += 8px (max 36px)
 * Cooldown: 90s
 * Max: 2 applications
 *
 * Foundation: Fitts (1954) - target size inversely related to error rate
 */
const buttonEnlargeRule: AdaptationRule = {
  id: 'button_enlarge',
  check: (signals: SignalSnapshot) => signals.missedTapRate >= THRESHOLDS.missedTapRate,
  apply: (ui: UIState) => ({
    ...ui,
    buttonPadding: Math.min(ui.buttonPadding + 10, 40),
  }),
  cooldown: 30_000,
  maxApplications: 3,
};

/**
 * Rule 3: Contrast Boost
 *
 * Trigger: avgDwellSeconds >= 7 AND scrollReversalRate >= 0.30
 * Action: contrast += 1 (max level 2)
 * Cooldown: 180s
 * Max: 2 applications
 *
 * Foundation: Rayner et al. (2016) on reading comprehension difficulty;
 * Buscher et al. (2012) on scroll behavior as a reading signal
 */
const contrastBoostRule: AdaptationRule = {
  id: 'contrast_boost',
  check: (signals: SignalSnapshot) =>
    signals.avgDwellSeconds >= THRESHOLDS.avgDwellSeconds &&
    signals.scrollReversalRate >= THRESHOLDS.scrollReversalRate,
  apply: (ui: UIState) => ({
    ...ui,
    contrast: Math.min(ui.contrast + 1, 2),
  }),
  cooldown: 45_000,
  maxApplications: 2,
};

/**
 * Rule 4: Spacing Increase
 *
 * Trigger: tremorScore >= 18px
 * Action: lineHeight += 0.15 (max 2.2)
 * Cooldown: 150s
 * Max: 3 applications
 *
 * Foundation: Wobbrock et al. (2008) - pointing performance and motor impairment models
 */
const spacingIncreaseRule: AdaptationRule = {
  id: 'spacing_increase',
  check: (signals: SignalSnapshot) => signals.tremorScore >= THRESHOLDS.tremorScore,
  apply: (ui: UIState) => ({
    ...ui,
    lineHeight: Math.min(ui.lineHeight + 0.2, 2.4),
  }),
  cooldown: 40_000,
  maxApplications: 3,
};

/**
 * Rule 5: Motion Reduce
 *
 * Trigger: tremorScore >= 27px
 * Action: animations = false
 * Cooldown: Infinity (permanent)
 * Max: 1 application
 *
 * Foundation: Wobbrock et al. (2011) - ability-based design framework
 */
const motionReduceRule: AdaptationRule = {
  id: 'motion_reduce',
  check: (signals: SignalSnapshot) => signals.tremorScore >= THRESHOLDS.tremorScoreHigh,
  apply: (ui: UIState) => ({
    ...ui,
    animations: false,
  }),
  cooldown: Infinity,
  maxApplications: 1,
};

/**
 * Rule 6: Cursor Enlarge
 *
 * Trigger: rageClickCount >= 3
 * Action: cursorScale += 0.5 (max 2)
 * Cooldown: 90s
 * Max: 2 applications
 *
 * Foundation: Hurst et al. (2013) - automatic detection of pointing accuracy problems
 */
const cursorEnlargeRule: AdaptationRule = {
  id: 'cursor_enlarge',
  check: (signals: SignalSnapshot) => signals.rageClickCount >= THRESHOLDS.rageClickCount,
  apply: (ui: UIState) => ({
    ...ui,
    cursorScale: Math.min(ui.cursorScale + 0.5, 2),
  }),
  cooldown: 30_000,
  maxApplications: 2,
};

/**
 * Rule 7: Layout Simplify
 *
 * Trigger: idleSeconds >= 30 AND mouseHesitationScore >= 3
 * Action: layoutSimplified = true
 * Cooldown: Infinity (permanent)
 * Max: 1 application
 *
 * Foundation: Gajos et al. (2010) - automatically generating personalized interfaces
 */
const layoutSimplifyRule: AdaptationRule = {
  id: 'layout_simplify',
  check: (signals: SignalSnapshot) =>
    signals.idleSeconds >= THRESHOLDS.idleSeconds &&
    signals.mouseHesitationScore >= THRESHOLDS.mouseHesitationScore,
  apply: (ui: UIState) => ({
    ...ui,
    layoutSimplified: true,
  }),
  cooldown: 60_000,
  maxApplications: 1,
};

/**
 * Rule 8: Reading Aid
 *
 * Trigger: readingSpeed < 15 chars/s (and readingSpeed > 0 to avoid false positive)
 * Action: readingGuide = true
 * Cooldown: 120s
 * Max: 1 application
 *
 * Foundation: Dickinson et al. (2002) - reading difficulties in older web users
 */
const readingAidRule: AdaptationRule = {
  id: 'reading_aid',
  check: (signals: SignalSnapshot) =>
    signals.readingSpeed > 0 && signals.readingSpeed < THRESHOLDS.readingSpeed,
  apply: (ui: UIState) => ({
    ...ui,
    readingGuide: true,
  }),
  cooldown: 120_000,
  maxApplications: 1,
};

/**
 * All adaptation rules in evaluation order
 * Order matters: motion_reduce should be checked last (highest severity)
 */
export const RULES: AdaptationRule[] = [
  fontScaleRule,
  buttonEnlargeRule,
  contrastBoostRule,
  spacingIncreaseRule,
  cursorEnlargeRule,
  layoutSimplifyRule,
  readingAidRule,
  motionReduceRule,
];
