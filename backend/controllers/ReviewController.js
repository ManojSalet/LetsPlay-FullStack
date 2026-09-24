const UserReview = require('../models/UserReview');
const Product = require('../models/Product');

exports.addReview = async (req, res) => {
	try {
		const userId = req.user.id;
		const { product, rating, comment } = req.body;

		// Check if the product exists
		const existingProduct = await Product.findById(product);
		if (!existingProduct) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Create a new review
		const newReview = new UserReview({
			user: userId,
			product,
			rating,
			comment
		});

		await newReview.save();

		res.status(201).json({ message: 'Review added successfully', review: newReview });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

exports.updateReview = async (req, res) => {
	try {
		const { reviewId, rating, comment } = req.body;

		// Find the review and update it
		const updatedReview = await UserReview.findByIdAndUpdate(
			reviewId,
			{ rating, comment },
			{ new: true }
		);

		if (!updatedReview) {
			return res.status(404).json({ message: 'Review not found' });
		}

		res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

exports.deleteReview = async (req, res) => {
	try {
		const { reviewId } = req.body;

		// Find the review and delete it
		const deletedReview = await UserReview.findByIdAndDelete(reviewId);

		if (!deletedReview) {
			return res.status(404).json({ message: 'Review not found' });
		}

		res.status(200).json({ message: 'Review deleted successfully' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

exports.getProductReviews = async (req, res) => {
	try {
		const { productId } = req.params;

		// Find reviews for the specified product
		const reviews = await UserReview.find({ product: productId }).populate('user', 'username');

		res.status(200).json({ reviews });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};
