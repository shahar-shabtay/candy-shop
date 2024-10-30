const storesService = require('../services/storesService');

async function getStores(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const stores = await storesService.getAllStores();
        res.render('allStores', { stores: stores , user});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

async function updateStoreDetails(req, res) {
    try {
        const storeId = req.params.storeId; // Get storeId from the route parameters
        const { 
            name, 
            address, 
            coordinates 
        } = req.body;
        
        const updateStore = {
            storeId, 
            name, 
            address, 
            coordinates
        };

        const updatedStore = await storesService.updateStoreDetails(storeId, updateStore);

        if (updatedStore) {
            res.json({ success: true, message: 'Store updated successfully' });
        } else {
            res.json({ success: false, message: 'Failed to update store' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update store", error: err.message });
    }
}

module.exports = {
    getStores,
    updateStoreDetails
};
