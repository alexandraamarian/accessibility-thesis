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

  it('renders email input', () => {
    renderWithProvider();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
  });

  it('renders consent checkbox', () => {
    renderWithProvider();
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /începe studiul/i })).toBeDefined();
  });

  it('shows error when email is empty', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /începe studiul/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/introduceți adresa de email/i)).toBeDefined();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'not-an-email');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /începe studiul/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/adresă de email validă/i)).toBeDefined();
  });

  it('shows error when consent not given', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'test@example.com');

    const submitBtn = screen.getByRole('button', { name: /începe studiul/i });
    await user.click(submitBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/consimțământul/i)).toBeDefined();
  });

  it('shows error when email already used for both sessions', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 409 });

    const user = userEvent.setup();
    renderWithProvider();

    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'used@example.com');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /începe studiul/i });
    await user.click(submitBtn);

    expect(await screen.findByRole('alert')).toBeDefined();
    expect(screen.getByText(/completat deja ambele sesiuni/i)).toBeDefined();
  });

  it('has fieldset and legend elements', () => {
    renderWithProvider();
    const fieldsets = document.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(2);
    const legends = document.querySelectorAll('legend');
    expect(legends.length).toBe(2);
  });
});
