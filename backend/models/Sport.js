const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String
	},
	sport_image:[{
		type: String,
		required: false
	}],
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	equipment: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Equipment'
	}],
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Sport', sportSchema);
