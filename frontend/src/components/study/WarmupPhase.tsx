import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Article } from '../Article';
import { InteractionTestZone } from '../InteractionTestZone';
import { Button } from '../Button';

export function WarmupPhase() {
  const { state, dispatch } = useStudyContext();
  const { t } = useTranslation();

  const practiceText2Key = state.condition === 'adaptive'
    ? 'warmup.practiceText2Adaptive'
    : 'warmup.practiceText2Control';

  const warmupContent = [
    {
      id: 'warmup-intro',
      heading: t('warmup.practiceHeading'),
      paragraphs: [
        t('warmup.practiceText1'),
        t(practiceText2Key),
      ],
    },
  ];
  const startTime = useRef(Date.now());

  const handleContinue = () => {
    studyLogger.log('warmup_completed', { duration: (Date.now() - startTime.current) / 1000 });
    dispatch({ type: 'SET_STEP', payload: 'tasks' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-bold adaptive-transition"
          style={{ fontSize: 'calc(var(--font-size-base) * 1.5)', lineHeight: 'var(--line-height)' }}
        >
          {t('warmup.heading')}
        </h2>
      </div>

      <p
        className="mb-6 opacity-75 adaptive-transition"
        style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}
      >
        {t('warmup.instructionsNoTime')}
      </p>

      <div className="space-y-8">
        <Article sections={warmupContent} />
        <InteractionTestZone />
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleContinue}>
          {t('warmup.continueToTasks')}
        </Button>
      </div>
    </div>
  );
}
