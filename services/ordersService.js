const Customer = require('../models/customer');
const Orders = require('../models/orders');

async function getCustomerOrders(customerId) {
    try {
        const orders = await Orders.find({customerId: customerId});
        return orders;
    } catch (err) {
        console.error('Error fetching favorites', err);
    }
}

async function getAllOrders () {
    try {
        const orders = await Orders.find({});
        return orders;
    } catch (err) {
        console.error('Error fetching all orders ', err);
    }
}

async function getOrderDetailsById (orderId) {
    try {
      
      const order = await Orders.findOne({orderId: orderId}).populate('products.productId');
  
      if (!order) {
        return null;
      }
  
      
      const productsDetails = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          name: productDetails.name,
          price: productDetails.price,
          quantity: product.quantity
        };
      }));
  
      order.productsDetails = productsDetails;
  
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error; 
    }
  };

async function getOrderById(orderId) {
  try {
    const order = await Orders.findOne({orderId : orderId});
    return order;
  } catch(err) {
    console.error('error', err);
  }
}

async function updateOrderStatus (orderId, newStatus) {
  try {
    const updatedOrder = await Orders.findOneAndUpdate(
        {orderId :orderId}, 
        { status: newStatus }, 
        { new: true }
    );
    return updatedOrder;
} catch (error) {
    console.error(error);
    throw new Error('Error updating order status');
}
}

async function deleteOrder(orderId) {
  try {
    const result = await Orders.deleteOne({ 
      orderId: orderId  ,
    }); 
    return result.deletedCount > 0;
  } catch (err) {
    console.error('Error removing order:', err);
    throw err; 
  }
}

async function createOrder(orderDetails) {
  const order = new Orders(orderDetails);
  return await order.save();
}

module.exports = {
    getCustomerOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderDetailsById,
    getOrderById,
    deleteOrder,
    createOrder
  };