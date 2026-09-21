const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => {
      const unitPrice = Number(item.product.selling_price?.toString() || item.product.selling_price || 0);
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: unitPrice,
      };
    });

    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    await newOrder.save();

    // Clear the cart after creating the order
    await Cart.findOneAndDelete({ user: userId });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId)
      .populate("items.product")
      .populate("shippingAddress");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({user : userId}).populate("items.product");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
