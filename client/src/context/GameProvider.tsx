import { useState, type ReactNode } from 'react';
import { GameContext } from './GameContext';
import { getProgressRequest } from '../api/progress.api';
import { getBannersRequest } from '../api/banner.api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { sumByRarity } from '../utils/rarity';

export function GameProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState(0);
  const [cps, setCps] = useState(0);
  const [pityCounter, setPityCounter] = useState(0);
  const [charactersByRarity, setCharactersByRarity] = useState<Record<string, number>>({});
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
        const pool = banners[0]?.pool ?? [];
        setCharactersByRarity(sumByRarity(pool, () => 1));
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
      value={{ currency, cps, pityCounter, charactersByRarity, isLoading, error, refresh }}
    >
      {children}
    </GameContext.Provider>
  );
}
