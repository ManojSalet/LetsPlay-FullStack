const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	details: [{
		name: {
			type: String,
			required: true
		},
		houseNo: {
			type: String,
			required: true
		},
		street: {
			type: String,
			required: true
		},
		landmark: {
			type: String,
			required: true
		},
		pin: {
			type: Number,
			required: true
		},
		district: {
			type: String,
			required: true
		},
		state: {
			type: String,
			required: true
		},
		country: {
			type: String,
			required: true
		},
		contact: {
			type: Number,
			required: true
		},
		select: {
			type: Boolean,
			default: false
		}
	}]
});

module.exports = mongoose.model('Address', addressSchema);
