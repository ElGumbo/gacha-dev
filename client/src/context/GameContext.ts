import { createContext } from 'react';

export interface GameContextValue {
  currency: number;
  cps: number;
  pityCounter: number;
  totalCharacters: number;
  isLoading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);
