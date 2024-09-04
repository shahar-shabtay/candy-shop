// controllers/authController.js

const userService = require('../services/userService');

// Function to handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (user && user.password === password) { // Simplified password check
      // Generate token or other login logic here
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  loginUser,
};
