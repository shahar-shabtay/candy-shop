const Products = require("../models/products.js");

async function getAllProducts () {
    try {
        return await Products.find();
    }
    catch (err) {
        console.error('Error getting all products:', err);
    }
};

async function createProduct (productsData) {
    try {
        const product = new Products(productsData);
        return await product.save();
    } catch (err) {
        console.error('Error fetching products:', err);
    }
};

module.exports = {
    getAllProducts,
    createProduct
}