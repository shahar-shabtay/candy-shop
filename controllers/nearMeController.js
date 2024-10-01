// controllers/nearMeController.js
const nearMeService = require('../services/nearMeService');

async function showNearestStore(req, res) {
  const { lat, lon } = req.query; // User's current latitude and longitude
  try {
    const nearestStore = await nearMeService.findNearestStore(lat, lon);
    if (nearestStore) {
      res.render('nearMe', { store: nearestStore});
    } else {
      res.render('nearMe', { error: 'No stores found nearby' });
    }
  } catch (err) {
    console.error('Error finding nearest store:', err);
    res.render('nearMe', { error: 'Failed to retrieve nearest store' });
  }
}

// Get all stores from the database
async function getStores(req, res) {
  try {
    const stores = await nearMeService.getAllStores();
    res.json(stores);
  } catch (error) {
    console.error('Error retrieving stores:', error);
    res.status(500).send('Server error');
  }
}

module.exports = {
  getStores,
  showNearestStore,
};
