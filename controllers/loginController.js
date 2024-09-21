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
      // If failed to connect - stay in login page (There is print to user from ejs)  
      return res.render('login', { error: 'Email / Password is incorrect' }); // Re-render login page with error
    }
  }
  catch (err){
    console.error('Login attempt failed', err)

  }
}

async function logout(req,res) {
  req.session.destroy(() => {
    req.session.user = null;
    res.render("login", { error: false });
  });
}

module.exports = {
  loginUser,
  logout
};
