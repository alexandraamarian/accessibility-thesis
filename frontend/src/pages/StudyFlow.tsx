import { AdaptationProvider } from '../context/AdaptationContext';
import { StudyProvider, useStudyContext } from '../context/StudyContext';
import { useBehaviourCollector } from '../hooks/useBehaviourCollector';
import { useAdaptationEngine } from '../hooks/useAdaptationEngine';
import { useAdaptationContext } from '../context/AdaptationContext';
import { applyUIState } from '../utils/applyUIState';
import { DEFAULT_UI } from '../constants';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProgressTracker } from '../components/study/ProgressTracker';
import { ConsentScreen } from '../components/study/ConsentScreen';
import { DemographicsScreen } from '../components/study/DemographicsScreen';
import { WarmupPhase } from '../components/study/WarmupPhase';
import { TaskRunner } from '../components/study/TaskRunner';
import { SUSQuestionnaire } from '../components/study/SUSQuestionnaire';
import { NASATLXQuestionnaire } from '../components/study/NASATLXQuestionnaire';
import { FeedbackScreen } from '../components/study/FeedbackScreen';
import { SessionSummary } from '../components/study/SessionSummary';
import { AdaptationMonitor } from '../components/AdaptationMonitor';

function StudyFlowContent() {
  const { state } = useStudyContext();
  const { t } = useTranslation();

  const { dispatch: adaptDispatch } = useAdaptationContext();
  const prevSessionId = useRef(state.sessionId);

  // Reset UI to defaults when starting a new session (e.g., switching from adaptive to control)
  useEffect(() => {
    if (state.sessionId && state.sessionId !== prevSessionId.current) {
      adaptDispatch({ type: 'RESET' });
      applyUIState(DEFAULT_UI);
      prevSessionId.current = state.sessionId;
    }
  }, [state.sessionId, adaptDispatch]);

  // Always collect signals (both conditions need behavioral data for comparison)
  const collectSignals = state.consentGiven;
  // Only adapt UI in the adaptive condition
  const adaptEnabled = state.condition === 'adaptive' && state.consentGiven;
  const signals = useBehaviourCollector(state.sessionId, collectSignals);
  const uiState = useAdaptationEngine(signals, adaptEnabled, state.sessionId);

  useEffect(() => {
    applyUIState(uiState);
  }, [uiState]);

  const renderStep = () => {
    switch (state.step) {
      case 'consent':
        return <ConsentScreen />;
      case 'demographics':
        return <DemographicsScreen />;
      case 'warmup':
        return <WarmupPhase />;
      case 'tasks':
        return <TaskRunner />;
      case 'sus':
        return <SUSQuestionnaire />;
      case 'nasatlx':
        return <NASATLXQuestionnaire />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'summary':
      case 'complete':
        return <SessionSummary />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <header className="max-w-4xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <h1
            className="font-bold mb-2 text-center adaptive-transition flex-1"
            style={{
              fontSize: 'calc(var(--font-size-base) * 1.75)',
              lineHeight: 'var(--line-height)',
            }}
          >
            {t('study.title')}
          </h1>
          <div className="flex-1 flex justify-end">
            <LanguageSelector />
          </div>
        </div>
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
