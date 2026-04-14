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
    expect(screen.getByLabelText('ID Participant')).toBeDefined();
  });

  it('renders condition select', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Conditie')).toBeDefined();
  });

  it('renders consent checkbox', () => {
    renderWithProvider();
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /incepe studiul/i })).toBeDefined();
  });

  it('shows error when participant ID is empty', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /incepe studiul/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/va rugam sa introduceti un id de participant/i)).toBeDefined();
  });

  it('shows error when consent not given', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const input = screen.getByLabelText('ID Participant');
    await user.type(input, 'P001');

    const submitBtn = screen.getByRole('button', { name: /incepe studiul/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/va rugam sa va dati consimtamantul/i)).toBeDefined();
  });

  it('has fieldset and legend elements', () => {
    renderWithProvider();
    const fieldsets = document.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(2);
    const legends = document.querySelectorAll('legend');
    expect(legends.length).toBe(2);
  });
});
