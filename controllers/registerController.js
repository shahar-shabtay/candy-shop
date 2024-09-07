const registerService = require('../services/registerService');

function showRegisterForm(req, res) {
  res.render('register', { error: null });
}

function registerUser(req, res) {
  const { name, email, ID, password, birtdate, address } = req.body;

  registerService.registerUser({
    name,
    email,
    ID,
    password,
    birtdate,
    address: {
      town: address.town,
      street: address.street,
      homeNumber: address.homeNumber
    }
  })
  .then(function (savedUser) {
    // Redirect to login or any other page on success
    res.redirect('/login');
  })
  .catch(function (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  });
}

module.exports = {
  showRegisterForm,
  registerUser
};
