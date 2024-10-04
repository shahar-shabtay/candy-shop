const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Display cart
router.get('/', cartController.showCart);
router.post('/cart/updateQuantity', cartController.updateCartQuantity);


// Add to cart
router.post('/add', cartController.addToCart);

// Remove from cart
router.post('/remove', cartController.removeFromCart);

// Checkout
router.post('/checkout', cartController.checkout);

router.get('/complete', cartController.completePurchase);
router.post('/update', cartController.updateCart);

module.exports = router;