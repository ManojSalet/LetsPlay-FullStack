const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    sport_image: [
      {
        type: String,
        required: false,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    equipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for equipment
sportSchema.virtual('equipmentList', {
  ref: 'Equipment',
  localField: '_id',
  foreignField: 'sport',
});

module.exports = mongoose.model('Sport', sportSchema);
