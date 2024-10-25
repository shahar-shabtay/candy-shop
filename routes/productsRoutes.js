const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');
const currencyController = require('../controllers/currencyController.js');


// Get products list
router.get('/', productsController.getAllProducts);

// Get new product form

// Get product detail
router.get('/:productId', productsController.getProductDetail);

// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Delete product
router.post('/delete', productsController.deleteProduct);

// Add new favorite
router.post('/addFav', productsController.addNewFavorite);

// Set new currency
router.post('/setCurrency', currencyController.setCurrency);



module.exports = router;