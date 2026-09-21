const Address = require('../models/Address');

// add a new address
exports.addAddress = async (req, res) => {
	try {
		const userId = req.user.id;
		const  details = req.body.details;

		console.log('Request body:', req.body);
    	console.log('User ID:', req.user.id);

		if (!details || details.length === 0) {
            return res.status(400).json({ message: "Details are required." });
        }

		const address = new Address({
			userId,
			details
		});

		await address.save();
		res.status(201).json({ message: "Address Add Successfully", address });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// update an existing Address
exports.updateAddress = async (req, res) => {
	try {
		const { addressId } = req.params;
		const { details } = req.body;

		const address = await Address.findById(addressId);

		if (!address) {
			return res.status(404).json({ message: 'Address not found' });
		}

		address.details = details;
		await address.save();

		res.status(200).json({ message: 'Address updated successfully', address });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Delete an address

exports.deleteAddress = async (req, res) => {
	try {
		const { addressId } = req.params;

		const address = await Address.findById(addressId);

		if (!address) {
			return res.status(404).json({ message: 'Address not found' });
		}

		await Address.deleteOne({ _id: addressId });

		res.status(200).json({ message: 'Address deleted successfully' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

// Show all addresses for a user
exports.showAddresses = async (req, res) => {
	try {
		const { userId } = req.params;

		const addresses = await Address.find({ userId });

		if (!addresses.length) {
			return res.status(404).json({ message: 'No addresses found for this user' });
		}

		res.status(200).json({ addresses });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

