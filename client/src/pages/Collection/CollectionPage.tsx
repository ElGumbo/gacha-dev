import { useGame } from '../../hooks/useGame';
import { useCollection } from '../../hooks/useCollection';
import { RARITY_ORDER } from '../../utils/rarity';
import { RarityBadge } from '../../components/RarityBadge';
import { CharacterCard } from '../../components/CharacterCard';
import { CharacterCardSkeleton } from '../../components/CharacterCardSkeleton';
import { CharacterGrid } from '../../components/CharacterGrid';
import type { CollectionCharacter } from '../../types/collection.types';

export function CollectionPage() {
  const { charactersByRarity, isLoading: isGameLoading, error: gameError, refresh: refreshGame } = useGame();
  const { characters, isLoading: isCollectionLoading, error: collectionError } = useCollection();

  const isLoading = isGameLoading || isCollectionLoading;
  const error = gameError || collectionError;

  const ownedByRarity: Record<string, CollectionCharacter[]> = {};
  for (const entry of characters) {
    (ownedByRarity[entry.character.rarity] ??= []).push(entry);
  }

  return (
    <>
      <p className="mb-4 text-xs text-terminal-100">// collection.tsx</p>

      {isLoading ? (
        <p className="text-center text-sm text-terminal-100">Loading your collection…</p>
      ) : error ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-terminal-100">Couldn't load your collection.</p>
          <button
            type="button"
            onClick={() => refreshGame()}
            className="text-sm font-medium text-terminal-100 underline hover:text-terminal-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {[...RARITY_ORDER].reverse().map(rarity => {
            const owned = ownedByRarity[rarity] ?? [];
            const total = charactersByRarity[rarity] ?? 0;
            const lockedCount = Math.max(total - owned.length, 0);

            return (
              <div key={rarity}>
                <div className="mb-3 flex items-center gap-3">
                  <RarityBadge rarity={rarity} />
                  <div className="h-px flex-1 bg-terminal-200" />
                  <span className="text-[10px] text-terminal-100">
                    {owned.length}/{total}
                  </span>
                </div>
                <CharacterGrid>
                  {owned.map(entry => (
                    <CharacterCard key={entry.id} character={entry.character} level={entry.level} />
                  ))}
                  {Array.from({ length: lockedCount }, (_, i) => (
                    <CharacterCardSkeleton key={i} rarity={rarity} />
                  ))}
                </CharacterGrid>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
