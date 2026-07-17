import { useEffect, useRef, useState, type ReactNode } from 'react';
import { GameContext } from './GameContext';
import { getProgressRequest } from '../api/progress.api';

export function GameProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState(0);
  const [cps, setCps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedInitialProgress = useRef(false);

  async function refresh() {
    try {
      const data = await getProgressRequest();
      setCurrency(data.currency);
      setCps(data.cps);
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    if (hasLoadedInitialProgress.current) return;
    hasLoadedInitialProgress.current = true;

    async function loadInitialProgress() {
      await refresh();
      setIsLoading(false);
    }
    loadInitialProgress();
  }, []);

  return (
    <GameContext.Provider value={{ currency, cps, isLoading, error, refresh }}>
      {children}
    </GameContext.Provider>
  );
}
