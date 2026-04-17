import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

export function FeedbackScreen() {
  const { t } = useTranslation();
  const { state, dispatch } = useStudyContext();
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const feedback = response.trim();

    try {
      if (state.sessionId) {
        await fetch(`/api/sessions/${state.sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metadata: { openEndedFeedback: feedback } }),
        });
      }

      studyLogger.log('questionnaire_completed', {
        type: 'open_ended_feedback',
        response: feedback,
      });

      dispatch({ type: 'SET_STEP', payload: 'summary' });
    } catch {
      dispatch({ type: 'SET_STEP', payload: 'summary' });
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
        {t('feedback.heading')}
      </h2>
      <p className="mb-6 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {t('feedback.instructions')}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4 mb-6">
          <legend className="font-medium px-2">{t('feedback.question')}</legend>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={t('feedback.placeholder')}
            rows={5}
            className="w-full px-4 py-3 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent resize-y"
            style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}
          />
        </fieldset>

        <Button type="submit" disabled={submitting}>
          {submitting ? t('common.saving') : t('feedback.continue')}
        </Button>
      </form>
    </div>
  );
}
