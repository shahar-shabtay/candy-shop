const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productsController = require('../controllers/productsController.js');


// // Route to handle the form submission and update customer details
router.post('/myAccount/update', adminController.updateCustomerDetails);
// // Route for account area
router.get('/myAccount', adminController.renderAccountPage);

// // Route for personal details
router.get('/myAccount/details', adminController.renderAccountPage);

// // Route for account orders
router.get('/myAccount/orders', adminController.getCustomerOrders);

// // Route for admin area
router.get('/admin', adminController.renderAdminPage);

// // Route for all cutomers
router.get('/admin/customers', adminController.getAllCustomers);

// Route for all orders
router.get('/admin/orders', adminController.getAllOrders);

// Route for all products
router.get('/admin/products', adminController.getAllProducts);

// Route to add products
router.get('/admin/addProducts', adminController.addProductsPage);

// Route to all favorite
router.get('/myAccount/favorite', adminController.renderFavoriteProducts,);

// Update User
// router.put('/admin/customers/update/:customerId', adminController.updateCustomerDetails)

router.post('/favorite/remove', productsController.removeFavoriteProduct);

module.exports = router;