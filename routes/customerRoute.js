const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


// Route to handle the form submission and update customer details
router.post('/myAccount', customerController.updateCustomerDetails);

router.get('/myAccount', customerController.renderAccountPage);

// Route for personal details
router.get('/myAccount/details', customerController.renderAccountPage);

// Route for account orders
router.get('/myAccount/orders', customerController.getOrders);






module.exports = router;
