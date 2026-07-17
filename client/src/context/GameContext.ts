import { createContext } from 'react';

export interface GameContextValue {
  currency: number;
  cps: number;
  isLoading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);
