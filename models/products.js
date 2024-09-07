const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    imageUrl: String
});

module.exports = mongoose.model('Products', productsSchema);