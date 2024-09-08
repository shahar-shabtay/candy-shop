const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


// Route to handle the form submission and update customer details
router.post('/myAccount', adminController.updateCustomerDetails);

// Route for account area
router.get('/myAccount', adminController.renderAccountPage);

// Route for personal details
router.get('/myAccount/details', adminController.renderAccountPage);

// Route for account orders
router.get('/myAccount/orders', adminController.getOrdersByCustomerId);

// Route for admin area
router.get('/admin', adminController.renderAdminPage);

// Route for all cutomers
router.get('/admin/customers', adminController.getAllCustomers);

// Route based on role
router.get('/', adminController.redirectBasedOnRole);

// Route for all orders
router.get('/admin/orders', adminController.getAllOrders);

// Route for all products
router.get('/admin/products', adminController.getAllProducts);

// Route to add products
router.get('/admin/addProducts', adminController.addProducts);

// Route to all favorite
router.get('/myAccount/favorite', adminController.getAllFavorite);

// Route to remove favorite

// Edit customer by admin
router.put('/admin/customers/:id', adminController.updateCustomer);

module.exports = router;
