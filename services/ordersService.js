const Customer = require('../models/customer');
const Orders = require('../models/orders');

// Function to get customer orders
async function getCustomerOrders(customerId) {
    try {
        const orders = await Orders.find({customerId: customerId});
        return orders;
    } catch (err) {
        console.error('Error fetching favorites', err);
    }
}

// Function to get all orders
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
      // Fetch the order by ID and populate the products
      const order = await Orders.findOne({orderId: orderId}).populate('products.productId');
  
      if (!order) {
        return null; // Return null if the order is not found
      }
  
      // Fetch details of each product
      const productsDetails = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          name: productDetails.name,
          price: productDetails.price,
          quantity: product.quantity
        };
      }));
  
      // Add the products details to the order object
      order.productsDetails = productsDetails;
  
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error; // Handle error in the controller
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

module.exports = {
    getCustomerOrders,
    getAllOrders,
    getOrderDetailsById,
    getOrderById
  };
  