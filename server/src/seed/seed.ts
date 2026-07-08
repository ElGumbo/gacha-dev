import mongoose from 'mongoose';
import '#db';
import { Character, Banner } from '#models';

const CHARACTERS = [
  { name: 'WordPress Dev', rarity: 'R', cps: 1 },
  { name: 'Shopify Dev', rarity: 'R', cps: 1 },
  { name: 'Apprentice Dev', rarity: 'R', cps: 1 },
  { name: 'Junior Dev', rarity: 'R', cps: 1 },
  { name: 'Bootcamp Grad', rarity: 'R', cps: 1 },
  { name: 'Intern Dev', rarity: 'R', cps: 1 },
  { name: 'Stack Overflow Copy-Paster', rarity: 'R', cps: 1 },
  { name: 'Tutorial Hell Dev', rarity: 'R', cps: 1 },
  { name: 'Frontend Dev', rarity: 'SR', cps: 5 },
  { name: 'Backend Dev', rarity: 'SR', cps: 5 },
  { name: 'Full-Stack Dev', rarity: 'SR', cps: 5 },
  { name: 'DevOps Engineer', rarity: 'SR', cps: 5 },
  { name: 'Freelance Dev', rarity: 'SR', cps: 5 },
  { name: 'Mid-Level Dev', rarity: 'SR', cps: 5 },
  { name: 'Senior Dev', rarity: 'SSR', cps: 20 },
  { name: 'Tech Lead', rarity: 'SSR', cps: 20 },
  { name: 'Staff Engineer', rarity: 'SSR', cps: 20 },
  { name: 'Principal Engineer', rarity: 'SSR', cps: 20 },
  { name: 'AI Whisperer', rarity: 'UR', cps: 100 },
  { name: 'Vibe Coder Supreme', rarity: 'UR', cps: 100 },
  { name: 'God Dev Yush', rarity: 'LR', cps: 1000 },
  { name: 'God Dev Rami', rarity: 'LR', cps: 1000 }
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
