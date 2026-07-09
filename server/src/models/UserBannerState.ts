import { Schema, model } from 'mongoose';

const userBannerStateSchema = new Schema(
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
    pityCounter: {
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

userBannerStateSchema.index({ user: 1, banner: 1 }, { unique: true });

export default model('UserBannerState', userBannerStateSchema);
