import { Schema, model } from 'mongoose';
// User schema definition
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    roles: {
      type: [String],
      default: ['user']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const User = model('User', userSchema);

export default User;
