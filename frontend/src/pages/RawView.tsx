import { useState, useEffect } from 'react';
import { AdaptationProvider } from '../context/AdaptationContext';
import { useBehaviourCollector } from '../hooks/useBehaviourCollector';
import { useAdaptationEngine } from '../hooks/useAdaptationEngine';
import { applyUIState } from '../utils/applyUIState';
import { studyLogger } from '../services/studyLogger';
import { Article } from '../components/Article';
import { InteractionTestZone } from '../components/InteractionTestZone';
import { AdaptationMonitor } from '../components/AdaptationMonitor';
import { articleSets } from '../data/articles';

function RawViewContent() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [condition, setCondition] = useState<'adaptive' | 'control'>('adaptive');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCondition = params.get('condition');
    if (urlCondition === 'adaptive' || urlCondition === 'control') {
      setCondition(urlCondition);
    }

    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId: 'DEV_' + Date.now(),
        condition: urlCondition || condition,
        orderGroup: 'adaptive_first',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSessionId(data.id);
        studyLogger.initialize(data.id);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to create session:', error);
        setLoading(false);
      });
  }, []);

  const enabled = condition === 'adaptive';
  const signals = useBehaviourCollector(sessionId, enabled);
  const uiState = useAdaptationEngine(signals, enabled, sessionId);

  useEffect(() => {
    applyUIState(uiState);
  }, [uiState]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl adaptive-transition" style={{ fontSize: 'var(--font-size-base)' }}>
          Initializing session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <header className="max-w-4xl mx-auto px-4 mb-8">
        <h1
          className="font-bold mb-2 adaptive-transition"
          style={{
            fontSize: 'calc(var(--font-size-base) * 2)',
            lineHeight: 'var(--line-height)',
          }}
        >
          Adaptive Accessibility System (Raw View)
        </h1>
        <p
          className="opacity-75 adaptive-transition"
          style={{
            fontSize: 'calc(var(--font-size-base) * 1.125)',
            lineHeight: 'var(--line-height)',
          }}
        >
          Condition: <span className="font-semibold">{condition}</span> | Session:{' '}
          {sessionId?.slice(0, 8)}
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="space-y-12">
          <Article sections={articleSets[0].sections} />
          <InteractionTestZone />
        </div>
      </main>

      <AdaptationMonitor signals={signals} uiState={uiState} sessionId={sessionId} />
    </div>
  );
}

export function RawView() {
  return (
    <AdaptationProvider>
      <RawViewContent />
    </AdaptationProvider>
  );
}
