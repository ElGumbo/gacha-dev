import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';
import { CurrencyTicker } from '../../components/CurrencyTicker';

export function HomePage() {
  const { user } = useAuth();
  const { currency, cps, isLoading, error, refresh } = useGame();

  return (
    <div className="mx-auto mt-16 max-w-sm px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName}!</h1>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-600">Loading your progress…</p>
      ) : error ? (
        <div className="mt-6 flex flex-col items-center gap-2">
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
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Currency</p>
            <CurrencyTicker currency={currency} cps={cps} />
          </div>

          <div className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Per second</p>
            <p className="text-lg font-medium text-gray-900">{formatCurrency(cps)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
