const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Adjust the path to your controller

// Render login page
router.get('/', function(req, res) {
  res.render('login', { error: null });
});

// Handle login form submission
router.post('/', loginController.loginUser); // Use the controller to handle the login

router.get('/logout',loginController.logout);

module.exports = router;
