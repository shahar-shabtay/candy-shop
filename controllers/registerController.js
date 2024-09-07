const express = require('express');
const router = express.Router();
const registerService = require('../services/registerService');

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  const { name, email, ID, password, birtdate, address, role } = req.body;

  registerService.registerUser({
    name: name,
    email: email,
    ID: ID,
    password: password,
    birtdate: birtdate,
    address: address,
    role: role
  })
  .then(function(savedUser) {
    // Redirect to login or send success response
    res.redirect('/login');
  })
  .catch(function(error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  });
});

module.exports = router;
