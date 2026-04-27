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
  const adaptive = sessions.filter((s) => s.condition === 'adaptive');
  const control = sessions.filter((s) => s.condition === 'control');

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const adaptiveSUS = adaptive.map((s) => s.susScore).filter((v): v is number => v !== null);
  const controlSUS = control.map((s) => s.susScore).filter((v): v is number => v !== null);

  const susData = [
    { condition: 'Adaptive', score: Math.round(avg(adaptiveSUS) * 10) / 10, count: adaptiveSUS.length },
    { condition: 'Control', score: Math.round(avg(controlSUS) * 10) / 10, count: controlSUS.length },
  ];
  const SUS_COLORS = ['#38bdf8', '#6b7280'];

  // Normalize NASA-TLX values: old sessions used 0-100, new ones use 1-10.
  // Values > 10 are from the old scale and are converted to the 1-10 range.
  const normalizeNasa = (v: number) => v > 10 ? Math.round(v / 10) : v;

  const nasaDimensions = ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'];
  const nasaData = nasaDimensions.map((dim) => {
    const adaptiveVals = adaptive
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null)
      .map(normalizeNasa);
    const controlVals = control
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null)
      .map(normalizeNasa);
    return {
      dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
      Adaptive: avg(adaptiveVals),
      Control: avg(controlVals),
    };
  });

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

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.totalSessions')}</div>
          <div className="text-2xl font-bold text-accent">{sessions.length}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('common.adaptive')}</div>
          <div className="text-2xl font-bold text-accent">{adaptive.length}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('common.control')}</div>
          <div className="text-2xl font-bold text-accent">{control.length}</div>
        </div>
        <div className="border border-accent border-opacity-20 rounded p-3 text-center">
          <div className="text-xs opacity-60">{t('dashboard.summaryStats.completed')}</div>
          <div className="text-2xl font-bold text-accent">
            {sessions.filter((s) => s.endedAt).length}
          </div>
        </div>
      </div>

      {/* SUS Scores */}
      <div className="mb-8">
        <h3 className="font-semibold text-accent mb-3">{t('dashboard.summaryStats.meanSusByCondition')}</h3>
        {adaptiveSUS.length === 0 && controlSUS.length === 0 ? (
          <p className="opacity-50 text-sm">{t('dashboard.summaryStats.noSusScores')}</p>
        ) : (
          <div className="flex gap-8 items-end">
            {/* Chart */}
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
            {/* Side stats */}
            <div className="flex-shrink-0 space-y-3 pb-4">
              <div className="border border-accent border-opacity-20 rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-xs opacity-50 mb-1">Adaptive (n={adaptiveSUS.length})</div>
                <div className="text-2xl font-bold text-accent">{avg(adaptiveSUS).toFixed(1)}</div>
              </div>
              <div className="border border-gray-600 border-opacity-30 rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-xs opacity-50 mb-1">Control (n={controlSUS.length})</div>
                <div className="text-2xl font-bold text-gray-400">{avg(controlSUS).toFixed(1)}</div>
              </div>
              <div className="border border-yellow-600 border-opacity-30 rounded-lg p-3 text-center min-w-[120px] bg-yellow-900 bg-opacity-10">
                <div className="text-xs opacity-50 mb-1">Delta</div>
                <div className={`text-lg font-bold ${avg(adaptiveSUS) - avg(controlSUS) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {avg(adaptiveSUS) - avg(controlSUS) >= 0 ? '+' : ''}{(avg(adaptiveSUS) - avg(controlSUS)).toFixed(1)}
                </div>
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
    </div>
  );
}
