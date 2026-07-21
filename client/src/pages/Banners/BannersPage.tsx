import { useEffect, useMemo, useState } from 'react';
import { useBanners } from '../../hooks/useBanners';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';
import { RARITY_ORDER, rarityStyle, sumByRarity } from '../../utils/rarity';
import { RarityBadge } from '../../components/RarityBadge';
import { CharacterCard } from '../../components/CharacterCard';
import type { PullResult } from '../../types/banner.types';

const PREVIEW_INTERVAL_MS = 10000;
const PREVIEW_FADE_MS = 300;

function InfoPopover({
  availableRarities,
  rates,
  pityThreshold,
}: {
  availableRarities: string[];
  rates: Record<string, number>;
  pityThreshold: number;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-terminal-200 text-xs text-terminal-100 transition-colors hover:border-brand hover:text-brand"
        aria-label="Pull rates"
      >
        i
      </button>
      <div className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-52 rounded-xl border border-terminal-200 bg-terminal-900 p-3.5 opacity-0 shadow-2xl transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <p className="mb-2.5 text-[10px] text-terminal-100">// pull_rates</p>
        <ul className="flex flex-col gap-1.5">
          {availableRarities.map(rarity => {
            const rate = rates[rarity];
            return (
              <li key={rarity} className="flex items-center gap-2">
                <span className="flex w-9 shrink-0 items-center">
                  <RarityBadge rarity={rarity} small />
                </span>
                <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-terminal-600">
                  <div className={`h-full rounded-full opacity-65 ${rarityStyle(rarity).bg}`} style={{ width: `${rate}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[10px] text-terminal-100">{rate.toFixed(2)}%</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2.5 border-t border-terminal-200 pt-2.5 text-[10px] text-terminal-100">
          UR guaranteed at {pityThreshold} pulls
        </p>
      </div>
    </div>
  );
}

function PullResultModal({
  character,
  pityCounter,
  pityThreshold,
  onClose,
}: {
  character: PullResult;
  pityCounter: number;
  pityThreshold: number;
  onClose: () => void;
}) {
  const badgeLabel = character.isNew ? 'NEW' : character.leveledUp ? 'LEVELED UP' : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-xs" onClick={event => event.stopPropagation()}>
        <p className="mb-5 text-center text-xs text-terminal-100">// pull_result [1]</p>

        <div className="relative mx-auto w-40 animate-[fadeSlideUp_0.3s_ease]">
          {badgeLabel && (
            <span className="absolute -top-2.5 right-2 z-10 rounded border border-terminal-200 bg-terminal-950 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-currency">
              {badgeLabel}
            </span>
          )}
          <CharacterCard character={character} level={character.level} />
        </div>

        <p className="mt-4 text-center text-[10px] text-terminal-100">
          UR pity: {pityCounter} / {pityThreshold}
        </p>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-terminal-200 px-6 py-2 font-mono text-xs text-terminal-100 transition-colors hover:border-terminal-50 hover:text-terminal-50"
          >
            close()
          </button>
        </div>
      </div>
    </div>
  );
}

export function BannersPage() {
  const { banner, isLoading, error, isPulling, pullError, pullResult, pull, clearPullResult } = useBanners();
  const {
    currency,
    pityCounter,
    isLoading: isGameLoading,
    error: gameError,
    refresh: refreshGame,
  } = useGame();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const rates = useMemo(() => (banner ? sumByRarity(banner.pool, entry => entry.oddsPercent) : {}), [banner]);
  const availableRarities = RARITY_ORDER.filter(rarity => rarity in rates);

  useEffect(() => {
    if (!banner || banner.pool.length < 2) return;
    let fadeTimeoutId: number;
    const intervalId = setInterval(() => {
      setFading(true);
      fadeTimeoutId = setTimeout(() => {
        setPreviewIndex(index => {
          const offset = 1 + Math.floor(Math.random() * (banner.pool.length - 1));
          return (index + offset) % banner.pool.length;
        });
        setFading(false);
      }, PREVIEW_FADE_MS);
    }, PREVIEW_INTERVAL_MS);
    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeTimeoutId);
    };
  }, [banner]);

  const previewChar = banner?.pool[previewIndex]?.character;
  const canPull = Boolean(banner) && currency >= (banner?.cost ?? 0);

  return (
    <>
      <p className="mb-4 text-xs text-terminal-100">// banner.tsx</p>

      {isLoading || isGameLoading ? (
        <p className="text-center text-sm text-terminal-100">Loading banner…</p>
      ) : error || !banner || !previewChar ? (
        <p className="text-center text-sm text-terminal-100">Couldn't load the banner.</p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-terminal-500 bg-terminal-900">
            <div className="grid items-stretch gap-6 p-5 md:grid-cols-[1.1fr_1fr] md:p-7">
              <div className="rounded-lg border border-terminal-500 bg-terminal-950 p-5 font-mono text-xs">
                <div className="mb-4 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-danger/40" />
                  <div className="h-2 w-2 rounded-full bg-currency/40" />
                  <div className="h-2 w-2 rounded-full bg-success/40" />
                </div>
                <p className="mb-1 text-terminal-100">$ cat pool_preview.json</p>
                <div
                  className={`transition-opacity ${fading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ transitionDuration: `${PREVIEW_FADE_MS}ms` }}
                >
                  <p className="text-terminal-100">{'{'}</p>
                  <div className="mt-0.5 space-y-1 pl-4">
                    <p>
                      <span className="text-rarity-ssr">"name"</span>
                      <span className="text-terminal-100">: </span>
                      <span className="text-rarity-sr">"{previewChar.name}"</span>
                      <span className="text-terminal-100">,</span>
                    </p>
                    <p>
                      <span className="text-rarity-ssr">"rarity"</span>
                      <span className="text-terminal-100">: </span>
                      <span className={rarityStyle(previewChar.rarity).text}>
                        "<b>{previewChar.rarity}</b>"
                      </span>
                      <span className="text-terminal-100">,</span>
                    </p>
                    <p>
                      <span className="text-rarity-ssr">"tokensPerSecond"</span>
                      <span className="text-terminal-100">: </span>
                      <span className="text-currency">{previewChar.cps}</span>
                    </p>
                  </div>
                  <p className="text-terminal-100">{'}'}</p>
                </div>
                <span className="mt-3 inline-block h-3 w-1.5 animate-pulse bg-terminal-400" />
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div>
                  <p className="mb-3 text-[10px] text-terminal-100">
                    // {banner.name.toLowerCase().replace(/\s+/g, '_')}
                  </p>
                  <h2 className="text-xl leading-tight font-bold text-terminal-50">{banner.name}</h2>
                  <p className="mt-1 text-sm text-terminal-100">All rarities available in pool</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {availableRarities.map(rarity => (
                      <RarityBadge key={rarity} rarity={rarity} />
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-terminal-100">{banner.pool.length} characters in pool</p>
                </div>

                <div className="border-t border-terminal-500 pt-4">
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-[10px] text-terminal-100">UR pity</span>
                    <span className="text-[10px] text-rarity-ur">
                      {pityCounter} / {banner.pityThreshold}
                    </span>
                  </div>
                  <div className="h-0.75 overflow-hidden rounded-full bg-terminal-600">
                    <div
                      className="h-full rounded-full bg-rarity-ur opacity-75 transition-all duration-400"
                      style={{ width: `${(pityCounter / banner.pityThreshold) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-terminal-100">
                    guaranteed UR at {banner.pityThreshold} pulls
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-terminal-500 bg-terminal-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] text-terminal-100">// gacha_pull()</span>
              <InfoPopover availableRarities={availableRarities} rates={rates} pityThreshold={banner.pityThreshold} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => pull()}
                disabled={isPulling || !canPull}
                className="rounded-lg border border-terminal-200 px-5 py-2.5 font-mono text-sm text-terminal-100 transition-all duration-150 hover:enabled:border-terminal-50 hover:enabled:text-terminal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPulling ? 'pulling…' : 'pull ×1'}
                <span className="ml-2 text-xs text-terminal-100">{formatCurrency(banner.cost)}t</span>
              </button>

              {!canPull && (
                <span className="text-xs text-terminal-100">
                  need {formatCurrency(banner.cost - currency)} more tokens
                </span>
              )}
            </div>

            {pullError && <p className="mt-3 text-sm text-danger">Pull failed. Try again.</p>}

            {gameError && (
              <p className="mt-3 text-sm text-danger">
                Couldn't refresh your progress.{' '}
                <button type="button" onClick={() => refreshGame()} className="underline hover:text-terminal-50">
                  Try again
                </button>
              </p>
            )}
          </div>

          {pullResult && (
            <PullResultModal
              character={pullResult.character}
              pityCounter={pullResult.pityCounter}
              pityThreshold={banner.pityThreshold}
              onClose={clearPullResult}
            />
          )}
        </div>
      )}
    </>
  );
}
