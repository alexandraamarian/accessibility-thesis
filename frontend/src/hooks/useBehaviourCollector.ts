import { useState, useEffect, useRef } from 'react';
import { SignalSnapshot, EMPTY_SNAPSHOT } from '../types';
import { SIGNAL_COMPUTE_INTERVAL, WINDOWS } from '../constants';
import { SlidingWindow } from '../utils/slidingWindow';
import {
  computeTremorScore,
  computeMissedTapRate,
  computeAvgDwellTime,
  computeScrollReversalRate,
  computeRageClickCount,
  computeMouseHesitationScore,
  computeReadingSpeed,
} from '../utils/signalComputation';
import { studyLogger } from '../services/studyLogger';

interface TapEvent {
  x: number;
  y: number;
  missed: boolean;
}

interface DwellEvent {
  sectionId: string;
  enterTime: number;
  exitTime: number;
}

interface ClickEvent {
  x: number;
  y: number;
  timestamp: number;
}

interface HesitationEvent {
  duration: number;
}

/**
 * useBehaviourCollector - Detect 9 types of user behavior signals
 *
 * Original 5:
 * 1. Zoom count (pinch/ctrl+scroll events in 60s window)
 * 2. Missed tap rate (failed taps / total in 30s window)
 * 3. Average dwell time (section reading time in 90s window)
 * 4. Scroll reversal rate (upward scrolls in 45s window)
 * 5. Tremor score (std-dev of tap positions in 8s window)
 *
 * New 4:
 * 6. Rage click count (rapid clicks in same area, 2s window)
 * 7. Mouse hesitation score (cursor paused over interactive elements, 10s window)
 * 8. Idle seconds (time since last interaction)
 * 9. Reading speed (chars per dwell second, 90s window)
 */
