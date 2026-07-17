interface ProgressLike {
  currency: number;
  cps: number;
  lastActiveAt: Date;
}

export function accrueEarnings<T extends ProgressLike>(userProgress: T): void {
  const now = new Date();
  const elapsedSeconds = Math.max(0, (now.getTime() - userProgress.lastActiveAt.getTime()) / 1000);

  userProgress.currency += elapsedSeconds * userProgress.cps;
  userProgress.lastActiveAt = now;
}
