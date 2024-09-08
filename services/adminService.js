// AdminPage Service -- all the function are for tests the admin controller take the function from each service and dont have own servcie
// import shcema
const Favorit = require('../models/favorite');
const Product = require('../models/products');
const Order = require('../models/orders');
const Customer = require('../models/customers');

// import mongo module
const { MongoClient } = require('mongodb');


// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'sweetly';

// Function to connect to MongoDB
async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to database');
    const db = client.db(dbName);
    return {db, client};
}

// Function to get account role by the custmer id
async function getUserRoleByCustomerId(customerId) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        // Fetch the user by customerId and return their role
        const customer = await db.collection('customer').findOne({ customerId });
        if (customer) {
            return customer.role; // Return the role ('admin' or 'user')
        } else {
            throw new Error('Customer not found');
        }
    } catch (err) {
        console.error('Error fetching customer role:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to get customer details by customerId
async function getCustomerById(customerId) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    
    try {
        // Fetch the customer by customerId from the MongoDB database
        const customer = await db.collection('customer').findOne({ customerId });
        return customer;
    } catch (err) {
        console.error('Error fetching customer by ID:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to update customer details - by customerID
async function updateCustomerById(customerId, updatedData) {
    const { db, client } = await connectToDb();
    try {
        // Ensure customerId is a string of 9 characters
        if (customerId.length !== 9) {
            throw new Error('Invalid customerId');
        }

        const customer = await db.collection('customer').updateOne(
            { customerId: customerId },  // Search by customerId
            { $set: updatedData }
        );
        return customer;
    } catch (err) {
        console.error('Error updating customer by customerId:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to get customer's orders - by customerID
async function getOrdersByCustomerId(customerId) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        // Fetch the orders by customerId
        const orders = await db.collection('orders').find({ customerId }).toArray();
        return orders;
    } catch (err) {
        console.error('Error fetching orders:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to get customer's favorite items - by customerID
async function getAllProducts() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    
    try {
        const products = await db.collection('products').find({}).toArray();
        return products;
    } catch (err) {
        console.error('Error fetching all products: ', err);
        throw err;
    } finally {
        client.close();
    }

    
}

// Function to cancle order - by orderNumber


// Function to get all orders -- for admins only
async function getAllOrders() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        // Fetch all customers from the customers collection
        const customers = await db.collection('orders').find({}).toArray();
        return customers;
    } catch (err) {
        console.error('Error fetching all customers:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to get all customers -- for admin only
async function getAllCustomers() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        // Fetch all customers from the customers collection
        const customers = await db.collection('customer').find({}).toArray();
        return customers;
    } catch (err) {
        console.error('Error fetching all customers:', err);
        throw err;
    } finally {
        client.close();
    }
}

// Function to update customer details.
async function updateCustomer(customerId, customerData) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        // Ensure that you're using Mongoose here with the correct method
        const updatedCustomer = await db.collection('customer').updateOne({ customerId: customerId }, { $set: customerData });


        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({ success: true, customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error updating customer: ${error.message}` });
    }
}

// Function to get customer's favorite - by customerID
async function getFavorite(customerId) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    try {
        const favorites = await db.collection('favorite').find({ customerId: customerId });

        if (!favorites.length) {
            return [];
        }

        const productNumbers = favorites.map(fav => fav.product_number);
        const products = await db.collection('products').find({ product_number: { $in: productNumbers } });
        return products;
    } catch (err) {
        console.error('Error fetching orders:', err);
        throw err;
    } finally {
        client.close();
    }
}



// Function to remove from favorite


module.exports = {
    getCustomerById,
    updateCustomerById,
    getOrdersByCustomerId,
    getAllCustomers,
    getUserRoleByCustomerId,
    getAllOrders,
    getAllProducts,
    updateCustomer,
    getFavorite
};