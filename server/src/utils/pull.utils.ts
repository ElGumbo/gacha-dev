interface WeightedPoolEntry<T> {
  character: T;
  weight: number;
}

export function weightedRandomPick<T>(pool: WeightedPoolEntry<T>[]): T {
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) throw new Error('Cannot pick from a pool with zero total weight.');

  let roll = Math.random() * totalWeight;

  for (const entry of pool) {
    roll -= entry.weight;
    if (roll < 0) return entry.character;
  }

  return pool[pool.length - 1].character;
}
