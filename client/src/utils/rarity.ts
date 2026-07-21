interface RarityStyle {
  text: string;
  bg: string;
  glow: string;
  borderRest: string;
  borderHover: string;
  shadowHover: string;
}

const RARITY_STYLES: Record<string, RarityStyle> = {
  R: {
    text: 'text-rarity-r',
    bg: 'bg-rarity-r',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(156,163,175,0.08)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(156,163,175,0.22)]',
    borderHover: 'hover:border-rarity-r',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(156,163,175,0.08)]',
  },
  SR: {
    text: 'text-rarity-sr',
    bg: 'bg-rarity-sr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(74,222,128,0.1)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(74,222,128,0.28)]',
    borderHover: 'hover:border-rarity-sr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(74,222,128,0.1)]',
  },
  SSR: {
    text: 'text-rarity-ssr',
    bg: 'bg-rarity-ssr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(96,165,250,0.12)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(96,165,250,0.32)]',
    borderHover: 'hover:border-rarity-ssr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(96,165,250,0.12)]',
  },
  UR: {
    text: 'text-rarity-ur',
    bg: 'bg-rarity-ur',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(192,132,252,0.12)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(192,132,252,0.35)]',
    borderHover: 'hover:border-rarity-ur',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(192,132,252,0.12)]',
  },
  LR: {
    text: 'text-rarity-lr',
    bg: 'bg-rarity-lr',
    glow: 'bg-[radial-gradient(circle_at_100%_0%,rgba(251,191,36,0.15)_0%,transparent_65%)]',
    borderRest: 'border-[rgba(251,191,36,0.45)]',
    borderHover: 'hover:border-rarity-lr',
    shadowHover: 'hover:shadow-[0_0_16px_rgba(251,191,36,0.15)]',
  },
};

// Keep in sync with the RARITIES enum in server/src/models/Character.ts.
export const RARITY_ORDER = Object.keys(RARITY_STYLES);

export function rarityStyle(rarity: string): RarityStyle {
  return RARITY_STYLES[rarity] ?? RARITY_STYLES.R;
}
