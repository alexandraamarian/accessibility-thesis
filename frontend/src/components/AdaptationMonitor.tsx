import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SignalSnapshot, UIState } from '../types';
import { THRESHOLDS } from '../constants';
import { SignalSparkline } from './visualizations/SignalSparkline';
import { ThresholdGauge } from './visualizations/ThresholdGauge';
import { AdaptationTimeline } from './visualizations/AdaptationTimeline';

interface AdaptationMonitorProps {
  signals: SignalSnapshot;
  uiState: UIState;
  sessionId: string | null;
}

interface AdaptationEvent {
  ruleId: string;
  timestamp: number;
}

const MAX_HISTORY = 60; // 60 snapshots = 150s of data

export function AdaptationMonitor({ signals, uiState, sessionId }: AdaptationMonitorProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const signalHistory = useRef<SignalSnapshot[]>([]);
  const adaptationEvents = useRef<AdaptationEvent[]>([]);
  const sessionStart = useRef(Date.now());
  const prevUiState = useRef<UIState>(uiState);

  // Update history
  useEffect(() => {
    if (signals.timestamp > 0) {
      signalHistory.current.push(signals);
      if (signalHistory.current.length > MAX_HISTORY) {
        signalHistory.current.shift();
      }
    }
  }, [signals]);

  // Track adaptation events
  useEffect(() => {
    if (JSON.stringify(uiState) !== JSON.stringify(prevUiState.current)) {
      // Determine which rule fired by checking what changed
      const changed: string[] = [];
      if (uiState.fontSize !== prevUiState.current.fontSize) changed.push('font_scale');
      if (uiState.buttonPadding !== prevUiState.current.buttonPadding) changed.push('button_enlarge');
      if (uiState.contrast !== prevUiState.current.contrast) changed.push('contrast_boost');
      if (uiState.lineHeight !== prevUiState.current.lineHeight) changed.push('spacing_increase');
      if (uiState.animations !== prevUiState.current.animations) changed.push('motion_reduce');
      if (uiState.cursorScale !== prevUiState.current.cursorScale) changed.push('cursor_enlarge');
      if (uiState.layoutSimplified !== prevUiState.current.layoutSimplified) changed.push('layout_simplify');
      if (uiState.readingGuide !== prevUiState.current.readingGuide) changed.push('reading_aid');

      changed.forEach((ruleId) => {
        adaptationEvents.current.push({ ruleId, timestamp: Date.now() });
      });

      prevUiState.current = uiState;
    }
  }, [uiState]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 bg-accent text-bg px-4 py-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity font-semibold"
        style={{ padding: 'calc(var(--button-padding) * 0.75)' }}
        aria-label="Open debug panel"
      >
        {t('monitor.debugPanel')}
      </button>
    );
  }

  const history = signalHistory.current;
  const getHistory = (key: keyof SignalSnapshot) =>
    history.map((s) => s[key] as number);

  return (
    <div
      className="fixed bottom-4 right-4 border-2 border-accent rounded-lg shadow-2xl max-h-[80vh] overflow-auto"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        width: '420px',
      }}
      data-interactive
    >
      <div className="sticky top-0 bg-accent text-bg p-3 flex justify-between items-center z-10">
        <h3 className="font-bold">{t('monitor.title')}</h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-bg hover:opacity-80 text-xl"
          aria-label="Close debug panel"
        >
          X
        </button>
      </div>

      <div className="p-3 space-y-3 text-sm">
        <div>
          <strong className="text-accent text-xs">{t('monitor.session')}</strong>{' '}
          <span className="font-mono text-xs">{sessionId?.slice(0, 8) || t('common.none')}</span>
        </div>

        {/* Signal Gauges with Sparklines */}
        <div>
          <strong className="text-accent text-xs block mb-2">{t('monitor.signals')}</strong>
          <div className="space-y-2">
            <div>
              <ThresholdGauge value={signals.zoomCount} threshold={THRESHOLDS.zoomCount} label={t('monitor.signalLabels.zoom')} format={(v) => String(Math.round(v))} />
              <SignalSparkline data={getHistory('zoomCount')} threshold={THRESHOLDS.zoomCount} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.missedTapRate} threshold={THRESHOLDS.missedTapRate} label={t('monitor.signalLabels.missRate')} format={(v) => `${(v * 100).toFixed(0)}%`} />
              <SignalSparkline data={getHistory('missedTapRate')} threshold={THRESHOLDS.missedTapRate} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.avgDwellSeconds} threshold={THRESHOLDS.avgDwellSeconds} label={t('monitor.signalLabels.dwell')} format={(v) => `${v.toFixed(1)}s`} />
              <SignalSparkline data={getHistory('avgDwellSeconds')} threshold={THRESHOLDS.avgDwellSeconds} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.scrollReversalRate} threshold={THRESHOLDS.scrollReversalRate} label={t('monitor.signalLabels.scrollRev')} format={(v) => `${(v * 100).toFixed(0)}%`} />
              <SignalSparkline data={getHistory('scrollReversalRate')} threshold={THRESHOLDS.scrollReversalRate} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.tremorScore} threshold={THRESHOLDS.tremorScore} label={t('monitor.signalLabels.tremor')} format={(v) => `${v.toFixed(0)}px`} />
              <SignalSparkline data={getHistory('tremorScore')} threshold={THRESHOLDS.tremorScore} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.rageClickCount} threshold={THRESHOLDS.rageClickCount} label={t('monitor.signalLabels.rageClick')} format={(v) => String(Math.round(v))} />
              <SignalSparkline data={getHistory('rageClickCount')} threshold={THRESHOLDS.rageClickCount} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.mouseHesitationScore} threshold={THRESHOLDS.mouseHesitationScore} label={t('monitor.signalLabels.hesitation')} format={(v) => String(Math.round(v))} />
              <SignalSparkline data={getHistory('mouseHesitationScore')} threshold={THRESHOLDS.mouseHesitationScore} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.idleSeconds} threshold={THRESHOLDS.idleSeconds} label={t('monitor.signalLabels.idle')} format={(v) => `${v.toFixed(0)}s`} />
              <SignalSparkline data={getHistory('idleSeconds')} threshold={THRESHOLDS.idleSeconds} height={24} />
            </div>
            <div>
              <ThresholdGauge value={signals.readingSpeed} threshold={THRESHOLDS.readingSpeed} label={t('monitor.signalLabels.readSpd')} format={(v) => `${v.toFixed(0)}c/s`} />
              <SignalSparkline data={getHistory('readingSpeed')} threshold={THRESHOLDS.readingSpeed} height={24} />
            </div>
          </div>
        </div>

        {/* UI State */}
        <div>
          <strong className="text-accent text-xs block mb-1">{t('monitor.uiState')}</strong>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span>{t('monitor.font', { value: uiState.fontSize })}</span>
            <span>{t('monitor.padding', { value: uiState.buttonPadding })}</span>
            <span>{t('monitor.contrast', { value: uiState.contrast })}</span>
            <span>{t('monitor.lineH', { value: uiState.lineHeight.toFixed(2) })}</span>
            <span>{t('monitor.anim', { value: uiState.animations ? t('common.on') : t('common.off') })}</span>
            <span>{t('monitor.cursor', { value: uiState.cursorScale })}</span>
            <span>{t('monitor.simplified', { value: uiState.layoutSimplified ? t('common.yes') : t('common.no') })}</span>
            <span>{t('monitor.readGuide', { value: uiState.readingGuide ? t('common.yes') : t('common.no') })}</span>
          </div>
        </div>

        {/* Adaptation Timeline */}
        <div>
          <strong className="text-accent text-xs block mb-1">{t('monitor.adaptations')}</strong>
          <AdaptationTimeline
            events={adaptationEvents.current}
            sessionStart={sessionStart.current}
          />
        </div>

        {/* Metadata */}
        <div className="text-xs opacity-50 pt-2 pb-2 border-t border-accent border-opacity-30">
          <div>{t('monitor.taps', { taps: signals.totalTaps, scrolls: signals.totalScrollChanges })}</div>
          <div>{t('monitor.updated', { time: new Date(signals.timestamp).toLocaleTimeString() })}</div>
        </div>
      </div>
    </div>
  );
}
