const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');

// Get products list
router.get('/', productsController.getAllProducts);

// Get new product form
router.get('/new', productsController.newProductForm);

// Save new product
router.post('/', productsController.saveProduct);

// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Delete product
router.post('/delete', productsController.deleteProduct);

module.exports = router;