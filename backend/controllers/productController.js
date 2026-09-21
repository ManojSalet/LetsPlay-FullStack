const Equipment = require("../models/Equipment");
const Product = require("../models/Product");
const Sport = require("../models/Sport");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      product_images,
      qty,
      discountPer,
      price,
      equipment: equipmentId,
    } = req.body;

    const discount = (price * discountPer) / 100;
    const selling_price = price - discount;

    let equipment = null;
    if (equipmentId) {
      // If equipmentId is provided, find the equipment
      equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
    }

    const newProduct = new Product({
      name,
      description,
      product_images,
      qty,
      discountPer,
      price,
      selling_price,
      equipment: equipmentId || null,
    });

    await newProduct.save();

    // If equipment exists, add the product to the equipment's product list
    if (equipment) {
      equipment.products.push(newProduct._id);
      await equipment.save();
    }

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

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
    } = req.body;

    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the equipment has changed, update the reference
    if (equipmentId && equipmentId !== product.equipment.toString()) {
      const newEquipment = await Equipment.findById(equipmentId);
      if (!newEquipment) {
        return res.status(404).json({ message: "New equipment not found" });
      }

      // Remove the product from the old equipment's product list
      const oldEquipment = await Equipment.findById(product.equipment);
      if (oldEquipment) {
        oldEquipment.products.pull(product._id);
        await oldEquipment.save();
      }

      // Add the product to the new equipment's product list
      newEquipment.products.push(product._id);
      await newEquipment.save();

      product.equipment = equipmentId;
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.product_images = product_images || product.product_images;
    product.qty = qty || product.qty;
    product.discountPer =
      discountPer !== undefined ? discountPer : product.discountPer;
    product.price = price || product.price;

    // Recalculate discount and selling price if price or discountPer changed
    const discount = (product.price * product.discountPer) / 100;
    product.selling_price = product.price - discount;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the product from the equipment's product list
    const equipment = await Equipment.findById(product.equipment);
    if (equipment) {
      equipment.products.pull(product._id);
      await equipment.save();
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.showAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("equipment");
    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("equipment");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.viewProductsByEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const equipment = await Equipment.findById(equipmentId).populate(
      "products"
    );
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (!equipment.products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this equipment" });
    }

    res.status(200).json({ products: equipment.products });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
