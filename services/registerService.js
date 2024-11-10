require('dotenv').config()
const Customer = require('../models/customer');
const crypto = require("crypto-js");

const SECRET_KEY = process.env.SECRET_KEY; 

function encrypt(password){
  return crypto.AES.encrypt(password, SECRET_KEY).toString();
}

async function registerUser(userData) {
  try {
    // Encrypt the password
    const encryptedPassword = encrypt(userData.password);

    // Create a new customer with all the user data and the encrypted password
    const newCustomer = new Customer({
      ...userData,               // Spread userData to pass fields directly
      password: encryptedPassword // Override password with the encrypted version
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    return savedCustomer;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

module.exports = {
  registerUser
};