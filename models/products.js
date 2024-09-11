const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    productId: String,
    name : String,
    description : String,
    price : Number,
    imageUrl: String
}, { versionKey: false });

module.exports = mongoose.model('Products', productsSchema);