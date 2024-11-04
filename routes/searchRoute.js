const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController.js');
const { isAuthenticated } = require('../controllers/loginController.js');

// Get
router.get('/search', isAuthenticated, searchController.searchProduct);
router.get('/search/sweetType/:sweetType', isAuthenticated, searchController.searchBySweetType);
router.get('/search/filter',isAuthenticated, searchController.searchByFilter);

module.exports = router;
