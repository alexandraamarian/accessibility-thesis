/**
 * Structured tasks for the study
 * 3 task types per article set
 */

export interface StudyTask {
  id: string;
  type: 'find_answer' | 'form_completion' | 'navigation';
  articleSetId: string;
  title: string;
  instruction: string;
  expectedAnswer?: string;
  formFields?: FormField[];
  targetSectionId?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  required: boolean;
}

export const tasks: Record<string, StudyTask[]> = {
  'adaptive-interfaces': [
    {
      id: 'ai-find',
      type: 'find_answer',
      articleSetId: 'adaptive-interfaces',
      title: 'Find Information',
      instruction: 'In which section is the sliding time window for tremor measurement discussed? Type the section heading.',
      expectedAnswer: 'Behavior Signal Detection',
    },
    {
      id: 'ai-form',
      type: 'form_completion',
      articleSetId: 'adaptive-interfaces',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about the adaptation system.',
      formFields: [
        { id: 'max_font', label: 'Maximum font size (px)', type: 'text', required: true },
        { id: 'study_design', label: 'Study design type', type: 'select', options: ['Between-subjects', 'Within-subjects', 'Mixed'], required: true },
        { id: 'sample_size', label: 'Target sample size', type: 'text', required: true },
      ],
    },
    {
      id: 'ai-nav',
      type: 'navigation',
      articleSetId: 'adaptive-interfaces',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Evaluation and Expected Outcomes" section and click any button in the interaction test area.',
      targetSectionId: 'evaluation',
    },
  ],
  'digital-accessibility': [
    {
      id: 'da-find',
      type: 'find_answer',
      articleSetId: 'digital-accessibility',
      title: 'Find Information',
      instruction: 'In which section is the Robles v. Domino\'s Pizza case mentioned? Type the section heading.',
      expectedAnswer: 'Legal and Regulatory Landscape',
    },
    {
      id: 'da-form',
      type: 'form_completion',
      articleSetId: 'digital-accessibility',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following accessibility details.',
      formFields: [
        { id: 'wcag_year', label: 'Year WCAG 2.0 was published', type: 'text', required: true },
        { id: 'conformance', label: 'Most commonly required conformance level', type: 'select', options: ['A', 'AA', 'AAA'], required: true },
        { id: 'wcag21_criteria', label: 'Number of new criteria in WCAG 2.1', type: 'text', required: true },
      ],
    },
    {
      id: 'da-nav',
      type: 'navigation',
      articleSetId: 'digital-accessibility',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Future Directions in Accessibility" section and click any button in the interaction test area.',
      targetSectionId: 'future-directions',
    },
  ],
  'hci-methods': [
    {
      id: 'hci-find',
      type: 'find_answer',
      articleSetId: 'hci-methods',
      title: 'Find Information',
      instruction: 'In which section is the Hick-Hyman Law discussed? Type the section heading.',
      expectedAnswer: 'Interaction Models and Paradigms',
    },
    {
      id: 'hci-form',
      type: 'form_completion',
      articleSetId: 'hci-methods',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following HCI details.',
      formFields: [
        { id: 'sus_items', label: 'Number of items in the SUS questionnaire', type: 'text', required: true },
        { id: 'nasa_dimensions', label: 'Number of NASA-TLX dimensions', type: 'select', options: ['4', '5', '6', '7'], required: true },
        { id: 'evaluators', label: 'Recommended evaluators for heuristic evaluation (e.g. "3-5")', type: 'text', required: true },
      ],
    },
    {
      id: 'hci-nav',
      type: 'navigation',
      articleSetId: 'hci-methods',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Modern HCI Challenges" section and click any button in the interaction test area.',
      targetSectionId: 'modern-hci',
    },
  ],
};

export function getTasksForArticleSet(articleSetId: string): StudyTask[] {
  return tasks[articleSetId] || [];
}
