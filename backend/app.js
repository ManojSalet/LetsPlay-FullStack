const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sportRoutes = require('./routes/sportRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/userReviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration supporting modern REST methods
app.use(cors({
	origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Authorization', 'Content-Type']
}));

// Middleware to parse JSON
app.use(express.json());

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res, next) => {
	res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
	console.error('Server error:', err);
	res.status(err.status || 500).json({
		message: err.message || 'Internal Server Error'
	});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
