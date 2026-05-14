import { describe, it, expect } from 'vitest';
import { RULES } from '../engine/rules';
import { SignalSnapshot, UIState } from '../types';
import { DEFAULT_UI, THRESHOLDS } from '../constants';

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

describe('cursor_enlarge rule', () => {
  const rule = RULES.find((r) => r.id === 'cursor_enlarge')!;

  it('exists', () => {
    expect(rule).toBeDefined();
  });

  it('triggers when rageClickCount reaches threshold', () => {
    const signals = createSignals({ rageClickCount: THRESHOLDS.rageClickCount });
    expect(rule.check(signals)).toBe(true);
  });

  it('does not trigger below threshold', () => {
    const signals = createSignals({ rageClickCount: THRESHOLDS.rageClickCount - 1 });
    expect(rule.check(signals)).toBe(false);
  });

  it('increases cursorScale by 0.5', () => {
    const result = rule.apply(DEFAULT_UI);
    expect(result.cursorScale).toBe(1.5);
  });

  it('respects maximum cursorScale of 2', () => {
    const maxUI: UIState = { ...DEFAULT_UI, cursorScale: 2 };
    const result = rule.apply(maxUI);
    expect(result.cursorScale).toBe(2);
  });

  it('has maxApplications of 2', () => {
    expect(rule.maxApplications).toBe(2);
  });

  it('has cooldown of 90s', () => {
    expect(rule.cooldown).toBe(90_000);
  });
});

describe('layout_simplify rule', () => {
  const rule = RULES.find((r) => r.id === 'layout_simplify')!;

  it('exists', () => {
    expect(rule).toBeDefined();
  });

  it('triggers when both idle and hesitation thresholds are met', () => {
    const signals = createSignals({
      idleSeconds: THRESHOLDS.idleSeconds,
      mouseHesitationScore: THRESHOLDS.mouseHesitationScore,
    });
    expect(rule.check(signals)).toBe(true);
  });

  it('does not trigger if only idle threshold is met', () => {
    const signals = createSignals({
      idleSeconds: THRESHOLDS.idleSeconds,
      mouseHesitationScore: THRESHOLDS.mouseHesitationScore - 1,
    });
    expect(rule.check(signals)).toBe(false);
  });

  it('does not trigger if only hesitation threshold is met', () => {
    const signals = createSignals({
      idleSeconds: THRESHOLDS.idleSeconds - 1,
      mouseHesitationScore: THRESHOLDS.mouseHesitationScore,
    });
    expect(rule.check(signals)).toBe(false);
  });

  it('sets layoutSimplified to true', () => {
    const result = rule.apply(DEFAULT_UI);
    expect(result.layoutSimplified).toBe(true);
  });

  it('has permanent cooldown', () => {
    expect(rule.cooldown).toBe(Infinity);
  });

  it('has maxApplications of 1', () => {
    expect(rule.maxApplications).toBe(1);
  });
});

describe('reading_aid rule', () => {
  const rule = RULES.find((r) => r.id === 'reading_aid')!;

  it('exists', () => {
    expect(rule).toBeDefined();
  });

  it('triggers when reading speed is below threshold and > 0', () => {
    const signals = createSignals({ readingSpeed: THRESHOLDS.readingSpeed - 1 });
    expect(rule.check(signals)).toBe(true);
  });

  it('does not trigger at or above threshold', () => {
    const signals = createSignals({ readingSpeed: THRESHOLDS.readingSpeed });
    expect(rule.check(signals)).toBe(false);
  });

  it('does not trigger when reading speed is 0 (no data)', () => {
    const signals = createSignals({ readingSpeed: 0 });
    expect(rule.check(signals)).toBe(false);
  });

  it('sets readingGuide to true', () => {
    const result = rule.apply(DEFAULT_UI);
    expect(result.readingGuide).toBe(true);
  });

  it('has cooldown of 120s', () => {
    expect(rule.cooldown).toBe(120_000);
  });

  it('has maxApplications of 1', () => {
    expect(rule.maxApplications).toBe(1);
  });
});

describe('all rules are present', () => {
  it('has 8 total rules', () => {
    expect(RULES.length).toBe(8);
  });

  it('has all expected rule IDs', () => {
    const ids = RULES.map((r) => r.id);
    expect(ids).toContain('font_scale');
    expect(ids).toContain('button_enlarge');
    expect(ids).toContain('contrast_boost');
    expect(ids).toContain('spacing_increase');
    expect(ids).toContain('motion_reduce');
    expect(ids).toContain('cursor_enlarge');
    expect(ids).toContain('layout_simplify');
    expect(ids).toContain('reading_aid');
  });
});
