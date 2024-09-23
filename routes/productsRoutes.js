const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');

// Get products list
router.get('/', productsController.getAllProducts);

// Get new product form

// Save new product
router.post('/admin/addProducts', productsController.newProduct);

// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Delete product
router.post('/delete', productsController.deleteProduct);

// Add new favorite
router.post('/add', productsController.addNewFavorite);


module.exports = router;