export function useBehaviourCollector(
  sessionId: string | null,
  enabled: boolean
): SignalSnapshot {
  const [signals, setSignals] = useState<SignalSnapshot>(EMPTY_SNAPSHOT);

  // Sliding windows for each signal type
  const zoomWindow = useRef(new SlidingWindow<void>(WINDOWS.zoom));
  const tapWindow = useRef(new SlidingWindow<TapEvent>(WINDOWS.missedTap));
  const dwellWindow = useRef(new SlidingWindow<DwellEvent>(WINDOWS.dwell));
  const scrollWindow = useRef(new SlidingWindow<string>(WINDOWS.scrollReversal));
  const tremorWindow = useRef(new SlidingWindow<TapEvent>(WINDOWS.tremor));
  const rageClickWindow = useRef(new SlidingWindow<ClickEvent>(WINDOWS.rageClick));
  const hesitationWindow = useRef(new SlidingWindow<HesitationEvent>(WINDOWS.mouseHesitation));
  const readingDwellWindow = useRef(new SlidingWindow<DwellEvent>(WINDOWS.readingSpeed));

  // Track current dwell sessions
  const dwellSessions = useRef<Map<string, number>>(new Map());

  // Track last interaction time for idle detection
  const lastInteraction = useRef<number>(Date.now());

  // Track section character counts
  const sectionCharCounts = useRef<Record<string, number>>({});

  // Clear all sliding windows when sessionId changes (prevents stale data between sessions)
  useEffect(() => {
    zoomWindow.current.clear();
    tapWindow.current.clear();
    dwellWindow.current.clear();
    scrollWindow.current.clear();
    tremorWindow.current.clear();
    rageClickWindow.current.clear();
    hesitationWindow.current.clear();
    readingDwellWindow.current.clear();
    dwellSessions.current.clear();
    lastInteraction.current = Date.now();
    sectionCharCounts.current = {};
    setSignals(EMPTY_SNAPSHOT);
  }, [sessionId]);

  // 1. ZOOM DETECTION
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        zoomWindow.current.add(undefined, Date.now());
        lastInteraction.current = Date.now();
      }
    };

    const handleGestureStart = () => {
      zoomWindow.current.add(undefined, Date.now());
      lastInteraction.current = Date.now();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('gesturestart', handleGestureStart as EventListener);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGestureStart as EventListener);
    };
  }, [enabled]);

  // 2. MISSED TAP DETECTION + 6. RAGE CLICK DETECTION
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: PointerEvent) => {
      const now = Date.now();
      lastInteraction.current = now;
      const target = e.target as HTMLElement;

      const isInteractive = target.closest(
        'button, a, input, textarea, select, [data-interactive]'
      );

      // Only count as a tap (hit or miss) when clicking near interactive elements.
      // This avoids counting normal content clicks (text selection, reading) as misses.
      const nearInteractive = isInteractive || isNearInteractiveElement(e.clientX, e.clientY, 50);

      if (nearInteractive) {
        tapWindow.current.add(
          { x: e.clientX, y: e.clientY, missed: !isInteractive },
          now
        );
      }

      tremorWindow.current.add(
        { x: e.clientX, y: e.clientY, missed: !isInteractive },
        now
      );

      // Rage click tracking
      rageClickWindow.current.add(
        { x: e.clientX, y: e.clientY, timestamp: now },
        now
      );
    };

    /**
     * Check if a click position is within `radius` pixels of any interactive element.
     * This ensures only near-miss clicks are counted as missed taps,
     * not arbitrary clicks on content areas.
     */
    function isNearInteractiveElement(x: number, y: number, radius: number): boolean {
      const interactives = document.querySelectorAll(
        'button, a, input, textarea, select, [data-interactive]'
      );
      for (const el of interactives) {
        const rect = el.getBoundingClientRect();
        const closestX = Math.max(rect.left, Math.min(x, rect.right));
        const closestY = Math.max(rect.top, Math.min(y, rect.bottom));
        const dx = x - closestX;
        const dy = y - closestY;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          return true;
        }
      }
      return false;
    }

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [enabled]);

  // 3. DWELL TIME TRACKING
  // Uses MutationObserver to detect when article sections appear in the DOM
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();

        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (!sectionId) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            dwellSessions.current.set(sectionId, now);
          } else if (dwellSessions.current.has(sectionId)) {
            const enterTime = dwellSessions.current.get(sectionId)!;
            const dwellEvent = { sectionId, enterTime, exitTime: now };
            dwellWindow.current.add(dwellEvent, now);
            readingDwellWindow.current.add(dwellEvent, now);
            dwellSessions.current.delete(sectionId);
          }
        });
      },
      { threshold: [0.6] }
    );

    const observedSections = new Set<Element>();

    function scanAndObserveSections() {
      const sections = document.querySelectorAll('[data-section-id]');
      sections.forEach((section) => {
        if (!observedSections.has(section)) {
          observedSections.add(section);
          observer.observe(section);
          const sectionId = section.getAttribute('data-section-id');
          if (sectionId) {
            sectionCharCounts.current[sectionId] = (section.textContent || '').length;
          }
        }
      });
    }

    // Initial scan
    scanAndObserveSections();

    // Watch for new sections being added to the DOM
    const mutationObserver = new MutationObserver(() => {
      scanAndObserveSections();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled]);

  // 4. SCROLL REVERSAL DETECTION
  useEffect(() => {
    if (!enabled) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      lastInteraction.current = Date.now();
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';

      scrollWindow.current.add(direction, Date.now());

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  // 7. MOUSE HESITATION DETECTION
  useEffect(() => {
    if (!enabled) return;

    let hesitationTimer: ReturnType<typeof setTimeout> | null = null;
    let currentElement: Element | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastInteraction.current = Date.now();
      const target = (e.target as HTMLElement).closest(
        'button, a, input, textarea, select, [data-interactive]'
      );

      if (target !== currentElement) {
        if (hesitationTimer) {
          clearTimeout(hesitationTimer);
          hesitationTimer = null;
        }
        currentElement = target;

        if (target) {
          const startTime = Date.now();
          hesitationTimer = setTimeout(() => {
            const duration = Date.now() - startTime;
            hesitationWindow.current.add({ duration }, Date.now());
          }, 3000);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hesitationTimer) clearTimeout(hesitationTimer);
    };
  }, [enabled]);

  // 8. KEYBOARD INTERACTION TRACKING (for idle)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = () => {
      lastInteraction.current = Date.now();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);

  // 9. COMPUTE SIGNALS EVERY 2.5 SECONDS
  useEffect(() => {
    if (!enabled || !sessionId) return;

    const computeInterval = setInterval(() => {
      const now = Date.now();

      // Get data from all windows
      const taps = tapWindow.current.getAll(now);
      const dwells = dwellWindow.current.getAll(now);
      const scrolls = scrollWindow.current.getAll(now);
      const tremorTaps = tremorWindow.current.getAll(now);
      const rageClicks = rageClickWindow.current.getAll(now);
      const hesitations = hesitationWindow.current.getAll(now);
      const readingDwells = readingDwellWindow.current.getAll(now);

      // Compute signals
      const snapshot: SignalSnapshot = {
        zoomCount: zoomWindow.current.count(now),
        missedTapRate: computeMissedTapRate(taps),
        avgDwellSeconds: computeAvgDwellTime(dwells),
        scrollReversalRate: computeScrollReversalRate(scrolls),
        tremorScore: computeTremorScore(tremorTaps),
        rageClickCount: computeRageClickCount(rageClicks),
        mouseHesitationScore: computeMouseHesitationScore(hesitations),
        idleSeconds: (now - lastInteraction.current) / 1000,
        readingSpeed: computeReadingSpeed(readingDwells, sectionCharCounts.current),
        totalTaps: taps.length,
        totalScrollChanges: scrolls.length,
        timestamp: now,
      };

      setSignals(snapshot);

      // Log to backend
      studyLogger.log('signal_snapshot', { signals: snapshot });
    }, SIGNAL_COMPUTE_INTERVAL);

    return () => {
      clearInterval(computeInterval);
    };
  }, [enabled, sessionId]);

  return signals;
}
