import type { CollectionCharacter } from '../types/collection.types';
import { formatCurrency } from '../utils/format';

const RARITY_STYLES: Record<
  string,
  { text: string; glow: string; borderRest: string; borderHover: string; shadowHover: string }
> = {
  R: {
    text: 'text-rarity-r',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(156,163,175,0.08)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(156,163,175,0.22)]',
    borderHover: 'hover:border-rarity-r',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(156,163,175,0.08)]',
  },
  SR: {
    text: 'text-rarity-sr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(74,222,128,0.1)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(74,222,128,0.28)]',
    borderHover: 'hover:border-rarity-sr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(74,222,128,0.1)]',
  },
  SSR: {
    text: 'text-rarity-ssr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(96,165,250,0.12)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(96,165,250,0.32)]',
    borderHover: 'hover:border-rarity-ssr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(96,165,250,0.12)]',
  },
  UR: {
    text: 'text-rarity-ur',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(192,132,252,0.12)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(192,132,252,0.35)]',
    borderHover: 'hover:border-rarity-ur',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(192,132,252,0.12)]',
  },
  LR: {
    text: 'text-rarity-lr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(251,191,36,0.15)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(251,191,36,0.45)]',
    borderHover: 'hover:border-rarity-lr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(251,191,36,0.15)]',
  },
};

interface CharacterCardProps {
  entry: CollectionCharacter;
}

export function CharacterCard({ entry }: CharacterCardProps) {
  const { character, level } = entry;
  const rarity = RARITY_STYLES[character.rarity] ?? RARITY_STYLES.R;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-linear-145 from-[#131418] to-[#1a1b21] p-3 transition-all duration-150 hover:-translate-y-0.5 ${rarity.borderRest} ${rarity.borderHover} ${rarity.shadowHover}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${rarity.glow}`} />

      <div className="relative leading-none">
        <span className={`rounded border border-current px-1 text-xs font-bold ${rarity.text}`}>
          {character.rarity}
        </span>

        <p className="mt-2 min-h-10 text-sm font-semibold text-terminal-50 line-clamp-2">
          {character.name}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs font-medium ${rarity.text}`}>+{formatCurrency(character.effectiveCps)}/s</span>
          <span className="rounded border border-terminal-700 bg-terminal-900 px-1 text-xs text-terminal-100">
            Lv.{level}
          </span>
        </div>
      </div>
    </div>
  );
}
