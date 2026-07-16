interface ProgressLike {
  currency: number;
  cps: number;
  lastActiveAt: Date;
}

export function accrueEarnings<T extends ProgressLike>(userProgress: T): number {
  const now = new Date();
  const elapsedSeconds = Math.max(0, (now.getTime() - userProgress.lastActiveAt.getTime()) / 1000);
  const earnings = elapsedSeconds * userProgress.cps;

  userProgress.currency += earnings;
  userProgress.lastActiveAt = now;

  return earnings;
}
