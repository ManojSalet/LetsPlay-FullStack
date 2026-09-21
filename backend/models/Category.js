const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	sports: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Sport'
	}],
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Category', categorySchema);