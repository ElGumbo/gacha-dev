import { useEffect, useRef, useState, type ReactNode } from 'react';
import { GameContext } from './GameContext';
import { getProgressRequest } from '../api/progress.api';
import { getBannersRequest } from '../api/banner.api';

export function GameProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState(0);
  const [cps, setCps] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedInitialData = useRef(false);

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
    if (hasLoadedInitialData.current) return;
    hasLoadedInitialData.current = true;

    async function loadInitialData() {
      try {
        const [progress, { banners }] = await Promise.all([getProgressRequest(), getBannersRequest()]);
        setCurrency(progress.currency);
        setCps(progress.cps);
        setTotalCharacters(banners[0]?.pool.length ?? 0);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  return (
    <GameContext.Provider value={{ currency, cps, totalCharacters, isLoading, error, refresh }}>
      {children}
    </GameContext.Provider>
  );
}
