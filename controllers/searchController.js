const mongoose = require("mongoose");
const searchService = require('../services/searchService.js');

async function searchProduct(req, res) {
    const user = req.session.user; // Get user from session
    const searchQuery = req.query.q;  // 'q' will be the query parameter from the search form
    const searchResults = await searchService.searchProductsByName(searchQuery);

    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).send('Query parameter missing');
        }
        //const products = await searchService.searchProductsByName(query);
        res.render('searchPage', { 
            user: user,
            searchQuery: searchQuery,
            products: searchResults
        });  
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).send('Error searching for products');
    }
}

async function searchBySweetType(req, res) {
    const user = req.session.user;
    const sweetType = req.params.sweetType;

    try {
        const products = await searchService.searchProductsBySweetType(sweetType);
        res.render('searchPage', {
            user: user,
            searchQuery: sweetType,
            products: products[0] ? products[0].products : []
        });
    } catch (error) {
        console.error('Error searching for products by sweetType:', error);
        res.status(500).send('Error searching for products by sweetType');
    }
}

async function searchByFilter(req, res) {
    const user = req.session.user;
    const searchQuery = req.query.q || '';
    const filters = {
        flavor: req.query.flavor || '', 
        allergans: req.query.allergans || '',
        sweetType: req.query.sweetType || '',
        kosher: req.query.kosher || ''
    };

    // Create a combined query string for display
    let combinedQuery = searchQuery;

    if (filters.flavor) {
        combinedQuery += ` (Flavor: ${filters.flavor})`;
    }
    if (filters.allergans) {
        combinedQuery += ` (Allergen: ${filters.allergans})`;
    }
    if (filters.sweetType) {
        combinedQuery += ` (Sweet Type: ${filters.sweetType})`;
    }
    if (filters.kosher) {
        combinedQuery += ` (Kosher: ${filters.kosher})`;
    }

    try {
        const searchResults = await searchService.searchFilter(searchQuery, filters);
        const products = searchResults.flatMap(result => result.products);
        res.render('searchPage', { 
            user: user,
            searchQuery: combinedQuery,
            products: products,
            filters: filters
        });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).send('Error searching for products');
    }
}


module.exports = { 
    searchProduct,
    searchBySweetType,
    searchByFilter
};