const Payment = require('../models/Payment');
const Order = require('../models/Order');

exports.processPayment = async (req, res) => {
	try {
		const { order: orderId, paymentMethod } = req.body;

		const order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		if (order.paymentStatus === 'Paid') {
			return res.status(400).json({ message: 'Order already paid' });
		}

		const payment = new Payment({
			order: orderId,
			amount: order.totalPrice,
			paymentMethod,
			paymentStatus: 'Success',
		});

		order.paymentStatus = 'Paid';
		await payment.save();
		await order.save();

		res.status(200).json({ message: 'Payment successful', payment });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
