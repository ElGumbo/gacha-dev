import { Schema, model } from 'mongoose';
import { RARITIES } from './Character.ts';

const pullHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    banner: {
      type: Schema.Types.ObjectId,
      ref: 'Banner',
      required: true
    },
    character: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true
    },
    rarity: {
      type: String,
      enum: RARITIES,
      required: true
    },
    pityTriggered: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

export default model('PullHistory', pullHistorySchema);
