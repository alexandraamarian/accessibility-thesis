# Adaptive Accessibility System

**Status:** ✅ Complete - Production Ready

A React + NestJS web application for a Software Engineering Master's thesis investigating whether behaviour-based UI adaptation can improve usability.

## Research Question

**Can behaviour-based UI adaptation improve usability?**

## System Overview

The system detects user behaviour in real-time through 5 signal types:
- **Zoom gestures** (Ctrl+Wheel, pinch) - indicates legibility issues
- **Missed taps** - reveals motor control challenges
- **Reading dwell time** - measures comprehension difficulty
- **Scroll reversals** - detects re-reading patterns
- **Tap tremor** - quantifies pointing precision

Based on these signals, the system applies 5 research-justified adaptation rules:
1. **font_scale** - Increases font size (Nielsen 1993)
2. **button_enlarge** - Enlarges touch targets (Fitts 1954)
3. **contrast_boost** - Improves contrast (Rayner et al. 2016)
4. **spacing_increase** - Adds line spacing (Wobbrock et al. 2008)
5. **motion_reduce** - Disables animations (Wobbrock et al. 2011)

All adaptations happen silently without requiring user configuration.

## Implementation Status

✅ **All 8 phases complete** (100%)
- Backend API with PostgreSQL
- Frontend with React 18 + TypeScript
- 5 behavior signal detections
- 5 adaptation rules with cooldowns
- Real-time debug monitoring panel
- CSV export for statistical analysis
- WCAG 2.1 AA accessibility compliance
- 64/64 unit tests passing

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Infrastructure:** Docker Compose
- **Testing:** Vitest (frontend), Jest (backend)

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation & Run

```bash
# Install dependencies
npm install

# Terminal 1 - Start PostgreSQL
docker compose up -d

# Terminal 2 - Start Backend
npm run dev:backend
# Backend: http://localhost:3000
# Swagger: http://localhost:3000/api

# Terminal 3 - Start Frontend
npm run dev:frontend
# Frontend: http://localhost:5173
```

### Testing

```bash
# Run all frontend tests (64 tests)
npm test --workspace=frontend -- --run

# Test accessibility in browser console
# Open http://localhost:5173 and run:
runAccessibilityValidation()
```

### Study Modes

- **Adaptive:** http://localhost:5173?condition=adaptive
- **Control:** http://localhost:5173?condition=control

## Testing Adaptations

1. **Font Scale:** Ctrl+Wheel (or Cmd+Wheel) 3 times in 60 seconds
2. **Button Enlarge:** Click outside buttons to create 35% miss rate
3. **Contrast Boost:** Read slowly (7s+) and scroll up/down repeatedly
4. **Spacing Increase:** Click with position variance (18px tremor)
5. **Motion Reduce:** Click with extreme variance (27px tremor)

**Debug Panel:** Click "📊 Debug Panel" (bottom-right) to monitor signals in real-time.

## Research Data Export

```bash
# Export study data to CSV
curl http://localhost:3000/analytics/export > study_data.csv

# Statistical analysis in R
data <- read.csv('study_data.csv')
wilcox.test(sus_score ~ condition, data = data, paired = TRUE)
```

## Project Structure

```
ale/
├── frontend/
│   ├── src/
│   │   ├── components/       # Article, InteractionTestZone, AdaptationMonitor
│   │   ├── engine/
│   │   │   └── rules.ts      # 5 adaptation rules with research citations
│   │   ├── hooks/
│   │   │   ├── useBehaviourCollector.ts  # 5 signal detections
│   │   │   └── useAdaptationEngine.ts    # Rule evaluation engine
│   │   ├── utils/
│   │   │   ├── contrastValidator.ts      # WCAG validation
│   │   │   ├── slidingWindow.ts          # Time-series data structure
│   │   │   └── signalComputation.ts      # Signal calculations
│   │   ├── types.ts          # Core TypeScript interfaces
│   │   └── constants.ts      # Thresholds with academic justifications
│   └── __tests__/            # 64 unit tests
│
├── backend/
│   ├── src/
│   │   ├── sessions/         # Session management API
│   │   ├── events/           # Behavior event logging
│   │   ├── analytics/        # CSV export for statistical analysis
│   │   └── adaptations/      # Adaptation tracking
│   └── ...
│
├── docker-compose.yml        # PostgreSQL service
├── FINAL_SUMMARY.md          # Complete implementation overview
├── COMPLETED.md              # Detailed usage guide
├── ACCESSIBILITY_CHECKLIST.md # WCAG 2.1 AA compliance
├── PROGRESS.md               # Implementation tracker
└── Agents.md                 # Agent documentation
```

## Documentation

- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - Comprehensive system overview ⭐
- **[COMPLETED.md](./COMPLETED.md)** - Detailed usage and testing guide
- **[ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md)** - WCAG compliance verification
- **[PROGRESS.md](./PROGRESS.md)** - Implementation progress tracker
- **[Agents.md](./Agents.md)** - Agent roles and project context

## Key Features

✅ **Research-Justified Thresholds** - Every threshold linked to peer-reviewed research
✅ **WCAG 2.1 AA Compliant** - Contrast ratios: 8.2:1, 10.5:1, 21:1
✅ **Real-time Adaptation** - Signals computed every 2.5s, adaptations with cooldowns
✅ **Statistical Analysis Ready** - CSV export with all required metrics
✅ **Within-Subjects Study Support** - Adaptive vs. control conditions, counterbalancing
✅ **Comprehensive Testing** - 64 unit tests, 100% pass rate
✅ **Debug Monitoring** - Real-time signal and UI state visualization

## System Validation

**Unit Tests:** 64/64 passing ✅
**WCAG Compliance:** Level AA verified ✅
**Contrast Ratios:** All exceed minimum requirements ✅
**Touch Targets:** 44×44px minimum after adaptation ✅
**Keyboard Navigation:** Fully accessible ✅

## Thesis Integration

### Methodology Chapter
- Reference: `frontend/src/constants.ts` for threshold justifications
- Reference: `frontend/src/engine/rules.ts` for rule implementations with citations
- Table: 5 signals × 5 rules with academic sources

### Results Chapter
- Export CSV: `GET /analytics/export`
- Import to R/SPSS for Wilcoxon signed-rank tests
- Analyze: SUS scores, task times, error rates, adaptation frequencies

### Discussion Chapter
- Limitations documented in COMPLETED.md
- Future work suggestions included
- Ethical considerations for silent adaptation

## Agent Roles (Development)

The system was built using specialized agent roles:
- **Frontend Agent** - React components, hooks, signal detection
- **Backend Agent** - NestJS API, database, analytics
- **Accessibility Agent** - WCAG compliance, threshold justification, study methodology

See [Agents.md](./Agents.md) for detailed specifications.

## License

This is a Master's thesis project. Please cite appropriately if using for research purposes.

## Contact

For questions about the implementation or thesis research, see documentation files or open an issue.
