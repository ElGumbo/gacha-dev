import type { RequestHandler } from 'express';
import { UserProgress } from '#models';
import { accrueEarnings } from '#utils';

interface ProgressResponse {
  message: string;
  currency: number;
  cps: number;
  pityCounter: number;
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

    accrueEarnings(userProgress);
    await userProgress.save();

    res.json({
      message: 'Progress retrieved.',
      currency: userProgress.currency,
      cps: userProgress.cps,
      pityCounter: userProgress.pityCounter
    });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  } finally {
    progressUpdatesInProgress.delete(userId);
  }
};
