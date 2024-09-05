const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// GET request for the admin page
router.get('/myAccount', accountController.renderAccountPage);


module.exports = router;
