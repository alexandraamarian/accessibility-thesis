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
    { key: 'zoomCount', label: t('dashboard.sessionDetail.signalLabels.zoomCount'), threshold: THRESHOLDS.zoomCount },
    { key: 'missedTapRate', label: t('dashboard.sessionDetail.signalLabels.missedTapRate'), threshold: THRESHOLDS.missedTapRate },
    { key: 'avgDwellSeconds', label: t('dashboard.sessionDetail.signalLabels.avgDwell'), threshold: THRESHOLDS.avgDwellSeconds },
    { key: 'scrollReversalRate', label: t('dashboard.sessionDetail.signalLabels.scrollReversal'), threshold: THRESHOLDS.scrollReversalRate },
    { key: 'tremorScore', label: t('dashboard.sessionDetail.signalLabels.tremor'), threshold: THRESHOLDS.tremorScore },
    { key: 'rageClickCount', label: t('dashboard.sessionDetail.signalLabels.rageClicks'), threshold: THRESHOLDS.rageClickCount },
    { key: 'mouseHesitationScore', label: t('dashboard.sessionDetail.signalLabels.hesitation'), threshold: THRESHOLDS.mouseHesitationScore },
    { key: 'idleSeconds', label: t('dashboard.sessionDetail.signalLabels.idle'), threshold: THRESHOLDS.idleSeconds },
    { key: 'readingSpeed', label: t('dashboard.sessionDetail.signalLabels.readSpeed'), threshold: THRESHOLDS.readingSpeed },
  ];

  return (
    <div>
      <button onClick={onBack} className="text-accent hover:underline text-sm mb-4">
        {t('dashboard.sessionDetail.backToSessions')}
      </button>

      <h2 className="text-xl font-bold text-accent mb-4">
        {t('dashboard.sessionDetail.sessionHeading', { participant: session.participantId, condition: session.condition })}
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-accent border-opacity-20 rounded p-3">
          <div className="text-xs opacity-60">{t('dashboard.sessionDetail.started')}</div>
          <div className="font-mono text-sm">{new Date(session.startedAt).toLocaleString()}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3">
          <div className="text-xs opacity-60">{t('dashboard.sessionDetail.duration')}</div>
          <div className="font-mono text-sm">
            {session.endedAt
              ? `${Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)}m`
              : t('common.active')}
          </div>
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
            {Object.entries(session.nasaTlx).map(([key, value]) => (
              <div key={key} className="border border-accent border-opacity-20 rounded p-2 text-center">
                <div className="text-xs opacity-60 capitalize">{key}</div>
                <div className="font-mono text-lg text-accent">{value as number}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signal History */}
      <div className="mb-6">
        <h3 className="font-semibold text-accent mb-2">{t('dashboard.sessionDetail.signalHistory', { count: signalSnapshots.length })}</h3>
        <div className="space-y-3">
          {signalKeys.map(({ key, label, threshold }) => {
            const data = signalSnapshots.map((s: any) => {
              const signals = s.signals || s;
              return signals[key] || 0;
            });
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="w-32 text-xs opacity-75">{label}</span>
                <div className="flex-1">
                  <SignalSparkline data={data} threshold={threshold} height={30} />
                </div>
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
          <h3 className="font-semibold text-accent mb-2">{t('dashboard.sessionDetail.taskMetrics')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent border-opacity-30">
                <th className="text-left p-2">{t('dashboard.sessionDetail.task')}</th>
                <th className="text-left p-2">{t('dashboard.sessionDetail.duration')}</th>
                <th className="text-left p-2">{t('dashboard.sessionDetail.errors')}</th>
              </tr>
            </thead>
            <tbody>
              {taskMetrics.map((t: any, i: number) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="p-2">{t.taskId || `Task ${i + 1}`}</td>
                  <td className="p-2 font-mono">{t.duration ? `${t.duration.toFixed(1)}s` : '-'}</td>
                  <td className="p-2 font-mono">{t.errors ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
