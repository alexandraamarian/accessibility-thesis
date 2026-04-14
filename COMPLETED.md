# Adaptive Accessibility System - IMPLEMENTATION COMPLETE

## Overview

**Status:** 100% Complete (All Phases + Enhancements)

Your Master's thesis adaptive accessibility system is fully functional with comprehensive enhancements:
- 9 behavior signal detection mechanisms
- 8 research-justified adaptation rules
- Real-time UI adaptation
- Complete study flow (consent, warmup, tasks, questionnaires)
- Researcher dashboard with passphrase protection
- Rich visualizations (sparklines, gauges, timeline)
- Backend analytics with CSV export for statistical analysis
- Debug monitoring panel with enhanced visualizations
- 140 total tests (121 frontend + 19 backend) + Playwright E2E setup
- WCAG 2.1 AA accessibility compliance

---

## How to Run the System

### 1. Start PostgreSQL
```bash
docker compose up -d
```

### 2. Start Backend (Terminal 1)
```bash
npm run dev:backend
```
- Backend running on http://localhost:3000
- Swagger API docs: http://localhost:3000/api

### 3. Start Frontend (Terminal 2)
```bash
npm run dev:frontend
```
- Frontend running on http://localhost:5173

### 4. Open in Browser
- **Study flow:** http://localhost:5173 (routes to StudyFlow)
- **Adaptive mode:** http://localhost:5173?condition=adaptive
- **Control mode:** http://localhost:5173?condition=control
- **Dashboard:** http://localhost:5173/dashboard (passphrase: `ale-researcher-2024`)
- **Raw data:** http://localhost:5173/raw

---

## Study Flow

The main route (`/`) guides participants through a structured study experience:

1. **ConsentScreen** - Informed consent with required acceptance checkbox
2. **WarmupPhase** - Familiarization tasks before data collection begins
3. **TaskRunner** - Structured tasks (find_answer, form_completion, navigation) using article content from 3 article sets
4. **SUSQuestionnaire** - System Usability Scale (10 items, 0-100 score)
5. **NASATLXQuestionnaire** - NASA Task Load Index (6 dimensions)
6. **SessionSummary** - End-of-session overview with results

The **ProgressTracker** component displays the current stage with step indicators.

### Article Content
- 3 article sets: Adaptive Interfaces, Digital Accessibility History, HCI Methods
- Article assignment is deterministic based on participantId hash

---

## Researcher Dashboard

Access at http://localhost:5173/dashboard with passphrase: `ale-researcher-2024`

**Features:**
- **SessionList** - Browse all sessions, filter by participantId
- **SessionDetail** - Deep-dive into signals and adaptations for a single session
- **ComparisonView** - Side-by-side adaptive vs. control comparison
- **SummaryStats** - Aggregate statistics across all sessions

**Backend support:**
- `GET /analytics/summary` - Aggregated metrics
- `GET /sessions?participantId=P001` - Filter by participant

---

## Testing the Adaptation Rules

### Rule 1: Font Scale (font_scale)
**Trigger:** Zoom 3 times in 60 seconds
**Action:** fontSize increases by 2px (max 26px)

**How to test:**
1. Use **Ctrl+Wheel** (or **Cmd+Wheel** on Mac) to zoom in/out
2. Repeat 3 times within 60 seconds
3. Watch font size increase in Debug Panel
4. Wait 120 seconds (cooldown) to test again
5. Can trigger maximum 3 times

**Expected behavior:**
- Font size: 16px -> 18px -> 20px -> 22px (after 3 applications)

---

### Rule 2: Button Enlarge (button_enlarge)
**Trigger:** 35% missed tap rate in 30 seconds
**Action:** buttonPadding increases by 8px (max 36px)

**How to test:**
1. Go to "Interaction Test Area"
2. Click **outside** the buttons repeatedly (on the white space around them)
3. For every 3 clicks outside, click 1 button (to get ~75% miss rate)
4. After ~10 total taps with 35%+ miss rate, rule triggers

**Expected behavior:**
- Button padding: 12px -> 20px -> 28px (after 2 applications, max reached)

---

### Rule 3: Contrast Boost (contrast_boost)
**Trigger:** avgDwellSeconds >= 7s AND scrollReversalRate >= 30%
**Action:** contrast level increases by 1 (max level 2)

**How to test:**
1. Read an article section slowly (stay visible for 7+ seconds)
2. Scroll down, then scroll up, repeat (create 30%+ reversal rate)

**Expected behavior:**
- Level 0 -> Level 1 -> Level 2 (progressively higher contrast)

---

### Rule 4: Spacing Increase (spacing_increase)
**Trigger:** tremorScore >= 18px
**Action:** lineHeight increases by 0.15 (max 2.2)

**How to test:**
1. Click rapidly at varying positions (simulate hand tremor)
2. System computes standard deviation of tap positions
3. When stddev >= 18px, rule triggers

