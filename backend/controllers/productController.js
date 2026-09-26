const Equipment = require("../models/Equipment");
const Product = require("../models/Product");
const Sport = require("../models/Sport");

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      product_images,
      qty,
      discountPer = 0,
      price,
      equipment: equipmentId,
      sport: sportId,
      category: categoryId,
      brand = "General",
      sku,
      isActive = true,
    } = req.body;

    const discount = (price * discountPer) / 100;
    const selling_price = price - discount;

    let equipment = null;
    let resolvedSportId = sportId || null;
    let resolvedCategoryId = categoryId || null;

    if (equipmentId) {
      equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      if (!resolvedSportId && equipment.sport) {
        resolvedSportId = equipment.sport;
      }
      if (!resolvedCategoryId && equipment.category) {
        resolvedCategoryId = equipment.category;
      }
    }

    if (resolvedSportId && !resolvedCategoryId) {
      const sportDoc = await Sport.findById(resolvedSportId);
      if (sportDoc && sportDoc.category) {
        resolvedCategoryId = sportDoc.category;
      }
    }

    const generatedSku =
      sku ||
      `LP-${name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const newProduct = new Product({
      name,
      sku: generatedSku,
      brand,
      description,
      product_images: product_images || [],
      qty: Number(qty) || 0,
      discountPer: Number(discountPer) || 0,
      price: Number(price),
      selling_price: Number(selling_price),
      equipment: equipmentId || null,
      sport: resolvedSportId,
      category: resolvedCategoryId,
      isActive,
    });

    await newProduct.save();

    // Maintain backwards-compatible equipment.products array
    if (equipment) {
      equipment.products.push(newProduct._id);
      await equipment.save();
    }

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      product_images,
      qty,
      discountPer,
      price,
      equipment: equipmentId,
      sport: sportId,
      category: categoryId,
      brand,
      sku,
      isActive,
    } = req.body;

    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If equipment changed, update relationship
    if (equipmentId && equipmentId !== product.equipment?.toString()) {
      const newEquipment = await Equipment.findById(equipmentId);
      if (!newEquipment) {
        return res.status(404).json({ message: "New equipment not found" });
      }

      if (product.equipment) {
        const oldEquipment = await Equipment.findById(product.equipment);
        if (oldEquipment) {
          oldEquipment.products.pull(product._id);
          await oldEquipment.save();
        }
      }

      newEquipment.products.push(product._id);
      await newEquipment.save();

      product.equipment = equipmentId;
      if (newEquipment.sport) product.sport = newEquipment.sport;
      if (newEquipment.category) product.category = newEquipment.category;
    }

    if (sportId) product.sport = sportId;
    if (categoryId) product.category = categoryId;
    if (brand !== undefined) product.brand = brand;
    if (sku !== undefined) product.sku = sku;
    if (isActive !== undefined) product.isActive = isActive;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (product_images) product.product_images = product_images;
    if (qty !== undefined) product.qty = Number(qty);
    if (discountPer !== undefined) product.discountPer = Number(discountPer);
    if (price !== undefined) product.price = Number(price);

    // Recalculate selling price
    const currentPrice = Number(product.price);
    const currentDiscount = Number(product.discountPer || 0);
    const discountAmount = (currentPrice * currentDiscount) / 100;
    product.selling_price = currentPrice - discountAmount;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Soft-delete (archive) a product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isDeleted = true;
    product.isActive = false;
    product.deletedAt = new Date();
    await product.save();

    res.status(200).json({
      message: "Product archived successfully (soft deleted)",
      product,
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Restore an archived (soft-deleted) product
exports.restoreProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isDeleted = false;
    product.isActive = true;
    product.deletedAt = null;
    await product.save();

    res.status(200).json({
      message: "Product restored successfully",
      product,
    });
  } catch (error) {
    console.error("Error in restoreProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Show all products with optional filters
exports.showAllProducts = async (req, res) => {
  try {
    const { category, sport, equipment, inStock, includeArchived } = req.query;
    const filter = {};

    // Filter out soft-deleted items unless specifically requested (e.g. by admin)
    if (includeArchived !== "true") {
      filter.isDeleted = { $ne: true };
    }

    if (category) filter.category = category;
    if (sport) filter.sport = sport;
    if (equipment) filter.equipment = equipment;
    if (inStock === "true") filter.qty = { $gt: 0 };

    const products = await Product.find(filter)
      .populate("equipment")
      .populate("sport")
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({ products, count: products.length });
  } catch (error) {
    console.error("Error in showAllProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View single product
exports.viewProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("equipment")
      .populate("sport")
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error in viewProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View products by equipment
exports.viewProductsByEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const products = await Product.find({
      equipment: equipmentId,
      isActive: true,
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in viewProductsByEquipment:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View products directly by sport
exports.viewProductsBySport = async (req, res) => {
  try {
    const { sportId } = req.params;

    const products = await Product.find({
      sport: sportId,
      isActive: true,
      isDeleted: { $ne: true },
    })
      .populate("equipment")
      .sort({ createdAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in viewProductsBySport:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
