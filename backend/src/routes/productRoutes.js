

const express = require('express');
const Product = require('../models/productModel');
const router = express.Router();
const upload = require('../middlewares/fileUpload');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/rloeMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload product image
router.post('/uploads/:id', verifyToken, authorizedRoles('admin'), upload.single('productImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Save the file path to the product - relative to server root
    const imagePath = `/uploads/products/${req.file.filename}`;
    product.picture = imagePath;
    await product.save();

    res.status(200).json({
      message: 'Image uploaded successfully',
      filePath: imagePath
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get product image by product ID
router.get('/image/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.picture) {
      return res.status(404).send('Image not found');
    }

    // Get absolute path on server
    const imagePath = path.join(__dirname, '..', product.picture.replace(/^\//, ''));

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image file not found on server');
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Image retrieval error:', error);
    res.status(500).send('Error retrieving image');
  }
});

// Create a new product
router.post('/', verifyToken, authorizedRoles('admin'), async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.patch('/:id', verifyToken, authorizedRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', verifyToken, authorizedRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;