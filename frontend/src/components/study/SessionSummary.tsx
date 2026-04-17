import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

export function SessionSummary() {
  const { t } = useTranslation();
  const { state, dispatch } = useStudyContext();
  const [ending, setEnding] = useState(false);
  const [hasNextSession, setHasNextSession] = useState(false);
  const [checkingNext, setCheckingNext] = useState(true);
  const [startingNext, setStartingNext] = useState(false);

  // End current session and check if next session is available
  useEffect(() => {
    if (state.sessionId && !ending) {
      setEnding(true);
      fetch(`/api/sessions/${state.sessionId}/end`, { method: 'PATCH' })
        .then(() => {
          studyLogger.log('study_phase_changed', { phase: 'complete' });
          studyLogger.destroy();
        })
        .catch(console.error);

      // Check if this participant can do a second session
      fetch(`/api/sessions?participantId=${encodeURIComponent(state.participantId)}`)
        .then((r) => r.json())
        .then((sessions: any[]) => {
          setHasNextSession(sessions.length < 2);
        })
        .catch(() => setHasNextSession(false))
        .finally(() => setCheckingNext(false));
    }
  }, [state.sessionId]);

  const handleStartNextSession = async () => {
    setStartingNext(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.participantId }),
      });

      if (!response.ok) {
        setHasNextSession(false);
        return;
      }

      const session = await response.json();

      studyLogger.initialize(session.id);
      studyLogger.log('consent_given', {
        email: state.participantId,
        condition: session.condition,
        isSecondSession: true,
      });

      dispatch({
        type: 'START_NEXT_SESSION',
        payload: { sessionId: session.id, condition: session.condition },
      });
    } catch {
      setHasNextSession(false);
    } finally {
      setStartingNext(false);
    }
  };

  const totalDuration = state.taskResults.reduce((sum, r) => sum + r.durationSeconds, 0);
  const totalErrors = state.taskResults.reduce((sum, r) => sum + r.errors, 0);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2
        className="font-bold mb-6 adaptive-transition"
        style={{ fontSize: 'calc(var(--font-size-base) * 1.75)', lineHeight: 'var(--line-height)' }}
      >
        {t('summary.heading')}
      </h2>

      <p className="mb-8 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {t('summary.description')}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">{t('summary.condition')}</div>
          <div className="text-lg font-semibold text-accent">{state.condition}</div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">{t('summary.tasksCompleted')}</div>
          <div className="text-lg font-semibold text-accent">{state.taskResults.length}</div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">{t('summary.totalTaskTime')}</div>
          <div className="text-lg font-semibold text-accent">
            {Math.floor(totalDuration / 60)}m {Math.round(totalDuration % 60)}s
          </div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">{t('summary.totalErrors')}</div>
          <div className="text-lg font-semibold text-accent">{totalErrors}</div>
        </div>
      </div>

      <div className="border-2 border-accent border-opacity-20 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">{t('summary.questionnaireScores')}</h3>
        <div className="flex justify-center gap-8">
          <div>
            <div className="text-sm opacity-60 mb-1">{t('summary.susScore')}</div>
            <div className="text-2xl font-bold text-accent">
              {state.susResponses.length > 0
                ? calculateSUSScore(state.susResponses).toFixed(1)
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-60 mb-1">{t('summary.nasaTlxAvg')}</div>
            <div className="text-2xl font-bold text-accent">
              {state.nasaTlxResponses
                ? (
                    Object.values(state.nasaTlxResponses).reduce((a, b) => a + b, 0) /
                    Object.values(state.nasaTlxResponses).length
                  ).toFixed(1)
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Next session button */}
      {!checkingNext && hasNextSession && (
        <div className="mb-8 p-6 border-2 border-green-500 border-opacity-30 rounded-lg bg-green-900 bg-opacity-10">
          <p className="mb-4 text-sm">{t('summary.nextSessionPrompt')}</p>
          <Button onClick={handleStartNextSession} disabled={startingNext}>
            {startingNext ? t('common.loading') : t('summary.startNextSession')}
          </Button>
        </div>
      )}

      <p className="text-sm opacity-50">
        {t('summary.sessionInfo', { sessionId: state.sessionId?.slice(0, 8), participantId: state.participantId })}
      </p>
      {!hasNextSession && !checkingNext && (
        <p className="text-sm opacity-50 mt-2">
          {t('summary.closeMessage')}
        </p>
      )}
    </div>
  );
}

function calculateSUSScore(responses: number[]): number {
  let total = 0;
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      total += responses[i] - 1;
    } else {
      total += 5 - responses[i];
    }
  }
  return total * 2.5;
}
