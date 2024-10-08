const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');
const fixerController = require('../controllers/fixerController.js');


// Get products list
router.get('/', productsController.getAllProducts);

// Get new product form


// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Delete product
router.post('/delete', productsController.deleteProduct);

// Add new favorite
router.post('/addFav', productsController.addNewFavorite);

router.get('/conversionRates', fixerController.getConversionRates);
router.post('/setCurrency', fixerController.setCurrency);
router.get('/getCurrency', fixerController.getCurrency);


module.exports = router;