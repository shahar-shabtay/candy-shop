const productService = require('../services/productsService');
const orderService = require('../services/ordersService');
const customerService = require('../services/customerService');



async function getAllOrders(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const orders = await orderService.getAllOrders();
        res.render('allOrders', { orders, user}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllOrders)');
    }
}

async function getCustomerOrders (req, res) {
    try {
        const user = req.session.user;
        const orders = await orderService.getCustomerOrders(user.customerId);
        if(user){
            res.render('customerOrders', {orders, user});
        } else {
            res.render('notLogin');
        }
    } catch (err) {
        res.status(500).send('Error fetching orders');
    }
}

async function getCustomerOrderDetailsById (req, res) {
  try {
        const user = req.session.user;
        const orderId = req.params.orderId; // Get orderId from the request
    
        // Fetch the order from the service
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const customer = await customerService.getCustomerById(user.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }   
      // Prepare an array to hold products with full details
      const fullProductDetails = await Promise.all(order.products.map(async (product) => {
          // Fetch product details
          const productDetails = await productService.getProductById(product.productId);
          
          if (!productDetails) {
              console.warn(`Product with ID ${product.productId} not found`);
              return {
                  name: 'We dont have this product right now', // Provide a fallback name for missing products
                  price: 0, // Set a default price if product is not found
                  quantity: product.quantity, // Get quantity from the order document
                  image: '/public/images/logo.svg', // Default image if the product is missing
              };
          }
          
          return {
              name: productDetails.name, // Get product name from product collection
              price: productDetails.price, // Get product price from product collection
              quantity: product.quantity, // Get quantity from the order document
              image: productDetails.imageUrl, // Get product image
          };
      }));
  
      // Retrieve user from the session
      
      
      // Pass the data to the view
      res.render('customerOrderDetails', {
            orderDetails: {
                orderId: order.orderId,
                customerId: order.customerId,
                orderDate: order.orderDate,
                totalPrice: order.totalPrice,
                status: order.status,
                address: order.address,
                products: fullProductDetails,
            },
            customerDetails: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
            },
          user: user, // Pass the user from the session
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


async function getOrderDetailsById (req, res) {
    try {
        const user = req.session.user;
        const orderId = req.params.orderId; // Get orderId from the request
    
        // Fetch the order from the service
        const order = await orderService.getOrderById(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        const customer = await customerService.getCustomerById(user.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }  
        // Prepare an array to hold products with full details
        const fullProductDetails = await Promise.all(order.products.map(async (product) => {
          const productDetails = await productService.getProductById(product.productId);
          if (!productDetails) {
            console.warn(`Product with ID ${product.productId} not found`);
            return {
                name: 'We dont have this product right now', // Provide a fallback name for missing products
                price: 0, // Set a default price if product is not found
                quantity: product.quantity, // Get quantity from the order document
                image: '/public/images/logo.svg', // Default image if the product is missing
            };
        }
        
        return {
            name: productDetails.name, // Get product name from product collection
            price: productDetails.price, // Get product price from product collection
            quantity: product.quantity, // Get quantity from the order document
            image: productDetails.imageUrl, // Get product image
        };
        }));
    
        // Retrieve user from the session
        
        // Pass the data to the view
        res.render('orderDetails', {
          orderDetails: {
            orderId: order.orderId,
            customerId: order.customerId,
            orderDate: order.orderDate,
            totalPrice: order.totalPrice,
            status: order.status,
            address: order.address,
            products: fullProductDetails,
          },
          customerDetails: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        },  
          user: user, // Pass the user from the session
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

async function updateOrderStatus(req,res) {
    try {
        const orderId = req.params.orderId;
        const { newStatus } = req.body;
        // Validate status (you may want to have valid statuses)
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Call the service to update the status
        const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
        if (updatedOrder) {
            return res.status(200).json({ success: true, order: updatedOrder });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteOrder (req, res) {
    try {
        const orderId = req.params;
        const wasRemoved = await orderService.deleteOrder(orderId);
		if (wasRemoved) {
			res.status(200).json({ message: 'order removed' }); // Respond with success
		} else {
			res.status(404).json({ error: 'order not found' }); // Handle case where product was not found
		}
	} catch (err) {
		console.error('Error removing order:', err);
		res.status(500).json({ error: 'Failed to remove order' }); // Handle other errors
	}
}

module.exports = {
    getAllOrders,
    getCustomerOrders,
    getCustomerOrderDetailsById,
    getOrderDetailsById,
    updateOrderStatus,
    deleteOrder
}