const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController.js');

router.get('/search', searchController.searchProduct);
router.get('/search/sweetType/:sweetType', searchController.searchBySweetType);
router.get('/search/filter', searchController.searchByFilter);

module.exports = router;
