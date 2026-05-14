import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SignalSparkline } from '../visualizations/SignalSparkline';
import { THRESHOLDS } from '../../constants';

interface SessionDetailProps {
  sessionId: string;
  onBack: () => void;
}

export function SessionDetail({ sessionId, onBack }: SessionDetailProps) {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/analytics/sessions/${sessionId}`)
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return <div className="text-center py-8">{t('dashboard.sessionDetail.loadingSession')}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">{t('dashboard.sessionDetail.sessionNotFound')}</div>;
  }

  const { session, signalSnapshots, adaptations, taskMetrics } = analytics;

  const signalKeys = [
    { key: 'zoomCount', label: t('dashboard.sessionDetail.signalLabels.zoomCount'), tooltip: t('dashboard.sessionDetail.signalTooltips.zoomCount'), threshold: THRESHOLDS.zoomCount },
    { key: 'missedTapRate', label: t('dashboard.sessionDetail.signalLabels.missedTapRate'), tooltip: t('dashboard.sessionDetail.signalTooltips.missedTapRate'), threshold: THRESHOLDS.missedTapRate },
    { key: 'avgDwellSeconds', label: t('dashboard.sessionDetail.signalLabels.avgDwellSeconds'), tooltip: t('dashboard.sessionDetail.signalTooltips.avgDwellSeconds'), threshold: THRESHOLDS.avgDwellSeconds },
    { key: 'scrollReversalRate', label: t('dashboard.sessionDetail.signalLabels.scrollReversalRate'), tooltip: t('dashboard.sessionDetail.signalTooltips.scrollReversalRate'), threshold: THRESHOLDS.scrollReversalRate },
    { key: 'tremorScore', label: t('dashboard.sessionDetail.signalLabels.tremorScore'), tooltip: t('dashboard.sessionDetail.signalTooltips.tremorScore'), threshold: THRESHOLDS.tremorScore },
    { key: 'rageClickCount', label: t('dashboard.sessionDetail.signalLabels.rageClickCount'), tooltip: t('dashboard.sessionDetail.signalTooltips.rageClickCount'), threshold: THRESHOLDS.rageClickCount },
    { key: 'mouseHesitationScore', label: t('dashboard.sessionDetail.signalLabels.mouseHesitationScore'), tooltip: t('dashboard.sessionDetail.signalTooltips.mouseHesitationScore'), threshold: THRESHOLDS.mouseHesitationScore },
    { key: 'idleSeconds', label: t('dashboard.sessionDetail.signalLabels.idleSeconds'), tooltip: t('dashboard.sessionDetail.signalTooltips.idleSeconds'), threshold: THRESHOLDS.idleSeconds },
    { key: 'readingSpeed', label: t('dashboard.sessionDetail.signalLabels.readingSpeed'), tooltip: t('dashboard.sessionDetail.signalTooltips.readingSpeed'), threshold: THRESHOLDS.readingSpeed },
    { key: 'keyboardNavCount', label: t('dashboard.sessionDetail.signalLabels.keyboardNavCount'), tooltip: t('dashboard.sessionDetail.signalTooltips.keyboardNavCount'), threshold: 0 },
  ];

  return (
    <div>
      <button onClick={onBack} className="text-accent hover:underline text-sm mb-4">
        {t('dashboard.sessionDetail.backToSessions')}
      </button>

      <h2 className="text-xl font-bold text-accent mb-4">
        {t('dashboard.sessionDetail.sessionHeading', { participant: session.participantId, condition: session.condition })}
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-accent border-opacity-20 rounded p-3">
          <div className="text-xs opacity-60">{t('dashboard.sessionDetail.started')}</div>
          <div className="font-mono text-sm">{new Date(session.startedAt).toLocaleString()}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3">
          <div className="text-xs opacity-60">{t('dashboard.sessionDetail.susScore')}</div>
          <div className="font-mono text-sm text-accent">{session.susScore ?? '-'}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3">
          <div className="text-xs opacity-60">{t('dashboard.sessionDetail.adaptations')}</div>
          <div className="font-mono text-sm">{adaptations.length}</div>
        </div>
      </div>

      {/* NASA-TLX Breakdown */}
      {session.nasaTlx && (
        <div className="mb-6">
          <h3 className="font-semibold text-accent mb-2">{t('dashboard.sessionDetail.nasaTlxScores')}</h3>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(session.nasaTlx).map(([key, value]) => {
              // Normalize: old sessions used 0-100, new ones use 1-10
              // Performance is reverse-scored so higher = more workload (consistent with other dimensions)
              const normalized = (value as number) > 10 ? Math.round((value as number) / 10) : (value as number);
              const v = key === 'performance' ? 10 - normalized : normalized;
              return (
                <div key={key} className="border border-accent border-opacity-20 rounded p-2 text-center">
                  <div className="text-xs opacity-60 capitalize">{key}</div>
                  <div className="font-mono text-lg text-accent">{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Signal History */}
      <div className="mb-6">
        <h3 className="font-semibold text-accent mb-2">{t('dashboard.sessionDetail.signalHistory', { count: signalSnapshots.length })}</h3>
        <div className="grid grid-cols-1 gap-3">
          {signalKeys.map(({ key, label, tooltip, threshold }) => {
            const data = signalSnapshots.map((s: any) => {
              const signals = s.signals || s;
              return signals[key] || 0;
            });
            const lastVal = data[data.length - 1] || 0;
            return (
              <div key={key} className="border border-accent border-opacity-10 rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium opacity-75 cursor-help" title={tooltip}>{label} ⓘ</span>
                  <span className="text-xs font-mono opacity-50">
                    {lastVal.toFixed(2)} / {threshold}
                  </span>
                </div>
                <SignalSparkline data={data} threshold={threshold} label={label} height={48} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptation Events */}
      {adaptations.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-accent mb-2">{t('dashboard.sessionDetail.adaptationEvents')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent border-opacity-30">
                <th className="text-left p-2">{t('dashboard.sessionDetail.rule')}</th>
                <th className="text-left p-2">{t('dashboard.sessionDetail.time')}</th>
              </tr>
            </thead>
            <tbody>
              {adaptations.map((a: any, i: number) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="p-2 font-mono">{a.ruleId}</td>
                  <td className="p-2">{new Date(a.triggeredAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Metrics */}
      {taskMetrics.length > 0 && (
        <div>
          <h3 className="font-semibold text-accent mb-2">
            {t('dashboard.sessionDetail.taskMetrics')} ({taskMetrics.length})
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {taskMetrics.map((task: any, i: number) => {
              const taskType = task.taskType || task.type || 'unknown';
              const typeLabel = taskType === 'find_answer' ? t('dashboard.sessionDetail.taskTypes.findAnswer')
                : taskType === 'form_completion' ? t('dashboard.sessionDetail.taskTypes.formCompletion')
                : taskType === 'navigation' ? t('dashboard.sessionDetail.taskTypes.navigation')
                : taskType;
              const dur = typeof task.duration === 'number' ? task.duration : 0;
              return (
                <div key={i} className="border border-accent border-opacity-15 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent bg-accent bg-opacity-15 px-2 py-0.5 rounded">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{typeLabel}</span>
                    </div>
                    <span className="text-xs font-mono opacity-50">{task.taskId}</span>
                  </div>
                  <div className="flex gap-6 text-xs">
                    <div>
                      <span className="opacity-50">{t('dashboard.sessionDetail.duration')}: </span>
                      <span className="font-mono text-accent">{dur.toFixed(1)}s</span>
                    </div>
                    <div>
                      <span className="opacity-50">{t('dashboard.sessionDetail.errors')}: </span>
                      <span className={`font-mono ${(task.errors || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {task.errors || 0}
                      </span>
                    </div>
                    {task.answer && (
                      <div className="flex-1 truncate">
                        <span className="opacity-50">{t('dashboard.sessionDetail.answer')}: </span>
                        <span className="font-mono text-xs opacity-75">{task.answer}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
