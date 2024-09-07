const Customer = require('../models/customer');

function registerUser(userData) {
  return new Promise(function (resolve, reject) {
    try {
      const { name, email, ID, password, birtdate, address } = userData;

      // Create a new customer instance
      const newCustomer = new Customer({
        name,
        email,
        ID,
        password,
        birtdate,
        address
      });

      // Save the customer to the database
      newCustomer.save(function (err, savedCustomer) {
        if (err) {
          console.error('Error registering user:', err);
          reject(err);
        } else {
          resolve(savedCustomer);
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      reject(error);
    }
  });
}

module.exports = {
  registerUser
};
