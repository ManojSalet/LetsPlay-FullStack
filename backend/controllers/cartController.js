const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const userId = req.user.id;

		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			cart = new Cart({ user: userId, items: [] });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

		if (itemIndex > -1) {
			cart.items[itemIndex].quantity += quantity;
		} else {
			cart.items.push({ product: productId, quantity });
		}

		await cart.save();
		res.status(200).json({ message: 'Item added to cart', cart });
	} catch (error) {
		console.error('Error in addToCart:', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.updateCartQuantity = async (req,res) =>{
	try {
		const {productId, quantity} = req.body;
		const userId = req.user.id;

		// find the cart for the logged in user 
		let cart = await Cart.findOne({user : userId});

		if(!cart){
			return res.status(404).json({message: 'Cart not found'});
		}

		//find the index of the product to update
		const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

		if(itemIndex > -1){
			//update the quantity of the item
			cart.items[itemIndex].quantity = quantity;
			await cart.save();
			res.status(200).json({message: 'Cart update successfully',cart});
		}
		else{
			res.status(404).json({message:'Product not found in cart'});
		}

	} catch (error) {
		console.error('Error in updateCartQuantity:',error.message);
		res.status(500).json({message:'Server error',error: error.message});
	}
}

exports.removeFromCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const userId = req.user.id;

		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}

		cart.items = cart.items.filter(item => item.product.toString() !== productId);

		await cart.save();
		res.status(200).json({ message: 'Item removed from cart', cart });
	} catch (error) {
		console.error('Error in removeFromCart:', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getCart = async (req, res) => {
	try {
		const userId = req.user.id;
		const cart = await Cart.findOne({ user: userId }).populate('items.product');
		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}
		res.status(200).json({ cart });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
