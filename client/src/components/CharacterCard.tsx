import { formatCurrency } from '../utils/format';
import { rarityStyle } from '../utils/rarity';
import type { BannerCharacter } from '../types/banner.types';

export interface CharacterSummary extends Pick<BannerCharacter, 'name' | 'rarity'> {
  effectiveCps: number;
}

interface CharacterCardProps {
  character: CharacterSummary;
  level: number;
}

export function CharacterCard({ character, level }: CharacterCardProps) {
  const rarity = rarityStyle(character.rarity);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-linear-145 from-[#131418] to-[#1a1b21] p-3 transition-all duration-150 hover:-translate-y-0.5 ${rarity.borderRest} ${rarity.borderHover} ${rarity.shadowHover}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${rarity.glow}`} />

      <div className="relative leading-none">
        <span className={`rounded border border-current px-1 text-xs font-bold ${rarity.text}`}>
          {character.rarity}
        </span>

        <div className="mt-3 flex min-h-10 items-center">
          <p className="text-sm font-semibold text-terminal-50 line-clamp-2">{character.name}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs font-medium ${rarity.text}`}>
            +{formatCurrency(character.effectiveCps)}/s
          </span>
          <span className="rounded border border-terminal-700 bg-terminal-900 px-1 text-xs text-terminal-100">
            Lv.{level}
          </span>
        </div>
      </div>
    </div>
  );
}
