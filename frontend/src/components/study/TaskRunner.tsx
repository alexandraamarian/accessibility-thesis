import { useState, useEffect, useRef } from 'react';
import { useStudyContext, TaskResult } from '../../context/StudyContext';
import { studyLogger } from '../../services/studyLogger';
import { getArticleSetForParticipant } from '../../data/articles';
import { getTasksForArticleSet, StudyTask } from '../../data/tasks';
import { Article } from '../Article';
import { InteractionTestZone } from '../InteractionTestZone';
import { Button } from '../Button';

export function TaskRunner() {
  const { state, dispatch } = useStudyContext();
  const articleSet = getArticleSetForParticipant(state.participantId);
  const allTasks = getTasksForArticleSet(articleSet.id);
  const currentTask = allTasks[state.currentTaskIndex];

  if (!currentTask) {
    // All tasks done, move to SUS
    dispatch({ type: 'SET_STEP', payload: 'sus' });
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="font-bold adaptive-transition"
          style={{ fontSize: 'calc(var(--font-size-base) * 1.5)', lineHeight: 'var(--line-height)' }}
        >
          Task {state.currentTaskIndex + 1} of {allTasks.length}
        </h2>
        <span className="text-sm opacity-60">Article: {articleSet.title}</span>
      </div>

      <TaskView
        key={currentTask.id}
        task={currentTask}
        taskIndex={state.currentTaskIndex}
        onComplete={(result) => {
          dispatch({ type: 'ADD_TASK_RESULT', payload: result });
          dispatch({ type: 'NEXT_TASK' });
        }}
      />

      <div className="mt-8 space-y-8">
        <Article sections={articleSet.sections} />
        <InteractionTestZone />
      </div>
    </div>
  );
}

function TaskView({
  task,
  taskIndex,
  onComplete,
}: {
  task: StudyTask;
  taskIndex: number;
  onComplete: (result: TaskResult) => void;
}) {
  const startTime = useRef(Date.now());
  const [errors, setErrors] = useState(0);
  const [answer, setAnswer] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
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

    onComplete(result);
  };

  return (
    <div className="border-2 border-accent border-opacity-30 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3
          className="font-semibold adaptive-transition"
          style={{ fontSize: 'calc(var(--font-size-base) * 1.25)', lineHeight: 'var(--line-height)' }}
        >
          {task.title}
        </h3>
        <span className="text-accent font-mono text-sm" aria-live="polite">
          {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
        </span>
      </div>

      <p className="mb-6" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
        {task.instruction}
      </p>

      {task.type === 'find_answer' && (
        <div className="mb-4">
          <label htmlFor="task-answer" className="block mb-2 font-medium">
            Your Answer
          </label>
          <input
            id="task-answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 rounded border-2 border-gray-600 bg-transparent text-inherit focus:border-accent"
            placeholder="Type your answer here..."
          />
        </div>
      )}

      {task.type === 'form_completion' && task.formFields && (
        <div className="space-y-4 mb-4">
          {task.formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={`field-${field.id}`} className="block mb-2 font-medium">
                {field.label} {field.required && <span className="text-red-400">*</span>}
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
                  <option value="">Select...</option>
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
          Scroll down to find the referenced section, then interact with the test area.
        </p>
      )}

      <Button onClick={handleSubmit} disabled={submitted}>
        {submitted ? 'Submitted' : 'Submit & Continue'}
      </Button>
    </div>
  );
}
