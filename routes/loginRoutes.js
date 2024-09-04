const express = require('express');
const router = express.Router();
const User = require('../models/customer'); // Adjust the path as needed

// Render login page
router.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Handle login form submission
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists and passwords match
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.render('login', { error: 'Username / Password is incorrect' });
    }

    // Set user session or JWT token here if needed
    res.redirect('/dashboard'); // Redirect to a dashboard or home page
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Login failed' });
  }
});

module.exports = router;
