const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    transactionId: {
      type: String,
      default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'COD'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
