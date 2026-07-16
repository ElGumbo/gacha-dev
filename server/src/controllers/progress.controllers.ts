import type { RequestHandler } from 'express';
import { UserProgress } from '#models';

interface ProgressResponse {
  message: string;
  currency: number;
  cps: number;
  lastActiveAt: Date;
  offlineEarnings: number;
}

const progressUpdatesInProgress = new Set<string>();

export const getProgress: RequestHandler<unknown, ProgressResponse> = async (req, res, next) => {
  const userId = req.user!.id;

  if (progressUpdatesInProgress.has(userId))
    return next(new Error('A progress update is already in progress.', { cause: { status: 409 } }));
  progressUpdatesInProgress.add(userId);

  try {
    const userProgress = await UserProgress.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const elapsedSeconds = Math.max(0, (Date.now() - userProgress.lastActiveAt.getTime()) / 1000);
    const offlineEarnings = elapsedSeconds * userProgress.cps;

    userProgress.currency += offlineEarnings;
    userProgress.lastActiveAt = new Date();
    await userProgress.save();

    res.json({
      message: 'Progress retrieved.',
      currency: userProgress.currency,
      cps: userProgress.cps,
      lastActiveAt: userProgress.lastActiveAt,
      offlineEarnings
    });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  } finally {
    progressUpdatesInProgress.delete(userId);
  }
};
