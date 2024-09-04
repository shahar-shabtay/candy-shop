
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/new', productController.newProductForm);
router.post('/', productController.saveProduct);

// Add more routes as needed

module.exports = router;