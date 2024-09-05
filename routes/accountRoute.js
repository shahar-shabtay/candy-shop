const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// GET request for the admin page
router.get('/myAccount', accountController.renderAccountPage);

// Route to handle the form submission and update customer details
router.post('/updateCustomer', accountController.updateCustomerDetails);



module.exports = router;
