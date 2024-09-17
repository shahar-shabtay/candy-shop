const customerService = require('../services/customerService');
const productService = require('../services/productsService');
const favoriteService = require('../services/favoriteService');
const orderService = require('../services/ordersService');
const multer = require('multer');
const path = require('path');
const mongoose = require("mongoose");


// Helper function to convert address object to a string
function formatAddress(address) {
    if (!address || typeof address !== 'object') return '';
    return `${address.street} ${address.number}, ${address.city}`;
}

// Render personal area - myAccount / admin
async function renderAdminPage(req, res) {
    try {
        const customerId = req.session.user.customerId;  // Assume customerId is available in the session
        const user = await customerService.getCustomerById(customerId);  // Search by customerId
        const customers = await customerService.getAllCustomers();  // Search by customerId
        const role = req.session.user.role;
        if (!user) {
            return res.status(404).send('Customer not found');
        }
        user.formattedAddress = formatAddress(user.address);
        if(role === 'admin')
        {
            res.render('allCustomers', {customers, user});
        } else {
            res.render('accessDenied', {customers, user});
        }
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error - renderAdminPage');
    }
}

async function renderAccountPage(req, res) {
    try {
        const user = req.session.user;
        console.log(user);
        res.render('customerDetails', {user});
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
    }
}

// Manage customers / orders / product
async function updateCustomerDetails(req, res) {
    try {
        const customerId = req.session.user.customerId;
        const { 
            name, 
            email, 
            birth_day, birth_month, birth_year, 
            phone, 
            street, number, city, 
            password 
        } = req.body;
        const birthdate = new Date(`${birth_year}-${birth_month}-${birth_day}`);    
        const updateUser = {
            customerId, 
            name, 
            email, 
            birthdate, 
            phone, 
            street, number, city,
            password
        };
        console.log('the new data that fetch: ', updateUser);
        const updateCustomer = await customerService.updateCustomerDetails(customerId, updateUser);
        if (updateCustomer) {
            req.session.user = {...req.session.user, ...updateUser};
            res.redirect('/personal/myAccount');
        }
    } catch (err) {
        res.status(500).send("Failed to update customer", err);
    }
}

async function saveProduct(req, res) {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            return res.status(500).send('Error uploading file');
        }

        const { name } = req.body;
        const imageFileName = req.file.filename; // Get the file name

        try {
            // Save the product details to the database
            const product = new Product({
                name: name,
                image: `/public/images/${imageFileName}` // Save the file path in the DB
            });
            console.log(product);
            await product.save();

            // Redirect to a success page or the product list page
            res.redirect('/admin/addProducts');
        } catch (error) {
            res.status(500).send('Error saving product to database');
        }
    });
}

// Get all about - orders / favorite / customers / products
async function getAllCustomers(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const customers = await customerService.getAllCustomers(); // Fetch all customers from service
        const customer = await customerService.getCustomerById(user.customerId);  // Search by customerId
        console.log(customers);
        res.render('allCustomers', { customers, customer, user}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllCustomers)');
    }
}

async function getAllOrders(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(user.customerId);  // Search by customerId
        const orders = await orderService.getAllOrders();
        res.render('allOrders', { orders, customer, user}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllOrders)');
    }
}

async function getAllProducts(req, res) {
    try {
        const user = req.session.user;
        const customer = await customerService.getCustomerById(user.customerId);
        const customers = await customerService.getAllCustomers();
        const products = await productService.getAllProducts();
        res.render('allProducts', {customers, customer, products, user});
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
    }
}

// For specific customer - orders / details / favorite
async function getOrdersByCustomerId(req, res) {
    try {
        const customerId = req.user.customerId;
        if (!customerId) {
            console.error('No user ID found in request');
            return res.status(400).send('User not authenticated');
        }
        const orders = await orderService.getOrderByCustomer(customerId);
        console.log(orders);
        const customer = await customerService.getCustomerById(customerId); // Fetch Custoer
        // const products = await orderService.getProductsInOrder()
        if (!orders || orders.length === 0) {
            console.log('No orders found for this user');
            return res.render('customerOrders', { orders , customer });  // Render an empty order list
        }

        res.render('customerOrders', { orders, customer });;  // Render the orders EJS view
    } catch (err) {
        console.error('Error in getOrders controller:', err);  // Log the error in detail
        res.status(500).send('Server Error - getOrdersByCustomerId');
    }
}

async function renderFavoriteProducts(req, res) {
    try {
        const user = req.session.user;
        const favoriteProducts = await favoriteService.getFavoriteProductsByCustomerId(user.customerId);
        // Render the favorite products view, passing the products data
        res.render('favoriteProducts', { favoriteProducts , user});
    } catch (err) {
        console.error('Error rendering favorite products:', err);
        res.status(500).send('Failed to fetch favorite products');
    }
}


async function getCustomerOrders (req, res) {
    try {
        const user = req.session.user;
        const customer = await customerService.getCustomerById(user.customerId);
        const orders = await orderService.getCustomerOrders(user.customerId);
        res.render('customerOrders', {customer, orders, user});
    } catch (err) {
        res.status(500).send('Error fetching orders');
    }
}




// Multer storage configuration to save the file to /public/images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images')); // Save to /public/images
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Create unique filename
    }
});

// Multer upload middleware to handle file upload
const upload = multer({ storage: storage });

// Controller to render the add product part
async function addProductsPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        res.render('addProducts', {customer}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addProducts)');
    }
}

const getOrderDetailsById = async (req, res) => {
    const orderId = req.params.orderId;
    
    try {
        const order = await orderService.getOrderById(orderId); // שליפת ההזמנה
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // נשלוף את כל פרטי המוצרים בהזמנה
        const productsDetails = await Promise.all(order.products.map(async (product) => {
            const productDetails = await productService.getProductById(product.productId);
            return {
                ...productDetails.toObject(), // פרטי המוצר
                quantity: product.quantity // הוספת הכמות של המוצר
            };
        }));

        res.render('orderDetails', { order, products: productsDetails }); // הצגת הטבלה עם פרטי ההזמנה
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    renderAccountPage,
    updateCustomerDetails,
    getAllCustomers,
    getOrdersByCustomerId,
    renderAdminPage,
    getAllOrders,
    getAllProducts,
    addProductsPage,
    saveProduct,
    renderFavoriteProducts,
    getCustomerOrders,
    getOrderDetailsById
};
