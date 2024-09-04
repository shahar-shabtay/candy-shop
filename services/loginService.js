// services/userService.js

const User = require('../models/User'); // Import the User model

// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};

// Function to save a new user
const saveUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    console.error('Error saving user:', err);
    throw err;
  }
};

module.exports = {
  findUserByEmail,
  saveUser,
};
