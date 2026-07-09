import mongoose from 'mongoose';
import type { RequestHandler } from 'express';
import { Banner, UserProgress, UserBannerState, UserCharacter, PullHistory } from '#models';
import { weightedRandomPick } from '#utils';

interface PullResponse {
  message: string;
  character: {
    id: string;
    name: string;
    rarity: string;
    cps: number;
  };
  pityCounter: number;
  currency: number;
}

type PoolCharacter = {
  _id: mongoose.Types.ObjectId;
  name: string;
  rarity: string;
  cps: number;
};

export const pull: RequestHandler<{ id: string }, PullResponse> = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { id: bannerId } = req.params;
    const userId = req.user!.id;

    let responseBody: PullResponse | undefined;

    await session.withTransaction(async () => {
      const banner = await Banner.findById(bannerId).populate('pool.character').session(session);
      if (!banner) throw new Error('Banner not found.', { cause: { status: 404 } });

      const pool = banner.pool as unknown as { character: PoolCharacter | null; weight: number }[];

      if (pool.length === 0)
        throw new Error('Banner has no characters configured.', { cause: { status: 500 } });
      if (pool.some(entry => !entry.character))
        throw new Error('Banner pool references a deleted character.', { cause: { status: 500 } });

      const validPool = pool as { character: PoolCharacter; weight: number }[];

      const userProgress = await UserProgress.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { user: userId } },
        { upsert: true, new: true, setDefaultsOnInsert: true, session }
      );

      if (userProgress.currency < banner.cost)
        throw new Error('Insufficient currency.', { cause: { status: 400 } });

      const bannerState = await UserBannerState.findOneAndUpdate(
        { user: userId, banner: banner._id },
        { $setOnInsert: { user: userId, banner: banner._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true, session }
      );

      const pityTriggered = bannerState.pityCounter + 1 >= banner.pityThreshold;
      const urPool = validPool.filter(entry => entry.character.rarity === 'UR');

      if (pityTriggered && urPool.length === 0)
        throw new Error('Banner pool has no UR character configured for the pity guarantee.', {
          cause: { status: 500 }
        });

      const character = pityTriggered ? weightedRandomPick(urPool) : weightedRandomPick(validPool);

      bannerState.pityCounter = character.rarity === 'UR' ? 0 : bannerState.pityCounter + 1;
      await bannerState.save({ session });

      userProgress.currency -= banner.cost;
      userProgress.cps += character.cps;
      await userProgress.save({ session });

      await UserCharacter.create([{ user: userId, character: character._id }], { session });

      await PullHistory.create(
        [
          {
            user: userId,
            banner: banner._id,
            character: character._id,
            rarity: character.rarity,
            pityTriggered
          }
        ],
        { session }
      );

      responseBody = {
        message: 'Pull successful.',
        character: {
          id: character._id.toString(),
          name: character.name,
          rarity: character.rarity,
          cps: character.cps
        },
        pityCounter: bannerState.pityCounter,
        currency: userProgress.currency
      };
    });

    res.json(responseBody);
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  } finally {
    await session.endSession();
  }
};
