const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	wishlist: [{
		products: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		}
	}],
});

module.exports = mongoose.model('Wishlist', wishlistSchema);