const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
	},
	amount: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
	paymentMethod: {
		type: String,
		enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'cod'],
		required: true,
	},
	paymentStatus: {
		type: String,
		enum: ['Success', 'Failed', 'Pending'],
		default: 'Pending',
	},
	paymentDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Payment', paymentSchema);
