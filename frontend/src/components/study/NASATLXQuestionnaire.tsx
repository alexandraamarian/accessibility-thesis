import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext, NasaTlxResponses } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

const dimensionKeys = ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'] as const;

export function NASATLXQuestionnaire() {
  const { t } = useTranslation();
  const { state, dispatch } = useStudyContext();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: number) => {
    setResponses({ ...responses, [key]: value });
    setTouched({ ...touched, [key]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const unansweredKey = dimensionKeys.find((k) => !touched[k]);
    if (unansweredKey) {
      setError(t('nasatlx.errorUnanswered', { dimension: t(`nasatlx.dimensions.${unansweredKey}.label`) }));
      return;
    }

    setSubmitting(true);
    // Store raw values as entered by the participant.
    // Performance is reverse-scored only during analysis/export (not at storage).
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
        const saveRes = await fetch(`/api/sessions/${state.sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nasaTlx }),
        });

        if (!saveRes.ok) {
          throw new Error('Failed to save NASA-TLX');
        }

        // End session immediately — all critical data (tasks, SUS, NASA-TLX) is saved.
        // Feedback is optional; if the user closes before submitting it, we still have complete data.
        await fetch(`/api/sessions/${state.sessionId}/end`, { method: 'PATCH' });
      }

      studyLogger.log('questionnaire_completed', {
        type: 'NASA-TLX',
        responses: nasaTlx,
      });
      studyLogger.log('study_phase_changed', { phase: 'complete' });

      dispatch({ type: 'SET_NASA_TLX', payload: nasaTlx });
      dispatch({ type: 'SET_STEP', payload: 'feedback' });
    } catch {
      setError(t('nasatlx.errorSaveFailed'));
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
        {t('nasatlx.heading')}
      </h2>
      <p className="mb-6 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {t('nasatlx.instructions')}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {dimensionKeys.map((key) => {
            const dim = t(`nasatlx.dimensions.${key}`, { returnObjects: true }) as { label: string; description: string; lowEnd: string; highEnd: string };
            return (
              <fieldset key={key} className="border-2 border-accent border-opacity-20 rounded-lg p-4">
                <legend className="font-medium px-2">{dim.label}</legend>
                <p className="text-sm opacity-75 mb-3">{dim.description}</p>

                <div className="flex items-center gap-2">
                  <span className="text-xs w-14 text-right opacity-60">{dim.lowEnd}</span>
                  <div className="flex-1 grid grid-cols-5 sm:grid-cols-10 gap-1" role="radiogroup" aria-label={dim.label}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleChange(key, value)}
                        className={`min-h-[44px] py-2 rounded text-sm font-medium transition-colors ${
                          responses[key] === value
                            ? 'bg-accent bg-opacity-20 text-accent border-2 border-accent'
                            : 'border-2 border-gray-600 hover:bg-accent hover:bg-opacity-10'
                        }`}
                        aria-label={`${value}`}
                        aria-pressed={responses[key] === value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs w-14 opacity-60">{dim.highEnd}</span>
                </div>
              </fieldset>
            );
          })}
        </div>

        {error && (
          <div role="alert" className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? t('common.saving') : t('nasatlx.continueToSummary')}
          </Button>
        </div>
      </form>
    </div>
  );
}
