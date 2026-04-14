# Adaptive Accessibility System — Agent Roster

## Project Summary
A React + NestJS web application for a Software Engineering Master's thesis. The system detects user behaviour in real time (zoom gestures, missed taps, reading time, scroll patterns, input tremor) and silently adapts the UI — scaling fonts, enlarging tap targets, boosting contrast, increasing spacing, and reducing motion — without requiring the user to open a single settings dialog.

**Research Question:** *Can behaviour-based UI adaptation improve usability?*

---

## How to Use These Agent Files in VS Code

Each agent file is a self-contained system prompt. Use them in one of three ways:

### Option A — Claude in VS Code (Recommended)
1. Install the **Claude for VS Code** extension
2. Open a new Claude chat panel
3. Paste the contents of the relevant `AGENT_*.md` file as your first message, prefixed with: `You are operating as the following agent. Follow these instructions for all subsequent messages in this session:`
4. The agent will then respond in-role for all follow-up questions

### Option B — GitHub Copilot Custom Instructions
1. Create `.github/copilot-instructions.md` in your repo root
2. Paste the contents of the relevant agent file
3. Copilot will use these as workspace-scoped instructions

### Option C — VS Code Workspace AI Instructions (`.vscode/`)
1. Create `.vscode/instructions/frontend.md`, `.vscode/instructions/backend.md`, `.vscode/instructions/accessibility.md`
2. Reference the agent you need per session

---

## Agent Directory

| File | Role | Scope |
|---|---|---|
| `AGENT_FRONTEND.md` | Principal Frontend Engineer | React, Vite, detection hooks, rule engine, UI adaptation, monitoring panel |
| `AGENT_BACKEND.md` | Principal Backend Engineer | NestJS, TypeORM, Postgres, analytics API, CSV export, Docker |
| `AGENT_ACCESSIBILITY.md` | Accessibility Specialist | WCAG compliance, threshold justification, rule design, evaluation methodology |

---

## Shared Project Context (read by all agents)

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS (utility classes only, no compiler)
- **Backend:** NestJS, TypeORM, PostgreSQL, class-validator, Swagger
- **Tooling:** ESLint, Prettier, Vitest (frontend), Jest (backend), Docker Compose
- **No ML/AI:** Rule-based adaptation only — more defensible for thesis scope

### Repository Structure
```
adaptive-ui/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── engine/
│   │   │   ├── rules.ts         # Rule definitions & thresholds
│   │   │   └── signals.ts       # Signal type definitions
│   │   ├── hooks/
│   │   │   ├── useBehaviourCollector.ts
│   │   │   └── useAdaptationEngine.ts
│   │   ├── components/
│   │   │   ├── AdaptationMonitor.tsx
│   │   │   ├── Article.tsx
│   │   │   └── InteractionTestZone.tsx
│   │   ├── services/
│   │   │   └── studyLogger.ts   # Batches events → backend
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # NestJS
│   ├── src/
│   │   ├── sessions/
│   │   ├── events/
│   │   ├── analytics/
│   │   └── rules/
│   └── package.json
│
├── .vscode/
│   ├── instructions/
│   │   ├── AGENT_FRONTEND.md
│   │   ├── AGENT_BACKEND.md
│   │   └── AGENT_ACCESSIBILITY.md
│   └── settings.json
│
├── docker-compose.yml
└── AGENTS.md                    # This file
```

### Core Domain Objects

```typescript
// A sliding-window signal snapshot — computed every 2.5s
interface SignalSnapshot {
  zoomCount: number;          // pinch/ctrl+scroll events in last 60s
  missedTapRate: number;      // 0–1, missed / total taps in last 30s
  avgDwellSeconds: number;    // avg section dwell time in last 90s
  scrollReversalRate: number; // 0–1, up-direction changes / total in 45s
  tremorScore: number;        // px std-dev of tap positions in last 8s
  totalTaps: number;
  totalScrollChanges: number;
}

// The current UI adaptation state
interface UIState {
  fontSize: number;        // px, baseline 16, max 26
  buttonPadding: number;   // px, baseline 12, max 36
  contrast: number;        // 0=normal | 1=enhanced | 2=maximum
  lineHeight: number;      // multiplier, baseline 1.65, max 2.2
  animations: boolean;     // true until motion_reduce fires
}

// A rule definition
interface AdaptationRule {
  id: string;
  check: (signals: SignalSnapshot) => boolean;
  apply: (ui: UIState) => UIState;
  cooldown: number;        // ms
  maxApplications: number;
}
```

### Adaptation Rules Reference

| Rule ID | Trigger Condition | UI Change | Cooldown | Max |
|---|---|---|---|---|
| `font_scale` | zoom_count ≥ 3 in 60s | fontSize += 2px | 120s | 3× |
| `button_enlarge` | missedTapRate ≥ 0.35 in 30s | buttonPadding += 8px | 90s | 2× |
| `contrast_boost` | dwell ≥ 7s AND reversals ≥ 30% | contrast += 1 | 180s | 2× |
| `spacing_increase` | tremorScore ≥ 18px | lineHeight += 0.15 | 150s | 3× |
| `motion_reduce` | tremorScore ≥ 27px | animations = false | permanent | 1× |

### Threshold Justifications (for thesis citations)
- **Missed tap rate 35%:** Fitts's Law minimum target size 44×44dp (Apple HIG), 48×48dp (Material Design)
- **Dwell time 7s:** Nielsen's readability research; WCAG 2.1 §1.4.12 text spacing
- **Tremor score 18px:** Wobbrock et al. (2008) motor impairment study baselines
- **Contrast levels:** WCAG 2.1 AA (4.5:1) → AAA (7:1) progression
- **Font step 2px:** BS 8300 §11.3 incremental legibility standards

---

## Evaluation Study Design (shared context)
- **Design:** Within-subjects, counterbalanced (adaptive vs. control condition)
- **n:** Target 12–15 participants
- **Tasks:** 5 standardised reading + interaction tasks per condition
- **Measures:** Task completion time, error rate, SUS score, NASA-TLX
- **Export:** Backend `/analytics/export` returns CSV for R/SPSS

---

## Inter-Agent Communication Protocol
When one agent's work creates a dependency for another, output a clearly labelled block:

```
📤 HANDOFF → [AGENT NAME]
File: src/path/to/file.ts
Change: [description of what was added/changed]
Impact: [what the receiving agent needs to do]
```

This keeps work coordinated without a real-time shared context.