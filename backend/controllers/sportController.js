const Category = require('../models/Category');
const Sport = require('../models/Sport');
const Equipment = require('../models/Equipment');

// Insert a new sport
exports.addSport = async (req, res) => {
	try {
		const { name, description, sport_image, category: categoryId } = req.body;

		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		const newSport = new Sport({
			name,
			description,
			sport_image,
			category: categoryId
		});

		await newSport.save();

		// Add the sport to the category's sports array
		category.sports.push(newSport._id);
		await category.save();

		res.status(201).json({ message: "Sport added successfully", sport: newSport });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Update an existing sport
exports.updateSport = async (req, res) => {
	try {
		const { sportId } = req.params;
		const { name, description, categoryId } = req.body;

		let sport = await Sport.findById(sportId);
		if (!sport) {
			return res.status(404).json({ message: 'Sport not found' });
		}

		sport.name = name || sport.name;
		sport.description = description || sport.description;

		if (categoryId && categoryId !== sport.category.toString()) {
			// Remove the sport from the old category's sports array
			const oldCategory = await Category.findById(sport.category);
			oldCategory.sports.pull(sport._id);
			await oldCategory.save();

			// Assign the new category and add the sport to the new category's sports array
			const newCategory = await Category.findById(categoryId);
			if (!newCategory) {
				return res.status(404).json({ message: 'New category not found' });
			}
			newCategory.sports.push(sport._id);
			await newCategory.save();

			sport.category = categoryId;
		}

		await sport.save();

		res.status(200).json({ message: "Sport updated successfully", sport });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Delete a sport
exports.deleteSport = async (req, res) => {
	try {
		const { sportId } = req.params;

		const sport = await Sport.findById(sportId);
		if (!sport) {
			return res.status(404).json({ message: 'Sport not found' });
		}

		// Remove the sport from the category's sports array
		const category = await Category.findById(sport.category);
		category.sports.pull(sport._id);
		await category.save();

		// Delete associated equipment
		for (let equipmentId of sport.equipment) {
			await Equipment.findByIdAndDelete(equipmentId);
		}

		await sport.deleteOne();

		res.status(200).json({ message: 'Sport deleted successfully' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Find one sport by ID
exports.findOneSport = async (req, res) => {
	try {
		const { sportId } = req.params;

		const sport = await Sport.findById(sportId).populate('category').populate('equipment');

		if (!sport) {
			return res.status(404).json({ message: 'Sport not found' });
		}

		res.status(200).json({ sport });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Show all sports
exports.showAllSports = async (req, res) => {
	try {
		const sports = await Sport.find().populate('category').populate('equipment');

		if (!sports.length) {
			return res.status(404).json({ message: 'No sports found' });
		}

		res.status(200).json({ sports });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Show all sports in a specific category
exports.showSportsByCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;

		const category = await Category.findById(categoryId).populate('sports');
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		if (!category.sports.length) {
			return res.status(404).json({ message: 'No sports found for this category' });
		}

		res.status(200).json({ sports: category.sports });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};
