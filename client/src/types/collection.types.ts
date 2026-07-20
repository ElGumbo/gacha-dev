export interface CollectionCharacter {
  id: string;
  character: {
    id: string;
    name: string;
    rarity: string;
    cps: number;
    effectiveCps: number;
  };
  level: number;
  duplicatesPulled: number;
  duplicatesPerLevel: number;
  obtainedAt: string;
}

export interface CollectionListResponse {
  message: string;
  characters: CollectionCharacter[];
}
