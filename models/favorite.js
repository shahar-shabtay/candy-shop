// Customers model in Ziv's branch - need to be deleted
const mongoose = require('mongoose');

const favoritSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    product_number: {
        type: Number,
        required: true,
        unique: true,
    }
});

const Favorite = mongoose.model('Favorite', favoritSchema);

module.exports = Favorite;
