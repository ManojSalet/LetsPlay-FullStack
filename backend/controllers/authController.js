const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { text } = require('body-parser');
require('dotenv').config();

const sendVerificationEmail = async (user) => {
	var transporter = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: '2525',
		secure: false,
		auth: {
			user: 'd89a43040a2f17',
			pass: '2ab0ebc0eb0cae'
		}
	});

	var mailOptions = {
		from: "letsplaysporteuipment@gmail.com",
		to: user.email,
		subject: 'Email Verification',
		text: `Verify your email by clicking the link: ${process.env.BASE_URL}/api/auth/verifyEmail/${user.verificationToken}`,
		message: `Verify your email by clicking the link: ${process.env.BASE_URL}/api/auth/verifyEmail/${user.verificationToken}`,
	};

	await transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

exports.register = async (req, res) => {
	const { username, mobile, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

		user = new User({
			username,
			mobile,
			email,
			password,
			verificationToken
		});

		await user.save();

		await sendVerificationEmail(user);

		res.status(201).json({ message: 'User registered, please varify your email' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("server error");
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		let user = await User.findOne({ email: decoded.email });

		if (!user) {
			return res.status(400).json({ message: "Invalid token" });
		}

		user.isVerified = true;
		user.verificationToken = null;

		await user.save();

		res.status(200).json({ message: "Email verified, you can now login" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("server error");
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// if (!user.isVerified) {
		// 	return res.status(400).json({ message: "Please verify your email first" });
		// }

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		return res.status(200).json({ 
			token
		});
	} catch (error) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
}
