// AdminPage Service

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



//function to get customer's orders - by customerID
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



// function to get customer's favorite items - by customerID


// function to cancle order - by orderNumber


//function to get all orders -- for admins only


//function to get all customers -- for admin only


module.exports = {
    getCustomerById,
    updateCustomerById,
    getOrdersByCustomerId
};