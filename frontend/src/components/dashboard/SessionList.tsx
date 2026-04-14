import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Session {
  id: string;
  participantId: string;
  condition: 'adaptive' | 'control';
  orderGroup: string;
  startedAt: string;
  endedAt: string | null;
  susScore: number | null;
  nasaTlx: Record<string, number> | null;
}

interface SessionListProps {
  sessions: Session[];
  onSelect: (id: string) => void;
}

type SortField = 'startedAt' | 'participantId' | 'condition' | 'susScore';

export function SessionList({ sessions, onSelect }: SessionListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'' | 'adaptive' | 'control'>('');
  const [sortField, setSortField] = useState<SortField>('startedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = sessions.filter((s) => {
    if (filter && !s.participantId.toLowerCase().includes(filter.toLowerCase())) return false;
    if (conditionFilter && s.condition !== conditionFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'startedAt':
        cmp = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        break;
      case 'participantId':
        cmp = a.participantId.localeCompare(b.participantId);
        break;
      case 'condition':
        cmp = a.condition.localeCompare(b.condition);
        break;
      case 'susScore':
        cmp = (a.susScore || 0) - (b.susScore || 0);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-accent mb-4">{t('dashboard.sessionList.heading', { count: sessions.length })}</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder={t('dashboard.sessionList.filterPlaceholder')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit text-sm"
        />
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value as '' | 'adaptive' | 'control')}
          className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit text-sm"
        >
          <option value="">{t('dashboard.sessionList.allConditions')}</option>
          <option value="adaptive">{t('common.adaptive')}</option>
          <option value="control">{t('common.control')}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-accent border-opacity-30">
              {[
                { key: 'participantId' as const, label: t('dashboard.sessionList.participant') },
                { key: 'condition' as const, label: t('dashboard.sessionList.condition') },
                { key: 'startedAt' as const, label: t('dashboard.sessionList.started') },
                { key: 'susScore' as const, label: t('dashboard.sessionList.sus') },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left p-2 cursor-pointer hover:text-accent"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortField === col.key ? (sortAsc ? '\u2191' : '\u2193') : ''}
                </th>
              ))}
              <th className="text-left p-2">{t('dashboard.sessionList.nasaTlx')}</th>
              <th className="text-left p-2">{t('dashboard.sessionList.status')}</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((session) => {
              const nasaAvg = session.nasaTlx
                ? (Object.values(session.nasaTlx).reduce((a, b) => a + b, 0) / Object.values(session.nasaTlx).length).toFixed(1)
                : '-';

              return (
                <tr key={session.id} className="border-b border-gray-800 hover:bg-accent hover:bg-opacity-5">
                  <td className="p-2 font-mono">{session.participantId}</td>
                  <td className="p-2">
                    <span className={session.condition === 'adaptive' ? 'text-accent' : 'text-gray-400'}>
                      {session.condition}
                    </span>
                  </td>
                  <td className="p-2">{new Date(session.startedAt).toLocaleString()}</td>
                  <td className="p-2 font-mono">{session.susScore ?? '-'}</td>
                  <td className="p-2 font-mono">{nasaAvg}</td>
                  <td className="p-2">
                    <span className={session.endedAt ? 'text-green-400' : 'text-yellow-400'}>
                      {session.endedAt ? t('common.complete') : t('common.active')}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => onSelect(session.id)}
                      className="text-accent hover:underline text-sm"
                    >
                      {t('common.view')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <p className="text-center opacity-50 py-8">{t('dashboard.sessionList.noSessions')}</p>
      )}
    </div>
  );
}
