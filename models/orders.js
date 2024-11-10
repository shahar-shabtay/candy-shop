const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: Number, required: true },
});


const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  products: [productSchema],
  address: addressSchema
}, { versionKey: false });

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;