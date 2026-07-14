import { Schema, model } from 'mongoose';

const userCharacterSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    character: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true
    },
    level: {
      type: Number,
      required: true,
      default: 1
    },
    duplicatesPulled: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userCharacterSchema.index({ user: 1, character: 1 }, { unique: true });

export default model('UserCharacter', userCharacterSchema);
