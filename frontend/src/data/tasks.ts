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
  /** Romanian expected answer (used when app language is RO) */
  expectedAnswerRo?: string;
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
  'climate-technology': [
    {
      id: 'ct-find',
      type: 'find_answer',
      articleSetId: 'climate-technology',
      title: 'Find Information',
      instruction: 'In which section is the Orca plant in Iceland discussed? Type the section heading.',
      expectedAnswer: 'Carbon Capture and Removal',
      expectedAnswerRo: 'Captarea și Eliminarea Carbonului',
    },
    {
      id: 'ct-form',
      type: 'form_completion',
      articleSetId: 'climate-technology',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about climate technology.',
      formFields: [
        { id: 'solar_reduction', label: 'Solar PV cost reduction since 2010 (%)', type: 'text', required: true },
        { id: 'ev_sales', label: 'Global EV sales in 2023 (millions)', type: 'text', required: true },
        { id: 'co2_removal', label: 'CO2 removal needed by 2050 (gigatonnes/year, e.g. "6-10")', type: 'text', required: true },
      ],
    },
    {
      id: 'ct-nav',
      type: 'navigation',
      articleSetId: 'climate-technology',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Future Outlook and Challenges" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
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
      expectedAnswerRo: 'Peisajul Legal și de Reglementare',
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
      expectedAnswerRo: 'Modele și Paradigme de Interacțiune',
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
