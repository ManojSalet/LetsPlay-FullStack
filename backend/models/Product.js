const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	product_images: [{
		type: String
	}],
	qty: {
		type: Number,
		required: true,
		default: 0
	},
	discountPer: {
		type: Number,
		default: 0
	},
	price: {
		type: mongoose.Schema.Types.Decimal128,
		require: true
	},
	selling_price: {
		type: mongoose.Schema.Types.Decimal128,
		require: true
	},
	equipment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Equipment',
		required: false
	},
	createAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Product', productSchema);