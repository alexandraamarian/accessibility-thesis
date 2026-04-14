import { useEffect, useRef } from 'react';
import { SignalSnapshot, UIState } from '../types';
import { RULES } from '../engine/rules';
import { useAdaptationContext } from '../context/AdaptationContext';
import { studyLogger } from '../services/studyLogger';

interface RuleCooldownState {
  lastApplied: number; // timestamp
  applicationCount: number;
}

/**
 * useAdaptationEngine - Evaluate adaptation rules and apply UI changes
 *
 * Runs every time signals update (every 2.5s)
 * For each rule:
 * 1. Check if cooldown has expired
 * 2. Check if maxApplications reached
 * 3. Check if rule condition is met (rule.check)
 * 4. Apply rule transformation (rule.apply)
 * 5. Log adaptation event to backend
 *
 * @param signals - Current signal snapshot
 * @param enabled - Whether adaptation is enabled (false for control condition)
 * @param sessionId - Current session ID
 * @returns Current UI state (from context)
 */
export function useAdaptationEngine(
  signals: SignalSnapshot,
  enabled: boolean,
  sessionId: string | null
): UIState {
  const { uiState, dispatch } = useAdaptationContext();
  const cooldowns = useRef<Map<string, RuleCooldownState>>(new Map());

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const now = Date.now();

    for (const rule of RULES) {
      const cooldownState = cooldowns.current.get(rule.id) || {
        lastApplied: 0,
        applicationCount: 0,
      };

      // Check 1: Cooldown
      if (now - cooldownState.lastApplied < rule.cooldown) {
        continue;
      }

      // Check 2: maxApplications
      if (cooldownState.applicationCount >= rule.maxApplications) {
        continue;
      }

      // Check 3: Rule condition
      if (!rule.check(signals)) {
        continue;
      }

      // Apply rule
      const newUIState = rule.apply(uiState);

      // Only dispatch if state actually changed (prevents unnecessary re-renders)
      if (JSON.stringify(newUIState) !== JSON.stringify(uiState)) {
        console.log(`🎯 Adaptation triggered: ${rule.id}`, {
          signals,
          uiStateBefore: uiState,
          uiStateAfter: newUIState,
        });

        dispatch({ type: 'APPLY_RULE', payload: newUIState });

        // Update cooldown tracking
        cooldowns.current.set(rule.id, {
          lastApplied: now,
          applicationCount: cooldownState.applicationCount + 1,
        });

        // Log to backend
        studyLogger.log('adaptation_applied', {
          ruleId: rule.id,
          uiStateBefore: uiState,
          uiStateAfter: newUIState,
          signals,
        });

        // Only apply one rule per cycle (prevent multiple simultaneous changes)
        break;
      }
    }
  }, [signals, enabled, sessionId, uiState, dispatch]);

  return uiState;
}
