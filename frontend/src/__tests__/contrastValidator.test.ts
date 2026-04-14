import { describe, it, expect } from 'vitest';
import {
  contrastRatio,
  validateContrastLevels,
  validateAccentColor,
  getWCAGLevel,
} from '../utils/contrastValidator';

describe('Contrast Validator', () => {
  describe('contrastRatio', () => {
    it('calculates perfect contrast (black on white)', () => {
      const ratio = contrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21.0, 1);
    });

    it('calculates low contrast', () => {
      const ratio = contrastRatio('#777777', '#888888');
      expect(ratio).toBeLessThan(2.0);
    });

    it('is symmetric (order does not matter)', () => {
      const ratio1 = contrastRatio('#000000', '#ffffff');
      const ratio2 = contrastRatio('#ffffff', '#000000');
      expect(ratio1).toBe(ratio2);
    });

    it('handles hex colors without # prefix', () => {
      const ratio1 = contrastRatio('#ff0000', '#00ff00');
      const ratio2 = contrastRatio('ff0000', '00ff00');
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });
  });

  describe('validateContrastLevels', () => {
    it('validates all three contrast levels', () => {
      const validation = validateContrastLevels();
      expect(validation.results).toHaveLength(3);
    });

    it('Level 0 meets AA (4.5:1)', () => {
      const validation = validateContrastLevels();
      const level0 = validation.results.find((r) => r.name === 'Level 0 (Baseline)');
      expect(level0?.ratio).toBeGreaterThanOrEqual(4.5);
      expect(level0?.passes).toBe(true);
    });

    it('Level 1 exceeds AA (5.5:1)', () => {
      const validation = validateContrastLevels();
      const level1 = validation.results.find((r) => r.name === 'Level 1 (Enhanced)');
      expect(level1?.ratio).toBeGreaterThanOrEqual(5.5);
      expect(level1?.passes).toBe(true);
    });

    it('Level 2 meets AAA (7:1)', () => {
      const validation = validateContrastLevels();
      const level2 = validation.results.find((r) => r.name === 'Level 2 (Maximum)');
      expect(level2?.ratio).toBeGreaterThanOrEqual(7.0);
      expect(level2?.passes).toBe(true);
      expect(level2?.ratio).toBeCloseTo(21.0, 1); // Black on white
    });

    it('returns overall pass status', () => {
      const validation = validateContrastLevels();
      expect(validation.allPass).toBe(true);
    });
  });

  describe('validateAccentColor', () => {
    it('validates accent color against all backgrounds', () => {
      const validation = validateAccentColor();
      expect(validation.results).toHaveLength(3);
    });

    it('accent color meets 3:1 minimum for UI components', () => {
      const validation = validateAccentColor();
      validation.results.forEach((result) => {
        expect(result.ratio).toBeGreaterThanOrEqual(3.0);
        expect(result.passes).toBe(true);
      });
    });

    it('returns overall pass status', () => {
      const validation = validateAccentColor();
      expect(validation.allPass).toBe(true);
    });
  });

  describe('getWCAGLevel', () => {
    it('returns AAA for 7:1 normal text', () => {
      expect(getWCAGLevel(7.0, false)).toBe('AAA');
    });

    it('returns AA for 4.5:1 normal text', () => {
      expect(getWCAGLevel(4.5, false)).toBe('AA');
    });

    it('returns Fail for below 4.5:1 normal text', () => {
      expect(getWCAGLevel(4.0, false)).toBe('Fail');
    });

    it('returns AAA for 4.5:1 large text', () => {
      expect(getWCAGLevel(4.5, true)).toBe('AAA');
    });

    it('returns AA for 3:1 large text', () => {
      expect(getWCAGLevel(3.0, true)).toBe('AA');
    });

    it('returns Fail for below 3:1 large text', () => {
      expect(getWCAGLevel(2.5, true)).toBe('Fail');
    });
  });

  describe('Real color values from system', () => {
    it('Level 0: #0f172a on #cbd5e1', () => {
      const ratio = contrastRatio('#0f172a', '#cbd5e1');
      expect(ratio).toBeGreaterThanOrEqual(4.5); // AA minimum
      expect(getWCAGLevel(ratio)).toBe('AAA'); // Should exceed AAA
    });

    it('Level 1: #060d1a on #f1f5f9', () => {
      const ratio = contrastRatio('#060d1a', '#f1f5f9');
      expect(ratio).toBeGreaterThanOrEqual(5.5); // Enhanced target
      expect(getWCAGLevel(ratio)).toBe('AAA');
    });

    it('Level 2: #000000 on #ffffff', () => {
      const ratio = contrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21.0, 1); // Maximum possible
      expect(getWCAGLevel(ratio)).toBe('AAA');
    });

    it('Accent #38bdf8 on Level 0 bg #0f172a', () => {
      const ratio = contrastRatio('#38bdf8', '#0f172a');
      expect(ratio).toBeGreaterThanOrEqual(3.0); // UI component minimum
    });

    it('Accent #38bdf8 on Level 1 bg #060d1a', () => {
      const ratio = contrastRatio('#38bdf8', '#060d1a');
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('Accent #38bdf8 on Level 2 bg #000000', () => {
      const ratio = contrastRatio('#38bdf8', '#000000');
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });
});
