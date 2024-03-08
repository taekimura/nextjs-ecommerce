const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String
    },
    rating: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    }
  },
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models['Reviews'])
  delete mongoose.models['Reviews'];

export const Review = mongoose.model('Reviews', ReviewSchema);
