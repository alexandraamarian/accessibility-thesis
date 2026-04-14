# Implementation Plan: Adaptive Accessibility System

## Context

This is a full-stack web application for a Software Engineering Master's thesis investigating the research question: **"Can behaviour-based UI adaptation improve usability?"**

The system will:
- Detect 9 types of user behavior in real-time (zoom gestures, missed taps, reading dwell time, scroll reversals, tap tremor, rage clicks, mouse hesitation, idle time, reading speed)
- Apply 8 adaptation rules to silently adjust the UI (font scaling, button enlargement, contrast boost, spacing increase, motion reduction, cursor enlargement, layout simplification, reading aid)
- Log all behavior signals and adaptations to a backend for research analytics
- Support a within-subjects evaluation study (n=12-15 participants, adaptive vs. control conditions)
- Export study data to CSV for statistical analysis (Wilcoxon signed-rank tests in R/SPSS)

**Current State:** Fully implemented with all enhancement phases complete (100%).

**Tech Stack:** React 18 + Vite + TypeScript + TailwindCSS + react-router-dom + Recharts (frontend), NestJS + TypeORM + PostgreSQL (backend), Docker Compose (infrastructure), @playwright/test (E2E testing).

**Design Principle:** Rule-based adaptation only (no ML/AI) — more defensible for thesis scope with explicit threshold justifications from WCAG standards and peer-reviewed research (Fitts's Law, Wobbrock et al., Nielsen usability studies).

---

## Key Architectural Decisions

### 1. State Management
**Decision:** React Context API + useReducer for UI state

**Rationale:** Small app scope (single-page), UI state shared between useAdaptationEngine (writes) and all components (reads). No external library needed.

### 2. Event Batching
**Decision:** Flush behavior events to backend every 8 seconds + on window.beforeunload

**Rationale:** Aligns with tremor detection window (no missed signals), balances granularity with backend load.

### 3. Database Schema
**Three main entities:**

- **Sessions:** `id`, `participantId`, `condition` ('adaptive'|'control'), `orderGroup` ('adaptive_first'|'control_first'), timestamps, `susScore`, `nasaTlx` JSONB
- **Events:** `id`, `sessionId`, `timestamp`, `eventType` ('signal_snapshot'|'adaptation_applied'|'task_completed'|'questionnaire_completed'|'consent_given'|'warmup_completed'|'study_phase_changed'), `payload` JSONB
- **Adaptations:** Denormalized table for fast analytics queries with `ruleId`, `triggeredAt`, `signalsSnapshot`, `uiStateBefore`, `uiStateAfter`

### 4. Contrast Implementation
**Decision:** CSS custom properties scoped by `[data-contrast]` attribute

Three levels:
- Level 0: `--bg: #0f172a`, `--text: #cbd5e1` (WCAG AA, 4.5:1)
- Level 1: `--bg: #060d1a`, `--text: #f1f5f9` (enhanced, 5.5:1)
- Level 2: `--bg: #000000`, `--text: #ffffff` (WCAG AAA, 21:1)

### 5. API Contract

**POST /sessions** → `{ sessionId, startedAt }`

**POST /events/batch** → Accept array of `{ timestamp, eventType, payload }`

**GET /analytics/sessions/:id** → Session + events + adaptations

**GET /analytics/export?participantIds=...** → CSV file for R/SPSS with columns: `participant_id`, `condition`, `order_group`, `sus_score`, `nasa_tlx_mental`, `adaptation_count`, `zoom_events_total`, `missed_tap_rate_avg`, etc.

---

## Implementation Phases

### Phase 1: Project Infrastructure (2-3 hours)

**Goals:** Initialize repository structure, configure tooling, set up Docker Compose for PostgreSQL

**Critical Files:**
1. `/Users/mgurita/code/ale/package.json` - Root workspace with `frontend` and `backend` workspaces
2. `/Users/mgurita/code/ale/docker-compose.yml` - PostgreSQL service (image: postgres:15-alpine, port 5432)
3. `/Users/mgurita/code/ale/.gitignore` - node_modules, .env, dist, build, .DS_Store
4. `/Users/mgurita/code/ale/.prettierrc.json` - Code formatting config
5. `/Users/mgurita/code/ale/.eslintrc.json` - Linting rules (TypeScript, React)
6. `/Users/mgurita/code/ale/tsconfig.base.json` - Shared TypeScript config

**Verification:**
- `docker compose up -d` → PostgreSQL running on localhost:5432
- `npm install` → Workspaces recognized
- `git status` → Clean ignore patterns

---

### Phase 2: Backend Foundation (4-5 hours)

**Goals:** NestJS scaffold with TypeORM, Sessions module, Events module, Swagger docs

**Critical Files:**
1. `backend/src/main.ts` - Bootstrap NestJS app with Swagger on port 3000
2. `backend/src/app.module.ts` - Import DatabaseModule, SessionsModule, EventsModule
3. `backend/src/database/database.module.ts` - TypeORM config (connect to PostgreSQL)
4. `backend/src/sessions/session.entity.ts` - Session table with `participantId`, `condition`, `orderGroup`, `susScore`, `nasaTlx` JSONB
5. `backend/src/sessions/sessions.service.ts` - CRUD operations for sessions
6. `backend/src/sessions/sessions.controller.ts` - POST /sessions, GET /sessions/:id, PATCH /sessions/:id
7. `backend/src/events/event.entity.ts` - Event table with `sessionId` FK, `timestamp`, `eventType`, `payload` JSONB
8. `backend/src/events/events.service.ts` - Bulk insert for batch events
9. `backend/src/events/events.controller.ts` - POST /events/batch

**Key Pattern (Session Entity):**
```typescript
@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'participant_id' }) participantId: string;
  @Column({ type: 'varchar', length: 20 }) condition: 'adaptive' | 'control';
  @Column({ name: 'order_group' }) orderGroup: 'adaptive_first' | 'control_first';
  @Column({ name: 'started_at', default: () => 'CURRENT_TIMESTAMP' }) startedAt: Date;
  @Column({ name: 'ended_at', nullable: true }) endedAt: Date | null;
  @Column({ name: 'sus_score', nullable: true }) susScore: number | null;
  @Column({ name: 'nasa_tlx', type: 'jsonb', nullable: true }) nasaTlx: object | null;
  @OneToMany(() => Event, event => event.session) events: Event[];
}
```

**Verification:**
- `npm run start:dev --workspace=backend` → Server starts on :3000
- `curl -X POST http://localhost:3000/sessions -d '{"participantId":"P001","condition":"adaptive","orderGroup":"adaptive_first"}' -H "Content-Type: application/json"` → Returns `{ sessionId: "..." }`
- Swagger docs available at http://localhost:3000/api

---

### Phase 3: Frontend Foundation (3-4 hours)

**Goals:** Vite + React + TypeScript scaffold, TailwindCSS, type definitions, AdaptationContext

**Critical Files:**
1. `frontend/package.json` - Dependencies: react@18, vite, tailwindcss, vitest
2. `frontend/vite.config.ts` - Proxy `/api` to `http://localhost:3000`
3. `frontend/tailwind.config.js` - Extend theme with `accent: #38bdf8`
4. `frontend/src/main.tsx` - React root render
5. `frontend/src/App.tsx` - Main component with AdaptationProvider
6. `frontend/src/index.css` - CSS custom properties for contrast levels + TailwindCSS imports
7. `frontend/src/types.ts` - **CRITICAL**: SignalSnapshot, UIState, AdaptationRule, EventLog interfaces
8. `frontend/src/context/AdaptationContext.tsx` - Context + useReducer for UI state management
9. `frontend/src/constants.ts` - DEFAULT_UI, THRESHOLDS, intervals
10. `frontend/.env.local` - `VITE_API_URL=http://localhost:3000`

**Key Type Definitions:**
```typescript
export interface SignalSnapshot {
  zoomCount: number;
  missedTapRate: number;
  avgDwellSeconds: number;
  scrollReversalRate: number;
  tremorScore: number;
  rageClickCount: number;         // 2s window bursts
  mouseHesitationScore: number;   // 10s hover pauses
  idleSeconds: number;            // 60s of inactivity
  readingSpeed: number;           // words per minute (90s window)
  totalTaps: number;
  totalScrollChanges: number;
  timestamp: number;
}

export interface UIState {
  fontSize: number;        // px, 16-26
  buttonPadding: number;   // px, 12-36
  contrast: number;        // 0|1|2
  lineHeight: number;      // 1.65-2.2
  animations: boolean;
  cursorScale: number;     // 1.0-2.0
  layoutSimplified: boolean;
  readingGuide: boolean;
}

export interface AdaptationRule {
  id: 'font_scale' | 'button_enlarge' | 'contrast_boost' | 'spacing_increase' | 'motion_reduce' | 'cursor_enlarge' | 'layout_simplify' | 'reading_aid';
  check: (signals: SignalSnapshot) => boolean;
  apply: (ui: UIState) => UIState;
  cooldown: number;
  maxApplications: number;
}
```

**Contrast CSS (index.css):**
```css
:root {
  --bg: #0f172a;
  --text: #cbd5e1;
  --accent: #38bdf8;
}

[data-contrast="1"] {
  --bg: #060d1a;
  --text: #f1f5f9;
}

[data-contrast="2"] {
  --bg: #000000;
  --text: #ffffff;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**Verification:**
- `npm run dev --workspace=frontend` → Dev server on :5173
- Navigate to http://localhost:5173 → App renders without errors
- `tsc --noEmit` → Type checking passes

---

### Phase 4: Behavior Detection (6-8 hours)

**Goals:** Implement useBehaviourCollector hook with all 9 signal types, sliding window logic, studyLogger service

**Critical Files:**
1. `frontend/src/hooks/useBehaviourCollector.ts` - **MOST COMPLEX FILE**: Event listeners for zoom, taps, scroll, dwell tracking via IntersectionObserver, rage clicks, mouse hesitation, idle detection, reading speed
2. `frontend/src/services/studyLogger.ts` - Batch events to backend every 8s + on beforeunload
3. `frontend/src/utils/slidingWindow.ts` - Generic sliding window data structure for time-series signals
4. `frontend/src/utils/signalComputation.ts` - Compute tremor score (stddev), missed tap rate, avg dwell, reversal rate

**Signal Detection Logic:**

- **Zoom:** Listen to `wheel` event with `e.ctrlKey` + `gesturestart` for Safari pinch
- **Missed Taps:** `pointerdown` event, check if `e.target.closest('button, a, input, [data-interactive]')` is null
- **Dwell Time:** IntersectionObserver with `threshold: [0.6]` on elements with `data-section-id` attribute
- **Scroll Reversals:** Track scroll direction changes (up after down = reversal)
- **Tremor Score:** Compute `sqrt(var(x) + var(y))` of tap positions in 8s window

**Sliding Window Implementation:**
```typescript
export class SlidingWindow<T> {
  private events: Array<{ timestamp: number; data: T }> = [];

  constructor(private windowMs: number) {}

  add(data: T, timestamp = Date.now()) {
    this.events.push({ timestamp, data });
    this.prune(timestamp);
  }

  private prune(now: number) {
    const cutoff = now - this.windowMs;
    this.events = this.events.filter(e => e.timestamp >= cutoff);
  }

  getAll(now = Date.now()): T[] {
    this.prune(now);
    return this.events.map(e => e.data);
  }
}
```

**Signal Computation (every 2.5s):**
```typescript
const interval = setInterval(() => {
  const snapshot = {
    zoomCount: zoomWindow.count(),
    missedTapRate: tapWindow.getAll().filter(t => t.missed).length / tapWindow.count(),
    avgDwellSeconds: computeAvgDwell(dwellEvents),
    scrollReversalRate: scrollReversalWindow.count() / scrollTotalWindow.count(),
    tremorScore: computeStdDev(tapPositions),
    totalTaps: tapWindow.count(),
    totalScrollChanges: scrollTotalWindow.count(),
    timestamp: Date.now(),
  };
  setSignals(snapshot);
  studyLogger.log('signal_snapshot', { signals: snapshot });
}, 2500);
```

**Verification:**
- Unit test: SlidingWindow with 5s window, add 10 events 1s apart, verify 5 remain after 6s
- Unit test: Tremor score with fixed tap positions `[(0,0), (10,0), (0,10)]` → sqrt(50) ≈ 7.07px
- Manual test: Simulate 3 zooms with Ctrl+Wheel, verify `signals.zoomCount === 3` in console

---

### Phase 5: Adaptation Engine (5-6 hours)

**Goals:** Implement 8 adaptation rules, useAdaptationEngine hook with cooldown management, apply UI state to DOM

**Critical Files:**
1. `frontend/src/engine/rules.ts` - **RESEARCH CORE**: 8 rule definitions with threshold constants (each constant must have citation comment from AgentAccessibility.md)
2. `frontend/src/hooks/useAdaptationEngine.ts` - Rule evaluation loop, cooldown tracking, maxApplications enforcement
3. `frontend/src/utils/applyUIState.ts` - Set CSS custom properties + data-contrast attribute

**Rule Definitions (rules.ts):**
```typescript
export const RULES: AdaptationRule[] = [
  {
    id: 'font_scale',
    // T.zoomCount: 3 events in 60s window
    // Cite: Nielsen (1993) repetitive corrective action pattern
    check: (s) => s.zoomCount >= 3,
    apply: (ui) => ({ ...ui, fontSize: Math.min(ui.fontSize + 2, 26) }),
    cooldown: 120_000,
    maxApplications: 3,
  },
  {
    id: 'button_enlarge',
    // T.missedTapRate: 0.35 (35% miss rate)
    // Cite: Fitts (1954) — below 44px targets, error rate rises non-linearly
    check: (s) => s.missedTapRate >= 0.35,
    apply: (ui) => ({ ...ui, buttonPadding: Math.min(ui.buttonPadding + 8, 36) }),
    cooldown: 90_000,
    maxApplications: 2,
  },
  {
    id: 'contrast_boost',
    // Combined signal: dwell ≥ 7s AND reversals ≥ 30%
    // Cite: Rayner et al. (2016) reading speed, Buscher et al. (2012) scroll reversals
    check: (s) => s.avgDwellSeconds >= 7 && s.scrollReversalRate >= 0.30,
    apply: (ui) => ({ ...ui, contrast: Math.min(ui.contrast + 1, 2) }),
    cooldown: 180_000,
    maxApplications: 2,
  },
  {
    id: 'spacing_increase',
    // T.tremorScore: 18px std-dev
    // Cite: Wobbrock et al. (2008) — 15-20% of target size is impairment threshold
    check: (s) => s.tremorScore >= 18,
    apply: (ui) => ({ ...ui, lineHeight: Math.min(ui.lineHeight + 0.15, 2.2) }),
    cooldown: 150_000,
    maxApplications: 3,
  },
  {
    id: 'motion_reduce',
    check: (s) => s.tremorScore >= 27,
    apply: (ui) => ({ ...ui, animations: false }),
    cooldown: Infinity,
    maxApplications: 1,
  },
  {
    id: 'cursor_enlarge',
    check: (s) => s.rageClickCount >= 1,
    apply: (ui) => ({ ...ui, cursorScale: Math.min(ui.cursorScale + 0.5, 2.0) }),
    cooldown: 120_000,
    maxApplications: 2,
  },
  {
    id: 'layout_simplify',
    check: (s) => s.idleSeconds >= 30,
    apply: (ui) => ({ ...ui, layoutSimplified: true }),
    cooldown: 180_000,
    maxApplications: 1,
  },
  {
    id: 'reading_aid',
    check: (s) => s.readingSpeed > 0 && s.readingSpeed < 100,
    apply: (ui) => ({ ...ui, readingGuide: true }),
    cooldown: 180_000,
    maxApplications: 1,
  },
];
```

**Adaptation Engine Hook:**
```typescript
export function useAdaptationEngine(signals: SignalSnapshot, enabled: boolean, sessionId: string | null) {
  const { uiState, dispatch } = useContext(AdaptationContext);
  const cooldowns = useRef<Map<string, { lastApplied: number; count: number }>>(new Map());

  useEffect(() => {
    if (!enabled || !sessionId) return;

    for (const rule of RULES) {
      const cd = cooldowns.current.get(rule.id) || { lastApplied: 0, count: 0 };

      if (Date.now() - cd.lastApplied < rule.cooldown) continue;
      if (cd.count >= rule.maxApplications) continue;
      if (!rule.check(signals)) continue;

      const newUIState = rule.apply(uiState);
      if (JSON.stringify(newUIState) !== JSON.stringify(uiState)) {
        dispatch({ type: 'APPLY_RULE', payload: newUIState });
        cooldowns.current.set(rule.id, { lastApplied: Date.now(), count: cd.count + 1 });
        studyLogger.log('adaptation_applied', { ruleId: rule.id, uiStateBefore: uiState, uiStateAfter: newUIState, signals });
      }
    }
  }, [signals, enabled, sessionId]);

  return uiState;
}
```

**Apply UI State to DOM:**
```typescript
export function applyUIState(ui: UIState) {
  const root = document.documentElement;
  root.style.setProperty('--font-size-base', `${ui.fontSize}px`);
  root.style.setProperty('--button-padding', `${ui.buttonPadding}px`);
  root.style.setProperty('--line-height', ui.lineHeight.toString());
  root.style.setProperty('--animate-duration', ui.animations ? '200ms' : '0ms');
  root.style.setProperty('--cursor-scale', ui.cursorScale.toString());
  document.body.setAttribute('data-contrast', ui.contrast.toString());
  document.body.setAttribute('data-layout-simplified', ui.layoutSimplified.toString());
  document.body.setAttribute('data-reading-guide', ui.readingGuide.toString());
}
```

**Verification:**
- Unit test: Each rule.check() with threshold boundary (zoomCount: 2 → false, 3 → true)
- Unit test: rule.apply() with max clamping (fontSize: 24 + 2 → 26, 26 + 2 → 26)
- Unit test: Cooldown enforcement (apply rule, advance time 119s, verify blocked; advance to 120s, verify allowed)
- Integration test: Mock signals with zoomCount=3 → verify uiState.fontSize increases → verify CSS variable updated

---

### Phase 6: UI Components (6-8 hours)

**Goals:** Article with section tracking, InteractionTestZone, AdaptationMonitor debug panel

**Critical Files:**
1. `frontend/src/components/Article.tsx` - Render content with `data-section-id` attributes for dwell tracking
2. `frontend/src/components/InteractionTestZone.tsx` - Buttons/forms for testing tap accuracy
3. `frontend/src/components/AdaptationMonitor.tsx` - Collapsible debug panel showing signals + UI state
4. `frontend/src/components/Button.tsx` - Styled button component using `var(--button-padding)`

**Article Component:**
```typescript
export function Article({ content }: { content: { sections: Array<{ id: string; heading: string; paragraphs: string[] }> } }) {
  return (
    <article className="max-w-3xl mx-auto px-4">
      {content.sections.map((section) => (
        <section key={section.id} data-section-id={section.id} className="mb-8">
          <h2 style={{ fontSize: 'calc(var(--font-size-base) * 1.5)' }}>{section.heading}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
```

**InteractionTestZone Component:**
```typescript
export function InteractionTestZone() {
  return (
    <div className="border-2 border-accent p-8 rounded-lg" data-interactive>
      <h3>Interaction Test Area</h3>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((n) => (
          <button key={n} style={{ padding: 'var(--button-padding)' }}>Button {n}</button>
        ))}
      </div>
    </div>
  );
}
```

**AdaptationMonitor Component:**
```typescript
export function AdaptationMonitor({ signals, uiState, sessionId }) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return <button onClick={() => setExpanded(true)}>Debug Panel</button>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-bg border-accent p-4" data-interactive>
      <button onClick={() => setExpanded(false)}>Close</button>
      <div>
        <strong>Signals:</strong>
        <ul>
          <li>Zoom: {signals.zoomCount}</li>
          <li>Missed Taps: {(signals.missedTapRate * 100).toFixed(1)}%</li>
          <li>Dwell: {signals.avgDwellSeconds.toFixed(1)}s</li>
          <li>Reversals: {(signals.scrollReversalRate * 100).toFixed(1)}%</li>
          <li>Tremor: {signals.tremorScore.toFixed(1)}px</li>
        </ul>
      </div>
      <div>
        <strong>UI State:</strong>
        <ul>
          <li>Font: {uiState.fontSize}px</li>
          <li>Padding: {uiState.buttonPadding}px</li>
          <li>Contrast: Level {uiState.contrast}</li>
        </ul>
      </div>
    </div>
  );
}
```

**Integrate in App.tsx:**
```typescript
export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [condition, setCondition] = useState<'adaptive' | 'control'>('adaptive');
  const enabled = condition === 'adaptive';

  useEffect(() => {
    fetch('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ participantId: 'TEST', condition, orderGroup: 'adaptive_first' }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(data => setSessionId(data.sessionId));
  }, []);

  const signals = useBehaviourCollector(sessionId, enabled);
  const uiState = useAdaptationEngine(signals, enabled, sessionId);

  useEffect(() => {
    applyUIState(uiState);
  }, [uiState]);

  return (
    <AdaptationProvider>
      <Article content={sampleContent} />
      <InteractionTestZone />
      <AdaptationMonitor signals={signals} uiState={uiState} sessionId={sessionId} />
    </AdaptationProvider>
  );
}
```

**Verification:**
- Component test: Article renders with `data-section-id` attributes
- Component test: AdaptationMonitor toggle expand/collapse
- Manual test: Open app, verify debug panel shows signals updating every 2.5s

---

### Phase 7: Backend Analytics (5-6 hours)

**Goals:** Analytics module, session query endpoint, CSV export for R/SPSS statistical analysis

**Critical Files:**
1. `backend/src/analytics/analytics.module.ts` - Import TypeORM repositories
2. `backend/src/analytics/analytics.service.ts` - **RESEARCH CRITICAL**: CSV export with all required columns for Wilcoxon tests
3. `backend/src/analytics/analytics.controller.ts` - GET /analytics/sessions/:id, GET /analytics/export
4. `backend/src/adaptations/adaptation.entity.ts` - Denormalized table for fast queries

**Adaptation Entity (Denormalized):**
```typescript
@Entity('adaptations')
export class Adaptation {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'uuid' }) sessionId: string;
  @Column() ruleId: string;
  @Column({ type: 'timestamp' }) triggeredAt: Date;
  @Column({ type: 'jsonb' }) signalsSnapshot: object;
  @Column({ type: 'jsonb' }) uiStateBefore: object;
  @Column({ type: 'jsonb' }) uiStateAfter: object;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'sessionId' })
  session: Session;
}
```

**CSV Export Service (analytics.service.ts):**
```typescript
async exportCSV(participantIds?: string[]): Promise<string> {
  const query = this.sessionRepository
    .createQueryBuilder('session')
    .leftJoinAndSelect('session.events', 'event')
    .leftJoinAndSelect('session.adaptations', 'adaptation');

  if (participantIds?.length) {
    query.where('session.participantId IN (:...ids)', { ids: participantIds });
  }

  const sessions = await query.getMany();

  const rows = sessions.map(session => {
    const signalSnapshots = session.events.filter(e => e.eventType === 'signal_snapshot');
    const avgMissedTapRate = signalSnapshots.reduce((sum, e) => sum + e.payload.signals.missedTapRate, 0) / signalSnapshots.length;

    return {
      participant_id: session.participantId,
      session_id: session.id,
      condition: session.condition,
      order_group: session.orderGroup,
      sus_score: session.susScore,
      nasa_tlx_mental: session.nasaTlx?.mental,
      nasa_tlx_physical: session.nasaTlx?.physical,
      adaptation_count: session.adaptations.length,
      first_adaptation_time: session.adaptations[0] ? (new Date(session.adaptations[0].triggeredAt).getTime() - new Date(session.startedAt).getTime()) / 1000 : null,
      zoom_events_total: this.sumSignalField(signalSnapshots, 'zoomCount'),
      missed_tap_rate_avg: avgMissedTapRate,
    };
  });

  return this.jsonToCSV(rows);
}

