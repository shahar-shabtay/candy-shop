const Customer = require('../models/customer');

// Function to get all customers
async function getAllCustomers() {
    try {
        const customers = await Customer.find({});
        return customers;
    } catch (err) {
        console.error('Error fetching customers', err);
    }
}

async function getUserRoleByCustomerId (customerId) {
    try {
        const customer = await Customer.find({customerId:customerId});
        const role = customer.role;
        return role;
    } catch (err) {
        console.error('Error customer role not found', err);
    }
}

async function getCustomerByEmail(email) {
    try {
        const customer = await Customer.findOne({email:email});
        return customer;
    } catch (err) {
        console.error('Error find customer ', err);
    }
}

async function getCustomerById(customerId) {
    try {
        const customer = await Customer.find({customerId});
        return customer;
    } catch (err) {
        console.error('Error find customer ', err);
    }
}

async function updateCustomerDetails(customerId, updateUser) {
    try {
        const updateCustomer = await Customer.findOneAndUpdate(
            {customerId : customerId},
                updateUser,
            { new: true, runValidators: true }
        );
        if (!updateCustomer) {
            throw new Error('customer not found');
        }
        return updateCustomer;
    } catch(err) {
        console.error('Error while update user ', err);
    }
}

module.exports = {
    getAllCustomers,
    getUserRoleByCustomerId,
    getCustomerByEmail,
    getCustomerById,
    updateCustomerDetails
  };
  