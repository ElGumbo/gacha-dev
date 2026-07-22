import { rarityStyle } from '../utils/rarity';

interface CharacterCardSkeletonProps {
  rarity: string;
}

export function CharacterCardSkeleton({ rarity }: CharacterCardSkeletonProps) {
  const rarityClasses = rarityStyle(rarity);

  return (
    <div className={`rounded-xl border bg-terminal-900 p-3 opacity-60 ${rarityClasses.borderRest}`}>
      <div className="leading-none">
        <span className={`rounded border border-current px-1 text-xs font-bold ${rarityClasses.text}`}>
          {rarity}
        </span>

        <div className="mt-3 flex min-h-10 items-center">
          <div className="h-3 w-3/4 animate-pulse rounded bg-terminal-700" />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="h-3 w-10 animate-pulse rounded bg-terminal-700" />
          <span className="text-xs text-terminal-600">???</span>
        </div>
      </div>
    </div>
  );
}
