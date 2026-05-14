import { describe, it, expect } from 'vitest';
import { RULES } from '../engine/rules';
import { SignalSnapshot, UIState } from '../types';
import { DEFAULT_UI, THRESHOLDS } from '../constants';

describe('Adaptation Rules', () => {
  const createSignals = (overrides: Partial<SignalSnapshot> = {}): SignalSnapshot => ({
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
    ...overrides,
  });

  describe('font_scale rule', () => {
    const rule = RULES.find((r) => r.id === 'font_scale')!;

    it('triggers when zoom count reaches threshold', () => {
      const signals = createSignals({ zoomCount: THRESHOLDS.zoomCount });
      expect(rule.check(signals)).toBe(true);
    });

    it('does not trigger below threshold', () => {
      const signals = createSignals({ zoomCount: THRESHOLDS.zoomCount - 1 });
      expect(rule.check(signals)).toBe(false);
    });

    it('increases font size by 2px', () => {
      const result = rule.apply(DEFAULT_UI);
      expect(result.fontSize).toBe(DEFAULT_UI.fontSize + 2);
    });

    it('respects maximum font size of 26px', () => {
      const maxUI: UIState = { ...DEFAULT_UI, fontSize: 26 };
      const result = rule.apply(maxUI);
      expect(result.fontSize).toBe(26);
    });
  });

  describe('button_enlarge rule', () => {
    const rule = RULES.find((r) => r.id === 'button_enlarge')!;

    it('triggers when missed tap rate reaches threshold', () => {
      const signals = createSignals({ missedTapRate: THRESHOLDS.missedTapRate });
      expect(rule.check(signals)).toBe(true);
    });

    it('does not trigger below threshold', () => {
      const signals = createSignals({ missedTapRate: THRESHOLDS.missedTapRate - 0.01 });
      expect(rule.check(signals)).toBe(false);
    });

    it('increases button padding by 8px', () => {
      const result = rule.apply(DEFAULT_UI);
      expect(result.buttonPadding).toBe(DEFAULT_UI.buttonPadding + 8);
    });

    it('respects maximum padding of 36px', () => {
      const maxUI: UIState = { ...DEFAULT_UI, buttonPadding: 36 };
      const result = rule.apply(maxUI);
      expect(result.buttonPadding).toBe(36);
    });
  });

  describe('contrast_boost rule', () => {
    const rule = RULES.find((r) => r.id === 'contrast_boost')!;

    it('triggers when both dwell and reversal thresholds are met', () => {
      const signals = createSignals({
        avgDwellSeconds: THRESHOLDS.avgDwellSeconds,
        scrollReversalRate: THRESHOLDS.scrollReversalRate,
      });
      expect(rule.check(signals)).toBe(true);
    });

    it('does not trigger if only dwell threshold is met', () => {
      const signals = createSignals({
        avgDwellSeconds: THRESHOLDS.avgDwellSeconds,
        scrollReversalRate: THRESHOLDS.scrollReversalRate - 0.01,
      });
      expect(rule.check(signals)).toBe(false);
    });

    it('does not trigger if only reversal threshold is met', () => {
      const signals = createSignals({
        avgDwellSeconds: THRESHOLDS.avgDwellSeconds - 1,
        scrollReversalRate: THRESHOLDS.scrollReversalRate,
      });
      expect(rule.check(signals)).toBe(false);
    });

    it('increases contrast level by 1', () => {
      const result = rule.apply(DEFAULT_UI);
      expect(result.contrast).toBe(DEFAULT_UI.contrast + 1);
    });

    it('respects maximum contrast level of 2', () => {
      const maxUI: UIState = { ...DEFAULT_UI, contrast: 2 };
      const result = rule.apply(maxUI);
      expect(result.contrast).toBe(2);
    });
  });

  describe('spacing_increase rule', () => {
    const rule = RULES.find((r) => r.id === 'spacing_increase')!;

    it('triggers when tremor score reaches threshold', () => {
      const signals = createSignals({ tremorScore: THRESHOLDS.tremorScore });
      expect(rule.check(signals)).toBe(true);
    });

    it('increases line height by 0.15', () => {
      const result = rule.apply(DEFAULT_UI);
      expect(result.lineHeight).toBeCloseTo(DEFAULT_UI.lineHeight + 0.15, 2);
    });

    it('respects maximum line height of 2.2', () => {
      const maxUI: UIState = { ...DEFAULT_UI, lineHeight: 2.2 };
      const result = rule.apply(maxUI);
      expect(result.lineHeight).toBe(2.2);
    });
  });

  describe('motion_reduce rule', () => {
    const rule = RULES.find((r) => r.id === 'motion_reduce')!;

    it('triggers when tremor score reaches high threshold', () => {
      const signals = createSignals({ tremorScore: THRESHOLDS.tremorScoreHigh });
      expect(rule.check(signals)).toBe(true);
    });

    it('does not trigger at regular tremor threshold', () => {
      const signals = createSignals({ tremorScore: THRESHOLDS.tremorScore });
      expect(rule.check(signals)).toBe(false);
    });

    it('disables animations', () => {
      const result = rule.apply(DEFAULT_UI);
      expect(result.animations).toBe(false);
    });

    it('has infinite cooldown', () => {
      expect(rule.cooldown).toBe(Infinity);
    });

    it('has maxApplications of 1', () => {
      expect(rule.maxApplications).toBe(1);
    });
  });
});
