const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Adjust the path to your controller

// Get
router.get('/', function(req, res) {
  res.render('login', { error: null });
});
router.get('/logout',loginController.logout);


// Post 
router.post('/', loginController.loginUser); // Use the controller to handle the login

module.exports = router;
