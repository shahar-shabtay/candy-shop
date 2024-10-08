const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Display cart
router.get('/', cartController.showCart);


// Add to cart
router.post('/add', cartController.addToCart);

// Remove from cart
router.post('/remove', cartController.removeFromCart);

// Checkout
router.post('/checkout', cartController.checkout);

router.post('/update', cartController.updateCart);


module.exports = router;