import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConsentScreen() {
  const { dispatch } = useStudyContext();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(t('consent.errorNoEmail'));
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError(t('consent.errorInvalidEmail'));
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
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (response.status === 409) {
        setError(t('consent.errorDuplicateEmail'));
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();

      // Condition is auto-assigned by the backend (blinded from participant)
      const condition = session.condition;

      studyLogger.initialize(session.id);
      studyLogger.log('consent_given', { email: trimmedEmail, condition });

      // Log device info automatically for cross-device analysis
      const deviceInfo = {
        userAgent: navigator.userAgent,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        inputType: navigator.maxTouchPoints > 0 ? 'touch' : 'mouse',
        language: navigator.language,
        platform: navigator.platform,
      };

      // Store device info in session metadata
      fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: { deviceInfo } }),
      }).catch(() => {});

      studyLogger.log('device_info', deviceInfo);

      dispatch({ type: 'SET_PARTICIPANT', payload: { participantId: trimmedEmail, condition } });
      dispatch({ type: 'SET_SESSION_ID', payload: session.id });
      if (session.sessionIndex != null) {
        dispatch({ type: 'SET_SESSION_INDEX', payload: session.sessionIndex });
      }
      dispatch({ type: 'GIVE_CONSENT' });
      dispatch({ type: 'SET_STEP', payload: 'demographics' });
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
            <label htmlFor="email" className="block mb-2 font-medium">
              {t('consent.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('consent.emailPlaceholder')}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
              required
              autoComplete="email"
              aria-describedby={error ? 'consent-error' : undefined}
            />
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
          <div role="alert" id="consent-error" className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300">
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
