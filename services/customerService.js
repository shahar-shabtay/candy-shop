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

async function getCustomerCart(customerId) {
    try {
        const customer = await Customer.findOne({ customerId: customerId }).select('cart');
        return customer ? customer.cart : [];
    } catch(err) {
        console.error(err);
        return [];
    }
}

async function updateCustomerCart(customerId, updateCart) {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId: customerId },
            { $set: { cart: updateCart } },
            { new: true }
        ).select('cart'); // מחזיר רק את שדה 'cart'
        
        return updatedCustomer;
    } catch(err) {
        console.error(err);
    }
}


module.exports = {
    getAllCustomers,
    getUserRoleByCustomerId,
    getCustomerByEmail,
    getCustomerById,
    updateCustomerDetails,
    getCustomerCart,
    updateCustomerCart
  };
  