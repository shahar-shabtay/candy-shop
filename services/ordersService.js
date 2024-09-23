const Orders = require('../models/orders');

exports.createOrder = async function(orderDetails) {
    const order = new Orders(orderDetails);
    return await order.save();
}


