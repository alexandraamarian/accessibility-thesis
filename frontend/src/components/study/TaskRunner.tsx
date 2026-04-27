import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudyContext, TaskResult } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { getArticleSetForParticipant } from '../../data/articles';
import { getTasksForArticleSet, StudyTask } from '../../data/tasks';
import { Article } from '../Article';
import { InteractionTestZone } from '../InteractionTestZone';
import { Button } from '../Button';

export function TaskRunner() {
  const { state, dispatch } = useStudyContext();
  const { t } = useTranslation();
  const sessionOffset = state.condition === 'control' ? 1 : 0;
  const articleSet = getArticleSetForParticipant(state.participantId, sessionOffset);
  const allTasks = getTasksForArticleSet(articleSet.id);
  const currentTask = allTasks[state.currentTaskIndex];

  const translatedArticles = t('articles.sets', { returnObjects: true }) as any[];
  const translatedArticleSet = translatedArticles?.find((a: any) => a.id === articleSet.id) || articleSet;
  const translatedTaskData = t(`taskData.${articleSet.id}`, { returnObjects: true }) as any[];
  const translatedTask = translatedTaskData?.[state.currentTaskIndex];

  if (!currentTask) {
    // All tasks done, move to SUS
    dispatch({ type: 'SET_STEP', payload: 'sus' });
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2
          className="font-bold adaptive-transition"
          style={{ fontSize: 'calc(var(--font-size-base) * 1.5)', lineHeight: 'var(--line-height)' }}
        >
          {t('tasks.heading', { current: state.currentTaskIndex + 1, total: allTasks.length })}
        </h2>
        <span className="text-sm opacity-60">{t('tasks.article', { title: translatedArticleSet.title })}</span>
      </div>

      <TaskView
        key={currentTask.id}
        task={currentTask}
        translatedTask={translatedTask}
        taskIndex={state.currentTaskIndex}
        onComplete={(result) => {
          dispatch({ type: 'ADD_TASK_RESULT', payload: result });
          dispatch({ type: 'NEXT_TASK' });
        }}
      />

      <div className="mt-8 space-y-8">
        <Article sections={translatedArticleSet.sections} />
        <InteractionTestZone />
      </div>
    </div>
  );
}

function TaskView({
  task,
  translatedTask,
  taskIndex,
  onComplete,
}: {
  task: StudyTask;
  translatedTask: any;
  taskIndex: number;
  onComplete: (result: TaskResult) => void;
}) {
  const { t, i18n } = useTranslation();
  const startTime = useRef(Date.now());
  const [errors, setErrors] = useState(0);
  const [answer, setAnswer] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finalResult, setFinalResult] = useState<TaskResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    startTime.current = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [task.id]);

  const handleSubmit = () => {
    if (submitted) return;

    let taskErrors = 0;

    // Validate required fields are not empty
    if (task.type === 'find_answer' && !answer.trim()) {
      setErrors((e) => e + 1);
      taskErrors++;
      return;
    }

    if (task.type === 'form_completion' && task.formFields) {
      const missing = task.formFields.filter((f) => f.required && !formValues[f.id]?.trim());
      if (missing.length > 0) {
        setErrors((e) => e + missing.length);
        taskErrors += missing.length;
        return;
      }
    }

    // Validate answer correctness (fuzzy match for find_answer tasks)
    if (task.type === 'find_answer' && task.expectedAnswer) {
      // Strip diacritics so "Captarea si Eliminarea Carbonului" matches
      // "Captarea și Eliminarea Carbonului"
      const stripDiacritics = (s: string) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalize = (s: string) =>
        stripDiacritics(s).toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');

      const userNorm = normalize(answer);

      // Use Romanian expected answer if available and language is Romanian
      const lang = i18n.language;
      const expected = (lang === 'ro' && task.expectedAnswerRo)
        ? task.expectedAnswerRo
        : task.expectedAnswer;
      const expectedNorm = normalize(expected);

      // Also check against both language versions for robustness
      const expectedEnNorm = normalize(task.expectedAnswer);
      const expectedRoNorm = task.expectedAnswerRo ? normalize(task.expectedAnswerRo) : '';

      const isCorrect =
        userNorm.includes(expectedNorm) || expectedNorm.includes(userNorm) ||
        userNorm.includes(expectedEnNorm) || expectedEnNorm.includes(userNorm) ||
        (expectedRoNorm && (userNorm.includes(expectedRoNorm) || expectedRoNorm.includes(userNorm)));

      if (!isCorrect) {
        taskErrors++;
      }
    }

    setSubmitted(true);
    const duration = (Date.now() - startTime.current) / 1000;

    const result: TaskResult = {
      taskIndex,
      taskType: task.type,
      durationSeconds: duration,
      errors: errors + taskErrors,
      completed: true,
      answer: task.type === 'find_answer' ? answer : JSON.stringify(formValues),
    };

    studyLogger.log('task_completed', {
      taskId: task.id,
      taskType: task.type,
      duration,
      errors: result.errors,
      answer: result.answer,
    });

    // Show result briefly before advancing
    setFinalResult(result);
    setTimeout(() => onComplete(result), 2000);
  };

  return (
    <div className="border-2 border-accent border-opacity-30 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
        <h3
          className="font-semibold adaptive-transition"
          style={{ fontSize: 'calc(var(--font-size-base) * 1.25)', lineHeight: 'var(--line-height)' }}
        >
          {translatedTask?.title || task.title}
        </h3>
        <span
          className="text-accent font-mono text-sm"
          aria-live="polite"
          aria-label={t('common.elapsedTime', { time: `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}` })}
          role="timer"
        >
          {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
        </span>
      </div>

      <p className="mb-6" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {translatedTask?.instruction || task.instruction}
      </p>

      {task.type === 'find_answer' && (
        <div className="mb-4">
          <label htmlFor="task-answer" className="block mb-2 font-medium">
            {t('tasks.yourAnswer')}
          </label>
          <input
            id="task-answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            placeholder={t('tasks.answerPlaceholder')}
          />
        </div>
      )}

      {task.type === 'form_completion' && task.formFields && (
        <div className="space-y-4 mb-4">
          {task.formFields.map((field, index) => (
            <div key={field.id}>
              <label htmlFor={`field-${field.id}`} className="block mb-2 font-medium">
                {translatedTask?.fields?.[index]?.label || field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === 'text' ? (
                <input
                  id={`field-${field.id}`}
                  type="text"
                  value={formValues[field.id] || ''}
                  onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                  className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
                  required={field.required}
                />
              ) : (
                <select
                  id={`field-${field.id}`}
                  value={formValues[field.id] || ''}
                  onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                  className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
                  required={field.required}
                >
                  <option value="">{t('common.select')}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {task.type === 'navigation' && (
        <p className="mb-4 text-sm opacity-75">
          {t('tasks.navigationHint')}
        </p>
      )}

      {finalResult ? (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-accent bg-opacity-10 border border-accent border-opacity-30">
          <span className="text-accent font-semibold">{t('tasks.submitted')}</span>
          <span className="font-mono text-sm">
            {Math.floor(finalResult.durationSeconds / 60)}:{Math.round(finalResult.durationSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      ) : (
        <Button onClick={handleSubmit} disabled={submitted}>
          {t('tasks.submitContinue')}
        </Button>
      )}
    </div>
  );
}
