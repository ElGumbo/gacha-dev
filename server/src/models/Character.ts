import { Schema, model } from 'mongoose';

export const RARITIES = ['R', 'SR', 'SSR', 'UR', 'LR'] as const;

const characterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: RARITIES,
    required: true
  },
  cps: {
    type: Number,
    required: true
  }
});

export default model('Character', characterSchema);
