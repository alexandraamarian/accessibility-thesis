import { useState, useEffect } from 'react';
import { SessionList } from '../components/dashboard/SessionList';
import { SessionDetail } from '../components/dashboard/SessionDetail';
import { ComparisonView } from '../components/dashboard/ComparisonView';
import { SummaryStats } from '../components/dashboard/SummaryStats';

type DashboardView = 'sessions' | 'detail' | 'comparison' | 'summary';

interface Session {
  id: string;
  participantId: string;
  condition: 'adaptive' | 'control';
  orderGroup: string;
  startedAt: string;
  endedAt: string | null;
  susScore: number | null;
  nasaTlx: Record<string, number> | null;
  events?: any[];
  adaptations?: any[];
}

export function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [view, setView] = useState<DashboardView>('sessions');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expectedPassphrase = 'ale-researcher-2024';

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === expectedPassphrase) {
      setAuthenticated(true);
      loadSessions();
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadSessions();
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <form onSubmit={handleAuth} className="border-2 border-accent border-opacity-30 rounded-lg p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold mb-4 text-accent">Researcher Dashboard</h1>
          <label htmlFor="passphrase" className="block mb-2 text-sm">
            Enter passphrase
          </label>
          <input
            id="passphrase"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-accent text-bg py-2 rounded font-semibold hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-48 min-h-screen border-r border-accent border-opacity-20 p-4 flex-shrink-0">
          <h1 className="text-lg font-bold text-accent mb-6">Dashboard</h1>
          <ul className="space-y-2">
            {[
              { key: 'sessions' as const, label: 'Sessions' },
              { key: 'comparison' as const, label: 'Compare' },
              { key: 'summary' as const, label: 'Summary' },
            ].map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setView(item.key)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    view === item.key
                      ? 'bg-accent bg-opacity-20 text-accent'
                      : 'hover:bg-accent hover:bg-opacity-10'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-accent border-opacity-20">
            <button
              onClick={loadSessions}
              className="w-full text-left px-3 py-2 rounded text-sm hover:bg-accent hover:bg-opacity-10"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {view === 'sessions' && !selectedSessionId && (
            <SessionList
              sessions={sessions}
              onSelect={(id) => {
                setSelectedSessionId(id);
                setView('detail');
              }}
            />
          )}
          {view === 'detail' && selectedSessionId && (
            <SessionDetail
              sessionId={selectedSessionId}
              onBack={() => {
                setSelectedSessionId(null);
                setView('sessions');
              }}
            />
          )}
          {view === 'comparison' && <ComparisonView sessions={sessions} />}
          {view === 'summary' && <SummaryStats sessions={sessions} />}
        </main>
      </div>
    </div>
  );
}
