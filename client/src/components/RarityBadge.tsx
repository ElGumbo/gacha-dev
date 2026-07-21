import { rarityStyle } from '../utils/rarity';

interface RarityBadgeProps {
  rarity: string;
  small?: boolean;
}

export function RarityBadge({ rarity, small }: RarityBadgeProps) {
  return (
    <span
      className={`rounded border border-current font-bold ${rarityStyle(rarity).text} ${
        small ? 'px-1 py-0 text-[9px]' : 'px-1.5 py-0.5 text-xs'
      }`}
    >
      {rarity}
    </span>
  );
}
