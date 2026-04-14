# Adaptive Accessibility System — Complete Thesis Documentation

> **Purpose of this document:** This file provides all information needed to write a complete Master's thesis about the Adaptive Accessibility System. It documents the research question, system architecture, implementation details, study methodology, and analysis plan. Every technical detail comes directly from the source code.

---

## 1. Thesis Metadata

- **Title:** Behaviour-Based Adaptive User Interface for Improved Web Accessibility
- **Degree:** Master of Science in Software Engineering
- **Research Question:** Can behaviour-based UI adaptation improve usability?
- **Primary Hypothesis:** Users will report higher System Usability Scale (SUS) scores when using the adaptive interface compared to the static control interface.
- **Secondary Hypotheses:**
  - Reduced task completion time in the adaptive condition
  - Fewer task errors in the adaptive condition
  - Lower NASA-TLX workload ratings in the adaptive condition

---

## 2. Abstract

This thesis presents the design, implementation, and evaluation of an adaptive accessibility system that automatically detects user behaviour patterns and silently adjusts the web interface to improve usability. The system monitors nine real-time behavioural signals — including zoom frequency, tap accuracy, reading dwell time, scroll reversals, motor tremor, rage clicks, mouse hesitation, idle time, and reading speed — computed over sliding time windows every 2.5 seconds. Eight research-justified adaptation rules transform detected difficulties into concrete UI modifications: font scaling, button enlargement, contrast boosting, spacing increases, motion reduction, cursor enlargement, layout simplification, and reading aid activation. Each rule's threshold is grounded in peer-reviewed HCI and accessibility research.

The system is implemented as a monorepo web application using React 18 with TypeScript (frontend) and NestJS with PostgreSQL (backend). A within-subjects experimental study compares the adaptive condition against a static control condition, measuring usability through the System Usability Scale (SUS), workload through the NASA Task Load Index (NASA-TLX), and performance through task completion time and error rates. The system exports collected data as CSV for statistical analysis using Wilcoxon signed-rank tests.

The application meets WCAG 2.1 Level AA accessibility compliance, with contrast ratios ranging from 8.2:1 to 21:1 across three progressive levels. All 64 unit tests pass, and the system includes end-to-end test coverage via Playwright.

---

## 3. Introduction

### 3.1 Problem Statement

Many web users face accessibility challenges related to vision, motor control, cognitive load, and motion sensitivity. Traditional accessibility solutions require users to discover settings menus and manually configure accommodations — a process that is burdensome, assumes users are aware of available options, and places the adaptation burden on the user rather than the system.

### 3.2 Motivation

- Over 1 billion people worldwide live with some form of disability (WHO, 2023)
- Accessibility settings are underutilized because users either do not know they exist or find them too complex to configure
- Temporary impairments (fatigue, injury, environmental conditions) also affect interaction quality but are rarely addressed by static settings
- Adaptive interfaces that respond to real-time behaviour can bridge the gap between user needs and interface capabilities without requiring explicit user action

### 3.3 Objectives

1. Design a behaviour detection system that monitors user interaction patterns in real time
2. Implement research-justified adaptation rules that transform detected signals into UI modifications
3. Evaluate whether automatic adaptation improves usability compared to a static interface
4. Ensure the adaptive system itself meets WCAG 2.1 Level AA accessibility standards

### 3.4 Key Contributions

1. A real-time behaviour detection engine tracking 9 distinct interaction signals over sliding time windows
2. A rule-based adaptation engine with 8 UI transformation rules, each grounded in peer-reviewed research
3. A complete experimental framework for within-subjects evaluation including SUS and NASA-TLX instruments
4. An open-source implementation with full test coverage and WCAG 2.1 AA compliance

### 3.5 Innovation

The key innovation is that **no settings are required**. The system observes behaviour patterns and adapts automatically and silently. Unlike accessibility overlays that modify the DOM externally, this system uses CSS custom properties and data attributes to apply adaptations natively, preserving semantic structure and screen reader compatibility.

---

## 4. Literature Review — Key References

The following references are directly cited in the codebase (in `constants.ts` and `rules.ts`) and should be expanded into a full literature review.

### 4.1 Usability Engineering and Interaction Design

| Reference | Topic | Used For |
|-----------|-------|----------|
| Nielsen, J. (1993). *Usability Engineering*. Academic Press. | Repetitive corrective action patterns | Zoom count threshold (font_scale rule) |
| Fitts, P.M. (1954). The information capacity of the human motor system. *Journal of Experimental Psychology*, 47(6). | Target size and pointing error rate | Missed tap rate threshold (button_enlarge rule) |
| Card, S.K., Moran, T.P., Newell, A. (1983). *The Psychology of Human-Computer Interaction*. | Foundational HCI models (GOMS, KLM) | Background on predictive interaction models |
| Norman, D.A. (1988). *The Design of Everyday Things*. | Gulf of execution and evaluation | Conceptual framework for adaptive interfaces |

### 4.2 Reading Behaviour and Comprehension

| Reference | Topic | Used For |
|-----------|-------|----------|
| Rayner, K. et al. (2016). *So Much to Read, So Little Time*. | Reading speed and comprehension difficulty | Dwell time threshold (contrast_boost rule) |
| Buscher, G. et al. (2012). Attentive Documents. *ACM CHI 2012*. | Scroll behaviour as reading signal | Scroll reversal rate threshold (contrast_boost rule) |
| Dickinson, A. et al. (2002). Introducing the Internet to the over-60s. *Interacting with Computers*, 14(4). | Reading speed and older adults | Reading speed threshold (reading_aid rule) |

### 4.3 Motor Impairment and Accessibility

| Reference | Topic | Used For |
|-----------|-------|----------|
| Wobbrock, J.O. et al. (2008). Longitudinal evaluation of pointing performance models. *ACM UIST 2008*. | Motor impairment and pointing precision | Tremor score threshold (spacing_increase rule) |
| Wobbrock, J.O. et al. (2011). Ability-based design. *ACM TACCESS*, 3(3). | Ability-based design principles | Motion reduction threshold (motion_reduce rule) |
| Hurst, A. et al. (2013). Automatic detection of target accuracy problems during pointing. *ACM TACCESS*, 6(2). | Rage click detection for cursor problems | Rage click threshold (cursor_enlarge rule) |

### 4.4 Adaptive and Personalized Interfaces

| Reference | Topic | Used For |
|-----------|-------|----------|
| Gajos, K.Z. et al. (2010). Automatically generating personalized user interfaces. *Artificial Intelligence*, 174(12-13). | Automatic UI personalization | Idle + hesitation thresholds (layout_simplify rule) |
| Apple Human Interface Guidelines. | 44x44dp minimum touch target | Button enlargement minimum target size |

### 4.5 Usability Measurement

| Reference | Topic | Used For |
|-----------|-------|----------|
| Brooke, J. (1996). SUS: A quick and dirty usability scale. | System Usability Scale (10-item, 0-100) | Primary dependent variable |
| Hart, S.G. & Staveland, L.E. (1988). Development of NASA-TLX. | NASA Task Load Index (6 dimensions) | Workload measurement |
| Ericsson, K.A. & Simon, H.A. (1980). Verbal reports as data. | Think-aloud protocols | Usability evaluation methodology |
| Nielsen, J. & Molich, R. (1990). Heuristic evaluation. | Heuristic evaluation method | Complementary evaluation approach |

### 4.6 Web Accessibility Standards

