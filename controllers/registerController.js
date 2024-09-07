const registerService = require('../services/registerService');

function getRegisterPage(req, res) {
  res.render('register', { error: null });
}

function postRegister(req, res) {
  const { name, email, ID, password, birtdate, address, role } = req.body;

  registerService.registerUser({
    name: name,
    email: email,
    ID: ID,
    password: password,
    birtdate: birtdate,
    address: address,
    role: role
  })
  .then(function(savedUser) {
    // Redirect to login or send success response
    res.redirect('/login');
  })
  .catch(function(error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  });
}

module.exports = {
  getRegisterPage,
  postRegister
};
