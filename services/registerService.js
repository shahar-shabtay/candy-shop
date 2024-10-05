const Customer = require('../models/customer');

async function registerUser(userData) {
  try {
    const { name, email, customerId, password, birthdate, address, role, phone} = userData;

    // Create a new customer instance
    const newCustomer = new Customer({
      name,
      email,
      customerId,
      password,
      birthdate,
      address,
      phone,
      role
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    return savedCustomer;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

module.exports = {
  registerUser
};
