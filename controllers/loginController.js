const loginService = require('../services/loginService'); // Ensure the path is correct

// Function to handle user login via Email and Password
async function loginUser(req, res) {
  const { email, password } = req.body;
  try{
    const connect = await loginService.loginAttempt(email, password);
    if (connect){
      console.log('Login attempt with:', { email, password }, 'SUCCESS');
      // later change this to home page !!!!!!
      return res.redirect('/login');
    }
    else{
      console.log('Login attempt with:', { email, password }, 'FAILED'); //DEBUG
      console.log('Redirect to register') //DEBUG
      // If failed to connect - stay in login page (There is print to user from ejs)  
      return res.render('login', { error: 'Email / Password is incorrect' }); // Re-render login page with error
    }
  }
  catch (err){
    console.error('Login attempt failed', err)

  }
}

module.exports = {
  loginUser,
};
