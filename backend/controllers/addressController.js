const Address = require('../models/Address');

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    let details = req.body.details;

    if (!details) {
      return res.status(400).json({ message: "Address details are required." });
    }

    // Normalize to array if a single details object was provided
    if (!Array.isArray(details)) {
      details = [details];
    }

    const address = new Address({
      userId,
      details,
    });

    await address.save();
    res.status(201).json({ success: true, message: "Address added successfully", address });
  } catch (error) {
    console.error("Error in addAddress:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    let { details } = req.body;

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (details) {
      if (!Array.isArray(details)) {
        details = [details];
      }
      address.details = details;
    }

    await address.save();
    res.status(200).json({ success: true, message: 'Address updated successfully', address });
  } catch (error) {
    console.error("Error in updateAddress:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error("Error in deleteAddress:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Show all addresses for a user (returns 200 with empty array instead of 404)
exports.showAddresses = async (req, res) => {
  try {
    const targetUserId =
      req.params.userId && req.params.userId !== 'my-addresses'
        ? req.params.userId
        : req.user.id;

    const addresses = await Address.find({ userId: targetUserId }).sort({ createdAt: -1 });
    res.status(200).json({ addresses: addresses || [] });
  } catch (error) {
    console.error("Error in showAddresses:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set an address as default/selected
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const addresses = await Address.find({ userId });
    for (const addr of addresses) {
      if (addr.details && addr.details.length > 0) {
        addr.details.forEach((d) => {
          d.select = addr._id.toString() === addressId;
        });
        await addr.save();
      }
    }

    const updatedAddresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      addresses: updatedAddresses,
    });
  } catch (error) {
    console.error("Error in setDefaultAddress:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
