import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    deliveryAddresses: {
      type: Array,
      default: [],
      required: false
    },
    isActive: {
      type: Boolean,
      default: true,
      required: false
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const User =
  mongoose.models['Users'] || mongoose.model('Users', UserSchema);
