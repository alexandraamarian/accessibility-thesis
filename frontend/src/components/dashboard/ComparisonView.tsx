import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Session {
  id: string;
  participantId: string;
  condition: 'adaptive' | 'control';
  susScore: number | null;
  nasaTlx: Record<string, number> | null;
  startedAt: string;
  endedAt: string | null;
}

interface ComparisonViewProps {
  sessions: Session[];
}

export function ComparisonView({ sessions }: ComparisonViewProps) {
  const { t } = useTranslation();
  const [selectedParticipant, setSelectedParticipant] = useState('');

  // Get unique participant IDs that have both conditions
  const participantIds = [...new Set(sessions.map((s) => s.participantId))];
  const pairedParticipants = participantIds.filter((pid) => {
    const conditions = sessions.filter((s) => s.participantId === pid).map((s) => s.condition);
    return conditions.includes('adaptive') && conditions.includes('control');
  });

  const selected = selectedParticipant || pairedParticipants[0] || '';
  const adaptiveSession = sessions.find((s) => s.participantId === selected && s.condition === 'adaptive');
  const controlSession = sessions.find((s) => s.participantId === selected && s.condition === 'control');

  const delta = (a: number | null, b: number | null) => {
    if (a === null || b === null) return null;
    return a - b;
  };

  const formatDelta = (d: number | null) => {
    if (d === null) return '-';
    const sign = d > 0 ? '+' : '';
    return `${sign}${d.toFixed(1)}`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-accent mb-4">{t('dashboard.comparison.heading')}</h2>

      {pairedParticipants.length === 0 ? (
        <p className="opacity-50">
          {t('dashboard.comparison.noParticipants')}
        </p>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="participant-select" className="block mb-2 text-sm">
              {t('dashboard.comparison.selectParticipant')}
            </label>
            <select
              id="participant-select"
              value={selected}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit"
            >
              {pairedParticipants.map((pid) => (
                <option key={pid} value={pid}>{pid}</option>
              ))}
            </select>
          </div>

          {adaptiveSession && controlSession && (
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-accent border-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-3">{t('dashboard.comparison.adaptive')}</h3>
                <div className="space-y-2 text-sm">
                  <div>SUS: <span className="font-mono">{adaptiveSession.susScore ?? '-'}</span></div>
                  {adaptiveSession.nasaTlx && Object.entries(adaptiveSession.nasaTlx).map(([key, value]) => (
                    <div key={key} className="capitalize">
                      {key}: <span className="font-mono">{value as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-accent border-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-3">{t('dashboard.comparison.control')}</h3>
                <div className="space-y-2 text-sm">
                  <div>SUS: <span className="font-mono">{controlSession.susScore ?? '-'}</span></div>
                  {controlSession.nasaTlx && Object.entries(controlSession.nasaTlx).map(([key, value]) => (
                    <div key={key} className="capitalize">
                      {key}: <span className="font-mono">{value as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-yellow-600 border-opacity-30 rounded-lg p-4 bg-yellow-900 bg-opacity-10">
                <h3 className="font-semibold text-yellow-400 mb-3">{t('dashboard.comparison.delta')}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    SUS:{' '}
                    <span className={`font-mono ${(delta(adaptiveSession.susScore, controlSession.susScore) ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatDelta(delta(adaptiveSession.susScore, controlSession.susScore))}
                    </span>
                  </div>
                  {adaptiveSession.nasaTlx && controlSession.nasaTlx &&
                    Object.keys(adaptiveSession.nasaTlx).map((key) => {
                      const d = delta(
                        (adaptiveSession.nasaTlx as Record<string, number>)[key],
                        (controlSession.nasaTlx as Record<string, number>)[key]
                      );
                      return (
                        <div key={key} className="capitalize">
                          {key}:{' '}
                          <span className={`font-mono ${(d ?? 0) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatDelta(d)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
