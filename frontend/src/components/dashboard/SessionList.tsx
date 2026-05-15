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
  metadata: {
    demographics?: {
      ageRange?: string;
      hasDisability?: string;
      computerProficiency?: string;
    };
  } | null;
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
  const [ageFilter, setAgeFilter] = useState('');
  const [disabilityFilter, setDisabilityFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('startedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [completedBothOnly, setCompletedBothOnly] = useState(false);
  const [incompleteOnly, setIncompleteOnly] = useState(false);

  // Build set of participant IDs who completed both conditions with SUS + NASA-TLX
  const completedBothParticipants = (() => {
    const byParticipant = new Map<string, Set<string>>();
    for (const s of sessions) {
      if (s.susScore != null && s.nasaTlx != null && s.endedAt) {
        if (!byParticipant.has(s.participantId)) byParticipant.set(s.participantId, new Set());
        byParticipant.get(s.participantId)!.add(s.condition);
      }
    }
    const ids = new Set<string>();
    for (const [pid, conditions] of byParticipant) {
      if (conditions.has('adaptive') && conditions.has('control')) ids.add(pid);
    }
    return ids;
  })();

  // Build set of participant IDs with incomplete data (only one session, no SUS, or no NASA-TLX)
  const incompleteParticipants = (() => {
    const byParticipant = new Map<string, { conditions: Set<string>; allHaveScores: boolean }>();
    for (const s of sessions) {
      if (!byParticipant.has(s.participantId)) {
        byParticipant.set(s.participantId, { conditions: new Set(), allHaveScores: true });
      }
      const entry = byParticipant.get(s.participantId)!;
      entry.conditions.add(s.condition);
      if (s.susScore == null || s.nasaTlx == null || !s.endedAt) {
        entry.allHaveScores = false;
      }
    }
    const ids = new Set<string>();
    for (const [pid, { conditions, allHaveScores }] of byParticipant) {
      if (!conditions.has('adaptive') || !conditions.has('control') || !allHaveScores) {
        ids.add(pid);
      }
    }
    return ids;
  })();

  const filtered = sessions.filter((s) => {
    if (completedBothOnly && !completedBothParticipants.has(s.participantId)) return false;
    if (incompleteOnly && !incompleteParticipants.has(s.participantId)) return false;
    if (filter && !s.participantId.toLowerCase().includes(filter.toLowerCase())) return false;
    if (conditionFilter && s.condition !== conditionFilter) return false;
    if (ageFilter && s.metadata?.demographics?.ageRange !== ageFilter) return false;
    if (disabilityFilter && s.metadata?.demographics?.hasDisability !== disabilityFilter) return false;
    if (proficiencyFilter && s.metadata?.demographics?.computerProficiency !== proficiencyFilter) return false;
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

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => { setCompletedBothOnly(!completedBothOnly); setIncompleteOnly(false); }}
          className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
            completedBothOnly
              ? 'border-accent bg-accent bg-opacity-20 text-accent'
              : 'border-gray-600 bg-transparent text-inherit opacity-75 hover:opacity-100'
          }`}
        >
          {t('dashboard.sessionList.completedBoth', { count: completedBothParticipants.size })}
        </button>
        <button
          onClick={() => { setIncompleteOnly(!incompleteOnly); setCompletedBothOnly(false); }}
          className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
            incompleteOnly
              ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-400'
              : 'border-gray-600 bg-transparent text-inherit opacity-75 hover:opacity-100'
          }`}
        >
          {t('dashboard.sessionList.incomplete', { count: incompleteParticipants.size })}
        </button>
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
        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit text-sm"
        >
          <option value="">{t('dashboard.sessionList.allAgeRanges')}</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55-64">55-64</option>
          <option value="65+">65+</option>
        </select>
        <select
          value={disabilityFilter}
          onChange={(e) => setDisabilityFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit text-sm"
        >
          <option value="">{t('dashboard.sessionList.allDisabilities')}</option>
          <option value="none">{t('demographics.disabilityNone')}</option>
          <option value="visual">{t('demographics.disabilityVisual')}</option>
          <option value="motor">{t('demographics.disabilityMotor')}</option>
          <option value="cognitive">{t('demographics.disabilityCognitive')}</option>
          <option value="other">{t('demographics.disabilityOther')}</option>
          <option value="prefer-not-to-say">{t('demographics.genderPreferNot')}</option>
        </select>
        <select
          value={proficiencyFilter}
          onChange={(e) => setProficiencyFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-600 bg-transparent text-inherit text-sm"
        >
          <option value="">{t('dashboard.sessionList.allProficiencies')}</option>
          <option value="beginner">{t('demographics.proficiencyBeginner')}</option>
          <option value="intermediate">{t('demographics.proficiencyIntermediate')}</option>
          <option value="advanced">{t('demographics.proficiencyAdvanced')}</option>
          <option value="expert">{t('demographics.proficiencyExpert')}</option>
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
                ? (Object.entries(session.nasaTlx).map(([k, v]) => {
                    const normalized = v > 10 ? Math.round(v / 10) : v;
                    return k === 'performance' ? 10 - normalized : normalized;
                  }).reduce((a, b) => a + b, 0) / Object.keys(session.nasaTlx).length).toFixed(1)
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
