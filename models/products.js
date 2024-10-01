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
<<<<<<< HEAD
    // description: {
    //     type: String,
    //     required: true,
    // },
=======
    description: {
        type: String,
        required: true,
    },
>>>>>>> origin/cart
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
<<<<<<< HEAD
=======
        default: '/public/images/logo.svg',
>>>>>>> origin/cart
    },
    inventory: {
        type: Number,
        required: true,
<<<<<<< HEAD
    },
    // category: {
    //     type: String,
    //     required: true,
    // },
=======
    }
>>>>>>> origin/cart
}, { versionKey: false });

module.exports = mongoose.model('Products', productsSchema);