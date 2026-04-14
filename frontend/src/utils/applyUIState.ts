import { UIState } from '../types';

/**
 * Apply UI state changes to the DOM via CSS custom properties
 * and data attributes
 */
export function applyUIState(ui: UIState): void {
  const root = document.documentElement;

  // Set CSS custom properties
  root.style.setProperty('--font-size-base', `${ui.fontSize}px`);
  root.style.setProperty('--button-padding', `${ui.buttonPadding}px`);
  root.style.setProperty('--line-height', ui.lineHeight.toString());
  root.style.setProperty('--animate-duration', ui.animations ? '200ms' : '0ms');
  root.style.setProperty('--cursor-scale', ui.cursorScale.toString());

  // Set contrast level via data attribute
  document.body.setAttribute('data-contrast', ui.contrast.toString());

  // Set layout simplified
  if (ui.layoutSimplified) {
    document.body.setAttribute('data-layout-simplified', '');
  } else {
    document.body.removeAttribute('data-layout-simplified');
  }

  // Set reading guide
  if (ui.readingGuide) {
    document.body.setAttribute('data-reading-guide', '');
  } else {
    document.body.removeAttribute('data-reading-guide');
  }
}
