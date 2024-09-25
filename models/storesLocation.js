const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storesLocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: [arrayLimit, 'Coordinates should be an array of two numbers']
  },
  address: {
    type: String,
    required: true
  }
});

// Validator for coordinates array
function arrayLimit(val) {
  return val.length === 2;
}

const storesLocation = mongoose.model('storeslocation', storesLocationSchema);

module.exports = storesLocation;