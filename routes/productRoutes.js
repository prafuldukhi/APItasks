const express = require('express');
const router = express.Router();
const { authenticateUser, checkAdmin } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// Apply authentication middleware to all routes in this file
router.use(authenticateUser);

// Routes accessible to admin only
router.use(checkAdmin);

// Routes
router.post('/', productController.addProduct);
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/price/:maxPrice', productController.getProductsByMaxPrice);
router.get('/rating/:minRating', productController.getProductsByMinRating);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