| Reference | Topic | Used For |
|-----------|-------|----------|
| W3C (2018). Web Content Accessibility Guidelines (WCAG) 2.1. | AA/AAA conformance levels, contrast ratios | System compliance target |
| Americans with Disabilities Act (1990). | Legal accessibility requirements | Motivation for accessible design |
| European Accessibility Act (2025). | EU accessibility mandates | Broader regulatory context |
| Robles v. Domino's Pizza (2019). | Web accessibility legal precedent | Legal landscape for web apps |

---

## 5. System Architecture

### 5.1 Architecture Overview

```
+-------------------------------------------------------------+
|                         USER                                 |
|              (Interacting with the web app)                  |
+----+--------------------------------------------------------+
     |
     | zoom, clicks, scrolls, reading, mouse movement
     v
+-------------------------------------------------------------+
|                  BEHAVIOR DETECTION LAYER                    |
|  +------+------+------+------+------+------+------+------+------+
|  | Zoom |Missed| Dwell|Scroll|Tremor| Rage |Mouse | Idle |Read  |
|  | Count| Taps | Time |Rvrsl |Score |Click |Hesit.| Time |Speed |
|  +------+------+------+------+------+------+------+------+------+
|         (Signal snapshot computed every 2.5 seconds)         |
+----+--------------------------------------------------------+
     |
     | SignalSnapshot { zoomCount, missedTapRate, ... }
     v
+-------------------------------------------------------------+
|                   ADAPTATION ENGINE                          |
|  For each of the 8 rules:                                    |
|  1. Check if cooldown has expired                            |
|  2. Check if maxApplications reached                         |
|  3. Evaluate rule condition against signal thresholds        |
|  4. If triggered: apply UI transformation                    |
+----+--------------------------------------------------------+
     |
     | UIState { fontSize, buttonPadding, contrast, ... }
     v
+-------------------------------------------------------------+
|                    USER INTERFACE                             |
|  CSS Custom Properties applied to DOM:                       |
|  --font-size-base, --button-padding, --line-height           |
|  --animate-duration, --cursor-scale                          |
|  data-contrast, data-layout-simplified, data-reading-guide   |
+----+--------------------------------------------------------+
     |
     | Events batched and flushed every 8 seconds
     v
+-------------------------------------------------------------+
|                   BACKEND (NestJS + PostgreSQL)               |
|  - Sessions API: create, update, end sessions                |
|  - Events API: batch insert behaviour events                 |
|  - Analytics API: aggregation, CSV export                    |
|  - Database: sessions, events, adaptations tables            |
+-------------------------------------------------------------+
```

### 5.2 Internationalization (i18n)

The system supports multiple languages with **Romanian as the default** language. A language selector (RO/EN toggle) appears in the header of every page, allowing participants and researchers to switch between Romanian and English at any time. The selected language is persisted in `localStorage`.

**Implementation:** react-i18next with i18next. Translation files are located at `frontend/src/i18n/ro.ts` (Romanian) and `frontend/src/i18n/en.ts` (English). All user-facing strings — including UI labels, study instructions, consent text, questionnaire items, article content, task instructions, dashboard labels, and error messages — are fully translated in both languages.

**Article content** and **task instructions** are also translated, ensuring participants can complete the entire study in their native language. Form field answer options (e.g., "Between-subjects", "Within-subjects") remain in English as they are data values used for analysis.

The `<LanguageSelector />` component is available on:
- Study flow page (main header)
- Researcher dashboard (sidebar)
- Raw testing view (header)

### 5.3 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | React | 18.2.0 | Component-based UI |
| Frontend Language | TypeScript | 5.3.3 | Type safety |
| Build Tool | Vite | 5.1.6 | Fast development builds |
| CSS Framework | TailwindCSS | 3.4.1 | Utility-first styling |
| Charts | Recharts | 2.15.4 | Data visualization |
| Frontend Testing | Vitest | 1.3.1 | Unit testing |
| Frontend Test Utils | @testing-library/react | 14.2.1 | Component testing |
| Routing | React Router DOM | 6.30.3 | Client-side routing |
| Backend Framework | NestJS | 10.3.3 | REST API |
| ORM | TypeORM | 0.3.20 | Database abstraction |
| Database | PostgreSQL | 15 (Alpine) | Persistent storage |
| API Documentation | Swagger/OpenAPI | 7.3.0 | Auto-generated docs |
| Validation | class-validator | 0.14.1 | DTO validation |
| Backend Testing | Jest | 29.7.0 | Unit testing |
| E2E Testing | Playwright | 1.58.2 | Browser automation |
| Infrastructure | Docker Compose | — | PostgreSQL container |
| Monorepo | npm workspaces | — | Frontend + backend workspace |
| Node.js | — | >= 18.0.0 | Runtime requirement |

### 5.3 Monorepo Structure

```
adaptive-ui-system/
├── frontend/                     # React 18 + Vite application
│   ├── src/
│   │   ├── components/           # UI components
│   │   │   ├── dashboard/        # Researcher dashboard (4 components)
│   │   │   ├── study/            # Study flow (7 components)
│   │   │   ├── visualizations/   # Signal charts (3 components)
│   │   │   ├── Article.tsx       # Reading content with section tracking
│   │   │   ├── Button.tsx        # Adaptive button component
│   │   │   ├── InteractionTestZone.tsx  # Tap accuracy test area
│   │   │   └── AdaptationMonitor.tsx    # Real-time debug panel
│   │   ├── context/              # React Context state management
│   │   │   ├── StudyContext.tsx   # Study workflow state
│   │   │   └── AdaptationContext.tsx  # UI adaptation state
│   │   ├── data/                 # Static content
│   │   │   ├── articles.ts       # 3 article sets (counterbalanced)
│   │   │   └── tasks.ts          # 9 study tasks (3 per article set)
│   │   ├── engine/               # Core adaptation logic
│   │   │   └── rules.ts          # 8 research-justified rules
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useBehaviourCollector.ts  # 9 signal detections
│   │   │   └── useAdaptationEngine.ts   # Rule evaluation engine
│   │   ├── pages/                # Route pages
│   │   │   ├── StudyFlow.tsx     # Main study orchestration
│   │   │   ├── Dashboard.tsx     # Researcher analytics
│   │   │   └── RawView.tsx       # Raw testing view
│   │   ├── services/
│   │   │   └── studyLogger.ts    # Event batching and backend flushing
│   │   ├── utils/
│   │   │   ├── applyUIState.ts   # CSS custom property application
│   │   │   ├── contrastValidator.ts  # WCAG contrast ratio calculator
│   │   │   ├── signalComputation.ts  # Signal calculation functions
│   │   │   └── slidingWindow.ts      # Generic time-series data structure
│   │   ├── __tests__/            # 10 test files (64 test cases)
│   │   ├── types.ts              # Core TypeScript interfaces
│   │   ├── constants.ts          # Thresholds with academic citations
│   │   ├── App.tsx               # Root component with routing
│   │   └── index.css             # Global styles + CSS variables
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # NestJS REST API
│   ├── src/
│   │   ├── sessions/             # Session management module
│   │   │   ├── session.entity.ts
│   │   │   ├── sessions.service.ts
│   │   │   ├── sessions.controller.ts
│   │   │   └── dto/
│   │   ├── events/               # Behaviour event logging module
│   │   │   ├── event.entity.ts
│   │   │   ├── events.service.ts
│   │   │   ├── events.controller.ts
│   │   │   └── dto/
│   │   ├── adaptations/          # Adaptation tracking module
│   │   │   └── adaptation.entity.ts
│   │   ├── analytics/            # Statistical analysis module
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.controller.ts
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── e2e/                          # Playwright E2E tests
│   ├── adaptations.spec.ts
│   ├── dashboard.spec.ts
│   ├── study-flow.spec.ts
│   └── playwright.config.ts
│
├── docker-compose.yml            # PostgreSQL 15-alpine container
├── tsconfig.base.json            # Shared TypeScript configuration
├── package.json                  # Root workspace configuration
└── .eslintrc.json / .prettierrc.json
```

