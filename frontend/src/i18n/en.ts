export const en = {
  common: {
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'Error',
    submit: 'Submit',
    continue: 'Continue',
    back: 'Back',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    on: 'On',
    off: 'Off',
    none: 'None',
    select: 'Select...',
    view: 'View',
    refresh: 'Refresh',
    enter: 'Enter',
    adaptive: 'Adaptive',
    control: 'Control',
    complete: 'Complete',
    active: 'Active',
    condition: 'Condition',
    session: 'Session',
    participant: 'Participant',
    exportCsv: 'Export CSV',
    language: 'Language',
  },

  study: {
    title: 'Adaptive Accessibility Study',
    steps: {
      consent: 'Consent',
      demographics: 'Profile',
      warmup: 'Warm-up',
      tasks: 'Tasks',
      sus: 'SUS',
      nasatlx: 'NASA-TLX',
      feedback: 'Feedback',
      summary: 'Summary',
    },
  },

  consent: {
    heading: 'Study Consent & Setup',
    participantInfo: 'Participant Information',
    email: 'Email Address',
    emailPlaceholder: 'e.g., participant@example.com',
    informedConsent: 'Informed Consent',
    consentText1:
      'This study investigates whether behaviour-based UI adaptation can improve usability. During the session, the system will collect data about your interactions (clicks, scrolling, zoom gestures) to evaluate the adaptation mechanism.',
    consentText2:
      'Your participation is voluntary. You may withdraw at any time without consequence. Your email is used only to link your two sessions and is not shared with third parties.',
    consentText3:
      'The session will take approximately 15-20 minutes and includes: a warm-up phase, reading and interaction tasks, and two short questionnaires.',
    consentCheckbox:
      'I have read and understood the above information. I consent to participate in this study and to the collection of my interaction data.',
    errorNoEmail: 'Please enter your email address.',
    errorInvalidEmail: 'Please enter a valid email address.',
    errorNoConsent: 'Please provide your consent to continue.',
    errorDuplicateEmail: 'This email has already completed both study sessions. Each participant may only participate twice (once per condition).',
    errorSessionFailed: 'Failed to create session. Please ensure the backend is running.',
    creatingSession: 'Creating session...',
    beginStudy: 'Begin Study',
  },

  demographics: {
    heading: 'Participant Profile',
    instructions: 'Please provide some background information. This helps us analyze results across different user groups.',
    ageRange: 'Age Range',
    gender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderPreferNot: 'Prefer not to say',
    disability: 'Do you have any disability that affects computer use?',
    disabilityNone: 'None',
    disabilityVisual: 'Visual impairment',
    disabilityMotor: 'Motor impairment',
    disabilityCognitive: 'Cognitive disability',
    disabilityOther: 'Other',
    assistiveTech: 'Do you use assistive technology?',
    assistiveNone: 'None',
    assistiveScreenReader: 'Screen reader',
    assistiveMagnifier: 'Screen magnifier',
    assistiveVoice: 'Voice control',
    assistiveOther: 'Other',
    computerProficiency: 'Computer Proficiency',
    proficiencyBeginner: 'Beginner',
    proficiencyIntermediate: 'Intermediate',
    proficiencyAdvanced: 'Advanced',
    proficiencyExpert: 'Expert',
    continue: 'Continue to Warm-up',
    errorRequired: 'Please fill in all required fields.',
    errorSaveFailed: 'Failed to save. Please try again.',
  },

  warmup: {
    heading: 'Warm-up Phase',
    timeRemaining: '{{time}}s remaining',
    readyToContinue: 'Ready to continue',
    practiceHeading: 'Practice: Getting Familiar',
    practiceText1:
      'This is a short warm-up phase to help you get comfortable with the interface. Feel free to scroll, click buttons, and read the text below.',
    practiceText2:
      'The system is now monitoring your interactions. In the adaptive condition, the interface may adjust based on your behavior patterns. This is normal and part of the study design.',
    instructions:
      'Take {{duration}} seconds to explore the interface. Scroll through the content, click the buttons, and try zooming (Ctrl+Wheel).',
    continueToTasks: 'Continue to Tasks',
    pleaseWait: 'Please wait {{time}}s...',
  },

  tasks: {
    heading: 'Task {{current}} of {{total}}',
    article: 'Article: {{title}}',
    yourAnswer: 'Your Answer',
    answerPlaceholder: 'Type your answer here...',
    navigationHint:
      'Scroll down to find the referenced section, then interact with the test area.',
    submitContinue: 'Submit & Continue',
    submitted: 'Submitted',
    errors: 'error(s)',
  },

  sus: {
    heading: 'System Usability Scale (SUS)',
    instructions:
      'Please rate your agreement with each statement about the system you just used.',
    questions: [
      'I think that I would like to use this system frequently.',
      'I found the system unnecessarily complex.',
      'I thought the system was easy to use.',
      'I think that I would need the support of a technical person to be able to use this system.',
      'I found the various functions in this system were well integrated.',
      'I thought there was too much inconsistency in this system.',
      'I would imagine that most people would learn to use this system very quickly.',
      'I found the system very cumbersome to use.',
      'I felt very confident using the system.',
      'I needed to learn a lot of things before I could get going with this system.',
    ],
    likert: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree',
    ],
    errorUnanswered: 'Please answer question {{n}}.',
    errorSaveFailed: 'Failed to save responses. Please try again.',
    continueToNasaTlx: 'Continue to NASA-TLX',
  },

  nasatlx: {
    heading: 'NASA Task Load Index (NASA-TLX)',
    instructions: 'Rate each dimension on a scale from 0 (low) to 100 (high). Drag the slider to indicate your rating.',
    dimensions: {
      mental: {
        label: 'Mental Demand',
        description: 'How mentally demanding was the task?',
        lowEnd: 'Very Low',
        highEnd: 'Very High',
      },
      physical: {
        label: 'Physical Demand',
        description: 'How physically demanding was the task?',
        lowEnd: 'Very Low',
        highEnd: 'Very High',
      },
      temporal: {
        label: 'Temporal Demand',
        description: 'How hurried or rushed was the pace of the task?',
        lowEnd: 'Very Low',
        highEnd: 'Very High',
      },
      performance: {
        label: 'Performance',
        description: 'How successful were you in accomplishing what you were asked to do?',
        lowEnd: 'Failure',
        highEnd: 'Perfect',
      },
      effort: {
        label: 'Effort',
        description: 'How hard did you have to work to accomplish your level of performance?',
        lowEnd: 'Very Low',
        highEnd: 'Very High',
      },
      frustration: {
        label: 'Frustration',
        description: 'How insecure, discouraged, irritated, stressed, and annoyed were you?',
        lowEnd: 'Very Low',
        highEnd: 'Very High',
      },
    },
    errorUnanswered: 'Please rate "{{dimension}}".',
    errorSaveFailed: 'Failed to save responses. Please try again.',
    continueToSummary: 'Continue to Feedback',
  },

  feedback: {
    heading: 'Your Experience',
    instructions: 'One last question before we wrap up. There are no right or wrong answers.',
    question: 'Did you notice any changes in the interface? If so, how did they make you feel?',
    placeholder: 'Write your thoughts here... (optional)',
    continue: 'Continue to Summary',
  },

  summary: {
    heading: 'Thank You!',
    description: 'Your session is now complete. Here is a summary of your participation.',
    condition: 'Condition',
    tasksCompleted: 'Tasks Completed',
    totalTaskTime: 'Total Task Time',
    totalErrors: 'Total Errors',
    questionnaireScores: 'Questionnaire Scores',
    susScore: 'SUS Score',
    nasaTlxAvg: 'NASA-TLX Avg',
    sessionInfo: 'Session ID: {{sessionId}} | Participant: {{participantId}}',
    nextSessionPrompt: 'You have completed the first condition. You can now continue with the second condition to complete the study.',
    startNextSession: 'Start Second Session',
    closeMessage: 'You may now close this window or notify the researcher.',
  },

  interactionZone: {
    heading: 'Interaction Test Area',
    instructions:
      'Click the buttons below to test tap accuracy. The system will detect missed taps (clicks outside buttons) and may enlarge buttons if needed.',
    button: 'Button {{id}}',
    totalClicks: 'Total clicks:',
    btnCount: 'Btn {{id}}: {{count}}',
  },

  monitor: {
    debugPanel: 'Monitor',
    title: 'Adaptation Monitor',
    session: 'Session:',
    signals: 'Signals:',
    uiState: 'UI State:',
    adaptations: 'Adaptations:',
    noAdaptations: 'No adaptations triggered yet',
    font: 'Font: {{value}}px',
    padding: 'Padding: {{value}}px',
    contrast: 'Contrast: L{{value}}',
    lineHeight: 'Line-H: {{value}}',
    anim: 'Anim: {{value}}',
    cursor: 'Cursor: {{value}}x',
    simplified: 'Simplified: {{value}}',
    readGuide: 'Read Guide: {{value}}',
    taps: 'Taps: {{taps}} | Scrolls: {{scrolls}}',
    updated: 'Updated: {{time}}',
    signalLabels: {
      zoom: 'Zoom Count',
      missRate: 'Missed Taps',
      dwell: 'Reading Time',
      scrollRev: 'Re-reading',
      tremor: 'Pointer Tremor',
      rageClick: 'Rage Clicks',
      hesitation: 'Cursor Hesitation',
      idle: 'Idle Time',
      readSpd: 'Reading Speed',
    },
  },

  dashboard: {
    title: 'Researcher Dashboard',
    enterPassphrase: 'Enter passphrase',
    sessions: 'Sessions',
    compare: 'Compare',
    summary: 'Summary',
    sessionList: {
      heading: 'Sessions ({{count}})',
      filterPlaceholder: 'Filter by participant ID...',
      allConditions: 'All conditions',
      participant: 'Participant',
      condition: 'Condition',
      started: 'Started',
      sus: 'SUS',
      nasaTlx: 'NASA-TLX',
      status: 'Status',
      noSessions: 'No sessions found.',
    },
    sessionDetail: {
      backToSessions: 'Back to sessions',
      sessionHeading: 'Session: {{participant}} ({{condition}})',
      started: 'Started',
      duration: 'Duration',
      susScore: 'SUS Score',
      adaptations: 'Adaptations',
      nasaTlxScores: 'NASA-TLX Scores',
      signalHistory: 'Signal History ({{count}} snapshots)',
      adaptationEvents: 'Adaptation Events',
      rule: 'Rule',
      time: 'Time',
      taskMetrics: 'Task Metrics',
      task: 'Task',
      taskType: 'Type',
      completed: 'Done',
      taskTypes: {
        findAnswer: 'Find Answer',
        formCompletion: 'Form',
        navigation: 'Navigation',
      },
      errors: 'Errors',
      answer: 'Answer',
      loadingSession: 'Loading session data...',
      sessionNotFound: 'Session not found.',
      signalLabels: {
        zoomCount: 'Zoom Count',
        missedTapRate: 'Missed Tap Rate',
        avgDwellSeconds: 'Section Reading Time',
        scrollReversalRate: 'Re-reading Rate',
        tremorScore: 'Pointer Tremor',
        rageClickCount: 'Rage Clicks',
        mouseHesitationScore: 'Cursor Hesitation',
        idleSeconds: 'Idle Time',
        readingSpeed: 'Reading Speed',
      },
      signalTooltips: {
        zoomCount: 'Number of Ctrl+Scroll or pinch-to-zoom events in the last 60s. High values suggest the user is struggling to read the text at its current size.',
        missedTapRate: 'Ratio of clicks that missed interactive elements (buttons, links) vs. total clicks near them in the last 30s. High values suggest motor difficulty hitting targets.',
        avgDwellSeconds: 'Average time (seconds) each article section stayed visible in the viewport over the last 90s. High values suggest the user is reading slowly or having difficulty.',
        scrollReversalRate: 'Fraction of scroll direction changes that go upward (re-reading) over the last 45s. High values suggest comprehension difficulty.',
        tremorScore: 'Standard deviation (px) of click positions over the last 8s. Measures pointing precision — high values indicate hand tremor or motor impairment.',
        rageClickCount: 'Clusters of 3+ rapid clicks in the same area in the last 5s. Indicates frustration with unresponsive or hard-to-click elements.',
        mouseHesitationScore: 'Count of times the cursor paused 3+ seconds over an interactive element in the last 10s. Suggests uncertainty or difficulty deciding.',
        idleSeconds: 'Seconds since the last mouse, keyboard, or scroll interaction. High values mean the user stopped interacting.',
        readingSpeed: 'Estimated words per minute based on visible section time and character count over the last 90s. Low values may indicate reading difficulty.',
      },
    },
    comparison: {
      heading: 'Condition Comparison',
      noParticipants:
        'No participants with both adaptive and control sessions found. Each participant needs two sessions (one per condition) for comparison.',
      selectParticipant: 'Select Participant',
      adaptive: 'Adaptive',
      control: 'Control',
      delta: 'Delta (Adaptive - Control)',
    },
    summaryStats: {
      heading: 'Summary Statistics',
      totalSessions: 'Total Sessions',
      completed: 'Completed',
      meanSusByCondition: 'Mean SUS Score by Condition',
      noSusScores: 'No SUS scores recorded yet.',
      nasaTlxByDimension: 'NASA-TLX by Dimension',
      noNasaTlxData: 'No NASA-TLX data recorded yet.',
    },
  },

  rawView: {
    initializingSession: 'Initializing session...',
    title: 'Adaptive Accessibility System (Raw View)',
    condition: 'Condition: ',
    session: 'Session: ',
  },

  articles: {
    sets: [
      {
        id: 'climate-technology',
        title: 'Climate Change and Technology',
        sections: [
          {
            id: 'intro',
            heading: 'The Climate Technology Landscape',
            paragraphs: [
              'The intersection of climate science and technology has produced some of the most consequential innovations of the 21st century. From satellite monitoring systems that track deforestation in real time to machine learning models that optimize wind turbine placement, technology is reshaping how humanity responds to environmental challenges.',
              'Global carbon dioxide concentrations surpassed 420 parts per million in 2024, a level not seen in at least 800,000 years according to ice core records. The urgency of this trajectory has accelerated investment in climate technology, with global clean energy spending reaching $1.8 trillion in 2023, surpassing fossil fuel investment for the first time.',
            ],
          },
          {
            id: 'renewable-energy',
            heading: 'Renewable Energy Systems',
            paragraphs: [
              'Solar photovoltaic technology has experienced a dramatic cost reduction of over 90% since 2010, making it the cheapest source of new electricity generation in most markets worldwide. Modern solar panels achieve conversion efficiencies above 22% for commercial modules, while laboratory cells have exceeded 47% using multi-junction concentrator designs.',
              'Wind energy has followed a similar trajectory. Offshore wind turbines now reach heights exceeding 260 meters with individual capacities of 15 megawatts, enough to power approximately 13,000 homes each. The Global Wind Energy Council reported 117 gigawatts of new capacity installed in 2023 alone.',
              'Battery storage technology, particularly lithium-ion cells, has seen costs decline by 97% since 1991. Grid-scale storage projects now regularly exceed 100 megawatt-hours, addressing the intermittency challenge that has historically limited renewable energy adoption. Emerging alternatives including sodium-ion, solid-state, and iron-air batteries promise further improvements.',
            ],
          },
          {
            id: 'carbon-capture',
            heading: 'Carbon Capture and Removal',
            paragraphs: [
              'Direct air capture (DAC) technology extracts carbon dioxide directly from ambient air using chemical sorbents or solvents. The Orca plant in Iceland, operated by Climeworks, captures approximately 4,000 tonnes of CO2 annually, storing it as mineral carbonates deep underground through a process called mineralization.',
              'Nature-based carbon removal approaches include reforestation, soil carbon sequestration, and ocean alkalinity enhancement. A mature tropical forest can sequester between 6 and 30 tonnes of CO2 per hectare per year, though permanence and measurement challenges complicate their inclusion in carbon credit markets.',
              'The Intergovernmental Panel on Climate Change (IPCC) estimates that limiting warming to 1.5 degrees Celsius will require removing 6 to 10 gigatonnes of CO2 per year by 2050. Current removal capacity stands at roughly 2 gigatonnes annually, almost entirely from conventional forestry and land management.',
            ],
          },
          {
            id: 'smart-cities',
            heading: 'Smart Cities and Urban Sustainability',
            paragraphs: [
              'Smart building systems using IoT sensors and AI-driven controls can reduce energy consumption by 20 to 30 percent compared to conventional buildings. Copenhagen aims to become the first carbon-neutral capital by 2025, deploying sensor networks to optimize traffic flow, waste collection, and district heating.',
              'Electric vehicle adoption accelerated sharply in 2023, with global sales exceeding 14 million units representing 18% of all new car sales. China led with 8.1 million units, followed by Europe with 3.2 million. The International Energy Agency projects EVs will comprise over 60% of new sales globally by 2030.',
              'Urban heat islands, where cities experience temperatures 3 to 5 degrees Celsius higher than surrounding rural areas, represent a growing challenge as climate change intensifies. Green roof installations, reflective building materials, and urban tree canopy expansion are among the strategies cities deploy to mitigate this effect.',
            ],
          },
          {
            id: 'future-outlook',
            heading: 'Future Outlook and Challenges',
            paragraphs: [
              'Nuclear fusion research reached a milestone in December 2022 when the National Ignition Facility achieved net energy gain for the first time. While commercial fusion power remains decades away, private investment in fusion startups exceeded $6 billion by 2024, reflecting growing optimism about the technology.',
              'The critical minerals supply chain presents a significant bottleneck for clean energy transition. Lithium demand is projected to increase 40-fold by 2040, while cobalt, nickel, and rare earth elements face similar pressures. Recycling infrastructure and alternative battery chemistries are essential to avoid simply trading one resource dependency for another.',
              'Climate adaptation technology, including early warning systems, drought-resistant crop varieties, and coastal defense infrastructure, receives far less funding than mitigation despite the reality that significant warming is already locked in. The United Nations estimates that developing countries alone will need $300 billion annually for adaptation by 2030.',
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
    ],
  },

  taskData: {
    'climate-technology': [
      {
        id: 'ct-find',
        title: 'Find Information',
        instruction:
          'In which section is the Orca plant in Iceland discussed? Type the section heading.',
      },
      {
        id: 'ct-form',
        title: 'Complete the Form',
        instruction:
          'Based on the article, fill in the following details about climate technology.',
        fields: [
          { id: 'solar_reduction', label: 'Solar PV cost reduction since 2010 (%)' },
          { id: 'ev_sales', label: 'Global EV sales in 2023 (millions)' },
          { id: 'co2_removal', label: 'CO2 removal needed by 2050 (gigatonnes/year, e.g. "6-10")' },
        ],
      },
      {
        id: 'ct-nav',
        title: 'Navigate and Interact',
        instruction:
          'Scroll to the "Future Outlook and Challenges" section and click any button in the interaction test area.',
      },
    ],
    'digital-accessibility': [
      {
        id: 'da-find',
        title: 'Find Information',
        instruction:
          'In which section is the Robles v. Domino\'s Pizza case mentioned? Type the section heading.',
      },
      {
        id: 'da-form',
        title: 'Complete the Form',
        instruction:
          'Based on the article, fill in the following accessibility details.',
        fields: [
          { id: 'wcag_year', label: 'Year WCAG 2.0 was published' },
          { id: 'conformance', label: 'Most commonly required conformance level' },
          { id: 'wcag21_criteria', label: 'Number of new criteria in WCAG 2.1' },
        ],
      },
      {
        id: 'da-nav',
        title: 'Navigate and Interact',
        instruction:
          'Scroll to the "Future Directions in Accessibility" section and click any button in the interaction test area.',
      },
    ],
    'hci-methods': [
      {
        id: 'hci-find',
        title: 'Find Information',
        instruction:
          'In which section is the Hick-Hyman Law discussed? Type the section heading.',
      },
      {
        id: 'hci-form',
        title: 'Complete the Form',
        instruction:
          'Based on the article, fill in the following HCI details.',
        fields: [
          { id: 'sus_items', label: 'Number of items in the SUS questionnaire' },
          { id: 'nasa_dimensions', label: 'Number of NASA-TLX dimensions' },
          { id: 'evaluators', label: 'Recommended evaluators for heuristic evaluation (e.g. "3-5")' },
        ],
      },
      {
        id: 'hci-nav',
        title: 'Navigate and Interact',
        instruction:
          'Scroll to the "Modern HCI Challenges" section and click any button in the interaction test area.',
      },
    ],
  },
};
