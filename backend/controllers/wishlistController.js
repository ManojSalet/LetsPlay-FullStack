const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');

exports.addToWishlist = async (req, res) => {
	try {
		const userId = req.user.id;
		const { wishlist } = req.body;
		const productId = wishlist[0]?.product; // Get the product ID from the wishlist array

		console.log("Request Body:", req.body); 
		console.log("Attempting to add product with ID:", productId);

		// Check if the product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Find the wishlist for the user
		let wishlistDoc = await Wishlist.findOne({ userId });

		if (!wishlistDoc) {
			// If the wishlist doesn't exist, create a new one
			wishlistDoc = new Wishlist({ userId, wishlist: [{ products: productId }] });
		} else {
			// If the product is already in the wishlist, return a message
			const isProductInWishlist = wishlistDoc.wishlist.some(item => item.products.toString() === productId);
			if (isProductInWishlist) {
				return res.status(400).json({ message: "Product is already in the wishlist" });
			}

			// Otherwise, add the product to the wishlist
			wishlistDoc.wishlist.push({ products: productId });
		}

		await wishlistDoc.save();
		res.status(200).json({ message: "Product added to wishlist", wishlist: wishlistDoc });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};


exports.getWishlist = async (req, res) => {
	try {
		const userId = req.user.id;

		const wishlist = await Wishlist.findOne({ userId }).populate('wishlist.products'); // Changed 'product' to 'products'

		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found" });
		}

		res.status(200).json({ wishlist });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};


exports.removeFromWishlist = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;

		let wishlist = await Wishlist.findOne({ userId });

		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found" });
		}

		// Ensure productId is provided
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		// Remove the product from the wishlist
		wishlist.wishlist = wishlist.wishlist.filter(item => item.products.toString() !== productId);

		await wishlist.save();
		res.status(200).json({ message: "Product removed from wishlist", wishlist });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

exports.deleteWishlist = async (req, res) => {
	try {
		const userId = req.user.id;

		const wishlist = await Wishlist.findOneAndDelete({ userId });

		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found" });
		}

		res.status(200).json({ message: "Wishlist deleted successfully" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};
