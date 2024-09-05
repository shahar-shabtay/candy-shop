const express = require('express');
const router = express.Router();
const adminController = require('../controllers/personal_area');

// GET request for the admin page
router.get('/adminPage', adminController.renderAdminPage);


module.exports = router;
