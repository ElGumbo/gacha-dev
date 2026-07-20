import { useBanners } from '../../hooks/useBanners';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../../components/Modal';

export function BannersPage() {
  const { banner, isLoading, error, isPulling, pullError, pullResult, pull, clearPullResult } = useBanners();

  return (
    <div className="mx-auto mt-16 max-w-sm px-4 text-center">
      <h1 className="text-2xl font-bold text-terminal-50">Banner</h1>

      {isLoading ? (
        <p className="mt-4 text-sm text-terminal-100">Loading banner…</p>
      ) : error || !banner ? (
        <p className="mt-4 text-sm text-terminal-100">Couldn't load the banner.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-xl border border-terminal-800 bg-terminal-900 px-4 py-3">
            <p className="text-xs text-terminal-100">{banner.name}</p>
            <p className="text-lg font-medium text-terminal-50">Cost: {formatCurrency(banner.cost)}</p>
          </div>

          <div className="rounded-xl border border-terminal-800 bg-terminal-900 px-4 py-3 text-left">
            <p className="mb-2 text-xs text-terminal-100">Pool</p>
            <ul className="flex flex-col gap-1">
              {banner.pool.map(entry => (
                <li key={entry.character.id} className="flex justify-between text-sm text-terminal-50">
                  <span>
                    {entry.character.name} ({entry.character.rarity})
                  </span>
                  <span className="text-terminal-100">{entry.oddsPercent.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => pull()}
            disabled={isPulling}
            className="rounded-lg bg-terminal-50 px-4 py-2 text-sm font-medium text-terminal-950 transition-colors hover:bg-terminal-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPulling ? 'Pulling…' : 'Pull'}
          </button>

          {pullError && <p className="text-sm text-danger">Pull failed. Try again.</p>}

          {pullResult && (
            <Modal onClose={clearPullResult}>
              <p className="text-xs text-terminal-100">Pull result</p>
              <p className="text-lg font-medium text-terminal-50">
                {pullResult.character.name} ({pullResult.character.rarity})
              </p>
              <p className="text-sm text-terminal-100">
                Level {pullResult.character.level}
                {pullResult.character.leveledUp ? ' (leveled up!)' : ''}
              </p>
              <p className="text-xs text-terminal-100">
                Pity: {pullResult.pityCounter} / {banner.pityThreshold}
              </p>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
