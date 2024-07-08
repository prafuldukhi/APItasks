const Product = require('../models/productSchema');

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true });
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products with price less than a certain value
exports.getProductsByMaxPrice = async (req, res) => {
  const { maxPrice } = req.params;
  try {
    const products = await Product.find({ price: { $lt: maxPrice } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products with rating higher than a certain value
exports.getProductsByMinRating = async (req, res) => {
  const { minRating } = req.params;
  try {
    const products = await Product.find({ rating: { $gte: minRating } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

