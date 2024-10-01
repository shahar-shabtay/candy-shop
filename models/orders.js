const mongoose = require('mongoose');

<<<<<<< HEAD
const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true }, // Assuming productId is a Number in your document
  quantity: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  products: [productSchema], // Array of product details
  address: addressSchema // Embedded address schema
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
=======
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
>>>>>>> origin/cart
