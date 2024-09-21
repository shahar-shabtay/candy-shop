const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        uniqe: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        default: '/public/images/logo.svg',
    },
    inventory: {
        type: Number,
        required: true,
    }
}, { versionKey: false });

module.exports = mongoose.model('Products', productsSchema);