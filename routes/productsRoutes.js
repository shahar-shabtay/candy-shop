const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');
const currencyController = require('../controllers/currencyController.js');
const { isAuthenticated } = require('../controllers/loginController.js');



// Get 
router.get('/', isAuthenticated, productsController.getAllProducts);
router.get('/:productId',isAuthenticated, productsController.getProductDetail);

// Post 
router.post('/delete', productsController.deleteProduct);
router.post('/addFav', productsController.addNewFavorite);
router.post('/setCurrency', currencyController.setCurrency);

module.exports = router;