import mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Category =
  mongoose.models['Categories'] || mongoose.model('Categories', CategorySchema);
