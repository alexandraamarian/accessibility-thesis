/**
 * Structured tasks for the study
 * 3 task types per article set (12 sets × 3 = 36 tasks)
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
  // ── 18-24: Social Media and Mental Health ──
  'social-media-mental-health': [
    {
      id: 'smh-find',
      type: 'find_answer',
      articleSetId: 'social-media-mental-health',
      title: 'Find Information',
      instruction: 'In which section is the concept of "doomscrolling" discussed? Type the section heading.',
      expectedAnswer: 'The Dopamine Loop and Addiction',
      expectedAnswerRo: 'Bucla Dopaminei și Dependența',
    },
    {
      id: 'smh-form',
      type: 'form_completion',
      articleSetId: 'social-media-mental-health',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about social media and mental health.',
      formFields: [
        { id: 'daily_hours', label: 'Average hours young adults spend daily on social media', type: 'text', required: true },
        { id: 'body_image', label: 'Percentage of teen girls feeling worse about body image on Instagram', type: 'text', required: true },
        { id: 'detox_duration', label: 'Duration of the University of Bath detox study (weeks)', type: 'text', required: true },
      ],
    },
    {
      id: 'smh-nav',
      type: 'navigation',
      articleSetId: 'social-media-mental-health',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Future Directions and Policy" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 18-24: Gig Economy and Freelancing ──
  'gig-economy-freelancing': [
    {
      id: 'gef-find',
      type: 'find_answer',
      articleSetId: 'gig-economy-freelancing',
      title: 'Find Information',
      instruction: 'In which section is Proposition 22 mentioned? Type the section heading.',
      expectedAnswer: 'The Future of Independent Work',
      expectedAnswerRo: 'Viitorul Muncii Independente',
    },
    {
      id: 'gef-form',
      type: 'form_completion',
      articleSetId: 'gig-economy-freelancing',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about the gig economy.',
      formFields: [
        { id: 'freelancer_count', label: 'Registered freelancers on Upwork (millions)', type: 'text', required: true },
        { id: 'independent_pct', label: 'Percentage of Americans identifying as independent workers (2024)', type: 'text', required: true },
        { id: 'earnings_boost', label: 'Extra earnings (%) for freelancers who invest in certifications', type: 'text', required: true },
      ],
    },
    {
      id: 'gef-nav',
      type: 'navigation',
      articleSetId: 'gig-economy-freelancing',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Challenges Facing Gig Workers" section and click any button in the interaction test area.',
      targetSectionId: 'challenges',
    },
  ],

  // ── 25-34: Remote Work and Work-Life Balance ──
  'remote-work-balance': [
    {
      id: 'rwb-find',
      type: 'find_answer',
      articleSetId: 'remote-work-balance',
      title: 'Find Information',
      instruction: 'In which section is "proximity bias" discussed? Type the section heading.',
      expectedAnswer: 'Burnout and Boundary Erosion',
      expectedAnswerRo: 'Epuizarea și Erodarea Granițelor',
    },
    {
      id: 'rwb-form',
      type: 'form_completion',
      articleSetId: 'remote-work-balance',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about remote work.',
      formFields: [
        { id: 'remote_pct', label: 'Percentage of US work days performed remotely (2024)', type: 'text', required: true },
        { id: 'productivity_gain', label: 'Productivity increase of remote employees (Stanford study, %)', type: 'text', required: true },
        { id: 'want_remote', label: 'Percentage of remote workers wanting to continue remotely', type: 'text', required: true },
      ],
    },
    {
      id: 'rwb-nav',
      type: 'navigation',
      articleSetId: 'remote-work-balance',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Remote Work" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 25-34: Sustainable Living on a Budget ──
  'sustainable-living-budget': [
    {
      id: 'slb-find',
      type: 'find_answer',
      articleSetId: 'sustainable-living-budget',
      title: 'Find Information',
      instruction: 'In which section is the Too Good To Go app mentioned? Type the section heading.',
      expectedAnswer: 'Food Waste and Smart Eating',
      expectedAnswerRo: 'Risipa Alimentară și Alimentația Inteligentă',
    },
    {
      id: 'slb-form',
      type: 'form_completion',
      articleSetId: 'sustainable-living-budget',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about sustainable living.',
      formFields: [
        { id: 'textile_waste', label: 'Annual textile waste produced by the fashion industry (million tonnes)', type: 'text', required: true },
        { id: 'led_savings', label: 'Annual savings from switching to LED bulbs ($)', type: 'text', required: true },
        { id: 'food_waste_cost', label: 'Average annual food waste cost per family ($)', type: 'text', required: true },
      ],
    },
    {
      id: 'slb-nav',
      type: 'navigation',
      articleSetId: 'sustainable-living-budget',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Sustainable Living" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 35-44: Parenting in the Digital Age ──
  'parenting-digital-age': [
    {
      id: 'pda-find',
      type: 'find_answer',
      articleSetId: 'parenting-digital-age',
      title: 'Find Information',
      instruction: 'In which section is COPPA (Children\'s Online Privacy Protection Act) discussed? Type the section heading.',
      expectedAnswer: 'Online Safety and Cyberbullying',
      expectedAnswerRo: 'Siguranța Online și Cyberbullying-ul',
    },
    {
      id: 'pda-form',
      type: 'form_completion',
      articleSetId: 'parenting-digital-age',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about digital parenting.',
      formFields: [
        { id: 'teen_screen', label: 'Average daily screen hours for teenagers', type: 'text', required: true },
        { id: 'cyberbully_pct', label: 'Percentage of students aged 12-17 affected by cyberbullying', type: 'text', required: true },
        { id: 'guidelines_pct', label: 'Percentage of families adhering to WHO screen time guidelines', type: 'text', required: true },
      ],
    },
    {
      id: 'pda-nav',
      type: 'navigation',
      articleSetId: 'parenting-digital-age',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Digital Parenting" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 35-44: Career Transitions and Lifelong Learning ──
  'career-transitions-learning': [
    {
      id: 'ctl-find',
      type: 'find_answer',
      articleSetId: 'career-transitions-learning',
      title: 'Find Information',
      instruction: 'In which section are "bridge roles" discussed? Type the section heading.',
      expectedAnswer: 'Strategies for Successful Transitions',
      expectedAnswerRo: 'Strategii pentru Tranziții de Succes',
    },
    {
      id: 'ctl-form',
      type: 'form_completion',
      articleSetId: 'career-transitions-learning',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about career transitions.',
      formFields: [
        { id: 'job_changes', label: 'Average number of job changes in a career', type: 'text', required: true },
        { id: 'skills_change', label: 'Percentage of worker skills that will change by 2027 (WEF)', type: 'text', required: true },
        { id: 'networking_pct', label: 'Percentage of positions filled through networking (LinkedIn)', type: 'text', required: true },
      ],
    },
    {
      id: 'ctl-nav',
      type: 'navigation',
      articleSetId: 'career-transitions-learning',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Career Development" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 45-54: Preventive Healthcare and Wellness ──
  'preventive-healthcare': [
    {
      id: 'phw-find',
      type: 'find_answer',
      articleSetId: 'preventive-healthcare',
      title: 'Find Information',
      instruction: 'In which section is sarcopenia discussed? Type the section heading.',
      expectedAnswer: 'Exercise for Longevity',
      expectedAnswerRo: 'Exerciții pentru Longevitate',
    },
    {
      id: 'phw-form',
      type: 'form_completion',
      articleSetId: 'preventive-healthcare',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about preventive healthcare.',
      formFields: [
        { id: 'hypertension_pct', label: 'Percentage of adults with unaware hypertension', type: 'text', required: true },
        { id: 'cvd_reduction', label: 'Cardiovascular event reduction from Mediterranean diet (%)', type: 'text', required: true },
        { id: 'colorectal_age', label: 'Recommended starting age for colorectal cancer screening', type: 'text', required: true },
      ],
    },
    {
      id: 'phw-nav',
      type: 'navigation',
      articleSetId: 'preventive-healthcare',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Preventive Medicine" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 45-54: The Sandwich Generation ──
  'sandwich-generation': [
    {
      id: 'sg-find',
      type: 'find_answer',
      articleSetId: 'sandwich-generation',
      title: 'Find Information',
      instruction: 'In which section is the CARE Act mentioned? Type the section heading.',
      expectedAnswer: 'Future Support Systems',
      expectedAnswerRo: 'Sisteme de Sprijin Viitoare',
    },
    {
      id: 'sg-form',
      type: 'form_completion',
      articleSetId: 'sandwich-generation',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about the sandwich generation.',
      formFields: [
        { id: 'sandwich_pct', label: 'Percentage of US adults in the sandwich generation', type: 'text', required: true },
        { id: 'care_hours', label: 'Average weekly hours spent on parent caregiving', type: 'text', required: true },
        { id: 'nursing_cost', label: 'Monthly cost of a private nursing home room ($)', type: 'text', required: true },
      ],
    },
    {
      id: 'sg-nav',
      type: 'navigation',
      articleSetId: 'sandwich-generation',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "Managing Dual Responsibilities" section and click any button in the interaction test area.',
      targetSectionId: 'strategies',
    },
  ],

  // ── 55-64: Retirement Planning and Financial Security ──
  'retirement-planning': [
    {
      id: 'rp-find',
      type: 'find_answer',
      articleSetId: 'retirement-planning',
      title: 'Find Information',
      instruction: 'In which section is the "bucket strategy" discussed? Type the section heading.',
      expectedAnswer: 'Strategies for the Final Decade',
      expectedAnswerRo: 'Strategii pentru Ultimul Deceniu',
    },
    {
      id: 'rp-form',
      type: 'form_completion',
      articleSetId: 'retirement-planning',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about retirement planning.',
      formFields: [
        { id: 'healthcare_cost', label: 'Estimated healthcare costs for a retiring couple ($)', type: 'text', required: true },
        { id: 'ss_increase', label: 'Annual Social Security benefit increase per year of delay (%)', type: 'text', required: true },
        { id: 'catchup_401k', label: 'Additional annual catch-up contribution for 401(k) ($)', type: 'text', required: true },
      ],
    },
    {
      id: 'rp-nav',
      type: 'navigation',
      articleSetId: 'retirement-planning',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Changing Face of Retirement" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 55-64: Travel and Cultural Exploration ──
  'travel-cultural-exploration': [
    {
      id: 'tce-find',
      type: 'find_answer',
      articleSetId: 'travel-cultural-exploration',
      title: 'Find Information',
      instruction: 'In which section is "voluntourism" discussed? Type the section heading.',
      expectedAnswer: 'Slow Travel and Immersive Experiences',
      expectedAnswerRo: 'Călătorii Lente și Experiențe Imersive',
    },
    {
      id: 'tce-form',
      type: 'form_completion',
      articleSetId: 'travel-cultural-exploration',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about travel.',
      formFields: [
        { id: 'travel_spend', label: 'Average leisure travel spending for this age group ($)', type: 'text', required: true },
        { id: 'culinary_pct', label: 'Percentage of leisure travelers who are "culinary travelers"', type: 'text', required: true },
        { id: 'insurance_cost', label: 'Typical travel insurance cost as percentage of trip cost', type: 'text', required: true },
      ],
    },
    {
      id: 'tce-nav',
      type: 'navigation',
      articleSetId: 'travel-cultural-exploration',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Travel" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 65+: Staying Connected with Technology ──
  'staying-connected-tech': [
    {
      id: 'sct-find',
      type: 'find_answer',
      articleSetId: 'staying-connected-tech',
      title: 'Find Information',
      instruction: 'In which section is technology anxiety discussed? Type the section heading.',
      expectedAnswer: 'Barriers to Technology Adoption',
      expectedAnswerRo: 'Bariere în Adoptarea Tehnologiei',
    },
    {
      id: 'sct-form',
      type: 'form_completion',
      articleSetId: 'staying-connected-tech',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about seniors and technology.',
      formFields: [
        { id: 'internet_pct', label: 'Percentage of adults over 65 using the internet', type: 'text', required: true },
        { id: 'fraud_loss', label: 'Amount lost to fraud by adults over 60 in 2023 ($ billion)', type: 'text', required: true },
        { id: 'telehealth_increase', label: 'Telehealth visit increase among seniors during 2020 (%)', type: 'text', required: true },
      ],
    },
    {
      id: 'sct-nav',
      type: 'navigation',
      articleSetId: 'staying-connected-tech',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Senior Technology" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],

  // ── 65+: Brain Health and Active Aging ──
  'brain-health-active-aging': [
    {
      id: 'bha-find',
      type: 'find_answer',
      articleSetId: 'brain-health-active-aging',
      title: 'Find Information',
      instruction: 'In which section is the MIND diet discussed? Type the section heading.',
      expectedAnswer: 'Nutrition for Brain Health',
      expectedAnswerRo: 'Nutriția pentru Sănătatea Creierului',
    },
    {
      id: 'bha-form',
      type: 'form_completion',
      articleSetId: 'brain-health-active-aging',
      title: 'Complete the Form',
      instruction: 'Based on the article, fill in the following details about brain health.',
      formFields: [
        { id: 'dementia_pct', label: 'Percentage of dementia cases preventable by addressing risk factors', type: 'text', required: true },
        { id: 'mind_diet_reduction', label: 'Alzheimer\'s risk reduction with strict MIND diet adherence (%)', type: 'text', required: true },
        { id: 'walking_volume', label: 'Hippocampal volume increase from walking program (%)', type: 'text', required: true },
      ],
    },
    {
      id: 'bha-nav',
      type: 'navigation',
      articleSetId: 'brain-health-active-aging',
      title: 'Navigate and Interact',
      instruction: 'Scroll to the "The Future of Active Aging" section and click any button in the interaction test area.',
      targetSectionId: 'future-outlook',
    },
  ],
};

export function getTasksForArticleSet(articleSetId: string): StudyTask[] {
  return tasks[articleSetId] || [];
}
