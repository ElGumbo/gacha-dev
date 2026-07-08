import mongoose from 'mongoose';
import '#db';
import { Character, Banner } from '#models';

const CHARACTERS = [
  { name: 'Ash Cub', rarity: 'R', cps: 1 },
  { name: 'Pebble Golem', rarity: 'R', cps: 1 },
  { name: 'Reed Sprite', rarity: 'R', cps: 1 },
  { name: 'Dust Imp', rarity: 'R', cps: 1 },
  { name: 'Moth Kin', rarity: 'R', cps: 1 },
  { name: 'Puddle Slime', rarity: 'R', cps: 1 },
  { name: 'Twig Faun', rarity: 'R', cps: 1 },
  { name: 'Coal Whelp', rarity: 'R', cps: 1 },
  { name: 'Ember Fox', rarity: 'SR', cps: 5 },
  { name: 'Tide Serpent', rarity: 'SR', cps: 5 },
  { name: 'Storm Hawk', rarity: 'SR', cps: 5 },
  { name: 'Iron Boar', rarity: 'SR', cps: 5 },
  { name: 'Moon Hare', rarity: 'SR', cps: 5 },
  { name: 'Thorn Wolf', rarity: 'SR', cps: 5 },
  { name: 'Frost Lynx', rarity: 'SSR', cps: 20 },
  { name: 'Solar Griffin', rarity: 'SSR', cps: 20 },
  { name: 'Void Panther', rarity: 'SSR', cps: 20 },
  { name: 'Thunder Drake', rarity: 'SSR', cps: 20 },
  { name: 'Abyssal Kraken', rarity: 'UR', cps: 100 },
  { name: 'Celestial Phoenix', rarity: 'UR', cps: 100 },
  { name: 'Eternal Dragon', rarity: 'LR', cps: 1000 }
];

const WEIGHT_BY_RARITY: Record<string, number> = {
  R: 100,
  SR: 40,
  SSR: 15,
  UR: 4,
  LR: 0.1
};

async function seed() {
  await Character.deleteMany({});
  await Banner.deleteMany({});

  const characters = await Character.insertMany(CHARACTERS);
  console.log(`Seeded ${characters.length} characters.`);

  const pool = characters.map(character => ({
    character: character._id,
    weight: WEIGHT_BY_RARITY[character.rarity]
  }));

  await Banner.create({
    name: 'Standard Banner',
    pool,
    cost: 100,
    pityThreshold: 90
  });
  console.log('Seeded standard banner.');
}

seed()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
