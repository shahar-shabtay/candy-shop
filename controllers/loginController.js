const loginService = require('../services/loginService'); // Ensure the path is correct

// Function to handle user login
async function loginUser(req, res) {
  const { email, password } = req.body;

  try{
    const connect = await loginService.loginAttempt(email, password);
    if (connect){
      console.log('Login attempt with:', { email, password }, 'SUCCESS');
      return res.redirect('/login');
    }
    else{
      console.log('Login attempt with:', { email, password }, 'FAILED');
      console.log('Redirect to register')
      return res.redirect('/register');
    }
  }
  catch (err){
    console.error('Login attempt failed', err)

  }
}

//   try {
//     // Debugging: Print email and password on login attempt
//     console.log('Login attempt with:', { email, password });

//     // Call the service to find user by email
//     const user = await loginService.getCustomerByEmail(email);
//     console.log('User found:', user); // Debugging to ensure the user is retrieved

//     if (user) {
//       // Compare the input password with the hashed password
      
//       const isPasswordValid = await loginService.verifyPassword(password);
//       console.log('Password validation result:', isPasswordValid); // Debugging to check password

//       if (isPasswordValid) {
//         // Set session or perform other actions after successful login
//         req.session.email = user.email;
//         console.log('Session set for:', user.email); // Debugging to confirm session data

//         // Redirect to the dashboard or home page after login success
//         res.redirect('/');
//       } else {
//         console.log('Invalid password for email:', email); // Debugging for invalid password
//         res.render('login', { error: 'Email / Password is incorrect' });
//       }
//     } else {
//       console.log('User not found for email:', email); // Debugging for no user found
//       res.render('login', { error: 'Email / Password is incorrect' });
//     }
//   } catch (err) {
//     console.error('Login error:', err); // Error handling
//     res.render('login', { error: 'Login failed' });
//   }
// }

module.exports = {
  loginUser,
};
