const Customer = require('../models/customers'); // Import the schema of the customers.
const mongoose = require('mongoose')


// Return the account details by username
async function getCustomerByUsername(name) {
    try{
        return await Customer.findById(name)
    } catch (error) {
        return null
    }
}

// Change the account details by id
async function updateCustomer(id, customerData) {
    const customer = await getCustomerByUsername(id);
    if (!customer)
        return null;
  
    Object.assign(customer, customerData);
    try {
        await customer.save();
        return customer;
    } catch (error) {
        throw new Error('Error updating customer: ' + error.message);
    }
}

module.exports = {
    getCustomerByUsername,
    updateCustomer
}