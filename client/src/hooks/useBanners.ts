import { useRef, useState } from 'react';
import { getBannersRequest, pullBannerRequest } from '../api/banner.api';
import { useGame } from './useGame';
import { useEffectOnce } from './useEffectOnce';
import type { Banner, PullResult } from '../types/banner.types';

interface PullOutcome {
  character: PullResult;
  pityCounter: number;
}

export function useBanners() {
  const { refresh: refreshProgress } = useGame();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullError, setPullError] = useState(false);
  const [pullResult, setPullResult] = useState<PullOutcome | null>(null);
  const isPullingRef = useRef(false);

  useEffectOnce(() => {
    async function loadBanner() {
      try {
        const data = await getBannersRequest();
        setBanner(data.banners[0] ?? null);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadBanner();
  });

  async function pull() {
    if (!banner || isPullingRef.current) return;
    isPullingRef.current = true;
    setIsPulling(true);
    try {
      const data = await pullBannerRequest(banner.id);
      setPullResult({ character: data.character, pityCounter: data.pityCounter });
      setPullError(false);
      await refreshProgress();
    } catch {
      setPullError(true);
    } finally {
      isPullingRef.current = false;
      setIsPulling(false);
    }
  }

  function clearPullResult() {
    setPullResult(null);
  }

  return { banner, isLoading, error, isPulling, pullError, pullResult, pull, clearPullResult };
}
