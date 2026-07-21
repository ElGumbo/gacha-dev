import { useState, type ReactNode } from 'react';
import { GameContext } from './GameContext';
import { getProgressRequest } from '../api/progress.api';
import { getBannersRequest } from '../api/banner.api';
import { useEffectOnce } from '../hooks/useEffectOnce';

export function GameProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState(0);
  const [cps, setCps] = useState(0);
  const [pityCounter, setPityCounter] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchProgress() {
    const data = await getProgressRequest();
    setCurrency(data.currency);
    setCps(data.cps);
    setPityCounter(data.pityCounter);
  }

  async function refresh() {
    try {
      await fetchProgress();
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffectOnce(() => {
    async function loadInitialData() {
      try {
        const [, { banners }] = await Promise.all([fetchProgress(), getBannersRequest()]);
        setTotalCharacters(banners[0]?.pool.length ?? 0);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  });

  return (
    <GameContext.Provider
      value={{ currency, cps, pityCounter, totalCharacters, isLoading, error, refresh }}
    >
      {children}
    </GameContext.Provider>
  );
}
