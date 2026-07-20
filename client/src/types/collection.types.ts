import type { BannerCharacter } from './banner.types';

export interface CollectionCharacter {
  id: string;
  character: BannerCharacter & { effectiveCps: number };
  level: number;
  duplicatesPulled: number;
  duplicatesPerLevel: number;
  obtainedAt: string;
}

export interface CollectionListResponse {
  message: string;
  characters: CollectionCharacter[];
}