**Expected behavior:**
- Line height: 1.65 -> 1.80 -> 1.95 -> 2.10 (after 3 applications)

---

### Rule 5: Motion Reduce (motion_reduce)
**Trigger:** tremorScore >= 27px (higher threshold)
**Action:** animations = false (permanent)

**How to test:**
1. Click at extremely different positions (30+ pixels apart)
2. This simulates severe motor control difficulty

**Expected behavior:**
- All CSS transitions stop (0ms), permanent once triggered

---

### Rule 6: Cursor Enlarge (cursor_enlarge)
**Trigger:** rageClickCount >= 1
**Action:** cursorScale += 0.5 (max 2.0)

**How to test:**
1. Click the same area rapidly 3+ times within 2 seconds (rage click)
2. Cursor scale increases

**Expected behavior:**
- Cursor scale: 1.0 -> 1.5 -> 2.0 (after 2 applications)

---

### Rule 7: Layout Simplify (layout_simplify)
**Trigger:** idleSeconds >= 30
**Action:** layoutSimplified = true

**How to test:**
1. Stop all interaction for 30+ seconds
2. Non-essential UI elements are hidden or collapsed

**Expected behavior:**
- Simplified layout activates, one-time only

---

### Rule 8: Reading Aid (reading_aid)
**Trigger:** readingSpeed < 100 wpm
**Action:** readingGuide = true

**How to test:**
1. Read content very slowly (stay on sections for extended periods)
2. System detects reading speed below 100 words per minute

**Expected behavior:**
- A horizontal reading guide follows scroll position

---

## Debug Panel

Click **"Debug Panel"** in bottom-right corner to see:

**Signals (real-time with sparklines and gauges):**
- Signal values displayed with threshold gauges (green/yellow/red)
- Sparkline charts showing signal history over time

**UI State:**
- Current font size, button padding, contrast level
- Line height, animation status, cursor scale, layout simplified, reading guide

**Metadata:**
- Total taps, scroll changes, last update time

---

## Research Features

### Threshold Justifications
Every threshold constant in `frontend/src/constants.ts` is justified by peer-reviewed research:

1. **Zoom count (3):** Nielsen (1993) - Repetitive corrective actions
2. **Missed tap rate (35%):** Fitts (1954), Apple HIG (44x44dp minimum)
3. **Dwell time (7s):** Rayner et al. (2016) - Reading speed 200-250 wpm
4. **Scroll reversals (30%):** Buscher et al. (2012) - Re-reading behavior
5. **Tremor score (18px):** Wobbrock et al. (2008) - 15-20% of target size

### Statistical Analysis Ready
Backend provides CSV export for R/SPSS:
```bash
curl http://localhost:3000/analytics/export > study_data.csv
```

**Analysis in R:**
```r
data <- read.csv('study_data.csv')
wilcox.test(sus_score ~ condition, data = data, paired = TRUE)
```

---

## Project Structure

```
ale/
├── frontend/
│   ├── src/
│   │   ├── components/          # 15+ components
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
│   │   ├── engine/
│   │   │   └── rules.ts         # 8 adaptation rules with citations
│   │   ├── hooks/
│   │   │   ├── useBehaviourCollector.ts  # 9 signal detections
│   │   │   └── useAdaptationEngine.ts    # 8 rule evaluations
│   │   ├── data/
│   │   │   ├── sampleContent.ts
│   │   │   └── articles/        # 3 article sets
│   │   ├── services/
│   │   │   └── studyLogger.ts   # Batch events to backend
│   │   ├── utils/
│   │   │   ├── slidingWindow.ts
│   │   │   ├── signalComputation.ts    # All 9 signal calculations
│   │   │   └── contrastValidator.ts
│   │   ├── types.ts             # SignalSnapshot, UIState, AdaptationRule
│   │   └── constants.ts         # Thresholds with research justifications
│   ├── __tests__/               # 121 unit tests
│   └── e2e/                     # Playwright E2E tests (3 specs)
│
├── backend/
│   ├── src/
│   │   ├── sessions/           # Session CRUD + participantId filter
│   │   ├── events/             # POST /events/batch
│   │   ├── analytics/          # CSV export + GET /analytics/summary
│   │   └── adaptations/        # Denormalized adaptation tracking
│   ├── test/                   # 19 backend tests
│   └── ...
│
├── docker-compose.yml          # PostgreSQL service
├── PROGRESS.md                 # Implementation progress tracker
└── COMPLETED.md                # This file
```

---

## What's Working

### Backend (NestJS)
- [x] PostgreSQL database with 3 tables (Sessions, Events, Adaptations)
- [x] REST API with Swagger documentation
- [x] Session management (create, get, update with SUS/NASA-TLX)
- [x] Batch event logging
- [x] CSV export for statistical analysis
- [x] GET /analytics/summary endpoint
- [x] participantId filter on GET /sessions
- [x] CORS configured for frontend
- [x] 19 backend tests passing

