import { useTranslation } from 'react-i18next';
import { StudyStep } from '../../context/StudyContext';

interface ProgressTrackerProps {
  currentStep: StudyStep;
}

const STEPS: { key: StudyStep; labelKey: string }[] = [
  { key: 'consent', labelKey: 'study.steps.consent' },
  { key: 'warmup', labelKey: 'study.steps.warmup' },
  { key: 'tasks', labelKey: 'study.steps.tasks' },
  { key: 'sus', labelKey: 'study.steps.sus' },
  { key: 'nasatlx', labelKey: 'study.steps.nasatlx' },
  { key: 'summary', labelKey: 'study.steps.summary' },
];

export function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  const { t } = useTranslation();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Study progress" className="mb-8">
      <ol className="flex items-center justify-center gap-0" role="list">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.key === currentStep;

          return (
            <li
              key={step.key}
              className="flex items-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    isComplete
                      ? 'bg-accent border-accent text-bg'
                      : isCurrent
                        ? 'border-accent text-accent bg-transparent'
                        : 'border-gray-600 text-gray-600 bg-transparent'
                  }`}
                >
                  {isComplete ? '\u2713' : index + 1}
                </div>
                <span
                  className={`text-xs mt-1 whitespace-nowrap ${
                    isCurrent ? 'text-accent font-semibold' : isComplete ? 'text-accent' : 'text-gray-500'
                  }`}
                >
                  {t(step.labelKey)}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 mt-[-1rem] ${
                    isComplete ? 'bg-accent' : 'bg-gray-600'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