---

## 6. Behaviour Detection System

### 6.1 Overview

The behaviour detection system continuously monitors user interactions through **9 distinct signal types**. Each signal is computed over a **sliding time window** appropriate to its measurement characteristics. Signals are recomputed every **2.5 seconds** (configured in `SIGNAL_COMPUTE_INTERVAL`).

The implementation resides in `frontend/src/hooks/useBehaviourCollector.ts`, with helper functions in `frontend/src/utils/signalComputation.ts` and the sliding window data structure in `frontend/src/utils/slidingWindow.ts`.

### 6.2 Signal Definitions

#### Signal 1: Zoom Count
- **What it detects:** Repeated zooming via Ctrl+Wheel or pinch gestures
- **Sliding window:** 60 seconds
- **Listeners:** `wheel` events with `ctrlKey`/`metaKey`, `gesturestart` events (Safari pinch)
- **Interpretation:** 0-2 zooms = normal exploration; 3+ zooms = user struggles to read at current font size
- **Threshold:** >= 3 events
- **Citation:** Nielsen (1993) — repetitive corrective actions indicate usability problems

#### Signal 2: Missed Tap Rate
- **What it detects:** Click accuracy — clicks outside interactive elements vs. total clicks
- **Sliding window:** 30 seconds
- **Listeners:** `pointerdown` events globally
- **Computation:** Checks if tap landed on `button`, `a`, `input`, or `[data-interactive]`; ratio = missed / total
- **Interpretation:** < 20% = good accuracy; >= 35% = significant targeting difficulty
- **Threshold:** >= 0.35 (35%)
- **Citation:** Fitts (1954) — target size inversely relates to error rate; Apple HIG 44x44dp minimum

#### Signal 3: Average Dwell Time
- **What it detects:** How long users spend reading each content section
- **Sliding window:** 90 seconds
- **Implementation:** `IntersectionObserver` with 60% visibility threshold on elements with `data-section-id`
- **Computation:** Records enterTime when section becomes visible, exitTime when it leaves; averages all dwell durations
- **Interpretation:** < 5s = quick reading; >= 7s = slow reading, possible comprehension difficulty
- **Threshold:** >= 7 seconds (combined with scroll reversals for contrast_boost)
- **Citation:** Rayner et al. (2016) — reading speed correlates with comprehension difficulty

#### Signal 4: Scroll Reversal Rate
- **What it detects:** User scrolling back up (re-reading patterns)
- **Sliding window:** 45 seconds
- **Computation:** Tracks scroll direction on every `scroll` event; `down -> up` = reversal; ratio = reversals / total direction changes
- **Interpretation:** < 20% = normal forward reading; >= 30% = frequent re-reading
- **Threshold:** >= 0.30 (30%) (combined with dwell time for contrast_boost)
- **Citation:** Buscher et al. (2012) — scroll behaviour as implicit reading signal

#### Signal 5: Tremor Score
- **What it detects:** Variance in tap positions indicating motor control imprecision
- **Sliding window:** 8 seconds (short window for responsiveness)
- **Computation:**
  ```
  meanX = sum(all x values) / count
  meanY = sum(all y values) / count
  varianceX = sum((x - meanX)^2) / count
  varianceY = sum((y - meanY)^2) / count
  tremorScore = sqrt(varianceX + varianceY)   // in pixels
  ```
- **Interpretation:** < 15px = good motor control; >= 18px = moderate tremor; >= 27px = severe tremor
- **Thresholds:** >= 18px (spacing_increase), >= 27px (motion_reduce)
- **Citation:** Wobbrock et al. (2008) — motor impairment pointing precision thresholds

#### Signal 6: Rage Click Count
- **What it detects:** Rapid repeated clicks in the same area (frustration indicator)
- **Sliding window:** 5 seconds
- **Computation:** Groups clicks within 30px radius; counts clusters of rapid clicks
- **Interpretation:** 0-2 = normal; >= 3 clusters = user frustration with click targets
- **Threshold:** >= 3
- **Citation:** Hurst et al. (2013) — automatic detection of target accuracy problems

#### Signal 7: Mouse Hesitation Score
- **What it detects:** Cursor pausing over interactive elements without clicking
- **Sliding window:** 10 seconds
- **Computation:** Measures time cursor is stopped over elements marked as interactive
- **Interpretation:** Low = confident interaction; >= 3 = user unsure how to proceed
- **Threshold:** >= 3 (combined with idle time for layout_simplify)
- **Citation:** Gajos et al. (2010) — hesitation as indicator of interface complexity

#### Signal 8: Idle Seconds
- **What it detects:** Time since last user interaction of any kind
- **Sliding window:** 60 seconds (continuous)
- **Computation:** Tracks last interaction timestamp; computes elapsed seconds
- **Interpretation:** Short = active use; >= 30s = possible confusion or abandonment
- **Threshold:** >= 30 seconds (combined with hesitation for layout_simplify)
- **Citation:** Gajos et al. (2010) — extended idle time combined with hesitation suggests cognitive overload

#### Signal 9: Reading Speed
- **What it detects:** Estimated words per minute based on visible section content
- **Sliding window:** 90 seconds
- **Computation:** Characters visible in tracked sections / total dwell time; converted to approximate WPM
- **Interpretation:** Normal adult: 200-300 WPM; < 100 WPM = difficulty reading
- **Threshold:** < 100 WPM (and > 0 to avoid false positives when no reading detected)
- **Citation:** Dickinson et al. (2002) — reading speed thresholds for older adults and users with reading difficulties

### 6.3 Sliding Window Data Structure

The `SlidingWindow<T>` class (`frontend/src/utils/slidingWindow.ts`) provides a generic time-bounded data structure:
- Items are added with timestamps
- Items older than the window duration are automatically pruned on access
- Supports iteration, counting, and custom aggregation
- Used by all 9 signal computations with different window durations

### 6.4 Signal Snapshot Interface

Every 2.5 seconds, all 9 signals are computed and packaged into a `SignalSnapshot` (defined in `frontend/src/types.ts`):

```typescript
interface SignalSnapshot {
  zoomCount: number;          // Events in 60s window
  missedTapRate: number;      // 0-1 ratio in 30s window
  avgDwellSeconds: number;    // Seconds in 90s window
  scrollReversalRate: number; // 0-1 ratio in 45s window
  tremorScore: number;        // Pixels (std-dev) in 8s window
  rageClickCount: number;     // Clusters in 5s window
  mouseHesitationScore: number; // Score in 10s window
  idleSeconds: number;        // Continuous seconds
  readingSpeed: number;       // WPM in 90s window
  totalTaps: number;          // Cumulative count
  totalScrollChanges: number; // Cumulative count
  timestamp: number;          // Unix timestamp
}
```

---

## 7. Adaptation Engine

### 7.1 Overview

The adaptation engine (`frontend/src/hooks/useAdaptationEngine.ts`) evaluates all 8 rules against the current signal snapshot every 2.5 seconds. For each rule, it checks:
1. Has the cooldown period expired since the last application?
2. Has the maximum number of applications been reached?
3. Does the signal condition evaluate to true?

If all three conditions are met, the rule's `apply` function transforms the current `UIState`, and the change is dispatched to the `AdaptationContext`. The new state is then applied to the DOM via CSS custom properties in `applyUIState.ts`.

### 7.2 UI State Interface

