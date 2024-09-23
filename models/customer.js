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
    role: {
        type: String,
        required: false,
    },
    address: {
        type: {
            town: String,
            street: String,
            homeNumber: Number
        },
        required: true,
    }
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
