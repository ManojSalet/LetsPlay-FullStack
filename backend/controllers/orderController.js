const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create a new order from active cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Verify stock availability
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: "One or more products in your cart are no longer available" });
      }
      if (item.quantity > (item.product.qty || 0)) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.product.name}". Only ${item.product.qty || 0} unit(s) left in stock.`
        });
      }
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

    const orderNumber = `LP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      orderStatus: "Processing",
      statusHistory: [
        {
          status: "Processing",
          changedAt: new Date(),
          note: "Order created and awaiting fulfillment",
        },
      ],
    });

    await newOrder.save();

    // Decrement inventory stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { qty: -item.quantity },
      });
    }

    // Clear the cart after creating the order
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single order by ID
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all orders for logged in user
exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: orders || [] });
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: View all orders across store
exports.adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email mobile")
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: orders || [] });
  } catch (error) {
    console.error("Error in adminGetAllOrders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Update order status (Processing -> Shipped -> Delivered -> Cancelled)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, note } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      changedAt: new Date(),
      note: note || `Status updated to ${orderStatus}`,
    });

    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
