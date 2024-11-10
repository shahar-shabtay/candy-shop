const registerService = require('../services/registerService');
const customerService = require('../services/customerService');


function getRegisterPage(req, res) {
  res.render('register', { error: null });
}

async function postRegister(req, res) {
  const { name, email, phone, password, birthdate, city, street, number, customerId } = req.body;

  const newUser = {
    name,
    email,
    phone,
    password,
    birthdate,
    address: {
      city,
      street,
      number: parseInt(number, 10) // Ensure `number` is an integer
    },
    customerId
  };

  try {
    const exsistEmail = await customerService.getCustomerByEmail(email);
    const exsistId = await customerService.getCustomerById(customerId);

    let errorMessage = "";

    if (exsistEmail && Array.isArray(exsistId) && exsistId.length > 0) {
      errorMessage = "Both the email and customer ID are already in use.";
    } else if (exsistEmail) {
      errorMessage = "Email is already in use.";
    } else if (Array.isArray(exsistId) && exsistId.length > 0) {
      errorMessage = "Customer ID is already in use.";
    }

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const savedUser = await registerService.registerUser(newUser); // Pass newUser directly
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
}

module.exports = {
  getRegisterPage,
  postRegister
};
