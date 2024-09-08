// Customers model in Ziv's branch - need to be deleted
const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    product_number: {
        type: Number,
        required: true,
        uniqe: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    weight: {
        type: Date,
    },
    image: {
        type: Date,
        required: true,
    }
});

const Products = mongoose.model('Products', productsSchema, 'products');

module.exports = Products;
