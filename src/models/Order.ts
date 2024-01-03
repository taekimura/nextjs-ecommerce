import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users'
    },
    items: [],
    paymentStatus: {
      type: String,
      required: true
    },
    orderStatus: {
      type: String,
      required: true
    },
    shippingAddress: {
      type: Object,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);
if (mongoose.models && mongoose.models['Orders'])
  delete mongoose.models['Orders'];

export const Order = mongoose.model('Orders', OrderSchema);
