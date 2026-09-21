const Equipment = require('../models/Equipment');
const Sport = require('../models/Sport');
const Product = require('../models/Product')

exports.addEquipment = async (req, res) => {
	try {
		const { name, description, equipment_image, sport: sportId } = req.body;
		const sport = await Sport.findById(sportId);
		if (!sport) {
			return res.status(404).json({ message: "Sport not found" });
		}

		const newEquipment = new Equipment({
			name,
			description,
			equipment_image,
			sport: sportId
		});

		await newEquipment.save();

		// Add the equipment to the sport's equipment array
		sport.equipment.push(newEquipment._id);
		await sport.save();

		res.status(201).json({ message: "Equipment added successfully", equipment: newEquipment });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};


// Update an existing equipment
exports.updateEquipment = async (req, res) => {
	try {
		const { equipmentId } = req.params;
		const { name, description, sportId } = req.body;

		let equipment = await Equipment.findById(equipmentId);
		if (!equipment) {
			return res.status(404).json({ message: 'Equipment not found' });
		}

		equipment.name = name || equipment.name;
		equipment.description = description || equipment.description;

		if (sportId && sportId !== equipment.sport.toString()) {
			// Remove the equipment from the old sport's equipment array
			const oldSport = await Sport.findById(equipment.sport);
			if (oldSport) {
				oldSport.equipment.pull(equipment._id);
				await oldSport.save();
			}

			// Assign the new sport and add the equipment to the new sport's equipment array
			const newSport = await Sport.findById(sportId);
			if (!newSport) {
				return res.status(404).json({ message: "Sport not found" });
			}
			newSport.equipment.push(equipment._id);
			await newSport.save();

			equipment.sport = sportId;
		}
		await equipment.save();

		res.status(200).json({ message: "Equipment updated successfully", equipment });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Delete an equipment
exports.deleteEquipment = async (req, res) => {
	try {
		const { equipmentId } = req.params;

		const equipment = await Equipment.findById(equipmentId);
		if (!equipment) {
			return res.status(404).json({ message: 'Equipment not found' });
		}

		// Remove the equipment from the sport's equipment array
		const sport = await Sport.findById(equipment.sport);
		if (sport) {
			sport.equipment.pull(equipment._id);
			await sport.save();
		}

		// Delete associated products
		for (let productId of (equipment.products || [])) {
			await Product.findByIdAndDelete(productId);
		}

		await equipment.deleteOne();

		res.status(200).json({ message: 'Equipment deleted successfully' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Find one equipment by ID
exports.findOneEquipment = async (req, res) => {
	try {
		const { equipmentId } = req.params;

		const equipment = await Equipment.findById(equipmentId).populate('sport');

		if (!equipment) {
			return res.status(404).json({ message: 'Equipment not found' });
		}

		res.status(200).json({ equipment });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Show all equipment
exports.showAllEquipment = async (req, res) => {
	try {
		const equipment = await Equipment.find().populate('sport');

		if (!equipment.length) {
			return res.status(404).json({ message: 'No equipment found' });
		}

		res.status(200).json({ equipment });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Show all equipment by sport
exports.showEquipmentBySport = async (req, res) => {
	try {
		const { sportId } = req.params;

		const sport = await Sport.findById(sportId).populate('equipment');
		if (!sport) {
			return res.status(404).json({ message: 'Sport not found' });
		}

		if (!sport.equipment.length) {
			return res.status(404).json({ message: 'No equipment found for this sport' });
		}

		res.status(200).json({ equipment: sport.equipment });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};
