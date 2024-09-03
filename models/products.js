const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    location : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    supplier : {
        type: String,
        required: true
    },
    calories : {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;