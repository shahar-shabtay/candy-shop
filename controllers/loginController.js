const loginService = require('../services/loginService'); // Ensure the path is correct
const customerService = require('../services/customerService');


// Function to handle user login via Email and Password
async function loginUser(req, res) {
  const { email, password } = req.body;
  try{
    const connect = await loginService.loginAttempt(email, password);
    const customer = await customerService.getCustomerByEmail(email)
    if (connect){
      req.session.user = customer;
      return res.redirect('/products');
    }
    else{
      return res.render('login', { error: 'Email / Password is incorrect' });
    }
  }
  catch (err){
    console.error('Login attempt failed', err)

  }
}

// Function to handle logout.
async function logout(req, res) {
  res.clearCookie('connect.sid');
    req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.status(200).json({message: 'Logout successful'});
  });
}

// Middleware Functions - is authenticated.
function isAuthenticated(req, res, next) {
  if (req.session.user) { 
      return next();
  }
  res.render('401');
}

// Middleware function - is admin.
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
      return next();
  }
  res.render('403');
}

module.exports = {
  loginUser,
  logout,
  isAuthenticated,
  isAdmin
};