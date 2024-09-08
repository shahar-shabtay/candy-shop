const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
        unique: true,
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
        default: "user",
    },
    address: {
        type: {
            city: String,
            street: String,
            homeNumber: Number
        },
        required: true,
    }
});

const Customer = mongoose.model('Customer', customerSchema, 'cutomer');

module.exports = Customer;