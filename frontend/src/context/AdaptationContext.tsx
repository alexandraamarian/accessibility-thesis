import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UIState } from '../types';
import { DEFAULT_UI } from '../constants';

interface AdaptationContextValue {
  uiState: UIState;
  dispatch: React.Dispatch<UIStateAction>;
}

type UIStateAction =
  | { type: 'APPLY_RULE'; payload: UIState }
  | { type: 'RESET' };

const AdaptationContext = createContext<AdaptationContextValue | null>(null);

function uiStateReducer(state: UIState, action: UIStateAction): UIState {
  switch (action.type) {
    case 'APPLY_RULE':
      return action.payload;
    case 'RESET':
      return DEFAULT_UI;
    default:
      return state;
  }
}

export function AdaptationProvider({ children }: { children: ReactNode }) {
  const [uiState, dispatch] = useReducer(uiStateReducer, DEFAULT_UI);

  return (
    <AdaptationContext.Provider value={{ uiState, dispatch }}>
      {children}
    </AdaptationContext.Provider>
  );
}

export function useAdaptationContext() {
  const context = useContext(AdaptationContext);
  if (!context) {
    throw new Error('useAdaptationContext must be used within AdaptationProvider');
  }
  return context;
}
