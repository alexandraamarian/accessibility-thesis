import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressTracker } from '../components/study/ProgressTracker';

describe('ProgressTracker', () => {
  it('renders all 6 steps', () => {
    render(<ProgressTracker currentStep="consent" />);
    expect(screen.getByText('Consimtamant')).toBeDefined();
    expect(screen.getByText('Incalzire')).toBeDefined();
    expect(screen.getByText('Sarcini')).toBeDefined();
    expect(screen.getByText('SUS')).toBeDefined();
    expect(screen.getByText('NASA-TLX')).toBeDefined();
    expect(screen.getByText('Sumar')).toBeDefined();
  });

  it('marks current step with aria-current="step"', () => {
    render(<ProgressTracker currentStep="tasks" />);
    const currentStep = screen.getByText('Sarcini').closest('li');
    expect(currentStep?.getAttribute('aria-current')).toBe('step');
  });

  it('does not mark non-current steps with aria-current', () => {
    render(<ProgressTracker currentStep="tasks" />);
    const consentStep = screen.getByText('Consimtamant').closest('li');
    expect(consentStep?.getAttribute('aria-current')).toBeNull();
  });

  it('has navigation role with aria-label', () => {
    render(<ProgressTracker currentStep="consent" />);
    expect(screen.getByRole('navigation', { name: 'Study progress' })).toBeDefined();
  });
});
