import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NASATLXQuestionnaire } from '../components/study/NASATLXQuestionnaire';
import { StudyProvider } from '../context/StudyContext';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderWithProvider() {
  return render(
    <StudyProvider>
      <NASATLXQuestionnaire />
    </StudyProvider>
  );
}

describe('NASATLXQuestionnaire', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    renderWithProvider();
    expect(screen.getByText(/nasa task load index/i)).toBeDefined();
  });

  it('renders all 6 dimensions as fieldsets', () => {
    renderWithProvider();
    const fieldsets = document.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(6);
  });

  it('renders Mental Demand dimension', () => {
    renderWithProvider();
    expect(screen.getByText(/Cerință Mentală/i)).toBeDefined();
  });

  it('renders Physical Demand dimension', () => {
    renderWithProvider();
    expect(screen.getByText(/Cerință Fizică/i)).toBeDefined();
  });

  it('renders 6 range sliders (one per dimension)', () => {
    renderWithProvider();
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(6);
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /continu.*feedback/i })).toBeDefined();
  });
});
