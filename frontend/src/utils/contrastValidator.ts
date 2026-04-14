/**
 * WCAG Contrast Ratio Validator
 *
 * Validates that all contrast levels meet WCAG 2.1 standards:
 * - Level 0: AA (4.5:1 for normal text)
 * - Level 1: Enhanced (5.5:1)
 * - Level 2: AAA (7:1 for normal text)
 */

interface ContrastLevel {
  name: string;
  bg: string;
  fg: string;
  targetRatio: number;
  wcagLevel: 'AA' | 'AAA' | 'Enhanced';
}

/**
 * Calculate relative luminance of a color
 * Formula from WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function relativeLuminance(hex: string): number {
  // Remove # if present
  const hexClean = hex.replace('#', '');

  // Parse RGB values
  const rgb = parseInt(hexClean, 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;

  // Linearize RGB values
  const linearize = (channel: number): number => {
    if (channel <= 0.03928) {
      return channel / 12.92;
    }
    return Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const rLinear = linearize(r);
  const gLinear = linearize(g);
  const bLinear = linearize(b);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 > L2
 *
 * WCAG Requirements:
 * - AA (normal text): 4.5:1
 * - AA (large text 18pt+): 3:1
 * - AAA (normal text): 7:1
 * - AAA (large text): 4.5:1
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const lum1 = relativeLuminance(hex1);
  const lum2 = relativeLuminance(hex2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate all contrast levels defined in the system
 */
export function validateContrastLevels(): {
  allPass: boolean;
  results: Array<{
    name: string;
    bg: string;
    fg: string;
    ratio: number;
    target: number;
    passes: boolean;
    wcagLevel: string;
  }>;
} {
  const levels: ContrastLevel[] = [
    {
      name: 'Level 0 (Baseline)',
      bg: '#0f172a',
      fg: '#cbd5e1',
      targetRatio: 4.5,
      wcagLevel: 'AA',
    },
    {
      name: 'Level 1 (Enhanced)',
      bg: '#060d1a',
      fg: '#f1f5f9',
      targetRatio: 5.5,
      wcagLevel: 'Enhanced',
    },
    {
      name: 'Level 2 (Maximum)',
      bg: '#000000',
      fg: '#ffffff',
      targetRatio: 7.0,
      wcagLevel: 'AAA',
    },
  ];

  const results = levels.map((level) => {
    const ratio = contrastRatio(level.bg, level.fg);
    const passes = ratio >= level.targetRatio;

    return {
      name: level.name,
      bg: level.bg,
      fg: level.fg,
      ratio: parseFloat(ratio.toFixed(2)),
      target: level.targetRatio,
      passes,
      wcagLevel: level.wcagLevel,
    };
  });

  const allPass = results.every((r) => r.passes);

  return { allPass, results };
}

/**
 * Validate accent color contrast against all backgrounds
 */
export function validateAccentColor(): {
  allPass: boolean;
  results: Array<{
    background: string;
    ratio: number;
    passes: boolean;
  }>;
} {
  const accent = '#38bdf8';
  const backgrounds = ['#0f172a', '#060d1a', '#000000'];

  const results = backgrounds.map((bg) => {
    const ratio = contrastRatio(accent, bg);
    // Accent color should have at least 3:1 for non-text UI components (WCAG 1.4.11)
    const passes = ratio >= 3.0;

    return {
      background: bg,
      ratio: parseFloat(ratio.toFixed(2)),
      passes,
    };
  });

  const allPass = results.every((r) => r.passes);

  return { allPass, results };
}

/**
 * Run all contrast validations and log results to console
 */
export function runContrastValidation(): boolean {
  console.group('🎨 WCAG Contrast Validation');

  // Validate text contrast levels
  console.log('\n📝 Text Contrast Levels:');
  const textValidation = validateContrastLevels();
  console.table(textValidation.results);

  // Validate accent color
  console.log('\n🔵 Accent Color (#38bdf8):');
  const accentValidation = validateAccentColor();
  console.table(accentValidation.results);

  // Summary
  const allPass = textValidation.allPass && accentValidation.allPass;
  console.log(
    `\n${allPass ? '✅' : '❌'} Overall: ${allPass ? 'All contrast checks passed!' : 'Some checks failed'}`
  );

  console.groupEnd();

  return allPass;
}

/**
 * Get WCAG conformance level based on contrast ratio
 */
export function getWCAGLevel(ratio: number, largeText: boolean = false): string {
  if (largeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
    return 'Fail';
  } else {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}
