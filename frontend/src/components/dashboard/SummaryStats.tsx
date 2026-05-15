import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';

interface Session {
  id: string;
  participantId: string;
  condition: 'adaptive' | 'control';
  susScore: number | null;
  nasaTlx: Record<string, number> | null;
  startedAt: string;
  endedAt: string | null;
}

interface SummaryStatsProps {
  sessions: Session[];
}

export function SummaryStats({ sessions }: SummaryStatsProps) {
  const { t } = useTranslation();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Categorize participants
  const byParticipant = new Map<string, Session[]>();
  for (const s of sessions) {
    if (!byParticipant.has(s.participantId)) byParticipant.set(s.participantId, []);
    byParticipant.get(s.participantId)!.push(s);
  }

  const completedBothEmails: string[] = [];
  const incompleteEmails: string[] = [];

  for (const [pid, pSessions] of byParticipant) {
    const conditions = new Set<string>();
    let allComplete = true;
    for (const s of pSessions) {
      if (s.endedAt && s.susScore != null && s.nasaTlx != null) {
        conditions.add(s.condition);
      } else {
        allComplete = false;
      }
    }
    if (conditions.has('adaptive') && conditions.has('control') && allComplete) {
      completedBothEmails.push(pid);
    } else {
      incompleteEmails.push(pid);
    }
  }

  // Only use sessions from participants who completed both for graphs
  const pairedSessions = sessions.filter((s) => completedBothEmails.includes(s.participantId));
  const adaptive = pairedSessions.filter((s) => s.condition === 'adaptive');
  const control = pairedSessions.filter((s) => s.condition === 'control');

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const std = (arr: number[]) => {
    if (arr.length < 2) return 0;
    const m = avg(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
  };

  const adaptiveSUS = adaptive.map((s) => s.susScore).filter((v): v is number => v !== null);
  const controlSUS = control.map((s) => s.susScore).filter((v): v is number => v !== null);

  const susData = [
    { condition: 'Adaptive', score: Math.round(avg(adaptiveSUS) * 10) / 10, count: adaptiveSUS.length },
    { condition: 'Control', score: Math.round(avg(controlSUS) * 10) / 10, count: controlSUS.length },
  ];
  const SUS_COLORS = ['#38bdf8', '#6b7280'];

  const normalizeNasa = (v: number, dim?: string) => {
    const normalized = v > 10 ? Math.round(v / 10) : v;
    return dim === 'performance' ? 10 - normalized : normalized;
  };

  const nasaDimensions = ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'];
  const nasaData = nasaDimensions.map((dim) => {
    const adaptiveVals = adaptive
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null)
      .map((v) => normalizeNasa(v, dim));
    const controlVals = control
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null)
      .map((v) => normalizeNasa(v, dim));
    return {
      dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
      Adaptive: avg(adaptiveVals),
      Control: avg(controlVals),
    };
  });

  // Paired delta per participant (within-subjects)
  const pairedSusDelta: number[] = [];
  const pairedNasaDelta: Record<string, number[]> = {};
  nasaDimensions.forEach((d) => { pairedNasaDelta[d] = []; });

  for (const pid of completedBothEmails) {
    const pSessions = byParticipant.get(pid)!;
    const a = pSessions.find((s) => s.condition === 'adaptive');
    const c = pSessions.find((s) => s.condition === 'control');
    if (a?.susScore != null && c?.susScore != null) {
      pairedSusDelta.push(a.susScore - c.susScore);
    }
    for (const dim of nasaDimensions) {
      const aVal = a?.nasaTlx?.[dim];
      const cVal = c?.nasaTlx?.[dim];
      if (aVal != null && cVal != null) {
        pairedNasaDelta[dim].push(normalizeNasa(aVal, dim) - normalizeNasa(cVal, dim));
      }
    }
  }

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/analytics/export');
      const csv = await res.text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study_data.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const copyEmails = (emails: string[], key: string) => {
    navigator.clipboard.writeText(emails.join('\n'));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-accent">{t('dashboard.summaryStats.heading')}</h2>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-accent text-bg rounded font-semibold text-sm hover:opacity-90"
        >
          {t('common.exportCsv')}
        </button>
      </div>

      {/* Overview counts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.totalSessions')}</div>
          <div className="text-2xl font-bold text-accent">{sessions.length}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.uniqueParticipants')}</div>
          <div className="text-2xl font-bold text-accent">{byParticipant.size}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.completedBoth')}</div>
          <div className="text-2xl font-bold text-green-400">{completedBothEmails.length}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.incomplete')}</div>
          <div className="text-2xl font-bold text-yellow-400">{incompleteEmails.length}</div>
        </div>
      </div>

      {/* Copy email buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => copyEmails(completedBothEmails, 'completed')}
          className="px-3 py-2 rounded border border-green-600 text-green-400 text-sm hover:bg-green-900 hover:bg-opacity-20 transition-colors"
        >
          {copiedKey === 'completed' ? t('common.copied') : t('dashboard.summaryStats.copyCompleted', { count: completedBothEmails.length })}
        </button>
        <button
          onClick={() => copyEmails(incompleteEmails, 'incomplete')}
          className="px-3 py-2 rounded border border-yellow-600 text-yellow-400 text-sm hover:bg-yellow-900 hover:bg-opacity-20 transition-colors"
        >
          {copiedKey === 'incomplete' ? t('common.copied') : t('dashboard.summaryStats.copyIncomplete', { count: incompleteEmails.length })}
        </button>
      </div>

      {/* Note about paired data */}
      {completedBothEmails.length > 0 && (
        <p className="text-xs opacity-50 mb-6">
          {t('dashboard.summaryStats.pairedNote', { count: completedBothEmails.length })}
        </p>
      )}

      {/* SUS Scores */}
      <div className="mb-8">
        <h3 className="font-semibold text-accent mb-3">{t('dashboard.summaryStats.meanSusByCondition')}</h3>
        {adaptiveSUS.length === 0 && controlSUS.length === 0 ? (
          <p className="opacity-50 text-sm">{t('dashboard.summaryStats.noSusScores')}</p>
        ) : (
          <div className="flex gap-8 items-end">
            <div style={{ flex: '1 1 auto', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={susData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }} barSize={80}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="condition" stroke="#9ca3af" tick={{ fontSize: 14 }} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" tickCount={6} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', borderRadius: 8 }}
                    formatter={(value: number) => [value.toFixed(1), 'Mean SUS']}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {susData.map((_entry, index) => (
                      <Cell key={index} fill={SUS_COLORS[index]} />
                    ))}
                    <LabelList dataKey="score" position="top" fill="#f1f5f9" fontSize={14} fontWeight="bold" formatter={(v: number) => v.toFixed(1)} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-shrink-0 space-y-3 pb-4">
              <div className="border border-accent border-opacity-20 rounded-lg p-3 text-center min-w-[140px]">
                <div className="text-xs opacity-50 mb-1">Adaptive (n={adaptiveSUS.length})</div>
                <div className="text-2xl font-bold text-accent">{avg(adaptiveSUS).toFixed(1)}</div>
                <div className="text-xs opacity-40">SD: {std(adaptiveSUS).toFixed(1)}</div>
              </div>
              <div className="border border-gray-600 border-opacity-30 rounded-lg p-3 text-center min-w-[140px]">
                <div className="text-xs opacity-50 mb-1">Control (n={controlSUS.length})</div>
                <div className="text-2xl font-bold text-gray-400">{avg(controlSUS).toFixed(1)}</div>
                <div className="text-xs opacity-40">SD: {std(controlSUS).toFixed(1)}</div>
              </div>
              <div className="border border-yellow-600 border-opacity-30 rounded-lg p-3 text-center min-w-[140px] bg-yellow-900 bg-opacity-10">
                <div className="text-xs opacity-50 mb-1">{t('dashboard.summaryStats.pairedDelta')}</div>
                <div className={`text-lg font-bold ${avg(pairedSusDelta) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {avg(pairedSusDelta) >= 0 ? '+' : ''}{avg(pairedSusDelta).toFixed(1)}
                </div>
                <div className="text-xs opacity-40">SD: {std(pairedSusDelta).toFixed(1)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NASA-TLX */}
      <div className="mb-8">
        <h3 className="font-semibold text-accent mb-3">{t('dashboard.summaryStats.nasaTlxByDimension')}</h3>
        {nasaData.every((d) => d.Adaptive === 0 && d.Control === 0) ? (
          <p className="opacity-50 text-sm">{t('dashboard.summaryStats.noNasaTlxData')}</p>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={nasaData} margin={{ top: 25, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="dimension" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} stroke="#9ca3af" tickCount={6} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', borderRadius: 8 }}
                  formatter={(value: number) => [value.toFixed(1)]}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Bar dataKey="Adaptive" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="Adaptive" position="top" fill="#94a3b8" fontSize={11} formatter={(v: number) => v.toFixed(1)} />
                </Bar>
                <Bar dataKey="Control" fill="#6b7280" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="Control" position="top" fill="#94a3b8" fontSize={11} formatter={(v: number) => v.toFixed(1)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Paired NASA-TLX delta table */}
      {pairedSusDelta.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-accent mb-3">{t('dashboard.summaryStats.pairedNasaDelta')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent border-opacity-30">
                <th className="text-left p-2">{t('dashboard.summaryStats.dimension')}</th>
                <th className="text-right p-2">Adaptive</th>
                <th className="text-right p-2">Control</th>
                <th className="text-right p-2">Delta</th>
              </tr>
            </thead>
            <tbody>
              {nasaDimensions.map((dim) => {
                const aVals = adaptive
                  .map((s) => s.nasaTlx?.[dim])
                  .filter((v): v is number => v != null)
                  .map((v) => normalizeNasa(v, dim));
                const cVals = control
                  .map((s) => s.nasaTlx?.[dim])
                  .filter((v): v is number => v != null)
                  .map((v) => normalizeNasa(v, dim));
                const d = avg(pairedNasaDelta[dim]);
                return (
                  <tr key={dim} className="border-b border-gray-800">
                    <td className="p-2 capitalize">{dim}</td>
                    <td className="p-2 text-right font-mono text-accent">{avg(aVals).toFixed(1)}</td>
                    <td className="p-2 text-right font-mono text-gray-400">{avg(cVals).toFixed(1)}</td>
                    <td className={`p-2 text-right font-mono ${d < 0 ? 'text-green-400' : d > 0 ? 'text-red-400' : ''}`}>
                      {d >= 0 ? '+' : ''}{d.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-accent border-opacity-30">
                <td className="p-2 font-semibold">SUS</td>
                <td className="p-2 text-right font-mono text-accent">{avg(adaptiveSUS).toFixed(1)}</td>
                <td className="p-2 text-right font-mono text-gray-400">{avg(controlSUS).toFixed(1)}</td>
                <td className={`p-2 text-right font-mono font-semibold ${avg(pairedSusDelta) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {avg(pairedSusDelta) >= 0 ? '+' : ''}{avg(pairedSusDelta).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
