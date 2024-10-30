const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');

// Get products list
router.get('/', productsController.getAllProducts);

// Get kosher products
router.get('/kosherData', productsController.getKosherData);

// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Delete product
router.post('/delete', productsController.deleteProduct);

// Add new favorite
router.post('/addFav', productsController.addNewFavorite);


module.exports = router;