import { Schema, model } from 'mongoose';

const userProgressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    currency: {
      type: Number,
      required: true,
      default: 1000
    },
    cps: {
      type: Number,
      required: true,
      default: 0
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('UserProgress', userProgressSchema);
