import mongoose from 'mongoose';
import type { RequestHandler } from 'express';
import { Banner, UserProgress, UserBannerState, UserCharacter, PullHistory } from '#models';
import {
  weightedRandomPick,
  applyDuplicatePull,
  characterCpsContribution,
  accrueEarnings
} from '#utils';

interface PullResponse {
  message: string;
  character: {
    id: string;
    collectionEntryId: string;
    name: string;
    rarity: string;
    cps: number;
    effectiveCps: number;
    level: number;
    leveledUp: boolean;
  };
  pityCounter: number;
  currency: number;
}

interface BannerDTO {
  id: string;
  name: string;
  cost: number;
  pityThreshold: number;
  pool: {
    character: { id: string; name: string; rarity: string; cps: number };
    weight: number;
    oddsPercent: number;
  }[];
}

interface BannersListResponse {
  message: string;
  banners: BannerDTO[];
}

type PoolCharacter = {
  _id: mongoose.Types.ObjectId;
  name: string;
  rarity: string;
  cps: number;
};

type PopulatedBanner = {
  _id: { toString(): string };
  name: string;
  cost: number;
  pityThreshold: number;
  pool: { character: PoolCharacter | null; weight: number }[];
};

type ValidatedBanner = Omit<PopulatedBanner, 'pool'> & {
  pool: { character: PoolCharacter; weight: number }[];
};

function toBannerDTO(banner: ValidatedBanner): BannerDTO {
  const totalWeight = banner.pool.reduce((sum, entry) => sum + entry.weight, 0);

  return {
    id: banner._id.toString(),
    name: banner.name,
    cost: banner.cost,
    pityThreshold: banner.pityThreshold,
    pool: banner.pool.map(entry => ({
      character: {
        id: entry.character._id.toString(),
        name: entry.character.name,
        rarity: entry.character.rarity,
        cps: entry.character.cps
      },
      weight: entry.weight,
      oddsPercent: totalWeight > 0 ? (entry.weight / totalWeight) * 100 : 0
    }))
  };
}

export const getBanners: RequestHandler<unknown, BannersListResponse> = async (req, res, next) => {
  try {
    const banners = (await Banner.find()
      .populate('pool.character')
      .lean()) as unknown as PopulatedBanner[];

    if (banners.some(banner => banner.pool.length === 0))
      throw new Error('Banner has no characters configured.', { cause: { status: 500 } });
    if (banners.some(banner => banner.pool.some(entry => !entry.character)))
      throw new Error('Banner pool references a deleted character.', { cause: { status: 500 } });

    const validBanners = banners as ValidatedBanner[];

    res.json({ message: 'Banners retrieved.', banners: validBanners.map(toBannerDTO) });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

const pullsInProgress = new Set<string>();

export const pull: RequestHandler<{ id: string }, PullResponse> = async (req, res, next) => {
  const userId = req.user!.id;

  if (pullsInProgress.has(userId))
    return next(new Error('A pull is already in progress.', { cause: { status: 409 } }));
  pullsInProgress.add(userId);

  try {
    const session = await mongoose.startSession();
    try {
      const { id: bannerId } = req.params;

      let responseBody: PullResponse | undefined;

      await session.withTransaction(async () => {
        const banner = await Banner.findById(bannerId)
          .populate('pool.character')
          .session(session);
        if (!banner) throw new Error('Banner not found.', { cause: { status: 404 } });

        const pool = banner.pool as unknown as {
          character: PoolCharacter | null;
          weight: number;
        }[];

        if (pool.length === 0)
          throw new Error('Banner has no characters configured.', { cause: { status: 500 } });
        if (pool.some(entry => !entry.character))
          throw new Error('Banner pool references a deleted character.', {
            cause: { status: 500 }
          });

        const validPool = pool as { character: PoolCharacter; weight: number }[];

        const userProgress = await UserProgress.findOneAndUpdate(
          { user: userId },
          { $setOnInsert: { user: userId } },
          { upsert: true, new: true, setDefaultsOnInsert: true, session }
        );
        accrueEarnings(userProgress);

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

        const character = pityTriggered
          ? weightedRandomPick(urPool)
          : weightedRandomPick(validPool);

        bannerState.pityCounter = character.rarity === 'UR' ? 0 : bannerState.pityCounter + 1;
        await bannerState.save({ session });

        userProgress.currency -= banner.cost;

        // Atomic upsert (same idiom as UserProgress/UserBannerState above) so two concurrent
        // first-time pulls of the same character can't race a plain find-then-create into a
        // non-transient duplicate-key error against the (user, character) unique index.
        const upsertResult = await UserCharacter.findOneAndUpdate(
          { user: userId, character: character._id },
          { $setOnInsert: { user: userId, character: character._id } },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            session,
            includeResultMetadata: true
          }
        );

        const userCharacter = upsertResult.value!;
        const isNewCharacter = Boolean(upsertResult.lastErrorObject?.upserted);

        let leveledUp = false;

        if (isNewCharacter) {
          userProgress.cps += character.cps;
        } else {
          const result = applyDuplicatePull(
            character.cps,
            userCharacter.level,
            userCharacter.duplicatesPulled
          );
          userCharacter.level = result.level;
          userCharacter.duplicatesPulled = result.duplicatesPulled;
          userProgress.cps += result.cpsGained;
          leveledUp = result.leveledUp;
          await userCharacter.save({ session });
        }

        await userProgress.save({ session });

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
            collectionEntryId: userCharacter._id.toString(),
            name: character.name,
            rarity: character.rarity,
            cps: character.cps,
            effectiveCps: characterCpsContribution(character.cps, userCharacter.level),
            level: userCharacter.level,
            leveledUp
          },
          pityCounter: bannerState.pityCounter,
          currency: userProgress.currency
        };
      });

      res.json(responseBody);
    } finally {
      await session.endSession();
    }
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  } finally {
    pullsInProgress.delete(userId);
  }
};
