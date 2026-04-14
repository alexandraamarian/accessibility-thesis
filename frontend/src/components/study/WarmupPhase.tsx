import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Article } from '../Article';
import { InteractionTestZone } from '../InteractionTestZone';
import { Button } from '../Button';

const WARMUP_DURATION = 30; // seconds

export function WarmupPhase() {
  const { dispatch } = useStudyContext();
  const { t } = useTranslation();

  const warmupContent = [
    {
      id: 'warmup-intro',
      heading: t('warmup.practiceHeading'),
      paragraphs: [
        t('warmup.practiceText1'),
        t('warmup.practiceText2'),
      ],
    },
  ];
  const [timeLeft, setTimeLeft] = useState(WARMUP_DURATION);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    studyLogger.log('warmup_completed', { duration: WARMUP_DURATION - timeLeft });
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
        <div className="text-accent font-mono text-lg" aria-live="polite">
          {timeLeft > 0 ? t('warmup.timeRemaining', { time: timeLeft }) : t('warmup.readyToContinue')}
        </div>
      </div>

      <p
        className="mb-6 opacity-75 adaptive-transition"
        style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}
      >
        {t('warmup.instructions', { duration: WARMUP_DURATION })}
      </p>

      <div className="space-y-8">
        <Article sections={warmupContent} />
        <InteractionTestZone />
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleContinue} disabled={!canSkip}>
          {canSkip ? t('warmup.continueToTasks') : t('warmup.pleaseWait', { time: timeLeft })}
        </Button>
      </div>
    </div>
  );
}
