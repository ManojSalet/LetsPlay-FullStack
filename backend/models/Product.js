const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    brand: {
      type: String,
      default: 'General',
      trim: true,
    },
    description: {
      type: String,
    },
    product_images: [
      {
        type: String,
      },
    ],
    qty: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discountPer: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    selling_price: {
      type: Number,
      required: true,
      min: 0,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: false,
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes for fast catalog searches and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ sport: 1, equipment: 1, category: 1 });
productSchema.index({ isDeleted: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);