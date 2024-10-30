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
            {storeId : storeId},
            updateStore,
            { new: true, runValidators: true }
        );
        if (!updatedStore) {
            throw new Error('Store not found');
        }
        return updatedStore;
    } catch(err) {
        console.error('Error while updating store', err);
        
    }
}


module.exports = {
    getAllStores,
    updateStoreDetails
  };
  