import { AdaptationProvider } from '../context/AdaptationContext';
import { StudyProvider, useStudyContext } from '../context/StudyContext';
import { useBehaviourCollector } from '../hooks/useBehaviourCollector';
import { useAdaptationEngine } from '../hooks/useAdaptationEngine';
import { applyUIState } from '../utils/applyUIState';
import { useEffect } from 'react';
import { ProgressTracker } from '../components/study/ProgressTracker';
import { ConsentScreen } from '../components/study/ConsentScreen';
import { WarmupPhase } from '../components/study/WarmupPhase';
import { TaskRunner } from '../components/study/TaskRunner';
import { SUSQuestionnaire } from '../components/study/SUSQuestionnaire';
import { NASATLXQuestionnaire } from '../components/study/NASATLXQuestionnaire';
import { SessionSummary } from '../components/study/SessionSummary';
import { AdaptationMonitor } from '../components/AdaptationMonitor';

function StudyFlowContent() {
  const { state } = useStudyContext();

  const enabled = state.condition === 'adaptive' && state.consentGiven;
  const signals = useBehaviourCollector(state.sessionId, enabled);
  const uiState = useAdaptationEngine(signals, enabled, state.sessionId);

  useEffect(() => {
    applyUIState(uiState);
  }, [uiState]);

  const renderStep = () => {
    switch (state.step) {
      case 'consent':
        return <ConsentScreen />;
      case 'warmup':
        return <WarmupPhase />;
      case 'tasks':
        return <TaskRunner />;
      case 'sus':
        return <SUSQuestionnaire />;
      case 'nasatlx':
        return <NASATLXQuestionnaire />;
      case 'summary':
      case 'complete':
        return <SessionSummary />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <header className="max-w-4xl mx-auto px-4 mb-4">
        <h1
          className="font-bold mb-2 text-center adaptive-transition"
          style={{
            fontSize: 'calc(var(--font-size-base) * 1.75)',
            lineHeight: 'var(--line-height)',
          }}
        >
          Adaptive Accessibility Study
        </h1>
      </header>

      {state.step !== 'consent' && (
        <div className="max-w-4xl mx-auto px-4">
          <ProgressTracker currentStep={state.step} />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4">
        {renderStep()}
      </main>

      {state.consentGiven && (
        <AdaptationMonitor signals={signals} uiState={uiState} sessionId={state.sessionId} />
      )}
    </div>
  );
}

export function StudyFlow() {
  return (
    <StudyProvider>
      <AdaptationProvider>
        <StudyFlowContent />
      </AdaptationProvider>
    </StudyProvider>
  );
}
