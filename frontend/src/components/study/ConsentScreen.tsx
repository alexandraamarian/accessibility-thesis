import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

export function ConsentScreen() {
  const { dispatch } = useStudyContext();
  const { t } = useTranslation();
  const [participantId, setParticipantId] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [condition, setCondition] = useState<'adaptive' | 'control'>('adaptive');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!participantId.trim()) {
      setError(t('consent.errorNoId'));
      return;
    }
    if (!consentChecked) {
      setError(t('consent.errorNoConsent'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participantId.trim(),
          condition,
          orderGroup: condition === 'adaptive' ? 'adaptive_first' : 'control_first',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();

      studyLogger.initialize(session.id);
      studyLogger.log('consent_given', { participantId: participantId.trim(), condition });

      dispatch({ type: 'SET_PARTICIPANT', payload: { participantId: participantId.trim(), condition } });
      dispatch({ type: 'SET_SESSION_ID', payload: session.id });
      dispatch({ type: 'GIVE_CONSENT' });
      dispatch({ type: 'SET_STEP', payload: 'warmup' });
    } catch {
      setError(t('consent.errorSessionFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="font-bold mb-6 adaptive-transition"
        style={{ fontSize: 'calc(var(--font-size-base) * 1.5)', lineHeight: 'var(--line-height)' }}
      >
        {t('consent.heading')}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="border-2 border-accent border-opacity-30 rounded-lg p-6 mb-6">
          <legend className="text-accent font-semibold px-2">{t('consent.participantInfo')}</legend>

          <div className="mb-4">
            <label htmlFor="participantId" className="block mb-2 font-medium">
              {t('consent.participantId')}
            </label>
            <input
              id="participantId"
              type="text"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder={t('consent.participantIdPlaceholder')}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
              required
              aria-describedby={error ? 'consent-error' : undefined}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="condition" className="block mb-2 font-medium">
              {t('consent.condition')}
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'adaptive' | 'control')}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="adaptive">{t('consent.conditionAdaptive')}</option>
              <option value="control">{t('consent.conditionControl')}</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="border-2 border-accent border-opacity-30 rounded-lg p-6 mb-6">
          <legend className="text-accent font-semibold px-2">{t('consent.informedConsent')}</legend>

          <div className="mb-4 space-y-3 opacity-90" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
            <p>{t('consent.consentText1')}</p>
            <p>{t('consent.consentText2')}</p>
            <p>{t('consent.consentText3')}</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 w-5 h-5 accent-accent"
            />
            <span>{t('consent.consentCheckbox')}</span>
          </label>
        </fieldset>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? t('consent.creatingSession') : t('consent.beginStudy')}
        </Button>
      </form>
    </div>
  );
}
