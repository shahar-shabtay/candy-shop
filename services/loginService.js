const bcrypt = require('bcrypt');
const User = require('../models/customer'); // Adjust the path as needed

// Function to get customer by username (assuming username = email)
async function loginAttempt(email, password) {
  try {
    const user = await User.findOne({ email : email });
    if (user) {
        const correctPassword = user.password;
        var isMatch = (password == correctPassword);
    }
    else{
        isMatch = false;
    }
    return isMatch
  } catch (error) {
    console.error('Error fetching user by email:', error); // Debugging
    return null;
  }
}

module.exports = {
  loginAttempt
};
