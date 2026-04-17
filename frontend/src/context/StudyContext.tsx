import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type StudyStep =
  | 'consent'
  | 'demographics'
  | 'warmup'
  | 'tasks'
  | 'sus'
  | 'nasatlx'
  | 'feedback'
  | 'summary'
  | 'complete';

export interface TaskResult {
  taskIndex: number;
  taskType: 'find_answer' | 'form_completion' | 'navigation';
  durationSeconds: number;
  errors: number;
  completed: boolean;
  answer?: string;
}

export interface NasaTlxResponses {
  mental: number;
  physical: number;
  temporal: number;
  performance: number;
  effort: number;
  frustration: number;
}

export interface StudyState {
  step: StudyStep;
  participantId: string;
  condition: 'adaptive' | 'control';
  sessionId: string | null;
  consentGiven: boolean;
  currentTaskIndex: number;
  taskResults: TaskResult[];
  susResponses: number[];
  nasaTlxResponses: NasaTlxResponses | null;
}

type StudyAction =
  | { type: 'SET_PARTICIPANT'; payload: { participantId: string; condition: 'adaptive' | 'control' } }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'GIVE_CONSENT' }
  | { type: 'SET_STEP'; payload: StudyStep }
  | { type: 'NEXT_TASK' }
  | { type: 'ADD_TASK_RESULT'; payload: TaskResult }
  | { type: 'SET_SUS_RESPONSES'; payload: number[] }
  | { type: 'SET_NASA_TLX'; payload: NasaTlxResponses }
  | { type: 'START_NEXT_SESSION'; payload: { sessionId: string; condition: 'adaptive' | 'control' } }
  | { type: 'RESET' };

const initialState: StudyState = {
  step: 'consent',
  participantId: '',
  condition: 'adaptive',
  sessionId: null,
  consentGiven: false,
  currentTaskIndex: 0,
  taskResults: [],
  susResponses: [],
  nasaTlxResponses: null,
};

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return {
        ...state,
        participantId: action.payload.participantId,
        condition: action.payload.condition,
      };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'GIVE_CONSENT':
      return { ...state, consentGiven: true };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'NEXT_TASK':
      return { ...state, currentTaskIndex: state.currentTaskIndex + 1 };
    case 'ADD_TASK_RESULT':
      return { ...state, taskResults: [...state.taskResults, action.payload] };
    case 'SET_SUS_RESPONSES':
      return { ...state, susResponses: action.payload };
    case 'SET_NASA_TLX':
      return { ...state, nasaTlxResponses: action.payload };
    case 'START_NEXT_SESSION':
      return {
        ...initialState,
        participantId: state.participantId,
        condition: action.payload.condition,
        sessionId: action.payload.sessionId,
        consentGiven: true,
        step: 'tasks',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface StudyContextValue {
  state: StudyState;
  dispatch: React.Dispatch<StudyAction>;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyContext() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within StudyProvider');
  }
  return context;
}
