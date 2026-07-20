import { useGame } from '../../hooks/useGame';
import { useCollection } from '../../hooks/useCollection';
import { formatCurrency } from '../../utils/format';
import { CurrencyTicker } from '../../components/CurrencyTicker';

export function HomePage() {
  const { currency, cps, totalCharacters, isLoading, error, refresh } = useGame();
  const { characters, isLoading: isCollectionLoading, error: collectionError } = useCollection();

  return (
    <div className="mx-auto mt-16 max-w-2xl px-4">
      {isLoading ? (
        <p className="text-center text-sm text-gray-600">Loading your progress…</p>
      ) : error ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">Couldn't load your progress.</p>
          <button
            type="button"
            onClick={() => refresh()}
            className="text-sm font-medium text-gray-900 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Tokens</p>
            <CurrencyTicker currency={currency} cps={cps} className="text-2xl font-semibold text-gray-900" />
          </div>

          <div className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Passive income</p>
            <p className="text-2xl font-semibold text-gray-900">
              +{formatCurrency(cps)} <span className="text-xs font-normal text-gray-500">per second</span>
            </p>
          </div>

          <div className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Collected</p>
            {collectionError ? (
              <p className="text-sm text-gray-600">Couldn't load</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">
                {isCollectionLoading ? '–' : characters.length}
                <span className="text-xs font-normal text-gray-500"> / {totalCharacters} characters</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
