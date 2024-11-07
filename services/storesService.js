const Stores = require('../models/storesLocation'); // Or the name you used when requiring the model

async function getAllStores() {
    try {
        return await Stores.find().exec();
    } catch (error) {
        throw new Error('Error occurred while fetching all stores: ', error);
    }
}

async function updateStoreDetails(storeId, updateStore) {
    try {
        const updatedStore = await Stores.findOneAndUpdate(
            { storeId: storeId },
            updateStore,
            { new: true, runValidators: true }
        );
        if (!updatedStore) {
            throw new Error('Store not found');
        }
        return updatedStore;
    } catch(err) {
        console.error('Error while updating store', err);
        throw err;
    }
}

async function createStore(storeData) {
    try {
        // Create a new store using the Stores model and the provided store data
        const store = new Stores(storeData);
        return await store.save(); // Save the store to the database
    } catch (err) {
        console.error('Error creating store:', err);
        throw err; // Rethrow the error to be handled in the controller
    }
}

async function deleteStoreById(storeId) {
    try {
        // Logic to delete the store from the database
        // Assuming you're using a MongoDB-like database
        await Stores.findOneAndDelete({storeId:storeId});

    } catch (error) {
        throw new Error('Failed to delete store from database: ' + error.message);
    }
}


module.exports = {
    getAllStores,
    updateStoreDetails, 
    createStore,
    deleteStoreById
  };
  