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

export function characterCpsContribution(cps: number, level: number): number {
  return cps * 2 ** (level - 1);
}

interface DuplicatePullResult {
  level: number;
  duplicatesPulled: number;
  cpsGained: number;
  leveledUp: boolean;
}

export function applyDuplicatePull(
  cps: number,
  level: number,
  duplicatesPulled: number
): DuplicatePullResult {
  const nextDuplicatesPulled = duplicatesPulled + 1;

  if (nextDuplicatesPulled < level)
    return { level, duplicatesPulled: nextDuplicatesPulled, cpsGained: 0, leveledUp: false };

  return {
    level: level + 1,
    duplicatesPulled: 0,
    cpsGained: characterCpsContribution(cps, level),
    leveledUp: true
  };
}
