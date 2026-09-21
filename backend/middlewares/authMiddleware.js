const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.protect = (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.userId };  // Ensure this matches your JWT payload
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};
