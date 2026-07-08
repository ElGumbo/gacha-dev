import { Schema, model } from 'mongoose';

const bannerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pool: [
    {
      _id: false,
      character: {
        type: Schema.Types.ObjectId,
        ref: 'Character',
        required: true
      },
      weight: {
        type: Number,
        required: true
      }
    }
  ],
  cost: {
    type: Number,
    required: true
  },
  pityThreshold: {
    type: Number,
    required: true
  }
});

export default model('Banner', bannerSchema);