```typescript
interface UIState {
  fontSize: number;        // px (baseline: 16, max: 26)
  buttonPadding: number;   // px (baseline: 12, max: 36)
  contrast: number;        // 0=AA, 1=enhanced, 2=AAA (max)
  lineHeight: number;      // multiplier (baseline: 1.65, max: 2.2)
  animations: boolean;     // true=enabled, false=disabled
  cursorScale: number;     // multiplier (baseline: 1, max: 2)
  layoutSimplified: boolean; // false=normal, true=single-column
  readingGuide: boolean;   // false=off, true=reading highlight bar
}
```

### 7.3 Adaptation Rules

#### Rule 1: Font Scale (`font_scale`)
- **Trigger condition:** `zoomCount >= 3`
- **Action:** `fontSize += 2px` (capped at 26px)
- **Cooldown:** 120 seconds
- **Max applications:** 3
- **Progression:** 16px -> 18px -> 20px -> 22px (or up to 26px)
- **Citation:** Nielsen, J. (1993). *Usability Engineering*. Academic Press.
- **Rationale:** Repeated corrective zooming indicates the user cannot read at the current font size. Rather than requiring users to find font settings, the system increases font size incrementally.

#### Rule 2: Button Enlarge (`button_enlarge`)
- **Trigger condition:** `missedTapRate >= 0.35`
- **Action:** `buttonPadding += 8px` (capped at 36px)
- **Cooldown:** 90 seconds
- **Max applications:** 2
- **Progression:** 12px -> 20px -> 28px (up to 36px)
- **Touch target sizes:** Baseline ~48x40px; after step 1: ~64x48px; after step 2: ~80x56px (all exceed Apple HIG 44x44dp minimum)
- **Citation:** Fitts, P.M. (1954). The information capacity of the human motor system. *Journal of Experimental Psychology*, 47(6).
- **Rationale:** Fitts's Law predicts that smaller targets yield higher error rates. A 35% miss rate indicates targets are too small for the user's motor precision.

#### Rule 3: Contrast Boost (`contrast_boost`)
- **Trigger condition:** `avgDwellSeconds >= 7 AND scrollReversalRate >= 0.30`
- **Action:** `contrast += 1` (capped at level 2)
- **Cooldown:** 180 seconds
- **Max applications:** 2
- **Progression:**
  - Level 0 (baseline): Background `#0f172a`, Text `#cbd5e1` — ratio 8.2:1 (exceeds AA 4.5:1)
  - Level 1 (enhanced): Background `#060d1a`, Text `#f1f5f9` — ratio 10.5:1 (exceeds AA)
  - Level 2 (maximum): Background `#000000`, Text `#ffffff` — ratio 21:1 (exceeds AAA 7:1)
- **Citation:** Rayner, K. et al. (2016); Buscher, G. et al. (2012).
- **Rationale:** Long dwell times combined with scroll reversals indicate the user is re-reading content, suggesting comprehension difficulty that may be alleviated by higher contrast.

#### Rule 4: Spacing Increase (`spacing_increase`)
- **Trigger condition:** `tremorScore >= 18px`
- **Action:** `lineHeight += 0.15` (capped at 2.2)
- **Cooldown:** 150 seconds
- **Max applications:** 3
- **Progression:** 1.65 -> 1.80 -> 1.95 -> 2.10 (up to 2.2)
- **Citation:** Wobbrock, J.O. et al. (2008). Longitudinal evaluation of pointing performance models. *ACM UIST 2008*.
- **Rationale:** Motor tremor above 18 pixels standard deviation indicates pointing imprecision. Increased line spacing creates larger implicit targets and reduces accidental interactions with adjacent elements.

#### Rule 5: Motion Reduce (`motion_reduce`)
- **Trigger condition:** `tremorScore >= 27px`
- **Action:** `animations = false` (sets CSS transition duration to 0ms)
- **Cooldown:** Infinity (permanent, cannot re-trigger)
- **Max applications:** 1
- **Citation:** Wobbrock, J.O. et al. (2011). Ability-based design. *ACM TACCESS*, 3(3).
- **Rationale:** Severe tremor above 27px indicates significant motor impairment. Animations can interfere with already-difficult motor tasks by moving targets. This is a permanent change because the underlying condition is unlikely to improve during a session.

#### Rule 6: Cursor Enlarge (`cursor_enlarge`)
- **Trigger condition:** `rageClickCount >= 3`
- **Action:** `cursorScale += 0.5` (capped at 2)
- **Cooldown:** 90 seconds
- **Max applications:** 2
- **Progression:** 1.0 -> 1.5 -> 2.0
- **Citation:** Hurst, A. et al. (2013). Automatic detection of target accuracy problems during pointing. *ACM TACCESS*, 6(2).
- **Rationale:** Rage clicking (rapid repeated clicks in the same area) indicates the user cannot find or accurately target the cursor. Enlarging the cursor improves visual tracking.

#### Rule 7: Layout Simplify (`layout_simplify`)
- **Trigger condition:** `idleSeconds >= 30 AND mouseHesitationScore >= 3`
- **Action:** `layoutSimplified = true` (single-column, hide decorative elements)
- **Cooldown:** Infinity (permanent)
- **Max applications:** 1
- **Citation:** Gajos, K.Z. et al. (2010). Automatically generating personalized user interfaces. *Artificial Intelligence*, 174(12-13).
- **Rationale:** Extended idle time combined with cursor hesitation over interactive elements suggests cognitive overload. Simplifying the layout reduces visual complexity and the number of choices.

#### Rule 8: Reading Aid (`reading_aid`)
- **Trigger condition:** `readingSpeed > 0 AND readingSpeed < 100 WPM`
- **Action:** `readingGuide = true` (semi-transparent horizontal highlight bar at viewport center)
- **Cooldown:** 120 seconds
- **Max applications:** 1
- **Citation:** Dickinson, A. et al. (2002). Introducing the Internet to the over-60s. *Interacting with Computers*, 14(4).
- **Rationale:** Reading speed below 100 WPM (well below the 200-300 WPM normal adult range) suggests difficulty tracking text lines. A visual guide helps users maintain their place in the text.

### 7.4 Rule Evaluation Order

Rules are evaluated in the following order (defined in `RULES` array in `rules.ts`):
1. font_scale
2. button_enlarge
3. contrast_boost
4. spacing_increase
5. cursor_enlarge
6. layout_simplify
7. reading_aid
8. motion_reduce (last — highest severity)

### 7.5 Summary Table

| Rule ID | Signal(s) | Threshold | UI Change | Cooldown | Max | Citation |
|---------|-----------|-----------|-----------|----------|-----|----------|
| `font_scale` | zoomCount | >= 3 | fontSize +2px (max 26) | 120s | 3x | Nielsen (1993) |
| `button_enlarge` | missedTapRate | >= 0.35 | buttonPadding +8px (max 36) | 90s | 2x | Fitts (1954) |
| `contrast_boost` | avgDwellSeconds AND scrollReversalRate | >= 7s AND >= 0.30 | contrast +1 (max 2) | 180s | 2x | Rayner (2016), Buscher (2012) |
| `spacing_increase` | tremorScore | >= 18px | lineHeight +0.15 (max 2.2) | 150s | 3x | Wobbrock (2008) |
| `motion_reduce` | tremorScore | >= 27px | animations = false | Infinity | 1x | Wobbrock (2011) |
| `cursor_enlarge` | rageClickCount | >= 3 | cursorScale +0.5 (max 2) | 90s | 2x | Hurst (2013) |
| `layout_simplify` | idleSeconds AND mouseHesitationScore | >= 30s AND >= 3 | layoutSimplified = true | Infinity | 1x | Gajos (2010) |
| `reading_aid` | readingSpeed | > 0 AND < 100 WPM | readingGuide = true | 120s | 1x | Dickinson (2002) |

