const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        required: true,
    }
}, { versionKey: false });

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;