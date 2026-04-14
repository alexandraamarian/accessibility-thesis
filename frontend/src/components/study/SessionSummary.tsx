import { useEffect, useState } from 'react';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';

export function SessionSummary() {
  const { state, dispatch } = useStudyContext();
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (state.sessionId && !ending) {
      setEnding(true);
      fetch(`/api/sessions/${state.sessionId}/end`, { method: 'PATCH' })
        .then(() => {
          studyLogger.log('study_phase_changed', { phase: 'complete' });
          studyLogger.destroy();
        })
        .catch(console.error);
    }
  }, [state.sessionId]);

  const totalDuration = state.taskResults.reduce((sum, t) => sum + t.durationSeconds, 0);
  const totalErrors = state.taskResults.reduce((sum, t) => sum + t.errors, 0);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2
        className="font-bold mb-6 adaptive-transition"
        style={{ fontSize: 'calc(var(--font-size-base) * 1.75)', lineHeight: 'var(--line-height)' }}
      >
        Thank You!
      </h2>

      <p className="mb-8 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        Your session is now complete. Here is a summary of your participation.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">Condition</div>
          <div className="text-lg font-semibold text-accent">{state.condition}</div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">Tasks Completed</div>
          <div className="text-lg font-semibold text-accent">{state.taskResults.length}</div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">Total Task Time</div>
          <div className="text-lg font-semibold text-accent">
            {Math.floor(totalDuration / 60)}m {Math.round(totalDuration % 60)}s
          </div>
        </div>
        <div className="border-2 border-accent border-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-60 mb-1">Total Errors</div>
          <div className="text-lg font-semibold text-accent">{totalErrors}</div>
        </div>
      </div>

      <div className="border-2 border-accent border-opacity-20 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Questionnaire Scores</h3>
        <div className="flex justify-center gap-8">
          <div>
            <div className="text-sm opacity-60 mb-1">SUS Score</div>
            <div className="text-2xl font-bold text-accent">
              {state.susResponses.length > 0
                ? calculateSUSScore(state.susResponses)
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-60 mb-1">NASA-TLX Avg</div>
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

      <p className="text-sm opacity-50">
        Session ID: {state.sessionId?.slice(0, 8)} | Participant: {state.participantId}
      </p>
      <p className="text-sm opacity-50 mt-2">
        You may now close this window or notify the researcher.
      </p>
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
  return Math.round(total * 2.5);
}
