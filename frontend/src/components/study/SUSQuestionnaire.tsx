import { useState } from 'react';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

const SUS_QUESTIONS = [
  'I think that I would like to use this system frequently.',
  'I found the system unnecessarily complex.',
  'I thought the system was easy to use.',
  'I think that I would need the support of a technical person to be able to use this system.',
  'I found the various functions in this system were well integrated.',
  'I thought there was too much inconsistency in this system.',
  'I would imagine that most people would learn to use this system very quickly.',
  'I found the system very cumbersome to use.',
  'I felt very confident using the system.',
  'I needed to learn a lot of things before I could get going with this system.',
];

const LIKERT_LABELS = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

function calculateSUSScore(responses: number[]): number {
  // SUS scoring: odd questions (1,3,5,7,9) subtract 1; even questions (2,4,6,8,10) subtract from 5
  // Sum contributions, multiply by 2.5
  let total = 0;
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      // Odd-numbered questions (0-indexed even)
      total += responses[i] - 1;
    } else {
      // Even-numbered questions (0-indexed odd)
      total += 5 - responses[i];
    }
  }
  return total * 2.5;
}

export function SUSQuestionnaire() {
  const { state, dispatch } = useStudyContext();
  const [responses, setResponses] = useState<number[]>(new Array(10).fill(0));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleResponse = (questionIndex: number, value: number) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const unanswered = responses.findIndex((r) => r === 0);
    if (unanswered !== -1) {
      setError(`Please answer question ${unanswered + 1}.`);
      return;
    }

    setSubmitting(true);
    const score = calculateSUSScore(responses);

    try {
      if (state.sessionId) {
        await fetch(`/api/sessions/${state.sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ susScore: Math.round(score) }),
        });
      }

      studyLogger.log('questionnaire_completed', {
        type: 'SUS',
        responses,
        score,
      });

      dispatch({ type: 'SET_SUS_RESPONSES', payload: responses });
      dispatch({ type: 'SET_STEP', payload: 'nasatlx' });
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
        System Usability Scale (SUS)
      </h2>
      <p className="mb-6 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        Please rate your agreement with each statement about the system you just used.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {SUS_QUESTIONS.map((question, qIndex) => (
            <fieldset key={qIndex} className="border-2 border-accent border-opacity-20 rounded-lg p-4">
              <legend className="font-medium px-2">
                {qIndex + 1}. {question}
              </legend>
              <div className="flex justify-between mt-3 gap-2">
                {LIKERT_LABELS.map((label, lIndex) => {
                  const value = lIndex + 1;
                  return (
                    <label
                      key={value}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded transition-colors ${
                        responses[qIndex] === value
                          ? 'bg-accent bg-opacity-20 text-accent'
                          : 'hover:bg-accent hover:bg-opacity-10'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`sus-q${qIndex}`}
                        value={value}
                        checked={responses[qIndex] === value}
                        onChange={() => handleResponse(qIndex, value)}
                        className="mb-1"
                      />
                      <span className="text-xs text-center">{label}</span>
                    </label>
                  );
                })}
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
            {submitting ? 'Saving...' : 'Continue to NASA-TLX'}
          </Button>
        </div>
      </form>
    </div>
  );
}
