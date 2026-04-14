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
    expect(screen.getByText('Mental Demand')).toBeDefined();
  });

  it('renders Physical Demand dimension', () => {
    renderWithProvider();
    expect(screen.getByText('Physical Demand')).toBeDefined();
  });

  it('renders 7 radio buttons per dimension (42 total)', () => {
    renderWithProvider();
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(42);
  });

  it('renders submit button', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /continue to summary/i })).toBeDefined();
  });
});
