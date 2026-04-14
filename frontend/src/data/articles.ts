/**
 * Article sets for the study
 * 3 sets of comparable length/difficulty
 * Assignment based on participantId hash modulo 3
 */

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface ArticleSet {
  id: string;
  title: string;
  sections: ArticleSection[];
}

export const articleSets: ArticleSet[] = [
  {
    id: 'adaptive-interfaces',
    title: 'Adaptive Interfaces',
    sections: [
      {
        id: 'intro',
        heading: 'Introduction to Adaptive Interfaces',
        paragraphs: [
          'Adaptive user interfaces represent a paradigm shift in how we design digital experiences. Rather than forcing users to navigate complex settings menus, these systems observe behavior patterns and silently adjust the interface to better meet individual needs.',
          'This approach is particularly valuable for accessibility, where users may not be aware of available accommodations or may find the process of configuring them too burdensome. By detecting signals such as zoom frequency, tap accuracy, and reading patterns, adaptive systems can proactively remove barriers to access.',
        ],
      },
      {
        id: 'methodology',
        heading: 'Research Methodology',
        paragraphs: [
          'This system employs a rule-based adaptation approach, where specific behavior signals trigger predefined UI transformations. Each rule threshold is justified by peer-reviewed research in human-computer interaction, accessibility standards, and motor control studies.',
          'The within-subjects study design allows each participant to experience both adaptive and control conditions, maximizing statistical power while controlling for individual differences. Counterbalancing prevents order effects from confounding the results.',
          'Data collection focuses on objective measures (task completion time, error rate) alongside subjective assessments (System Usability Scale, NASA Task Load Index). This mixed-methods approach provides a comprehensive view of usability impact.',
        ],
      },
      {
        id: 'signals',
        heading: 'Behavior Signal Detection',
        paragraphs: [
          'The system tracks five distinct signal types. Zoom count measures pinch gestures and Ctrl+Wheel events, indicating legibility issues. Missed tap rate compares successful button clicks to taps on non-interactive areas, revealing motor control challenges.',
          'Dwell time uses IntersectionObserver to track how long sections remain visible in the viewport, combined with scroll reversal detection to identify re-reading patterns that suggest comprehension difficulty. Tremor score computes the standard deviation of tap position coordinates, quantifying pointing precision.',
          'Each signal operates on a sliding time window appropriate to its measurement characteristics. Zoom events are tracked over 60 seconds, missed taps over 30 seconds, dwell time over 90 seconds, scroll reversals over 45 seconds, and tremor over 8 seconds for granular feedback.',
        ],
      },
      {
        id: 'adaptation',
        heading: 'Adaptation Rules',
        paragraphs: [
          'Five adaptation rules transform detected signals into UI changes. Font scaling increases text size when repeated zooming occurs. Button enlargement adds padding when tap accuracy degrades. Contrast boosting progresses through WCAG levels when reading difficulty is detected.',
          'Spacing increase adjusts line height to accommodate pointing imprecision. Motion reduction disables animations for users exhibiting severe tremor, preventing visual interference with motor tasks. Each rule includes cooldown periods to prevent adaptation thrashing.',
          'Maximum application limits ensure adaptations do not escalate beyond usable bounds. Font size caps at 26 pixels, button padding at 36 pixels, contrast at WCAG AAA level (21:1 ratio), line height at 2.2, and animations disable permanently once triggered.',
        ],
      },
      {
        id: 'evaluation',
        heading: 'Evaluation and Expected Outcomes',
        paragraphs: [
          'The primary hypothesis predicts higher System Usability Scale scores in the adaptive condition compared to control. Secondary measures include reduced task completion time, lower error rates, and decreased NASA-TLX workload ratings.',
          'Statistical analysis employs Wilcoxon signed-rank tests appropriate for the within-subjects design and small sample size (n=12-15). Effect sizes using Cohen\'s d supplement significance testing to assess practical importance.',
          'Expected limitations include the artificial nature of laboratory tasks, short session duration relative to real-world use, and the inability of rule-based systems to distinguish between different causes of similar behavioral patterns. These will be addressed candidly in the discussion section.',
        ],
      },
    ],
  },
  {
    id: 'digital-accessibility',
    title: 'Digital Accessibility History',
    sections: [
      {
        id: 'origins',
        heading: 'Origins of Digital Accessibility',
        paragraphs: [
          'The history of digital accessibility traces back to the early days of computing when text-based interfaces were the norm. Screen readers first emerged in the 1980s, translating on-screen text into synthesized speech for users with visual impairments.',
          'The passage of the Americans with Disabilities Act in 1990 marked a turning point, establishing legal frameworks that would eventually extend to digital spaces. Early web accessibility efforts were largely grassroots, driven by advocates who recognized the internet\'s potential to either include or exclude.',
        ],
      },
      {
        id: 'standards',
        heading: 'Web Content Accessibility Guidelines',
        paragraphs: [
          'The World Wide Web Consortium published the first Web Content Accessibility Guidelines (WCAG 1.0) in 1999, establishing 14 guidelines organized by priority. WCAG 2.0 followed in 2008 with a more testable, technology-agnostic framework built around four principles: Perceivable, Operable, Understandable, and Robust.',
          'WCAG 2.1, released in 2018, added 17 new success criteria addressing mobile accessibility, low vision, and cognitive disabilities. The guidelines introduced requirements for text spacing, content reflow, and target size that directly inform adaptive interface design.',
          'Each guideline includes three conformance levels: A (minimum), AA (standard), and AAA (enhanced). Most legal requirements reference AA conformance, which includes contrast ratios of 4.5:1 for normal text and 3:1 for large text.',
        ],
      },
      {
        id: 'assistive-tech',
        heading: 'Assistive Technology Evolution',
        paragraphs: [
          'Screen readers have evolved from simple text-to-speech engines to sophisticated navigation tools. Modern screen readers like JAWS, NVDA, and VoiceOver interpret semantic HTML, ARIA landmarks, and live regions to provide rich interactive experiences for blind and low-vision users.',
          'Switch access devices enable users with severe motor impairments to interact with computers through single or dual switches. Eye-tracking systems have matured from laboratory equipment to consumer products, opening new interaction modalities for users with limited motor control.',
          'Voice recognition software, exemplified by Dragon NaturallySpeaking and built-in OS dictation, allows hands-free computer operation. These tools benefit users with repetitive strain injuries, motor disabilities, and temporary injuries alike.',
        ],
      },
      {
        id: 'legal-landscape',
        heading: 'Legal and Regulatory Landscape',
        paragraphs: [
          'Section 508 of the US Rehabilitation Act requires federal agencies to make electronic information accessible. The European Accessibility Act, effective from 2025, mandates accessibility for a broad range of products and services across EU member states.',
          'Court decisions, particularly Robles v. Domino\'s Pizza (2019), have established that websites and mobile applications fall under the Americans with Disabilities Act. This precedent has accelerated corporate investment in accessibility programs.',
          'The growing body of accessibility legislation worldwide reflects a shift from voluntary compliance to mandatory requirements, driving demand for automated testing tools, accessibility overlays, and adaptive interface solutions.',
        ],
      },
      {
        id: 'future-directions',
        heading: 'Future Directions in Accessibility',
        paragraphs: [
          'Machine learning offers promising avenues for accessibility. Computer vision models can generate image descriptions, natural language processing can simplify complex text, and behavioral models can predict individual accessibility needs before users explicitly request accommodations.',
          'The concept of inclusive design extends accessibility principles to benefit all users, not just those with disabilities. Features originally designed for accessibility, such as curb cuts, closed captions, and voice assistants, have become mainstream conveniences.',
          'Emerging technologies like augmented reality, brain-computer interfaces, and haptic feedback systems present both opportunities and challenges for accessibility. Ensuring these technologies are accessible from inception requires collaboration between researchers, designers, and people with disabilities.',
        ],
      },
    ],
  },
  {
    id: 'hci-methods',
    title: 'Human-Computer Interaction Methods',
    sections: [
      {
        id: 'hci-foundations',
        heading: 'Foundations of HCI Research',
        paragraphs: [
          'Human-Computer Interaction emerged as a distinct field in the early 1980s, drawing from cognitive psychology, computer science, and design. The field\'s founding premise is that technology should adapt to human capabilities and limitations, rather than requiring humans to adapt to technological constraints.',
          'Card, Moran, and Newell\'s "The Psychology of Human-Computer Interaction" (1983) established foundational models including the keystroke-level model and the GOMS framework. These predictive models enabled designers to estimate task completion times and identify interaction bottlenecks before implementation.',
        ],
      },
      {
        id: 'usability-testing',
        heading: 'Usability Testing Methods',
        paragraphs: [
          'Think-aloud protocols, introduced by Ericsson and Simon (1980), remain a cornerstone of usability evaluation. Participants verbalize their thought processes while completing tasks, revealing mental models, expectations, and confusion points that quantitative metrics alone cannot capture.',
          'Heuristic evaluation, formalized by Nielsen and Molich (1990), provides a cost-effective inspection method. Evaluators assess an interface against established usability principles, identifying issues without requiring user participants. Studies show that 3-5 evaluators typically find 75% of usability problems.',
          'A/B testing and controlled experiments complement qualitative methods by providing statistical evidence for design decisions. Within-subjects designs, where each participant experiences all conditions, maximize statistical power with smaller sample sizes, making them ideal for academic research settings.',
        ],
      },
      {
        id: 'measurement',
        heading: 'Measuring User Experience',
        paragraphs: [
          'The System Usability Scale, developed by Brooke (1996), provides a reliable 10-item questionnaire yielding scores from 0 to 100. Its simplicity and reliability have made it the most widely used standardized usability questionnaire, with a benchmark database exceeding 10,000 responses.',
          'The NASA Task Load Index measures six dimensions of workload: mental demand, physical demand, temporal demand, performance, effort, and frustration. Originally developed for aerospace applications, it has been widely adopted in HCI research to assess the cognitive cost of interface interactions.',
          'Physiological measures including eye tracking, galvanic skin response, and facial expression analysis provide objective indicators of user state. These measures complement self-reported scales by capturing unconscious responses and moment-to-moment changes in engagement and frustration.',
        ],
      },
      {
        id: 'interaction-models',
        heading: 'Interaction Models and Paradigms',
        paragraphs: [
          'Fitts\'s Law, published in 1954, models the time required to point at a target as a function of distance and target width. This law has been validated across input devices from mice to touchscreens and remains fundamental to interface layout optimization.',
          'The Hick-Hyman Law describes the logarithmic relationship between the number of choices and decision time. This principle informs menu design, search interface structure, and the organization of navigation systems to minimize cognitive overhead.',
          'Norman\'s seven stages of action model describes how users form goals, translate them into actions, execute those actions, and evaluate results. The model identifies two key gaps: the gulf of execution (mapping goals to actions) and the gulf of evaluation (interpreting system feedback).',
        ],
      },
      {
        id: 'modern-hci',
        heading: 'Modern HCI Challenges',
        paragraphs: [
          'The proliferation of devices and form factors has made responsive design insufficient. Adaptive interfaces that respond not just to screen size but to user behavior, context, and ability level represent the next evolution in personalized interaction design.',
          'Privacy concerns around behavioral tracking require careful consideration of data minimization, informed consent, and purpose limitation. Transparent systems that explain why adaptations occur build user trust and comply with regulations like GDPR.',
          'The intersection of artificial intelligence and HCI raises questions about user agency, algorithmic bias, and the appropriate level of system autonomy. Effective adaptive systems must balance proactive assistance with user control, avoiding the "creepy factor" that undermines adoption.',
        ],
      },
    ],
  },
];

/**
 * Get article set based on participant ID hash
 */
export function getArticleSetForParticipant(participantId: string): ArticleSet {
  let hash = 0;
  for (let i = 0; i < participantId.length; i++) {
    const char = participantId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const index = Math.abs(hash) % articleSets.length;
  return articleSets[index];
}

// Keep backward compatibility
export const sampleContent = articleSets[0].sections;
