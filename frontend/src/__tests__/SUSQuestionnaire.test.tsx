import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SUSQuestionnaire } from '../components/study/SUSQuestionnaire';
import { StudyProvider } from '../context/StudyContext';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderWithProvider() {
  return render(
    <StudyProvider>
      <SUSQuestionnaire />
    </StudyProvider>
  );
}

describe('SUSQuestionnaire', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    renderWithProvider();
    expect(screen.getByText(/scala de utilizabilitate/i)).toBeDefined();
  });

  it('renders all 10 questions as fieldsets', () => {
    renderWithProvider();
    const fieldsets = document.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(10);
  });

  it('renders 5 radio buttons per question (50 total)', () => {
    renderWithProvider();
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(50);
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /continu.*nasa-tlx/i })).toBeDefined();
  });

  it('shows error when not all questions answered', async () => {
    const { container } = renderWithProvider();
    const submitBtn = screen.getByRole('button', { name: /continu.*nasa-tlx/i });

    // Simulate click on form submit
    const form = container.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // The form uses noValidate so validation happens in JS
    // We need to click the button to trigger the handler
    submitBtn.click();

    // Wait for state update
    await new Promise((r) => setTimeout(r, 0));

    expect(screen.getByRole('alert')).toBeDefined();
  });
});
