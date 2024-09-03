const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    birtdate: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        city: {type: String, required: true},
        street: {type: String, required: true},
        number: {type: Number, required: true}
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
