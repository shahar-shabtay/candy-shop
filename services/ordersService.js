const Customer = require('../models/customer');
const Orders = require('../models/orders');

// Function to get customer orders
async function getCustomerOrders(customerId) {
    try {
        const orders = await Customer.find({customerId: customerId});
        return orders;
    } catch (err) {
        console.error('Error fetching favorites', err);
    }
}

// Function to get all orders
async function getAllOrders () {
    try {
        const orders = await Orders.find({});
        return orders;
    } catch (err) {
        console.error('Error fetching all orders ', err);
    }
}

module.exports = {
    getCustomerOrders,
    getAllOrders
  };
  