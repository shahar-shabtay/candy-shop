const storesService = require('../services/storesService');

async function getStores(req, res) {
    try {
        const user = req.session.user;
        const stores = await storesService.getAllStores();
        const currency = req.session.currency;
        const rates = req.session.rates;
        res.render('allStores', { stores: stores , user, rates, currency});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

async function updateStoreDetails(req, res) {
    try {
        const storeId = req.params.storeId; // Get storeId from the route parameters
        const storeData = req.body;

        const updatedStore = await storesService.updateStoreDetails(storeId, storeData);

        if (updatedStore) {
            res.json({ success: true, message: 'Store updated successfully' });
        } else {
            res.json({ success: false, message: 'Failed to update store' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update store", error: err.message });
    }
}

async function addStore (req, res) {
    const storeData = req.body;
    let receivedCoordinates = req.body.coordinates;    // This will be a string "123,123"
    let coordinatesArray = receivedCoordinates.split(',').map(Number); // This will be an array [123, 123]
    storeData.coordinates = coordinatesArray;

    storesService.createStore(storeData)
        .then(store => res.status(200).json({ message: 'Store successfully added', data: store }))
        .catch(err => res.status(500).send({ error: 'Something went wrong' }));
}

async function deleteStore (req, res) {
    const storeId = req.params.storeId;
  
    storesService.deleteStoreById(storeId)
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  }
  

module.exports = {
    getStores,
    updateStoreDetails,
    addStore,
    deleteStore
};
