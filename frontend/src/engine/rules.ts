import { AdaptationRule, SignalSnapshot, UIState } from '../types';
import { THRESHOLDS } from '../constants';

/**
 * Adaptation Rules - The heart of the thesis research question
 *
 * Each rule has:
 * - Research-justified threshold (cited to peer-reviewed literature)
 * - Cooldown period (prevents adaptation thrashing)
 * - Maximum applications (prevents infinite escalation)
 */

/**
 * Rule 1: Font Scale
 *
 * Trigger: zoom_count >= 3 in 60s window
 * Action: fontSize += 2px (max 26px)
 * Cooldown: 120s
 * Max: 3 applications
 *
 * Citation: Nielsen, J. (1993). Usability Engineering. Academic Press.
 */
const fontScaleRule: AdaptationRule = {
  id: 'font_scale',
  check: (signals: SignalSnapshot) => signals.zoomCount >= THRESHOLDS.zoomCount,
  apply: (ui: UIState) => ({
    ...ui,
    fontSize: Math.min(ui.fontSize + 2, 26),
  }),
  cooldown: 120_000,
  maxApplications: 3,
};

/**
 * Rule 2: Button Enlarge
 *
 * Trigger: missedTapRate >= 0.35 in 30s window
 * Action: buttonPadding += 8px (max 36px)
 * Cooldown: 90s
 * Max: 2 applications
 *
 * Citation: Fitts, P.M. (1954). The information capacity of the human
 * motor system. Journal of Experimental Psychology, 47(6).
 */
const buttonEnlargeRule: AdaptationRule = {
  id: 'button_enlarge',
  check: (signals: SignalSnapshot) => signals.missedTapRate >= THRESHOLDS.missedTapRate,
  apply: (ui: UIState) => ({
    ...ui,
    buttonPadding: Math.min(ui.buttonPadding + 8, 36),
  }),
  cooldown: 90_000,
  maxApplications: 2,
};

/**
 * Rule 3: Contrast Boost
 *
 * Trigger: avgDwellSeconds >= 7 AND scrollReversalRate >= 0.30
 * Action: contrast += 1 (max level 2)
 * Cooldown: 180s
 * Max: 2 applications
 *
 * Citation: Rayner, K. et al. (2016). So much to read, so little time.
 * Buscher, G. et al. (2012). Attentive documents. ACM CHI 2012.
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
  cooldown: 180_000,
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
 * Citation: Wobbrock, J.O. et al. (2008). Longitudinal evaluation of
 * pointing performance models. ACM UIST 2008.
 */
const spacingIncreaseRule: AdaptationRule = {
  id: 'spacing_increase',
  check: (signals: SignalSnapshot) => signals.tremorScore >= THRESHOLDS.tremorScore,
  apply: (ui: UIState) => ({
    ...ui,
    lineHeight: Math.min(ui.lineHeight + 0.15, 2.2),
  }),
  cooldown: 150_000,
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
 * Citation: Wobbrock, J.O. et al. (2011). Ability-based design.
 * ACM TACCESS, 3(3).
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
 * Citation: Hurst, A. et al. (2013). Automatic detection of target
 * accuracy problems during pointing. ACM TACCESS, 6(2).
 */
const cursorEnlargeRule: AdaptationRule = {
  id: 'cursor_enlarge',
  check: (signals: SignalSnapshot) => signals.rageClickCount >= THRESHOLDS.rageClickCount,
  apply: (ui: UIState) => ({
    ...ui,
    cursorScale: Math.min(ui.cursorScale + 0.5, 2),
  }),
  cooldown: 90_000,
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
 * Citation: Gajos, K.Z. et al. (2010). Automatically generating
 * personalized user interfaces. Artificial Intelligence, 174(12-13).
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
  cooldown: Infinity,
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
 * Citation: Dickinson, A. et al. (2002). Introducing the Internet
 * to the over-60s. Interacting with Computers, 14(4).
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
