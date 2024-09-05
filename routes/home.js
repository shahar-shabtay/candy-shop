const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route to render the home page
router.get('/', homeController.renderHomePage);

module.exports = router;
