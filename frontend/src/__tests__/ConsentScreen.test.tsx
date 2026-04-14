import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentScreen } from '../components/study/ConsentScreen';
import { StudyProvider } from '../context/StudyContext';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderWithProvider() {
  return render(
    <StudyProvider>
      <ConsentScreen />
    </StudyProvider>
  );
}

describe('ConsentScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders participant ID input', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Participant ID')).toBeDefined();
  });

  it('renders condition select', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Condition')).toBeDefined();
  });

  it('renders consent checkbox', () => {
    renderWithProvider();
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /begin study/i })).toBeDefined();
  });

  it('shows error when participant ID is empty', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /begin study/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/please enter a participant id/i)).toBeDefined();
  });

  it('shows error when consent not given', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const input = screen.getByLabelText('Participant ID');
    await user.type(input, 'P001');

    const submitBtn = screen.getByRole('button', { name: /begin study/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/please provide your consent/i)).toBeDefined();
  });

  it('has fieldset and legend elements', () => {
    renderWithProvider();
    const fieldsets = document.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(2);
    const legends = document.querySelectorAll('legend');
    expect(legends.length).toBe(2);
  });
});
