const Category = require('../models/Category');
const Sport = require('../models/Sport');

// Add a new category
exports.addCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		const newCategory = new Category({
			name,
			description
		});

		await newCategory.save();
		res.status(201).json({ message: "Category added successfully", category: newCategory });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Update an existing category
exports.updateCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;
		const { name, description } = req.body;

		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		category.name = name || category.name;
		category.description = description || category.description;

		await category.save();

		res.status(200).json({ message: "Category updated successfully", category });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// Delete a category
exports.deleteCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;

		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Remove associated sports first
		await Sport.deleteMany({ category: categoryId });

		await category.deleteOne();

		res.status(201).json({ message: "Category and associated sports deleted successfully" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

// show all categories
exports.showCategories = async (req, res) => {
	try {
		const categories = await Category.find();

		if (!categories.length) {
			return res.status(404).json({ message: 'No categories found' });
		}

		res.status(200).json({ categories });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
};