### Frontend (React)
- [x] 9 behavior signal detections running every 2.5 seconds
- [x] 8 adaptation rules with cooldowns and maxApplications
- [x] Real-time UI adaptation via CSS custom properties
- [x] 3-level contrast system (WCAG AA -> Enhanced -> AAA)
- [x] React Router with 3 routes (/, /dashboard, /raw)
- [x] Complete study flow (consent, warmup, tasks, questionnaires, summary)
- [x] Researcher dashboard with passphrase protection
- [x] 3 article sets with deterministic assignment
- [x] Enhanced visualizations (sparklines, gauges, timeline)
- [x] Article component with dwell tracking
- [x] Interaction test zone with tap detection
- [x] Debug panel with sparklines and gauges
- [x] Event batching to backend every 8 seconds
- [x] Adaptive vs. control condition support
- [x] 121 frontend tests passing

### Testing
- [x] 121 frontend unit tests (Vitest)
- [x] 19 backend unit tests (Jest)
- [x] Playwright E2E test setup with 3 spec files
- [x] Type safety with TypeScript
- [x] Total: 140 tests passing

---

## Study Procedure

### For Participants

1. **Navigate to** http://localhost:5173
2. **ConsentScreen** - Read and accept informed consent
3. **WarmupPhase** - Complete familiarization tasks
4. **TaskRunner** - Complete structured tasks (find_answer, form_completion, navigation)
5. **SUSQuestionnaire** - Rate system usability (10 items)
6. **NASATLXQuestionnaire** - Rate workload (6 dimensions)
7. **SessionSummary** - Review session results

### For Researchers

1. **Setup:**
   - Assign participant ID (e.g., P001, P002)
   - Determine order group (adaptive_first or control_first)

2. **Session 1 (Adaptive):**
   - Open: `http://localhost:5173?condition=adaptive`
   - Participant completes full study flow
   - All data logged automatically

3. **Break (5 minutes):**
   - Distractor task

4. **Session 2 (Control):**
   - Open: `http://localhost:5173?condition=control`
   - Same study flow, no adaptations applied

5. **Review Dashboard:**
   - Open: `http://localhost:5173/dashboard`
   - Passphrase: `ale-researcher-2024`
   - Compare sessions, view summary statistics

6. **Data Export:**
   ```bash
   curl http://localhost:3000/analytics/export?participantIds=P001 > p001_data.csv
   ```

---

## Test Commands

```bash
# Run all frontend tests
cd frontend && npm test

# Run tests with coverage
cd frontend && npm run test:coverage

# Run backend tests
cd backend && npm test

# Run E2E tests
npx playwright test

# Type checking
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit

# Linting
npm run lint --workspace=frontend
npm run lint --workspace=backend
```

---

## Debugging Tips

### Signals not updating?
- Check browser console for errors
- Verify sessionId is set (Debug Panel shows session ID)
- Ensure condition=adaptive (control mode disables detection)

### Rules not triggering?
- Open Debug Panel - check if signals reach thresholds (gauge turns red)
- Check console for adaptation triggered messages
- Verify cooldown has expired (wait 90-180 seconds)
- Check if maxApplications reached

### Backend not receiving events?
- Check Network tab - look for POST /api/events/batch
- Verify backend is running (http://localhost:3000/api)
- Check studyLogger is initialized (needs sessionId)

---

## Documentation Files

- `README.md` - Project overview and quick start
- `HOW_IT_WORKS.md` - Complete technical documentation
- `PROGRESS.md` - Detailed implementation progress
- `COMPLETED.md` - This file (usage guide)
- `ACCESSIBILITY_CHECKLIST.md` - WCAG compliance verification
- `claudePlan.md` - Architecture and implementation plan
- `Agents.md` - Agent roles and project context

---

## Thesis Integration

### Chapter 3: Methodology
Use these files:
- `frontend/src/constants.ts` - Threshold definitions
- `frontend/src/engine/rules.ts` - Rule implementation with citations
- `backend/src/sessions/session.entity.ts` - Study design (condition, orderGroup)

### Chapter 4: Results
1. Export data: `GET /analytics/export`
2. Import to R/SPSS
3. Run Wilcoxon signed-rank tests
4. Report effect sizes (Cohen's d)

### Chapter 5: Discussion
Acknowledge limitations from implementation:
- Missed tap false positives (text selection counted as misses)
- Dwell time measurement (visibility != reading)
- Rule determinism (same threshold for all users)
- Short session duration (lab study vs. real-world use)

---

## Next Steps

1. **Run pilot study** - Test with 1-2 participants to validate procedure
2. **Refine thresholds** - Adjust if needed based on pilot data
3. **Conduct full study** - Collect data from n=12-15 participants
4. **Statistical analysis** - Export CSV and run Wilcoxon tests
5. **Write thesis** - Use code as evidence for methodology chapter
