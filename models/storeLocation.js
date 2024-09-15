// models/storeLocation.js
const mongoose = require('mongoose');

const storeLocationSchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('StoreLocation', storeLocationSchema);
