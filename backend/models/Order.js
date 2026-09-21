const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	quantity: {
		type: Number,
		required: true,
		min: 1
	},
	price: {
		type: mongoose.Schema.Types.Decimal128,
		required: true
	}
});

const orderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	items: [orderItemSchema],
	totalPrice: {
		type: mongoose.Schema.Types.Decimal128,
		required: true
	},
	shippingAddress: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
		required: true,
	},
	paymentStatus: {
		type: String,
		enum: ['Pending', 'Paid', 'Failed'],
		default: 'Pending',
	},
	orderStatus: {
		type: String,
		enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
		default: 'Processing',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Order', orderSchema);