private jsonToCSV(data: object[]): string {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => typeof v === 'string' ? `"${v}"` : v ?? '').join(','));
  return [headers, ...rows].join('\n');
}
```

**Verification:**
- Integration test: GET /analytics/sessions/:id returns events and adaptations
- Integration test: GET /analytics/export returns CSV with correct headers
- Manual test: Import CSV into R, verify Wilcoxon test runs: `wilcox.test(sus_score ~ condition, data=df, paired=TRUE)`

---

### Phase 8: Accessibility & Polish (6-8 hours)

**Goals:** WCAG 2.1 AA compliance verification, keyboard navigation, focus indicators, screen reader testing

**Critical Files:**
1. `frontend/src/utils/contrastValidator.ts` - Programmatic contrast ratio calculator
2. `frontend/src/styles/focus.css` - Focus styles with 3:1 contrast ratio
3. `ACCESSIBILITY_CHECKLIST.md` - WCAG compliance verification checklist

**Contrast Validator:**
```typescript
export function contrastRatio(hex1: string, hex2: string): number {
  const luminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    const linearize = (c: number) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  };
  const [l1, l2] = [luminance(hex1), luminance(hex2)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function validateContrastLevels() {
  const levels = [
    ['Level 0', { bg: '#0f172a', fg: '#cbd5e1' }, 4.5],
    ['Level 1', { bg: '#060d1a', fg: '#f1f5f9' }, 5.5],
    ['Level 2', { bg: '#000000', fg: '#ffffff' }, 7.0],
  ];
  return levels.every(([name, pair, target]) => contrastRatio(pair.bg, pair.fg) >= target);
}
```

**Focus Styles (focus.css):**
```css
*:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

button:focus-visible {
  box-shadow: 0 0 0 3px var(--bg), 0 0 0 6px var(--accent);
}
```

**Accessibility Checklist:**
- [ ] Contrast Level 0: ≥ 4.5:1 (verify with contrastValidator.ts)
- [ ] Contrast Level 1: ≥ 5.5:1
- [ ] Contrast Level 2: ≥ 7:1
- [ ] Focus indicators visible at all contrast levels
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader: Test with NVDA/VoiceOver
- [ ] Touch targets: Baseline buttons ≥ 44×44px
- [ ] No keyboard traps in AdaptationMonitor

**Verification:**
- Automated: Run `validateContrastLevels()` in console → all pass
- Automated: Lighthouse accessibility audit → score ≥ 95
- Manual: Tab through app without mouse → all elements reachable
- Manual: Open NVDA → read Article content → verify section headings announced

---

## Critical Files Summary

**Most Important Files (Architectural Anchors):**

1. **frontend/src/types.ts** - Core type contracts (SignalSnapshot, UIState, AdaptationRule)
2. **frontend/src/engine/rules.ts** - The 8 adaptation rules with research-justified thresholds
3. **frontend/src/hooks/useBehaviourCollector.ts** - All 9 signal detection mechanisms
4. **frontend/src/context/StudyContext.tsx** - Experiment flow management
5. **frontend/src/pages/StudyFlow.tsx** - Main study orchestrator
6. **backend/src/sessions/session.entity.ts** - Database schema foundation
7. **backend/src/analytics/analytics.service.ts** - CSV export + summary endpoint for thesis statistical analysis

**Reusable Utilities:**
- `frontend/src/utils/slidingWindow.ts` - Time-series data structure
- `frontend/src/utils/signalComputation.ts` - Tremor stddev, dwell avg, reversal rate
- `frontend/src/utils/contrastValidator.ts` - WCAG ratio verification

---

## Verification Strategy

### After Each Phase

**Phase 1:** `docker compose up -d` → PostgreSQL running
**Phase 2:** `curl POST /sessions` → Returns sessionId, Swagger at /api
**Phase 3:** `npm run dev` → Frontend loads, no console errors
**Phase 4:** Console log signals every 2.5s, simulate zoom → zoomCount increments
**Phase 5:** Simulate 3 zooms → fontSize increases from 16 to 18px, CSS variable updated
**Phase 6:** AdaptationMonitor shows real-time signals, buttons use --button-padding
**Phase 7:** `curl GET /analytics/export` → Valid CSV, import to R → wilcox.test runs
**Phase 8:** Lighthouse audit ≥ 95, keyboard navigation works, screen reader reads content

### End-to-End Test

1. Start backend: `npm run start:dev --workspace=backend`
2. Start frontend: `npm run dev --workspace=frontend`
3. Open browser: http://localhost:5173?condition=adaptive
4. Simulate behaviors:
   - Zoom 3 times with Ctrl+Wheel → Font scales
   - Click outside buttons 7 times → Missed tap rate ≥ 35% → Button padding enlarges
   - Read section slowly, scroll up/down → Dwell + reversals → Contrast boosts
5. Open AdaptationMonitor → Verify signals updating, UI state reflects changes
6. Export CSV: `curl http://localhost:3000/analytics/export > study_data.csv`
7. Import to R: `data <- read.csv('study_data.csv')` → Verify columns present

---

## Risks & Mitigation

**Risk:** False positive missed taps (text selection counted as missed)
**Mitigation:** Filter out events with `pressure === 0`, ignore taps within 100ms of pointermove

**Risk:** IntersectionObserver dwell time inaccuracy (user scrolls past without reading)
**Mitigation:** Acknowledge in thesis limitations section, validate with post-task questions

**Risk:** Adaptation thrashing (rule fires, behavior changes, rule fires again)
**Mitigation:** Long cooldowns (90-180s) prevent oscillation, maxApplications caps loops

**Risk:** TypeScript type safety lost in JSONB columns
**Mitigation:** Validate event payloads with Zod schemas on ingestion

---

## Timeline Estimate

**Phase 1:** 2-3 hours
**Phase 2:** 4-5 hours
**Phase 3:** 3-4 hours
**Phase 4:** 6-8 hours
**Phase 5:** 5-6 hours
**Phase 6:** 6-8 hours
**Phase 7:** 5-6 hours
**Phase 8:** 6-8 hours

**Total:** 37-48 hours (5-6 full working days)

**Parallelization:** Phases 2 and 3 can run simultaneously (different developers). Phase 7 (Analytics) can develop parallel to Phases 4-5 (Frontend behavior/engine).

---

## Enhancement Phases (Post-Initial Implementation)

### Phase E0: Foundation
- Added `react-router-dom` and `recharts` dependencies
- Added `@playwright/test` for E2E testing
- Extended `SignalSnapshot` with 4 new fields: `rageClickCount`, `mouseHesitationScore`, `idleSeconds`, `readingSpeed`
- Extended `UIState` with 3 new fields: `cursorScale`, `layoutSimplified`, `readingGuide`
- Extended `AdaptationRule` id union with: `cursor_enlarge`, `layout_simplify`, `reading_aid`
- Extended `EventLog` eventType with: `questionnaire_completed`, `consent_given`, `warmup_completed`, `study_phase_changed`
- React Router with 3 routes: `/` (StudyFlow), `/dashboard`, `/raw`
- `StudyContext` for experiment flow management

### Phase E1: Study Flow
- ConsentScreen, WarmupPhase, TaskRunner, SUSQuestionnaire, NASATLXQuestionnaire, SessionSummary, ProgressTracker components
- StudyFlow page orchestrating the full study experience

### Phase E2: New Signals & Rules
- 4 new signals: rage clicks (2s window), mouse hesitation (10s), idle time (60s), reading speed (90s)
- 3 new rules: `cursor_enlarge`, `layout_simplify`, `reading_aid`

### Phase E3: Visualizations
- SignalSparkline (Recharts), ThresholdGauge (SVG bar), AdaptationTimeline components
- Enhanced AdaptationMonitor with sparklines and gauges

### Phase E4: Content & Tasks
- 3 article sets: Adaptive Interfaces, Digital Accessibility History, HCI Methods
- Structured task types: find_answer, form_completion, navigation
- Article assignment based on participantId hash

### Phase E5: Researcher Dashboard
- Dashboard at `/dashboard` with passphrase protection (`ale-researcher-2024`)
- SessionList, SessionDetail, ComparisonView, SummaryStats components
- Backend: GET /analytics/summary endpoint, participantId filter on GET /sessions

### Phase E6: Testing
- Frontend tests expanded from 64 to 121
- Backend tests added: 19 (was 0)
- Playwright E2E test setup with 3 spec files
- Total: 140 tests (121 frontend + 19 backend)

---

## Final Notes

- **No ML/AI:** All adaptation is rule-based with explicit thresholds. More defensible for thesis scope.
- **Academic Citations:** Every threshold constant in rules.ts must have a comment linking to peer-reviewed research (Fitts 1954, Wobbrock 2008, Nielsen 1993, Rayner 2016, WCAG 2.1).
- **Study Design:** Within-subjects, counterbalanced. n=12-15 sufficient for Wilcoxon signed-rank tests.
- **Evaluation Chapter:** CSV export provides all data for R analysis (wilcox.test, effect sizes, descriptive stats).
- **Limitations Section:** Acknowledge lab setting vs. real-world, short session duration, rule determinism, missed tap false positives.
