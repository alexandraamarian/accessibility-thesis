import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Button } from '../Button';

export function DemographicsScreen() {
  const { t } = useTranslation();
  const { state, dispatch } = useStudyContext();
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [hasDisability, setHasDisability] = useState('');
  const [assistiveTech, setAssistiveTech] = useState('');
  const [computerProficiency, setComputerProficiency] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ageRange || !gender || !hasDisability || !computerProficiency) {
      setError(t('demographics.errorRequired'));
      return;
    }

    setSubmitting(true);

    const demographics = {
      ageRange,
      gender,
      hasDisability,
      assistiveTech: assistiveTech || 'none',
      computerProficiency,
    };

    try {
      if (state.sessionId) {
        await fetch(`/api/sessions/${state.sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metadata: { demographics } }),
        });
      }

      studyLogger.log('demographics_completed', demographics);
      dispatch({ type: 'SET_STEP', payload: 'warmup' });
    } catch {
      setError(t('demographics.errorSaveFailed'));
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
        {t('demographics.heading')}
      </h2>
      <p className="mb-6 opacity-75" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {t('demographics.instructions')}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4">
            <legend className="font-medium px-2">{t('demographics.ageRange')}</legend>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="">{t('common.select')}</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65+</option>
            </select>
          </fieldset>

          <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4">
            <legend className="font-medium px-2">{t('demographics.gender')}</legend>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="">{t('common.select')}</option>
              <option value="male">{t('demographics.genderMale')}</option>
              <option value="female">{t('demographics.genderFemale')}</option>
              <option value="prefer-not-to-say">{t('demographics.genderPreferNot')}</option>
            </select>
          </fieldset>

          <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4">
            <legend className="font-medium px-2">{t('demographics.disability')}</legend>
            <select
              value={hasDisability}
              onChange={(e) => setHasDisability(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="">{t('common.select')}</option>
              <option value="none">{t('demographics.disabilityNone')}</option>
              <option value="visual">{t('demographics.disabilityVisual')}</option>
              <option value="motor">{t('demographics.disabilityMotor')}</option>
              <option value="cognitive">{t('demographics.disabilityCognitive')}</option>
              <option value="other">{t('demographics.disabilityOther')}</option>
              <option value="prefer-not-to-say">{t('demographics.genderPreferNot')}</option>
            </select>
          </fieldset>

          <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4">
            <legend className="font-medium px-2">{t('demographics.assistiveTech')}</legend>
            <select
              value={assistiveTech}
              onChange={(e) => setAssistiveTech(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="">{t('common.select')}</option>
              <option value="none">{t('demographics.assistiveNone')}</option>
              <option value="screen-reader">{t('demographics.assistiveScreenReader')}</option>
              <option value="magnifier">{t('demographics.assistiveMagnifier')}</option>
              <option value="voice-control">{t('demographics.assistiveVoice')}</option>
              <option value="other">{t('demographics.assistiveOther')}</option>
            </select>
          </fieldset>

          <fieldset className="border-2 border-accent border-opacity-20 rounded-lg p-4">
            <legend className="font-medium px-2">{t('demographics.computerProficiency')}</legend>
            <select
              value={computerProficiency}
              onChange={(e) => setComputerProficiency(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            >
              <option value="">{t('common.select')}</option>
              <option value="beginner">{t('demographics.proficiencyBeginner')}</option>
              <option value="intermediate">{t('demographics.proficiencyIntermediate')}</option>
              <option value="advanced">{t('demographics.proficiencyAdvanced')}</option>
              <option value="expert">{t('demographics.proficiencyExpert')}</option>
            </select>
          </fieldset>
        </div>

        {error && (
          <div role="alert" className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? t('common.saving') : t('demographics.continue')}
          </Button>
        </div>
      </form>
    </div>
  );
}
