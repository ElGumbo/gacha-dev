import type { RequestHandler } from 'express';
import { UserCharacter } from '#models';
import { characterCpsContribution } from '#utils';

interface CollectionEntryDTO {
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
  obtainedAt: Date;
}

interface CollectionListResponse {
  message: string;
  characters: CollectionEntryDTO[];
}

interface CollectionDetailResponse {
  message: string;
  character: CollectionEntryDTO;
}

type PopulatedCharacter = { _id: { toString(): string }; name: string; rarity: string; cps: number };

type PopulatedUserCharacter = {
  _id: { toString(): string };
  character: PopulatedCharacter | null;
  level: number;
  duplicatesPulled: number;
  createdAt: Date;
};

function hasCharacter(
  entry: PopulatedUserCharacter
): entry is PopulatedUserCharacter & { character: PopulatedCharacter } {
  return entry.character !== null;
}

function toDTO(doc: PopulatedUserCharacter & { character: PopulatedCharacter }): CollectionEntryDTO {
  return {
    id: doc._id.toString(),
    character: {
      id: doc.character._id.toString(),
      name: doc.character.name,
      rarity: doc.character.rarity,
      cps: doc.character.cps,
      effectiveCps: characterCpsContribution(doc.character.cps, doc.level)
    },
    level: doc.level,
    duplicatesPulled: doc.duplicatesPulled,
    duplicatesPerLevel: doc.level,
    obtainedAt: doc.createdAt
  };
}

export const getCollection: RequestHandler<unknown, CollectionListResponse> = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user!.id;

    const entries = (await UserCharacter.find({ user: userId })
      .populate('character')
      .lean()) as unknown as PopulatedUserCharacter[];

    if (!entries.every(hasCharacter))
      throw new Error('Collection references a deleted character.', { cause: { status: 500 } });

    res.json({ message: 'Collection retrieved.', characters: entries.map(toDTO) });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const getCollectionEntry: RequestHandler<{ id: string }, CollectionDetailResponse> = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const entry = (await UserCharacter.findOne({ _id: id, user: userId })
      .populate('character')
      .lean()) as unknown as PopulatedUserCharacter | null;
    if (!entry) throw new Error('Character not found in collection.', { cause: { status: 404 } });
    if (!hasCharacter(entry))
      throw new Error('Collection entry references a deleted character.', {
        cause: { status: 500 }
      });

    res.json({ message: 'Character retrieved.', character: toDTO(entry) });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};
