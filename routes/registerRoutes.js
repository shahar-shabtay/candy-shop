const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Route for displaying the registration form
router.get('/register', registerController.showRegisterForm);

// Route for handling the registration form submission
router.post('/register', registerController.registerUser);

module.exports = router;
