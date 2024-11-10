require('dotenv').config()
const crypto = require("crypto-js");
const User = require('../models/customer'); 

const SECRET_KEY = process.env.SECRET_KEY; 

function decrypt(ciphertext) {
  const bytes  = crypto.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

async function loginAttempt(email, password) {
  try {
    const user = await User.findOne({ email : email });
    if (user) {
        const decryptedPassword = decrypt(user.password);
        if(decryptedPassword === password) {
            return user;
        } 
        else {
            return false;
        }
    } else {
        return false;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

module.exports = {
  loginAttempt
};