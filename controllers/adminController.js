const customerService = require('../services/customerService');
const productService = require('../services/productsService');
const favoriteService = require('../services/favoriteService');
const orderService = require('../services/orderService');
const multer = require('multer');
const path = require('path');
const mongoose = require("mongoose");


// Helper function to convert address object to a string
function formatAddress(address) {
    if (!address || typeof address !== 'object') return '';
    return `${address.street} ${address.number}, ${address.city}`;
}

// Controller to check the user's role and redirect to the correct page
async function redirectBasedOnRole(req, res) {
    try {
        const customerId = req.user.customerId; // Assuming req.user contains the authenticated user's customerId
        const role = await customerService.getUserRoleByCustomerId(customerId); // Fetch the role using the service
        console.log(role);
        // Redirect based on the user's role
        if (role === 'admin') {
            return res.redirect('/admin'); // Redirect to admin page
        } else if (role === 'user') {
            return res.redirect('/myAccount'); // Redirect to account page
        } else {
            return res.status(403).send('Access denied: invalid role');
        }
    } catch (err) {
        console.error('Error checking user role:', err);
        return res.status(500).send('Server Error - redirectBasedOnRole');
    }
}

// Function to render the admin page with customer details
async function renderAdminPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        const customers = await customerService.getAllCustomers();  // Search by customerId
        const role = await customerService.getUserRoleByCustomerId(customerId);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        console.log('role: ' ,role);
        customer.formattedAddress = formatAddress(customer.address);
        if(role === 'admin')
        {
            res.render('allCustomers', {customer, customers});
        } else {
            res.render('accessDenied', {customer, customers});
        }
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error - renderAdminPage');
    }
}

// Function to render the account page 
async function renderAccountPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        customer.formattedAddress = formatAddress(customer.address);

        res.render('customerDetails', {customer});
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
    }
}

// Controller to update customer details
async function updateCustomerDetails(req, res) {
    try {
        const customerId = req.params.customerId;
        console.log('the controller gonna save data for ', customerId);
        const {
        name,
        email,
        password,
        phone,
        city,
        street,
        number,
        role,
        birth_day,
        birth_month,
        birth_year,
        } = req.body;
        
        const birthdate = new Date(`${birth_year}-${birth_month}-${birth_day}`);
        const updateCustomer = await customerService.updateCustomer(customerId, {
        name,
        email,
        password,
        phone,
        city,
        street,
        number,
        role,
        birthdate
        });
    
        if (!updateCustomer) {
            console.log('error in controller ', customerId);
            return res.status(404).json({ errors: ["Customer not found"] });

        }
    
        res.status(200).json({ message: "Customer updated successfully" });
    } catch (err) {
        res.status(500).send("Failed to update customer", err);
    }
}


// Constroller to render account orders
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

// Controller to render the all customer part
async function getAllCustomers(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customers = await customerService.getAllCustomers(); // Fetch all customers from service
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        console.log(customers);
        res.render('allCustomers', { customers, customer}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllCustomers)');
    }
}

// Controller to render the all orders part
async function getAllOrders(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        const orders = await orderService.getAllOrders();
        res.render('allOrders', { orders, customer}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllOrders)');
    }
}

//controller to render the all products 
async function getAllProducts(req, res) {
    try {
        const customerId = req.user.customerId;
        const customer = await customerService.getCustomerById(customerId);
        const customers = await customerService.getAllCustomers();
        const products = await productService.getAllProducts();
        res.render('allProducts', {customers, customer, products});
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
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
// Controller to get all favoritwe products
async function getAllFavorite (req, res) {
    try {
        const customerId = req.user.customerId;
        const customer = await customerService.getCustomerById(customerId);
        const products = await favoriteService.getFavorite(customerId);
        console.log('form admin controller: ', products);
        res.render('favoriteProducts', {customer, products});
    } catch (err) {
        console.error('Error fetching favorite: ', err);
        res.status(500).send('Server Error (adminController - getAllFavorite');
    }
}

// Controller to get all orders of customer
async function getCustomerOrders (req, res) {
    try {
        const customerId = req.user.customerId;
        const customer = await customerService.getCustomerById(customerId);
        const orders = await orderService.getOrderByCustomer(customerId);
        res.render('customerOrders', {customer, orders});
    } catch (err) {
        res.status(500).send('Error fetching orders');
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
    redirectBasedOnRole,
    renderAdminPage,
    getAllOrders,
    getAllProducts,
    addProductsPage,
    saveProduct,
    getAllFavorite,
    getCustomerOrders,
    getOrderDetailsById
};
