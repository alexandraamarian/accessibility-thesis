import { useState, useEffect } from 'react';
import { useStudyContext } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { Article } from '../Article';
import { InteractionTestZone } from '../InteractionTestZone';
import { Button } from '../Button';

const WARMUP_DURATION = 30; // seconds

const warmupContent = [
  {
    id: 'warmup-intro',
    heading: 'Practice: Getting Familiar',
    paragraphs: [
      'This is a short warm-up phase to help you get comfortable with the interface. Feel free to scroll, click buttons, and read the text below.',
      'The system is now monitoring your interactions. In the adaptive condition, the interface may adjust based on your behavior patterns. This is normal and part of the study design.',
    ],
  },
];

export function WarmupPhase() {
  const { dispatch } = useStudyContext();
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
          Warm-up Phase
        </h2>
        <div className="text-accent font-mono text-lg" aria-live="polite">
          {timeLeft > 0 ? `${timeLeft}s remaining` : 'Ready to continue'}
        </div>
      </div>

      <p
        className="mb-6 opacity-75 adaptive-transition"
        style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}
      >
        Take {WARMUP_DURATION} seconds to explore the interface. Scroll through the content, click
        the buttons, and try zooming (Ctrl+Wheel).
      </p>

      <div className="space-y-8">
        <Article sections={warmupContent} />
        <InteractionTestZone />
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleContinue} disabled={!canSkip}>
          {canSkip ? 'Continue to Tasks' : `Please wait ${timeLeft}s...`}
        </Button>
      </div>
    </div>
  );
}
