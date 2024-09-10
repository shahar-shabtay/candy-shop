const bcrypt = require('bcrypt');
const User = require('../models/customer'); // Adjust the path as needed

// Function to handle login
// async function login(email, password) {
//   try {
//     console.log('Searching for user with email:', email); // Debugging

//     // Find the user by email
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       console.log('User not found'); // Debugging
//       return false; // User not found
//     }

//     console.log('User found, checking password'); // Debugging

//     // Compare the given password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (isMatch) {
//       console.log('Password matches'); // Debugging
//       return true;
//     } else {
//       console.log('Password does not match'); // Debugging
//       return false;
//     }
//   } catch (error) {
//     console.error('Error during login:', error); // Debugging
//     return false;
//   }
// }

// Function to get customer by username (assuming username = email)
async function loginAttempt(email, password) {
  try {
    console.log('Fetching user by email:', email); // Debugging
    const user = await User.findOne({ email : email });
    console.log(user)
    if (user) {
        const correctPassword = user.password;
        console.log('Password:' , correctPassword);
        var isMatch = (password == correctPassword);
        //var isMatch = await bcrypt.compare(password, correctPassword);
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

// async function verifyPassword(inputPassword, storedPasswordHash) {
//   try {
//     const user = await getCustomerByEmail(email);
//     console.log('User found:', user); // Debugging to ensure the user is retrieved
//     console.log('Verifying password...'); // Debugging
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log('Password match:', isMatch); // Debugging
//     return isMatch;
//   } catch (error) {
//     console.error('Error verifying password:', error); // Debugging
//     throw error;
//   }
// }

module.exports = {
  loginAttempt
};
