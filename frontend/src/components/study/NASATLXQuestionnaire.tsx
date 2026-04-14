import { useState } from 'react';
import { useStudyContext, NasaTlxResponses } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

const NASA_TLX_DIMENSIONS = [
  {
    key: 'mental' as const,
    label: 'Mental Demand',
    lowEnd: 'Very Low',
    highEnd: 'Very High',
    description: 'How mentally demanding was the task?',
  },
  {
    key: 'physical' as const,
    label: 'Physical Demand',
    lowEnd: 'Very Low',
    highEnd: 'Very High',
    description: 'How physically demanding was the task?',
  },
  {
    key: 'temporal' as const,
    label: 'Temporal Demand',
    lowEnd: 'Very Low',
    highEnd: 'Very High',
    description: 'How hurried or rushed was the pace of the task?',
  },
  {
    key: 'performance' as const,
    label: 'Performance',
    lowEnd: 'Perfect',
    highEnd: 'Failure',
    description: 'How successful were you in accomplishing what you were asked to do?',
  },
  {
    key: 'effort' as const,
    label: 'Effort',
    lowEnd: 'Very Low',
    highEnd: 'Very High',
    description: 'How hard did you have to work to accomplish your level of performance?',
  },
  {
    key: 'frustration' as const,
    label: 'Frustration',
    lowEnd: 'Very Low',
    highEnd: 'Very High',
    description: 'How insecure, discouraged, irritated, stressed, and annoyed were you?',
  },
];

export function NASATLXQuestionnaire() {
  const { state, dispatch } = useStudyContext();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: number) => {
    setResponses({ ...responses, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const unanswered = NASA_TLX_DIMENSIONS.find((d) => responses[d.key] === undefined);
    if (unanswered) {
      setError(`Please rate "${unanswered.label}".`);
      return;
    }

    setSubmitting(true);
    const nasaTlx: NasaTlxResponses = {
      mental: responses.mental,
      physical: responses.physical,
      temporal: responses.temporal,
      performance: responses.performance,
      effort: responses.effort,
      frustration: responses.frustration,
    };

    try {
      if (state.sessionId) {
        await fetch(`/api/sessions/${state.sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nasaTlx }),
        });
      }

      studyLogger.log('questionnaire_completed', {
        type: 'NASA-TLX',
        responses: nasaTlx,
      });

      dispatch({ type: 'SET_NASA_TLX', payload: nasaTlx });
      dispatch({ type: 'SET_STEP', payload: 'summary' });
    } catch {
      setError('Failed to save responses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="font-bold mb-2 adaptive-transition"
        style={{ fontSize: 'calc(var(--font-size-base) * 1.5)', lineHeight: 'var(--line-height)' }}
      >
        NASA Task Load Index (NASA-TLX)
      </h2>
      <p className="mb-6 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        Rate each dimension on a scale of 1 (low) to 7 (high).
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {NASA_TLX_DIMENSIONS.map((dimension) => (
            <fieldset key={dimension.key} className="border-2 border-accent border-opacity-20 rounded-lg p-4">
              <legend className="font-medium px-2">{dimension.label}</legend>
              <p className="text-sm opacity-75 mb-3">{dimension.description}</p>

              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right opacity-60">{dimension.lowEnd}</span>
                <div className="flex gap-1 flex-1 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <label
                      key={value}
                      className={`flex flex-col items-center cursor-pointer px-3 py-2 rounded transition-colors ${
                        responses[dimension.key] === value
                          ? 'bg-accent bg-opacity-20 text-accent'
                          : 'hover:bg-accent hover:bg-opacity-10'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`nasa-${dimension.key}`}
                        value={value}
                        checked={responses[dimension.key] === value}
                        onChange={() => handleChange(dimension.key, value)}
                        className="mb-1"
                      />
                      <span className="text-sm font-mono">{value}</span>
                    </label>
                  ))}
                </div>
                <span className="text-xs w-16 opacity-60">{dimension.highEnd}</span>
              </div>
            </fieldset>
          ))}
        </div>

        {error && (
          <div role="alert" className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Continue to Summary'}
          </Button>
        </div>
      </form>
    </div>
  );
}