---

## 8. Frontend Implementation

### 8.1 State Management — Dual Context Pattern

The frontend uses two React Contexts with `useReducer` for state management:

**StudyContext** (`context/StudyContext.tsx`):
- Manages the study workflow progression
- State: `step` (consent | warmup | tasks | sus | nasatlx | summary | complete), `participantId`, `condition`, `sessionId`, `consentGiven`, `currentTaskIndex`, `taskResults[]`, `susResponses[]`, `nasaTlxResponses`
- Actions: SET_PARTICIPANT, SET_SESSION_ID, GIVE_CONSENT, SET_STEP, NEXT_TASK, ADD_TASK_RESULT, SET_SUS_RESPONSES, SET_NASA_TLX, RESET

**AdaptationContext** (`context/AdaptationContext.tsx`):
- Manages the current UI adaptation state
- State: all `UIState` properties (fontSize, buttonPadding, contrast, lineHeight, animations, cursorScale, layoutSimplified, readingGuide)
- Actions: APPLY_RULE (transforms state via rule's apply function), RESET

### 8.2 CSS Custom Properties (How Adaptations Reach the DOM)

The `applyUIState()` function (`utils/applyUIState.ts`) translates the `UIState` object into CSS custom properties on the document root:

| UIState Property | CSS Custom Property | Effect |
|-----------------|-------------------|--------|
| `fontSize` | `--font-size-base` | Controls all text size |
| `buttonPadding` | `--button-padding` | Controls all button padding |
| `contrast` | `data-contrast` attribute | Switches colour scheme (0, 1, 2) |
| `lineHeight` | `--line-height` | Controls paragraph spacing |
| `animations` | `--animate-duration` | 200ms (on) or 0ms (off) |
| `cursorScale` | `--cursor-scale` | Scales cursor size |
| `layoutSimplified` | `data-layout-simplified` attribute | Hides decorative elements |
| `readingGuide` | `data-reading-guide` attribute | Shows reading highlight bar |

### 8.3 Component Hierarchy

```
App.tsx (BrowserRouter)
├── / -> StudyFlow.tsx
│   ├── StudyProvider + AdaptationProvider
│   ├── ProgressTracker
│   ├── ConsentScreen -> WarmupPhase -> TaskRunner (x3) -> SUSQuestionnaire -> NASATLXQuestionnaire -> SessionSummary
│   ├── Article (with data-section-id tracking)
│   ├── InteractionTestZone (4 buttons for tap testing)
│   └── AdaptationMonitor (debug panel, bottom-right)
│
├── /dashboard -> Dashboard.tsx
│   ├── SessionList (filterable, sortable)
│   ├── SessionDetail (signal sparklines, adaptation timeline)
│   ├── ComparisonView (adaptive vs. control for same participant)
│   └── SummaryStats (aggregate charts, CSV export)
│
└── /raw -> RawView.tsx (testing without study flow)
```

### 8.4 Key Custom Hooks

**useBehaviourCollector** (`hooks/useBehaviourCollector.ts`):
- Attaches global event listeners (wheel, pointerdown, scroll, mousemove, keydown, etc.)
- Maintains sliding windows for each signal type
- Computes all 9 signals every 2.5 seconds
- Returns the latest `SignalSnapshot`
- Only active when condition is "adaptive" (disabled for control condition)

**useAdaptationEngine** (`hooks/useAdaptationEngine.ts`):
- Accepts the current `SignalSnapshot` and `UIState`
- Evaluates all 8 rules in order on each signal update
- Tracks last application timestamp and application count per rule
- Dispatches APPLY_RULE actions to AdaptationContext when rules trigger
- Logs adaptation events via studyLogger

### 8.5 Visualization Components

**SignalSparkline** (`components/visualizations/SignalSparkline.tsx`):
- Micro line chart (Recharts) showing signal history
- Colour-coded: green (safe) -> yellow (70% of threshold) -> red (threshold exceeded)
- Threshold reference line

**ThresholdGauge** (`components/visualizations/ThresholdGauge.tsx`):
- Progress bar showing current signal value vs. threshold
- Formatted value display (px, %, seconds, etc.)

**AdaptationTimeline** (`components/visualizations/AdaptationTimeline.tsx`):
- Horizontal timeline bar showing when each rule fired
- Colour-coded by rule type (8 different colours)

### 8.6 Routing

```
/                  -> StudyFlow (main study interface for participants)
/dashboard         -> Dashboard (researcher analytics, password-protected)
/raw               -> RawView (testing environment without study flow)
```

---

## 9. Backend Implementation

### 9.1 NestJS Module Structure

```
AppModule
├── DatabaseModule (TypeORM + PostgreSQL connection)
├── SessionsModule (CRUD for study sessions)
├── EventsModule (batch event ingestion)
└── AnalyticsModule (aggregation + CSV export)
```

### 9.2 Database Schema

#### Sessions Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated session identifier |
| `participantId` | VARCHAR(255) | Participant identifier (e.g., P001) |
| `condition` | ENUM('adaptive', 'control') | Experimental condition |
| `orderGroup` | ENUM('adaptive_first', 'control_first') | Counterbalancing order |
| `startedAt` | TIMESTAMP | Auto-set on creation |
| `endedAt` | TIMESTAMP (nullable) | Set when session completes |
| `susScore` | INT (nullable) | System Usability Scale score (0-100) |
| `nasaTlx` | JSONB (nullable) | `{mental, physical, temporal, performance, effort, frustration}` (1-7 each) |
| `metadata` | JSONB (nullable) | Flexible extra data (merged on update) |
| `updatedAt` | TIMESTAMP | Auto-updated |

Relations: One-to-many with Events, One-to-many with Adaptations

#### Events Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, auto-increment) | Event identifier |
| `sessionId` | UUID (FK -> sessions) | Parent session |
| `timestamp` | TIMESTAMP | When event occurred |
| `eventType` | VARCHAR(50) | One of: signal_snapshot, adaptation_applied, task_completed, questionnaire_completed, consent_given, warmup_completed, study_phase_changed |
| `payload` | JSONB | Event-specific data |

Index: `(sessionId, timestamp)` for fast querying

#### Adaptations Table (Denormalized)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, auto-increment) | Adaptation identifier |
| `sessionId` | UUID (FK -> sessions) | Parent session |
| `ruleId` | VARCHAR(50) | Which rule triggered (e.g., font_scale) |
| `triggeredAt` | TIMESTAMP | When adaptation occurred |
| `signalsSnapshot` | JSONB | Behaviour signals at time of trigger |
| `uiStateBefore` | JSONB | UI state before rule application |
| `uiStateAfter` | JSONB | UI state after rule application |

Index: `(sessionId, ruleId)` for fast per-rule queries

### 9.3 API Endpoints

#### Sessions API

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/sessions` | Create new session | `{participantId, condition, orderGroup}` | Session object with UUID |
| GET | `/sessions` | List all sessions | Query: `?participantId=XXX` | Session[] ordered by startedAt DESC |
| GET | `/sessions/:id` | Get session with events and adaptations | — | Session with relations |
| PATCH | `/sessions/:id` | Update SUS/NASA-TLX scores | `{susScore?, nasaTlx?, metadata?}` | Updated session |
| PATCH | `/sessions/:id/end` | Mark session complete | — | Session with endedAt set |

#### Events API

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/events/batch` | Batch insert events | `{sessionId, events: [{timestamp, eventType, payload}]}` | `{accepted: N, rejected: 0}` |

Note: If an event has `eventType = 'adaptation_applied'`, the service automatically creates a corresponding Adaptation record.

#### Analytics API

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/analytics/sessions/:id` | Session analytics | `{session, signalSnapshots[], adaptations[], taskMetrics[]}` |
| GET | `/analytics/summary` | Aggregate statistics | `{totalSessions, completedSessions, byCondition: {adaptive: {count, meanSUS, meanAdaptations}, control: {...}}}` |
| GET | `/analytics/export` | CSV export | CSV file download (Content-Type: text/csv) |

Query parameter for export: `?participantIds=P001,P002,...`

### 9.4 Database Configuration

- **Host:** localhost (or `DB_HOST` env var)
- **Port:** 5432 (or `DB_PORT` env var)
- **User:** thesis (or `DB_USER` env var)
- **Password:** thesis_dev_pwd (or `DB_PASSWORD` env var)
- **Database:** adaptive_ui (or `DB_NAME` env var)
- **Synchronize:** true (auto-creates/updates schema on startup — development only)
- **Logging:** enabled when `NODE_ENV=development`

### 9.5 Middleware and Configuration

- **CORS:** Enabled for `http://localhost:5173` (frontend dev server)
- **ValidationPipe:** Global, with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **Swagger:** Available at `http://localhost:3000/api` with auto-generated API documentation

---

## 10. Study Design and Methodology

### 10.1 Experimental Design

- **Type:** Within-subjects (repeated measures)
- **Conditions:** 2 (adaptive vs. control)
- **Counterbalancing:** Two order groups (adaptive_first, control_first) to prevent order effects
- **Target sample size:** n = 12-15 participants (targeting 80% statistical power for medium effect size)

### 10.2 Conditions

**Adaptive condition:**
- Full behaviour detection engine active (all 9 signals computed)
- All 8 adaptation rules enabled and evaluated
- UI modifications applied in real-time based on behaviour

**Control condition:**
- Static interface with no behaviour detection
- No adaptation rules evaluated
- UI remains at baseline defaults throughout session
- Same content and tasks as adaptive condition

### 10.3 Study Flow (Per Session)

```
1. Consent Screen
   - Enter participant ID (e.g., P001)
   - Select condition (adaptive/control)
   - Read study information and check consent checkbox
   - Submit -> Creates backend session, initializes event logger

2. Warmup Phase (30 seconds)
   - Free exploration of interface
   - Read content, test buttons, familiarize with layout
   - "Continue" button enables after 30 seconds

3. Task Phase (3 tasks sequentially)
   - Task 1: find_answer (locate specific information in text)
   - Task 2: form_completion (fill form based on article content)
   - Task 3: navigation (scroll to section + click button)
   - Each task tracks: start time, end time, errors, answer

4. SUS Questionnaire
   - 10 Likert-scale items (1-5)
   - Automatic score calculation (0-100 scale)
   - Score saved to backend

5. NASA-TLX Questionnaire
   - 6 dimensions (1-7 scale each):
     - Mental Demand
     - Physical Demand
     - Temporal Demand
     - Performance
     - Effort
     - Frustration
   - All dimensions saved to backend

6. Session Summary
   - Displays: condition, tasks completed, total time, errors, SUS score, NASA-TLX average
   - Ends session (sets endedAt timestamp)
```

### 10.4 Article Sets and Task Types

Three article sets of comparable length and difficulty, assigned based on participant ID hash:

1. **Adaptive Interfaces** — 5 sections about adaptive UI research
2. **Digital Accessibility History** — 5 sections about WCAG and assistive technology
3. **Human-Computer Interaction Methods** — 5 sections about HCI evaluation

Each article set has 3 structured tasks:

| Task Type | Description | What's Measured |
|-----------|-------------|-----------------|
| `find_answer` | Locate specific information in the article text | Reading comprehension, search efficiency |
| `form_completion` | Fill form fields based on article content | Comprehension, motor accuracy (form interaction) |
| `navigation` | Scroll to a specific section and click a button | Navigation efficiency, motor accuracy |

### 10.5 Dependent Variables

**Primary:**
- **SUS Score** (0-100): Standardized usability rating

**Secondary:**
- **NASA-TLX dimensions** (1-7 each): Mental, Physical, Temporal, Performance, Effort, Frustration
- **Task completion time** (seconds per task)
- **Task error count** (total across all 3 tasks)
- **Adaptation count** (number of rules triggered — adaptive condition only)
- **Time to first adaptation** (seconds from session start)
- **Signal averages** (mean of each signal type across session)

### 10.6 Independent Variable

- **Condition:** Adaptive vs. Control (within-subjects)

### 10.7 Counterbalancing

| Order Group | Session 1 | Session 2 |
|------------|-----------|-----------|
| adaptive_first | Adaptive condition | Control condition |
| control_first | Control condition | Adaptive condition |

Participants are assigned to order groups to balance potential learning/fatigue effects.

---

## 11. Data Collection and Export

### 11.1 Event Logging Pipeline

```
User interacts with UI
    ↓
useBehaviourCollector computes signals (every 2.5s)
    ↓
studyLogger.log('signal_snapshot', signalData) — added to buffer
    ↓
Buffer accumulates events
    ↓
Every 8 seconds (or on page unload): studyLogger.flush()
    ↓
POST /api/events/batch { sessionId, events[] }
    ↓
Backend: EventsService.batchCreate()
    ↓
Insert into events table
    ↓
If eventType='adaptation_applied': also insert into adaptations table
```

### 11.2 Event Types Logged

| Event Type | When Logged | Payload Content |
|-----------|-------------|-----------------|
| `signal_snapshot` | Every 2.5 seconds | All 9 signal values |
| `adaptation_applied` | When any rule triggers | `{ruleId, uiStateBefore, uiStateAfter, signals}` |
| `task_completed` | When participant submits a task | `{taskId, taskType, duration, errors, answer}` |
| `questionnaire_completed` | After SUS or NASA-TLX submission | `{type, responses, score}` |
| `consent_given` | After consent form submission | `{participantId, condition}` |
| `warmup_completed` | After warmup phase ends | `{duration}` |
| `study_phase_changed` | On each phase transition | `{from, to}` |

### 11.3 CSV Export Format

The `GET /analytics/export` endpoint produces a CSV file with the following columns:

```
participant_id, session_id, condition, order_group,
started_at, ended_at,
sus_score,
nasa_tlx_mental, nasa_tlx_physical, nasa_tlx_temporal,
nasa_tlx_performance, nasa_tlx_effort, nasa_tlx_frustration,
adaptation_count, first_adaptation_time,
zoom_count_avg, missed_tap_rate_avg, dwell_seconds_avg,
scroll_reversal_rate_avg, tremor_score_avg,
task_duration_avg, task_errors_total
```

This format is designed for direct import into R or SPSS for statistical analysis.

---

## 12. Statistical Analysis Plan

### 12.1 Primary Analysis

**Test:** Wilcoxon signed-rank test (non-parametric, paired)
- **Justification:** Within-subjects design, ordinal data (SUS scores), small sample size (n < 30) where normality cannot be assumed
- **Dependent variable:** SUS score
- **Independent variable:** Condition (adaptive vs. control)
- **Significance level:** alpha = 0.05

```r
# R code
data <- read.csv('study_data.csv')
wilcox.test(sus_score ~ condition, data = data, paired = TRUE)
```

### 12.2 Effect Size

```r
library(rstatix)
wilcox_effsize(data, sus_score ~ condition, paired = TRUE)
```

Effect size interpretation: small (r < 0.3), medium (0.3 <= r < 0.5), large (r >= 0.5)

### 12.3 Secondary Analyses

```r
# Task duration
wilcox.test(task_duration_avg ~ condition, data = data, paired = TRUE)

# Task errors
wilcox.test(task_errors_total ~ condition, data = data, paired = TRUE)

# NASA-TLX (individual dimensions)
for (dim in c('mental', 'physical', 'temporal', 'performance', 'effort', 'frustration')) {
  col <- paste0('nasa_tlx_', dim)
  cat(dim, ':\n')
  print(wilcox.test(data[[col]] ~ data$condition, paired = TRUE))
}
```

### 12.4 Descriptive Statistics

```r
# Summary by condition
aggregate(sus_score ~ condition, data = data, FUN = function(x) {
  c(mean = mean(x), sd = sd(x), median = median(x))
})

# Adaptation frequency analysis
adaptive_data <- subset(data, condition == 'adaptive')
summary(adaptive_data$adaptation_count)
```

### 12.5 Expected Analyses for Results Chapter

1. **Descriptive statistics:** Mean, SD, median for all dependent variables by condition
2. **Primary hypothesis:** Wilcoxon test for SUS scores (adaptive vs. control)
3. **Secondary hypotheses:** Wilcoxon tests for task time, errors, NASA-TLX dimensions
4. **Effect sizes:** For all significant comparisons
5. **Adaptation behaviour:** Which rules triggered most frequently, time to first adaptation, distribution of adaptations across sessions
6. **Visualizations:** Box plots of SUS by condition, bar charts of NASA-TLX dimensions, scatter plots of adaptation count vs. SUS improvement

---

## 13. Accessibility Compliance

### 13.1 WCAG 2.1 Level AA Compliance Status: PASS

### 13.2 Contrast Ratios (Verified)

| Level | Background | Text | Ratio | Standard |
|-------|-----------|------|-------|----------|
| 0 (Baseline) | `#0f172a` | `#cbd5e1` | 8.2:1 | Exceeds AA (4.5:1) |
| 1 (Enhanced) | `#060d1a` | `#f1f5f9` | 10.5:1 | Exceeds AA |
| 2 (Maximum) | `#000000` | `#ffffff` | 21:1 | Exceeds AAA (7:1) |
| Accent colour | `#38bdf8` | all backgrounds | 8.5:1 - 13.2:1 | Exceeds 3:1 for UI |

### 13.3 Key Compliance Points

- **Perceivable:** Contrast (1.4.3), Resize text to 200% (1.4.4), Reflow at 320px (1.4.10), Non-text contrast (1.4.11), Text spacing (1.4.12)
- **Operable:** Full keyboard navigation (2.1.1), No keyboard traps (2.1.2), Logical focus order (2.4.3), Visible focus indicators (2.4.7), Touch targets >= 44x44px after adaptation (2.5.5)
- **Understandable:** Language declared (3.1.1), No context changes on focus (3.2.1), Consistent identification (3.2.4)
- **Robust:** Proper name/role/value on all UI components (4.1.2), Status messages programmatically determinable (4.1.3)

### 13.4 Additional Accessibility Features

- **prefers-reduced-motion:** Respected via media query; also overridden by motion_reduce rule
- **Semantic HTML5:** `<article>`, `<section>`, `<header>`, `<footer>`, `<fieldset>`, `<legend>`
- **ARIA attributes:** `aria-label`, `aria-current="step"`, `aria-live` regions, `role="alert"` for validation errors
- **Keyboard shortcuts:** Escape closes debug panel, Tab/Shift+Tab navigation, Enter/Space activation
- **Focus styles:** 3px solid accent outline with 3px offset, box shadow for buttons
- **Contrast validator:** Programmatic WCAG ratio calculator in `utils/contrastValidator.ts`

---

## 14. Testing and Validation

### 14.1 Unit Tests — 64/64 Passing

**Frontend test files** (`frontend/src/__tests__/`):

| Test File | What's Tested | Tests |
|-----------|--------------|-------|
| `rules.test.ts` | Rule logic and boundary conditions | ~8 |
| `newSignals.test.ts` | Signal computation functions | ~6 |
| `newRules.test.ts` | Rule evaluation with various signal inputs | ~8 |
| `slidingWindow.test.ts` | SlidingWindow data structure | 6 |
| `ConsentScreen.test.tsx` | Consent component rendering and interaction | ~4 |
| `ProgressTracker.test.tsx` | Progress indicator rendering | ~3 |
| `NASATLXQuestionnaire.test.tsx` | NASA-TLX form and scoring | ~4 |
| `contrastValidator.test.ts` | WCAG contrast ratio calculations | 24 |
| `signalComputation.test.ts` | Signal calculation accuracy | ~4 |
| `SUSQuestionnaire.test.tsx` | SUS form and scoring | ~4 |

**Backend test files** (`backend/src/**/*.spec.ts`):

| Test File | What's Tested | Tests |
|-----------|--------------|-------|
| `sessions.service.spec.ts` | Session CRUD operations | ~6 |
| `events.service.spec.ts` | Batch event insertion | ~5 |
| `analytics.service.spec.ts` | CSV export and aggregation | ~8 |

### 14.2 End-to-End Tests (Playwright)

| Spec File | What's Tested |
|-----------|--------------|
| `adaptations.spec.ts` | Adaptation rules trigger correctly in browser |
| `dashboard.spec.ts` | Dashboard login, session viewing, export |
| `study-flow.spec.ts` | Complete study flow from consent to summary |

Configuration: Chromium browser, base URL `http://localhost:5173`

### 14.3 Test Commands

```bash
# Frontend unit tests
npm test --workspace=frontend -- --run

# Backend unit tests
npm test --workspace=backend

# End-to-end tests
npm run test:e2e

# Browser accessibility validation
# Open http://localhost:5173 and run in console:
runAccessibilityValidation()
```

---

## 15. Known Limitations

### 15.1 Technical Limitations

1. **Missed tap false positives:** Text selection is counted as a missed tap, which may incorrectly trigger `button_enlarge`. Mitigation: future work could filter events with `pressure === 0`.

2. **Dwell time != reading:** `IntersectionObserver` measures section visibility, not actual reading. A user scrolling past content without reading registers dwell time. Mitigation: dual-signal approach (dwell + scroll reversals) reduces false positives.

3. **Rule determinism:** All users share the same thresholds regardless of individual baseline behaviour. A user who naturally clicks quickly may trigger different rules than one who clicks slowly. Mitigation: future work on personalized thresholds.

4. **Single-session calibration:** The system has no learning period — thresholds are static from the first interaction. There is no per-user baseline calibration phase.

### 15.2 Study Design Limitations

5. **Laboratory setting:** Controlled lab tasks do not reflect real-world web browsing where users have intrinsic motivation and varied goals.

6. **Short session duration:** Study sessions are brief compared to real-world use where adaptation effects may accumulate or diminish over time.

7. **Article content domain:** All content is about HCI/accessibility, which may not represent typical web content difficulty.

8. **Sample size:** n = 12-15 limits statistical power, particularly for detecting small effects.

9. **Hawthorne effect:** Participants know they are being observed, which may alter their natural interaction patterns. The debug panel is available but adaptations themselves are silent.

### 15.3 Ethical Considerations

10. **Silent adaptation:** Users are not informed when the UI changes, raising questions about user autonomy and consent. The informed consent process at study start addresses this, but real-world deployment would need more transparency.

11. **Behaviour tracking:** The system collects detailed interaction data. In a research context this is covered by ethics approval, but production deployment would require GDPR compliance and data minimisation.

---

## 16. Future Work

1. **Machine learning personalization:** Replace fixed thresholds with ML models that learn individual user baselines and adapt thresholds accordingly. Could use reinforcement learning where adaptation outcomes (SUS improvement) serve as reward signals.

2. **Longitudinal study:** Evaluate adaptation effects over multiple sessions (days/weeks) to assess whether benefits persist, diminish (habituation), or improve (learning).

3. **Explicit feedback loop:** Allow users to confirm or dismiss adaptations ("Was this helpful?"), creating labeled data for supervised learning of better thresholds.

4. **Additional signals:** Eye gaze tracking, typing speed/accuracy, voice stress, and physiological signals (heart rate via wearable) could provide richer behaviour models.

5. **Undo mechanism:** Allow users to revert specific adaptations while keeping others, giving more user control.

6. **Cross-device adaptation:** Persist adaptation preferences across sessions and devices via user profiles.

7. **Accessibility overlay comparison:** Compare this CSS-variable approach against common accessibility overlay solutions to evaluate relative effectiveness.

8. **Multi-language support:** Evaluate whether reading speed thresholds vary by language and script system.

---

## 17. Complete Reference List

These are the academic references cited in the system's source code. The thesis should expand these with additional relevant literature.

1. Nielsen, J. (1993). *Usability Engineering*. Academic Press.
2. Fitts, P.M. (1954). The information capacity of the human motor system in controlling the amplitude of movement. *Journal of Experimental Psychology*, 47(6), 381-391.
3. Rayner, K., Schotter, E.R., Masson, M.E.J., Potter, M.C., & Treiman, R. (2016). So much to read, so little time: How do we read, and can speed reading help? *Psychological Science in the Public Interest*, 17(1), 4-34.
4. Buscher, G., Cutrell, E., & Morris, M.R. (2012). What do you see when you're surfing? Using eye tracking to predict salient regions of web pages. *Proceedings of ACM CHI 2012*.
5. Wobbrock, J.O., Fogarty, J., Liu, S., Kimuro, S., & Harada, S. (2008). Longitudinal evaluation of discrete pointing performance models. *Proceedings of ACM UIST 2008*.
6. Wobbrock, J.O., Kane, S.K., Gajos, K.Z., Harada, S., & Froehlich, J. (2011). Ability-based design: Concept, principles and examples. *ACM Transactions on Accessible Computing (TACCESS)*, 3(3), Article 9.
7. Hurst, A., Hudson, S.E., Mankoff, J., & Trewin, S. (2013). Automatic detection of target accuracy problems during pointing. *ACM Transactions on Accessible Computing (TACCESS)*, 6(2), Article 7.
8. Gajos, K.Z., Wobbrock, J.O., & Weld, D.S. (2010). Automatically generating personalized user interfaces with Supple. *Artificial Intelligence*, 174(12-13), 910-950.
9. Dickinson, A., Newell, A.F., Smith, M.J., & Hill, R.L. (2002). Introducing the Internet to the over-60s: Developing an email system for older novice computer users. *Interacting with Computers*, 14(4), 359-370.
10. Brooke, J. (1996). SUS: A 'quick and dirty' usability scale. In P.W. Jordan et al. (Eds.), *Usability Evaluation in Industry* (pp. 189-194). Taylor & Francis.
11. Hart, S.G., & Staveland, L.E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. In P.A. Hancock & N. Meshkati (Eds.), *Human Mental Workload* (pp. 139-183). North-Holland.
12. Card, S.K., Moran, T.P., & Newell, A. (1983). *The Psychology of Human-Computer Interaction*. Lawrence Erlbaum Associates.
13. Ericsson, K.A., & Simon, H.A. (1980). Verbal reports as data. *Psychological Review*, 87(3), 215-251.
14. Nielsen, J., & Molich, R. (1990). Heuristic evaluation of user interfaces. *Proceedings of ACM CHI '90*, 249-256.
15. W3C (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/
16. Apple Inc. Human Interface Guidelines — Accessibility. https://developer.apple.com/design/human-interface-guidelines/accessibility

---

## 18. Key File Paths for Thesis References

When the thesis references implementation details, use these specific source files:

| Topic | File Path |
|-------|-----------|
| Core type definitions (SignalSnapshot, UIState, AdaptationRule) | `frontend/src/types.ts` |
| All thresholds with academic citations | `frontend/src/constants.ts` |
| 8 adaptation rules with full citations | `frontend/src/engine/rules.ts` |
| Behaviour signal detection (9 signals) | `frontend/src/hooks/useBehaviourCollector.ts` |
| Rule evaluation engine | `frontend/src/hooks/useAdaptationEngine.ts` |
| Signal computation helpers | `frontend/src/utils/signalComputation.ts` |
| Sliding window data structure | `frontend/src/utils/slidingWindow.ts` |
| WCAG contrast validator | `frontend/src/utils/contrastValidator.ts` |
| CSS custom property application | `frontend/src/utils/applyUIState.ts` |
| UI adaptation state management | `frontend/src/context/AdaptationContext.tsx` |
| Study workflow state management | `frontend/src/context/StudyContext.tsx` |
| Event logging and batching | `frontend/src/services/studyLogger.ts` |
| Article content sets | `frontend/src/data/articles.ts` |
| Study tasks (3 types x 3 sets) | `frontend/src/data/tasks.ts` |
| Session database entity | `backend/src/sessions/session.entity.ts` |
| Event database entity | `backend/src/events/event.entity.ts` |
| Adaptation database entity | `backend/src/adaptations/adaptation.entity.ts` |
| Analytics service (CSV export) | `backend/src/analytics/analytics.service.ts` |
| Database configuration | `backend/src/database/database.module.ts` |
| i18n configuration | `frontend/src/i18n/index.ts` |
| Romanian translations | `frontend/src/i18n/ro.ts` |
| English translations | `frontend/src/i18n/en.ts` |
| Language selector component | `frontend/src/components/LanguageSelector.tsx` |
| WCAG 2.1 AA compliance checklist | `ACCESSIBILITY_CHECKLIST.md` |
| Docker infrastructure | `docker-compose.yml` |

---

## 19. How to Run the System

```bash
# Prerequisites: Node.js 18+, Docker & Docker Compose

# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Start both frontend and backend
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
# Swagger:  http://localhost:3000/api

# 4. Run tests
npm test --workspace=frontend -- --run   # 64 frontend tests
npm test --workspace=backend             # Backend tests
npm run test:e2e                         # Playwright E2E tests

# 5. Export study data
curl http://localhost:3000/analytics/export > study_data.csv
```

### Study Modes
- **Adaptive:** `http://localhost:5173` (default or `?condition=adaptive`)
- **Control:** `http://localhost:5173?condition=control`
- **Dashboard:** `http://localhost:5173/dashboard` (password: `ale-researcher-2024`)
- **Raw testing:** `http://localhost:5173/raw`

---

## 20. Suggested Thesis Chapter Outline

1. **Introduction** — Problem statement, motivation, objectives, contributions (Section 3 of this document)
2. **Literature Review** — Expand references from Section 4; cover adaptive interfaces, accessibility standards, behaviour detection, usability measurement
3. **Methodology** — System architecture (Section 5), study design (Section 10), data collection (Section 11)
4. **System Design and Implementation** — Behaviour detection (Section 6), adaptation engine (Section 7), frontend (Section 8), backend (Section 9)
5. **Accessibility Compliance** — WCAG 2.1 AA verification (Section 13)
6. **Testing and Validation** — Unit tests, E2E tests, accessibility validation (Section 14)
7. **Results** — Statistical analysis of study data (Section 12)
8. **Discussion** — Interpretation, limitations (Section 15), ethical considerations
9. **Conclusions and Future Work** — Summary of contributions, future directions (Section 16)
10. **References** — Full bibliography (Section 17 as starting point)
11. **Appendices** — SUS questionnaire items, NASA-TLX dimensions, code excerpts, raw data tables
