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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('UserCharacter', userCharacterSchema);
