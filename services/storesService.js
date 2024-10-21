const StoresLocation = require('../models/storesLocation'); // Or the name you used when requiring the model

async function getAllStores() {
    try {
        return await StoresLocation.find().exec();
    } catch (error) {
        throw new Error('Error occurred while fetching all stores: ', error);
    }
}



module.exports = {
    getAllStores,
    createStore
  };
  