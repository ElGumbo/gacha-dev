export interface BannerCharacter {
  id: string;
  name: string;
  rarity: string;
  cps: number;
}

export interface BannerPoolEntry {
  character: BannerCharacter;
  weight: number;
  oddsPercent: number;
}

export interface Banner {
  id: string;
  name: string;
  cost: number;
  pityThreshold: number;
  pool: BannerPoolEntry[];
}

export interface BannersListResponse {
  message: string;
  banners: Banner[];
}

export interface PullResult {
  id: string;
  collectionEntryId: string;
  name: string;
  rarity: string;
  cps: number;
  effectiveCps: number;
  level: number;
  leveledUp: boolean;
}

export interface PullResponse {
  message: string;
  character: PullResult;
  pityCounter: number;
  currency: number;
}
