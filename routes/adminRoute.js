const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productsController = require('../controllers/productsController.js');
const orderController = require('../controllers/orderController.js');

// get
router.get('/myAccount', adminController.renderAccountPage);
router.get('/myAccount/details', adminController.renderAccountPage);
router.get('/admin', adminController.getAllCustomers);
router.get('/admin/customers', adminController.getAllCustomers);
router.get('/admin/products', adminController.getAllProducts);
router.get('/admin/addProducts', adminController.addProductsPage);
router.get('/myAccount/favorite', adminController.renderFavoriteProducts,);
router.get('/myAccount/orders/:orderId', orderController.getCustomerOrderDetailsById);
router.get('/admin/orders/:orderId', orderController.getOrderDetailsById);
router.get('/admin/orders', orderController.getAllOrders);
router.get('/myAccount/orders', orderController.getCustomerOrders);



// put
router.put('/admin/customers/update/:customerId', adminController.adminUpdateCustomerDetails);
router.put('/admin/orders/status/:orderId', orderController.updateOrderStatus);

// post
router.post('/myAccount/update', adminController.updateCustomerDetails);
router.post('/myAccount/favorite/remove', productsController.removeFavoriteProduct);
router.post('/admin/products/remove', productsController.deleteProduct);
router.post('/admin/orders/remove', orderController.deleteOrder);
router.post('/admin/products/:productId/edit', productsController.editProducts);
router.post('/admin/products/:productId/delete', productsController.deleteProduct);
router.post('/admin/addProducts', productsController.addProduct);


module.exports = router;