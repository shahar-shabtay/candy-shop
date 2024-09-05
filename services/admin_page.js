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
    return { db, client };
}

// Function to get customer data by name
async function getCustomerByName(customerName) {
    const { db, client } = await connectToDb();
    try {
        // Fetch the customer document where the name matches
        const customer = await db.collection('customer').findOne({ name: customerName });
        return customer;
    } catch (err) {
        console.error('Error fetching customer by name:', err);
        throw err;
    } finally {
        // Close the connection after querying
        client.close();
    }
}

module.exports = {
    getCustomerByName
};