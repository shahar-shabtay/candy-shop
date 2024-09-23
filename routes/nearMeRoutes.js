const express = require('express');
const router = express.Router();
const nearMeController = require('../controllers/nearMeController');

// Define the route to show the nearest store at /nearMe
router.get('/', nearMeController.showNearestStore);
router.get('/getStores', nearMeController.getStores);

module.exports = router;