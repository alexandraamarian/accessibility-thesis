import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
    { condition: 'Adaptive', score: avg(adaptiveSUS) },
    { condition: 'Control', score: avg(controlSUS) },
  ];

  const nasaDimensions = ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'];
  const nasaData = nasaDimensions.map((dim) => {
    const adaptiveVals = adaptive
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null);
    const controlVals = control
      .map((s) => s.nasaTlx?.[dim])
      .filter((v): v is number => v !== undefined && v !== null);
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
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={susData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="condition" stroke="#9ca3af" />
                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8' }} />
                <Bar dataKey="score" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* NASA-TLX */}
      <div className="mb-8">
        <h3 className="font-semibold text-accent mb-3">{t('dashboard.summaryStats.nasaTlxByDimension')}</h3>
        {nasaData.every((d) => d.Adaptive === 0 && d.Control === 0) ? (
          <p className="opacity-50 text-sm">{t('dashboard.summaryStats.noNasaTlxData')}</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={nasaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dimension" stroke="#9ca3af" />
                <YAxis domain={[0, 7]} stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8' }} />
                <Legend />
                <Bar dataKey="Adaptive" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Control" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
