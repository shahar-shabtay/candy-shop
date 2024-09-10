const bcrypt = require('bcrypt');
const User = require('../models/customer'); // Adjust the path as needed

// Function to get customer by username (assuming username = email)
async function loginAttempt(email, password) {
  try {
    console.log('Fetching user by email:', email); // Debugging
    const user = await User.findOne({ email : email });
    console.log(user)
    if (user) {
        const correctPassword = user.password;
        console.log('Password:' , correctPassword);
        // check if given password = to password in db 
        var isMatch = (password == correctPassword);
        console.log('Password match:', isMatch); // Debugging
    }
    else{
        console.log('No such user')
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
