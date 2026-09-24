const mongoose = require('mongoose');

const addressDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  houseNo: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India',
  },
  contact: {
    type: Number,
    required: true,
  },
  select: {
    type: Boolean,
    default: false,
  },
});

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: [addressDetailsSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Address', addressSchema);
