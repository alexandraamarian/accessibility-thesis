# How the Adaptive Accessibility System Works

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Behavior Detection](#behavior-detection)
4. [Adaptation Engine](#adaptation-engine)
5. [User Interface](#user-interface)
6. [Study Flow](#study-flow)
7. [Dashboard](#dashboard)
8. [Visualizations](#visualizations)
9. [Data Flow](#data-flow)
10. [Research Methodology](#research-methodology)
11. [Technical Implementation](#technical-implementation)

---

## Overview

### What Does This App Do?

The Adaptive Accessibility System is a web application that **automatically improves usability** by detecting how users interact with it and silently adjusting the interface to better meet their needs.

**Key Innovation:** No settings required. The system observes your behavior and adapts automatically.

### The Problem It Solves

Many users face accessibility challenges:
- **Vision:** Small text is hard to read
- **Motor control:** Small buttons are hard to click accurately
- **Cognitive load:** Low contrast makes reading difficult
- **Motion sensitivity:** Animations can be distracting

Traditional solution: Users must discover accessibility settings and manually configure them.

**Our solution:** The system detects these challenges through behavior patterns and adapts automatically.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
│              (Interacting with the app)                     │
└────────────┬────────────────────────────────────────────────┘
             │
             │ zoom, clicks, scrolls, reading
             ↓
┌─────────────────────────────────────────────────────────────┐
│                  BEHAVIOR DETECTION                         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐  │
│  │ Zoom │Missed│ Dwell│Scroll│Tremor│ Rage │Mouse │ Idle │Read  │  │
│  │ Count│ Taps │ Time │Revrsl│Score │Clicks│Hesit.│ Time │Speed │  │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘  │
│         (Every 2.5 seconds computes signal snapshot)        │
└────────────┬────────────────────────────────────────────────┘
             │
             │ SignalSnapshot { zoomCount: 3, ... }
             ↓
┌─────────────────────────────────────────────────────────────┐
│                   ADAPTATION ENGINE                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  For each rule:                                      │  │
│  │  1. Check if cooldown expired                       │  │
│  │  2. Check if maxApplications reached                │  │
│  │  3. Evaluate rule condition (threshold check)       │  │
│  │  4. Apply UI transformation if triggered            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────┘
             │
             │ UIState { fontSize: 18, ... }
             ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  CSS Variables applied:                                     │
│  --font-size-base: 18px                                     │
│  --button-padding: 20px                                     │
│  data-contrast="1"                                          │
│  --line-height: 1.80                                        │
│  --animate-duration: 0ms                                    │
│  --cursor-scale: 1.5                                        │
│  data-layout-simplified="true"                              │
│  data-reading-guide="true"                                  │
└─────────────────────────────────────────────────────────────┘
             │
             │ Events logged
             ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND / DATABASE                        │
│  - Store behavior signals                                   │
│  - Track adaptation events                                  │
│  - Generate CSV for research analysis                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Behavior Detection

### 9 Signal Types

The system continuously monitors user behavior through **9 signal types**, each computed over a sliding time window:

#### 1. Zoom Count
**What it detects:** User repeatedly zooming in/out with Ctrl+Wheel or pinch gestures

**How it works:**
- Listens to `wheel` events with `ctrlKey` or `metaKey` pressed
- Also listens to `gesturestart` events (Safari pinch)
- Counts zoom events in a **60-second sliding window**

**What it means:**
- 0-2 zooms: Normal exploration
- **3+ zooms:** User struggles to read at current font size ➜ Trigger font_scale

**Code location:** `frontend/src/hooks/useBehaviourCollector.ts`

---

#### 2. Missed Tap Rate
**What it detects:** User clicking outside buttons (poor targeting accuracy)

**How it works:**
- Listens to `pointerdown` events globally
- Checks if tap landed on an interactive element: `button, a, input, [data-interactive]`
- If not → counts as a "missed tap"
- Computes ratio: `missed taps / total taps` in **30-second window**

**What it means:**
- < 20%: Good accuracy
- **35%+:** 1 in 3 clicks miss targets ➜ Trigger button_enlarge

**Code location:** `frontend/src/hooks/useBehaviourCollector.ts` + `frontend/src/utils/signalComputation.ts`

---

#### 3. Average Dwell Time
**What it detects:** How long user spends reading each section

**How it works:**
- Uses `IntersectionObserver` to track when sections are visible
- Triggers when section reaches **60% visibility**
- Records `enterTime` when visible, `exitTime` when no longer visible
- Computes average dwell time across all sections in **90-second window**

**What it means:**
- < 5s: Quick reading
- **7s+:** Slow reading, possible comprehension difficulty ➜ Combined with scroll reversals triggers contrast_boost

**Code location:** `frontend/src/hooks/useBehaviourCollector.ts`

**Note:** Sections must have `data-section-id` attribute to be tracked

---

#### 4. Scroll Reversal Rate
**What it detects:** User scrolling up after scrolling down (re-reading)

**How it works:**
- Tracks scroll direction on every `scroll` event
- Detects direction changes: `down → up` = reversal, `up → down` = not reversal
- Computes ratio: `reversals / total direction changes` in **45-second window**

**What it means:**
- < 20%: Normal forward reading
- **30%+:** Frequent re-reading ➜ Combined with dwell time triggers contrast_boost

**Code location:** `frontend/src/hooks/useBehaviourCollector.ts` + `frontend/src/utils/signalComputation.ts`

---

#### 5. Tremor Score
**What it detects:** Variance in tap positions (motor control precision)

**How it works:**
- Records (x, y) coordinates of every tap
- Computes standard deviation of positions: `sqrt(var(x) + var(y))`
- Measured in **8-second window** (shorter = more responsive)

**What it means:**
- < 15px: Good motor control
- **18px+:** Moderate tremor ➜ Trigger spacing_increase
- **27px+:** Severe tremor ➜ Trigger motion_reduce

**Formula:**
```javascript
// 1. Calculate mean of x and y coordinates
meanX = sum(all x values) / count
meanY = sum(all y values) / count

// 2. Calculate variance
varianceX = sum((x - meanX)²) / count
varianceY = sum((y - meanY)²) / count

// 3. Standard deviation (tremor score)
tremorScore = sqrt(varianceX + varianceY)
```

**Code location:** `frontend/src/utils/signalComputation.ts`

---

#### 6. Rage Click Count
**What it detects:** User clicking the same area rapidly out of frustration

**How it works:**
- Tracks click events with timestamps and positions
- Detects 3+ clicks within a **2-second window** in roughly the same area
- Counts rage click bursts

**What it means:**
- 0: Normal clicking
- **1+:** Frustration detected, UI may need cursor/target adjustments

**Code location:** `frontend/src/utils/signalComputation.ts`

---

#### 7. Mouse Hesitation Score
**What it detects:** User hovering without committing to a click

**How it works:**
- Tracks mouse movement pauses over interactive elements
- Measures hover duration without a subsequent click within a **10-second window**
- Computes hesitation score based on pause frequency and duration

**What it means:**
- Low score: Confident interactions
- **High score:** User is uncertain about UI elements

**Code location:** `frontend/src/utils/signalComputation.ts`

---

#### 8. Idle Seconds
**What it detects:** User inactivity (no mouse, keyboard, or scroll events)

**How it works:**
- Monitors all user input events
- Tracks consecutive seconds of no interaction within a **60-second window**
- Resets on any user input

**What it means:**
- < 10s: Normal pauses
- **30s+:** User may be disengaged or confused

**Code location:** `frontend/src/utils/signalComputation.ts`

---

#### 9. Reading Speed
**What it detects:** How quickly the user processes visible content

**How it works:**
- Combines dwell time with content length of visible sections
- Computed over a **90-second window**
- Estimates words-per-minute reading rate

**What it means:**
- 200-250 wpm: Normal adult reading speed
- **< 100 wpm:** Possible comprehension difficulty, may benefit from reading aid

**Code location:** `frontend/src/utils/signalComputation.ts`

---

### Signal Computation Cycle

**Every 2.5 seconds:**
1. Collect all events from sliding windows
2. Compute current signal snapshot
3. Pass to adaptation engine
4. Log to backend

```typescript
interface SignalSnapshot {
  zoomCount: number;            // Last 60s
  missedTapRate: number;        // Last 30s (0-1 ratio)
  avgDwellSeconds: number;      // Last 90s
  scrollReversalRate: number;   // Last 45s (0-1 ratio)
  tremorScore: number;          // Last 8s (pixels)
  rageClickCount: number;       // Last 2s window bursts
  mouseHesitationScore: number; // Last 10s hover pauses
  idleSeconds: number;          // Last 60s of inactivity
  readingSpeed: number;         // Last 90s (words per minute)
  totalTaps: number;
  totalScrollChanges: number;
  timestamp: number;
}
```

---

## Adaptation Engine

### 8 Adaptation Rules

The engine evaluates rules every 2.5 seconds when new signals arrive. Each rule:
1. Checks if **cooldown** has expired
2. Checks if **maxApplications** limit reached
3. Evaluates rule **condition** (threshold check)
4. Applies **transformation** to UI state

---

#### Rule 1: Font Scale

**Trigger:** `zoomCount >= 3`

**Action:** Increase font size by 2px

**Justification:** Nielsen (1993) identifies repetitive corrective actions as a frustration pattern. Three zoom events in 60s distinguishes exploration from legibility issues.

**Parameters:**
- Cooldown: **120 seconds** (allow 2 reading cycles)
- Max applications: **3×**
- Progression: 16px → 18px → 20px → 22px

**Code:**
```typescript
{
  id: 'font_scale',
  check: (signals) => signals.zoomCount >= 3,
  apply: (ui) => ({ ...ui, fontSize: Math.min(ui.fontSize + 2, 26) }),
  cooldown: 120_000,
  maxApplications: 3,
}
```

---

#### Rule 2: Button Enlarge

**Trigger:** `missedTapRate >= 0.35` (35%)

**Action:** Increase button padding by 8px

**Justification:** Fitts's Law (1954) models pointing time as f(distance, width). Apple HIG and Material Design mandate 44×44dp minimum based on average fingertip contact area.

**Parameters:**
- Cooldown: **90 seconds** (short-task cycle)
- Max applications: **2×**
- Progression: 12px → 20px → 28px

**Code:**
```typescript
{
  id: 'button_enlarge',
  check: (signals) => signals.missedTapRate >= 0.35,
  apply: (ui) => ({ ...ui, buttonPadding: Math.min(ui.buttonPadding + 8, 36) }),
  cooldown: 90_000,
  maxApplications: 2,
}
```

---

#### Rule 3: Contrast Boost

**Trigger:** `avgDwellSeconds >= 7 AND scrollReversalRate >= 0.30`

**Action:** Increase contrast level by 1 (0 → 1 → 2)

**Justification:** Reading speed for English at 16px is 200-250 wpm (Rayner et al. 2016). 7s dwell + 30% reversals suggests re-reading due to visual difficulty.

**Parameters:**
- Cooldown: **180 seconds** (contrast changes are perceptually significant)
- Max applications: **2×**
- Progression: Level 0 (AA) → Level 1 (Enhanced) → Level 2 (AAA)

**Contrast Levels:**
- **Level 0:** `#0f172a` / `#cbd5e1` = 8.2:1 (WCAG AA)
- **Level 1:** `#060d1a` / `#f1f5f9` = 10.5:1 (Enhanced)
- **Level 2:** `#000000` / `#ffffff` = 21:1 (WCAG AAA)

**Code:**
```typescript
{
  id: 'contrast_boost',
  check: (signals) =>
    signals.avgDwellSeconds >= 7 && signals.scrollReversalRate >= 0.30,
  apply: (ui) => ({ ...ui, contrast: Math.min(ui.contrast + 1, 2) }),
  cooldown: 180_000,
  maxApplications: 2,
}
```

---

#### Rule 4: Spacing Increase

**Trigger:** `tremorScore >= 18` (pixels)

**Action:** Increase line height by 0.15

**Justification:** Wobbrock et al. (2008) found usability degradation when pointing error exceeds 15-20% of target size. 18px tremor ≈ 40% of standard 44px target.

**Parameters:**
- Cooldown: **150 seconds** (line height affects all reading)
- Max applications: **3×**
- Progression: 1.65 → 1.80 → 1.95 → 2.10

**Code:**
```typescript
{
  id: 'spacing_increase',
  check: (signals) => signals.tremorScore >= 18,
  apply: (ui) => ({ ...ui, lineHeight: Math.min(ui.lineHeight + 0.15, 2.2) }),
  cooldown: 150_000,
  maxApplications: 3,
}
```

---

#### Rule 5: Motion Reduce

**Trigger:** `tremorScore >= 27` (pixels, higher threshold)

**Action:** Disable all animations

**Justification:** Wobbrock et al. (2011) Ability-based design. Higher tremor threshold indicates severe motor difficulty. Animation sensitivity is typically stable.

**Parameters:**
- Cooldown: **Infinity** (permanent once triggered)
- Max applications: **1×**
- Effect: All CSS transitions become 0ms

**Code:**
```typescript
{
  id: 'motion_reduce',
  check: (signals) => signals.tremorScore >= 27,
  apply: (ui) => ({ ...ui, animations: false }),
  cooldown: Infinity,
  maxApplications: 1,
}
```

---

#### Rule 6: Cursor Enlarge

**Trigger:** `rageClickCount >= 1`

**Action:** Increase cursor scale (cursorScale += 0.5)

**Justification:** Rage clicks indicate frustration with small or hard-to-target UI elements. Enlarging the cursor improves target acquisition for users with motor difficulties.

**Parameters:**
- Cooldown: **120 seconds**
- Max applications: **2x**
- Progression: 1.0 -> 1.5 -> 2.0

**Code:**
```typescript
{
  id: 'cursor_enlarge',
  check: (signals) => signals.rageClickCount >= 1,
  apply: (ui) => ({ ...ui, cursorScale: Math.min(ui.cursorScale + 0.5, 2.0) }),
  cooldown: 120_000,
  maxApplications: 2,
}
```

---

#### Rule 7: Layout Simplify

**Trigger:** `idleSeconds >= 30`

**Action:** Enable simplified layout (layoutSimplified = true)

**Justification:** Extended idle time suggests cognitive overload or confusion. A simplified layout reduces visual complexity, helping users focus on primary content.

**Parameters:**
- Cooldown: **180 seconds**
- Max applications: **1x**
- Effect: Non-essential UI elements are hidden or collapsed

**Code:**
```typescript
{
  id: 'layout_simplify',
  check: (signals) => signals.idleSeconds >= 30,
  apply: (ui) => ({ ...ui, layoutSimplified: true }),
  cooldown: 180_000,
  maxApplications: 1,
}
```

---

#### Rule 8: Reading Aid

**Trigger:** `readingSpeed < 100` (words per minute)

**Action:** Enable reading guide overlay (readingGuide = true)

**Justification:** Reading speed below 100 wpm indicates significant comprehension difficulty. A reading guide (visual line highlight) helps users track their position in text, based on assistive technology principles.

**Parameters:**
- Cooldown: **180 seconds**
- Max applications: **1x**
- Effect: A horizontal reading guide follows the user's scroll position

**Code:**
```typescript
{
  id: 'reading_aid',
  check: (signals) => signals.readingSpeed > 0 && signals.readingSpeed < 100,
  apply: (ui) => ({ ...ui, readingGuide: true }),
  cooldown: 180_000,
  maxApplications: 1,
}
```

---

### Adaptation Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. New signal snapshot arrives (every 2.5s)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. For each rule (evaluated in order):                     │
│    a. Check cooldown: now - lastApplied < cooldown?        │
│       → Yes: Skip this rule                                 │
│       → No: Continue                                        │
│                                                             │
│    b. Check maxApplications: count >= max?                 │
│       → Yes: Skip this rule                                 │
│       → No: Continue                                        │
│                                                             │
│    c. Evaluate condition: rule.check(signals)              │
│       → False: Skip this rule                               │
│       → True: Continue                                      │
│                                                             │
│    d. Apply transformation: newState = rule.apply(uiState) │
│                                                             │
│    e. Check if state actually changed                       │
│       → No change: Skip (prevent no-op updates)            │
│       → Changed: Apply & log                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Update UI state in React Context                        │
│    dispatch({ type: 'APPLY_RULE', payload: newUIState })   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Apply to DOM via CSS custom properties                  │
│    document.documentElement.style.setProperty(...)          │
│    document.body.setAttribute('data-contrast', ...)         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Log adaptation event to backend                         │
│    studyLogger.log('adaptation_applied', { ... })           │
└─────────────────────────────────────────────────────────────┘
```

**Important:** Only **one rule** can trigger per cycle (break after first match) to prevent multiple simultaneous UI changes that could disorient users.

---

## User Interface

### Components

#### 1. Article Component
**Purpose:** Display reading content with dwell time tracking

**Features:**
- 5 sections with `data-section-id` attributes
- Adaptive font size: `font-size: var(--font-size-base)`
- Adaptive line height: `line-height: var(--line-height)`
- Responsive to all adaptations

**File:** `frontend/src/components/Article.tsx`

---

#### 2. Interaction Test Zone
**Purpose:** Test tap accuracy with interactive buttons

**Features:**
- 4 buttons marked with `data-interactive`
- Click counters for each button
- Adaptive padding: `padding: var(--button-padding)`
- Detects missed taps (clicks outside buttons)

**File:** `frontend/src/components/InteractionTestZone.tsx`

---

#### 3. Adaptation Monitor (Debug Panel)
**Purpose:** Real-time visualization for researchers

**Features:**
- Shows current signal values with threshold indicators:
  - 🟢 Below threshold (safe)
  - 🟡 Approaching threshold (70%+)
  - 🔴 Above threshold (may trigger)
- Displays current UI state (font, padding, contrast, etc.)
- Shows session ID and metadata
- Collapsible (doesn't interfere with study tasks)

**File:** `frontend/src/components/AdaptationMonitor.tsx`

---

### CSS Adaptation System

All UI adaptations use **CSS custom properties** for dynamic theming:

```css
:root {
  /* Updated dynamically by applyUIState() */
  --font-size-base: 16px;      /* 16-26px */
  --button-padding: 12px;      /* 12-36px */
  --line-height: 1.65;         /* 1.65-2.2 */
  --animate-duration: 200ms;   /* 200ms or 0ms */
}

/* Contrast levels via data attribute */
:root {
  --bg: #0f172a;
  --text: #cbd5e1;
}

[data-contrast="1"] {
  --bg: #060d1a;
  --text: #f1f5f9;
}

[data-contrast="2"] {
  --bg: #000000;
  --text: #ffffff;
}
```

**Usage in components:**
```jsx
<p style={{
  fontSize: 'var(--font-size-base)',
  lineHeight: 'var(--line-height)'
}}>
  Text content that adapts automatically
</p>
```

---

## Study Flow

The application now includes a complete study flow orchestrated by the `StudyFlow` page component and managed via `StudyContext`.

### Routes

React Router provides 3 routes:
- **`/`** (StudyFlow) - The main participant experience
- **`/dashboard`** - Researcher dashboard (passphrase-protected)
- **`/raw`** - Raw data view

### Study Flow Stages

The StudyFlow page guides participants through a structured sequence:

1. **ConsentScreen** - Informed consent with required acceptance
2. **WarmupPhase** - Familiarization tasks before data collection begins
3. **TaskRunner** - Executes structured tasks (find_answer, form_completion, navigation) using article content
4. **SUSQuestionnaire** - System Usability Scale (10 items, 0-100 score)
5. **NASATLXQuestionnaire** - NASA Task Load Index (6 dimensions)
6. **SessionSummary** - End-of-session overview

### Progress Tracking

The **ProgressTracker** component displays the current stage with step indicators, using `aria-current="step"` for accessibility.

### Content & Tasks

- **3 article sets:** Adaptive Interfaces, Digital Accessibility History, HCI Methods
- **Structured task types:** find_answer, form_completion, navigation
- Article assignment is deterministic based on participantId hash

**Key files:**
- `frontend/src/pages/StudyFlow.tsx`
- `frontend/src/context/StudyContext.tsx`
- `frontend/src/components/ConsentScreen.tsx`
- `frontend/src/components/WarmupPhase.tsx`
- `frontend/src/components/TaskRunner.tsx`
- `frontend/src/components/SUSQuestionnaire.tsx`
- `frontend/src/components/NASATLXQuestionnaire.tsx`
- `frontend/src/components/SessionSummary.tsx`
- `frontend/src/components/ProgressTracker.tsx`

---

## Dashboard

### Researcher Dashboard

Available at `/dashboard`, protected by passphrase (`ale-researcher-2024`).

**Components:**
- **SessionList** - Browse all study sessions, filter by participantId
- **SessionDetail** - Deep-dive into a single session's signals and adaptations
- **ComparisonView** - Side-by-side comparison of adaptive vs. control conditions
- **SummaryStats** - Aggregate statistics across all sessions

**Backend support:**
- `GET /analytics/summary` - Aggregated metrics endpoint
- `GET /sessions?participantId=P001` - Filter sessions by participant

---

## Visualizations

### New Visualization Components

Three new visualization components replace the emoji-based indicators in the AdaptationMonitor:

1. **SignalSparkline** - Recharts-based sparkline showing signal values over time. Renders a small inline line chart for each signal.

2. **ThresholdGauge** - SVG bar gauge showing current signal value relative to its threshold. Color-coded: green (safe), yellow (approaching), red (exceeded).

3. **AdaptationTimeline** - Timeline visualization of when adaptation rules were triggered during a session.

The enhanced **AdaptationMonitor** now uses sparklines and gauges for a more informative real-time display.

**Key files:**
- `frontend/src/components/SignalSparkline.tsx`
- `frontend/src/components/ThresholdGauge.tsx`
- `frontend/src/components/AdaptationTimeline.tsx`

---

## Data Flow

### Frontend to Backend

#### 1. Session Creation
**When:** User opens the app
**Endpoint:** `POST /sessions`

```javascript
fetch('/api/sessions', {
  method: 'POST',
  body: JSON.stringify({
    participantId: 'P001',
    condition: 'adaptive',      // or 'control'
    orderGroup: 'adaptive_first' // or 'control_first'
  })
})
// Response: { id: 'uuid', startedAt: '2024-03-07T...' }
```

#### 2. Event Logging (Batched)
**When:** Every 8 seconds + on page unload
**Endpoint:** `POST /events/batch`

```javascript
{
  sessionId: 'uuid',
  events: [
    {
      timestamp: '2024-03-07T12:00:00Z',
      eventType: 'signal_snapshot',
      payload: {
        signals: {
          zoomCount: 2,
          missedTapRate: 0.25,
          avgDwellSeconds: 5.3,
          scrollReversalRate: 0.15,
          tremorScore: 12.4,
          // ...
        }
      }
    },
    {
      timestamp: '2024-03-07T12:00:05Z',
      eventType: 'adaptation_applied',
      payload: {
        ruleId: 'font_scale',
        uiStateBefore: { fontSize: 16, ... },
        uiStateAfter: { fontSize: 18, ... },
        signals: { ... }
      }
    }
  ]
}
```

**Batching logic:**
- Buffer events in memory
- Flush every 8 seconds
- Also flush on `beforeunload` (page close)
- If flush fails, re-add events to buffer (retry)

**File:** `frontend/src/services/studyLogger.ts`

---

#### 3. Session Updates
**When:** After study tasks complete
**Endpoint:** `PATCH /sessions/:id`

```javascript
fetch('/api/sessions/uuid', {
  method: 'PATCH',
  body: JSON.stringify({
    susScore: 85,              // System Usability Scale (0-100)
    nasaTlx: {
      mental: 3,               // 1-7 scale
      physical: 2,
      temporal: 4,
      performance: 2,
      effort: 3,
      frustration: 2
    }
  })
})
```

---

### Backend Database Schema

#### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  participant_id VARCHAR(50),
  condition VARCHAR(20),           -- 'adaptive' | 'control'
  order_group VARCHAR(20),         -- 'adaptive_first' | 'control_first'
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  sus_score INTEGER,               -- 0-100
  nasa_tlx JSONB,                  -- { mental, physical, ... }
  metadata JSONB
);
```

#### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  timestamp TIMESTAMP,
  event_type VARCHAR(50),          -- 'signal_snapshot' | 'adaptation_applied' | 'task_completed' | 'questionnaire_completed' | 'consent_given' | 'warmup_completed' | 'study_phase_changed'
  payload JSONB,
  INDEX (session_id, timestamp)
);
```

#### Adaptations Table (Denormalized)
```sql
CREATE TABLE adaptations (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  rule_id VARCHAR(50),
  triggered_at TIMESTAMP,
  signals_snapshot JSONB,
  ui_state_before JSONB,
  ui_state_after JSONB,
  INDEX (session_id, rule_id)
);
```

---

### Data Export for Analysis

**Endpoint:** `GET /analytics/export?participantIds=P001,P002`

**Output:** CSV file with columns:
- `participant_id`
- `session_id`
- `condition` (adaptive | control)
- `order_group` (adaptive_first | control_first)
- `sus_score`
- `nasa_tlx_mental`, `nasa_tlx_physical`, etc.
- `adaptation_count`
- `first_adaptation_time` (seconds from start)
- `zoom_count_avg`
- `missed_tap_rate_avg`
- `dwell_seconds_avg`
- `scroll_reversal_rate_avg`
- `tremor_score_avg`
- `task_duration_avg`
- `task_errors_total`

**Usage in R:**
```r
data <- read.csv('study_data.csv')

# Wilcoxon signed-rank test (paired, within-subjects)
wilcox.test(sus_score ~ condition, data = data, paired = TRUE)

# Effect size
library(rstatix)
wilcox_effsize(data, sus_score ~ condition, paired = TRUE)
```

---

## Research Methodology

### Study Design

**Type:** Within-subjects, counterbalanced

**Why within-subjects?**
- Each participant experiences both conditions
- Controls for individual differences
- Higher statistical power with smaller sample size
- More efficient (n=12-15 vs. n=30+ for between-subjects)

**Counterbalancing:**
- Group A: Adaptive → Control
- Group B: Control → Adaptive
- Prevents order effects (learning, fatigue)

### Conditions

#### Adaptive Condition
- All 8 rules enabled
- UI adapts based on behavior signals
- Silent adaptation (no notifications)
- Debug panel available for researchers only

#### Control Condition
- All adaptations disabled
- Behavior still tracked (logged to backend)
- UI remains at default state throughout
- Identical appearance otherwise

**Implementation:**
```typescript
const enabled = condition === 'adaptive'; // true or false
const signals = useBehaviourCollector(sessionId, enabled);
const uiState = useAdaptationEngine(signals, enabled, sessionId);
```

### Measures

#### Primary
- **System Usability Scale (SUS):** 10-item questionnaire, 0-100 score
- **Task completion time:** Seconds per task, mean across 5 tasks
- **Error rate:** Failed inputs, missed taps, abandoned interactions

#### Secondary
- **NASA-TLX:** 6-dimension workload scale
  - Mental demand
  - Physical demand
  - Temporal demand
  - Performance
  - Effort
  - Frustration
- **Adaptation count:** Number of rules triggered
- **Time to first adaptation:** Seconds from session start

#### Objective (Backend)
- **Zoom events:** Total count per session
- **Missed tap rate:** Average across session
- **Dwell time:** Average per section
- **Scroll reversals:** Percentage per session
- **Tremor score:** Average variance

### Statistical Analysis

**Primary hypothesis:** Adaptive condition will have higher SUS scores than control

**Test:** Wilcoxon signed-rank test (non-parametric, paired)
- Appropriate for within-subjects design
- No assumption of normality (safe for n=12-15)
- Compares paired observations

**Effect size:** Calculate Cohen's d or report r = Z/√N

**Significance level:** α = 0.05

**Power:** Target 80% for medium effect size (d=0.5)

---

## Technical Implementation

### Key Technologies

**Frontend:**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **react-router-dom** - Client-side routing (3 routes)
- **Recharts** - Signal sparkline visualizations
- **Vitest** - Unit testing

**Backend:**
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **Swagger** - API documentation
- **Jest** - Unit testing

**Testing:**
- **@playwright/test** - E2E testing (3 spec files)
- **Vitest** - 121 frontend unit tests
- **Jest** - 19 backend unit tests

**Infrastructure:**
- **Docker Compose** - PostgreSQL container
- **npm workspaces** - Monorepo management

### Project Structure

```
ale/
├── frontend/
│   ├── src/
│   │   ├── components/          # UI components (15+)
│   │   │   ├── Article.tsx
│   │   │   ├── InteractionTestZone.tsx
│   │   │   ├── AdaptationMonitor.tsx   # Enhanced with sparklines/gauges
│   │   │   ├── ConsentScreen.tsx       # Study flow
│   │   │   ├── WarmupPhase.tsx
│   │   │   ├── TaskRunner.tsx
│   │   │   ├── SUSQuestionnaire.tsx
│   │   │   ├── NASATLXQuestionnaire.tsx
│   │   │   ├── SessionSummary.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   ├── SignalSparkline.tsx     # Recharts visualization
│   │   │   ├── ThresholdGauge.tsx      # SVG bar gauge
│   │   │   └── AdaptationTimeline.tsx
│   │   ├── context/
│   │   │   ├── AdaptationContext.tsx
│   │   │   └── StudyContext.tsx         # Experiment flow management
│   │   ├── pages/
│   │   │   ├── StudyFlow.tsx           # Main study orchestrator
│   │   │   └── Dashboard.tsx           # Researcher dashboard
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useBehaviourCollector.ts  # 9 signal detections
│   │   │   └── useAdaptationEngine.ts    # 8 rule evaluations
│   │   ├── engine/
│   │   │   └── rules.ts         # 8 adaptation rules
│   │   ├── data/
│   │   │   ├── sampleContent.ts
│   │   │   └── articles/        # 3 article sets
│   │   ├── utils/
│   │   │   ├── slidingWindow.ts        # Time-series data
│   │   │   ├── signalComputation.ts    # All 9 signal calculations
│   │   │   └── contrastValidator.ts    # WCAG validation
│   │   ├── services/
│   │   │   └── studyLogger.ts          # Event batching
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── constants.ts         # Thresholds + citations
│   ├── __tests__/               # 121 unit tests
│   └── e2e/                     # Playwright E2E tests (3 specs)
│
├── backend/
│   ├── src/
│   │   ├── sessions/            # Session CRUD + participantId filter
│   │   ├── events/              # Event logging
│   │   └── analytics/           # CSV export + GET /analytics/summary
│   ├── test/                    # 19 backend tests
│   └── ...
│
└── docker-compose.yml           # PostgreSQL service
```

### Performance Considerations

**Signal Computation:**
- Runs every 2.5 seconds (not too frequent)
- Sliding windows auto-prune old events
- Efficient O(n) calculations

**Event Batching:**
- Batch size: ~20 events per 8 seconds
- Reduces HTTP requests (1 request vs. 20)
- Payload size: ~2KB per batch

**Database Indexing:**
- Index on `(session_id, timestamp)` for fast queries
- Denormalized adaptations table for analytics

**React Performance:**
- Context for state (not prop drilling)
- Memoization where needed
- No unnecessary re-renders

---

## How to Use the App

### For Researchers

**1. Start the system:**
```bash
docker compose up -d
npm run dev:backend
npm run dev:frontend
```

**2. Open study session:**
- Adaptive: `http://localhost:5173?condition=adaptive`
- Control: `http://localhost:5173?condition=control`

**3. Monitor in real-time:**
- Click "📊 Debug Panel" (bottom-right)
- Watch signals approach thresholds
- See adaptations trigger live

**4. After session:**
```bash
curl http://localhost:3000/analytics/export > study_data.csv
```

**5. Analyze in R:**
```r
data <- read.csv('study_data.csv')
wilcox.test(sus_score ~ condition, data = data, paired = TRUE)
```

### For Participants

**Instructions:**
1. Read the article sections carefully
2. Interact with the buttons in the test zone
3. Complete the 5 tasks as instructed
4. The interface may change during your session — this is normal
5. After tasks, complete the SUS and NASA-TLX questionnaires

**No configuration needed** — the system adapts automatically based on your behavior.

---

## Example Scenario

### User Story: Low Vision User

**Minute 0-2:**
- User opens the app in adaptive mode
- Starts reading the article
- Text is small (16px baseline)
- User zooms in with Ctrl+Wheel to read better
- **Zoom count: 1**

**Minute 2-3:**
- User continues reading, zooms again
- **Zoom count: 2**
- User scrolls, zooms once more
- **Zoom count: 3** 🔴 (threshold reached)

**Minute 3:**
- **Rule triggers: font_scale**
- Font size increases: 16px → **18px**
- User notices text is more readable
- Console log: "🎯 Adaptation triggered: font_scale"
- Event logged to backend

**Minute 3-5:**
- User continues reading at new font size
- No more zooming needed
- Zoom count gradually decreases as events age out

**Minute 5:**
- Cooldown expires (120 seconds)
- If user zooms 3 more times, font scales again: 18px → **20px**

**Result:**
- User didn't open any settings
- System detected behavior pattern
- Adapted automatically
- Improved reading experience

---

## Accessibility Features

### WCAG 2.1 Level AA Compliance

✅ **1.4.3 Contrast (Minimum):** All text ≥ 4.5:1
- Level 0: 8.2:1
- Level 1: 10.5:1
- Level 2: 21:1

✅ **2.4.7 Focus Visible:** Keyboard focus indicators visible (3px blue outline)

✅ **2.5.5 Target Size:** Touch targets ≥ 44×44px after adaptation

✅ **2.1.1 Keyboard:** All functionality available via keyboard
- Tab/Shift+Tab for navigation
- Enter/Space for activation
- Escape to close debug panel

✅ **4.1.2 Name, Role, Value:** All components have proper ARIA labels

### Screen Reader Support

- Semantic HTML5 (`<article>`, `<section>`, `<header>`)
- Logical heading hierarchy (h1 → h2 → h3)
- Button labels clear and descriptive
- No empty links or buttons

---

## Validation

Run accessibility validation in browser console:
```javascript
runAccessibilityValidation()
```

**Output:**
```
🎨 WCAG Contrast Validation
✅ Level 0: 8.2:1 (target 4.5:1)
✅ Level 1: 10.5:1 (target 5.5:1)
✅ Level 2: 21:1 (target 7:1)

🔵 Accent Color (#38bdf8)
✅ All backgrounds: ≥ 3:1

👆 Touch Target Validation
✅ After adaptation: ≥ 44×44px

✅ ACCESSIBILITY VALIDATION PASSED
```

---

## Summary

The Adaptive Accessibility System combines:
1. **Real-time behavior detection** (9 signals)
2. **Research-justified adaptation rules** (8 rules with academic citations)
3. **Silent UI transformation** (no user configuration)
4. **Structured study flow** (consent, warmup, tasks, questionnaires)
5. **Researcher dashboard** (session comparison, summary statistics)
6. **Rich visualizations** (sparklines, gauges, adaptation timeline)
7. **Comprehensive data logging** (for research analysis)
8. **WCAG compliance** (Level AA verified)

**Result:** An intelligent interface that improves usability automatically by learning from user behavior.

**For thesis:** A complete implementation with 140 passing tests (121 frontend + 19 backend), ready for evaluation study to answer the research question: *Can behaviour-based UI adaptation improve usability?*

---

## Quick Reference

**Start app:**
```bash
docker compose up -d && npm run dev
```

**Open adaptive mode:**
```
http://localhost:5173?condition=adaptive
```

**Test adaptations:**
- Font: Ctrl+Wheel 3x
- Buttons: Miss 35% of taps
- Contrast: Read slowly + scroll up/down
- Spacing: Click with 18px variance
- Motion: Click with 27px variance
- Cursor: Rage-click same area rapidly
- Layout: Stay idle for 30+ seconds
- Reading guide: Read very slowly (< 100 wpm)

**Export data:**
```bash
curl http://localhost:3000/analytics/export > study_data.csv
```

**Validate accessibility:**
```javascript
runAccessibilityValidation() // in browser console
```

---

For more details, see:
- **FINAL_SUMMARY.md** - Complete system overview
- **COMPLETED.md** - Usage guide
- **ACCESSIBILITY_CHECKLIST.md** - WCAG verification
- **Code comments** - Inline documentation with citations
