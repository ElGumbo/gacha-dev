import { useGame } from '../../hooks/useGame';
import { useCollection } from '../../hooks/useCollection';
import { formatCurrency } from '../../utils/format';
import { CurrencyTicker } from '../../components/CurrencyTicker';
import { CharacterCard } from '../../components/CharacterCard';
import { CharacterGrid } from '../../components/CharacterGrid';
import { StatCard } from '../../components/StatCard';

export function HomePage() {
  const { currency, cps, totalCharacters, isLoading, error, refresh } = useGame();
  const { characters, isLoading: isCollectionLoading, error: collectionError } = useCollection();

  return (
    <>
      <p className="mb-4 text-xs text-terminal-100">// home.tsx</p>

      {isLoading ? (
        <p className="text-center text-sm text-terminal-100">Loading your progress…</p>
      ) : error ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-terminal-100">Couldn't load your progress.</p>
          <button
            type="button"
            onClick={() => refresh()}
            className="text-sm font-medium text-terminal-100 underline hover:text-terminal-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="tokens">
              <CurrencyTicker currency={currency} cps={cps} className="text-xl font-bold leading-none text-currency" />
            </StatCard>

            <StatCard label="passive income">
              <p className="text-xl font-bold leading-none text-success">
                +{formatCurrency(cps)} <span className="text-xs font-normal text-terminal-100">per second</span>
              </p>
            </StatCard>

            <StatCard label="collected">
              {collectionError ? (
                <p className="text-sm text-terminal-100">Couldn't load</p>
              ) : (
                <p className="text-xl font-bold leading-none text-terminal-50">
                  {isCollectionLoading ? '–' : characters.length}
                  <span className="text-xs font-normal text-terminal-100"> / {totalCharacters} characters</span>
                </p>
              )}
            </StatCard>
          </div>

          {characters.length === 0 ? (
            <div className="rounded-xl border border-dashed border-terminal-800 p-14 text-center text-sm text-terminal-100">
              no characters yet
              <br />
              <span className="mt-1 block text-xs text-terminal-100">visit the banner to pull</span>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-xs text-terminal-100">// roster [{characters.length}]</p>
              <CharacterGrid>
                {characters.map(entry => (
                  <CharacterCard key={entry.id} character={entry.character} level={entry.level} />
                ))}
              </CharacterGrid>
            </div>
          )}
        </div>
      )}
    </>
  );
}
