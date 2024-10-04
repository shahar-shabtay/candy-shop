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
        res.render('notLogin');
        console.error('Error rendering admin page:', err);
    }
}

async function renderAccountPage(req, res) {
    try {
        const user = req.session.user;
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
            address: {
                street, number, city
            },
            password
        };
        const updateCustomer = await customerService.updateCustomerDetails(customerId, updateUser);
        if (updateCustomer) {
            req.session.user = {...req.session.user, ...updateUser};
            res.redirect('/personal/myAccount');
        }
    } catch (err) {
        res.status(500).send("Failed to update customer", err);
    }
}

// Get all about - orders / favorite / customers / products
async function getAllCustomers(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const customers = await customerService.getAllCustomers(); // Fetch all customers from service
        const customer = await customerService.getCustomerById(user.customerId);  // Search by customerId
        res.render('allCustomers', { customers, customer, user}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllCustomers)');
    }
}



async function getAllProducts(req, res) {
    try {
        const user = req.session.user;
        const customers = await customerService.getAllCustomers();
        const products = await productService.getAllProducts();
        res.render('allProducts', {customers, products, user});
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
    }
}

// For specific customer - orders / details / favorite
async function getFavoriteProducts(req, res) {
    try {
        const customerId = req.session.user.customerId; // Fetching customerId from session
        const favoriteProducts = await favoriteService.getFavoritesByUser(customerId);

        // Render the EJS file and pass favorite products data to it
        res.render('favorites', { favorites: favoriteProducts });
    } catch (error) {
        console.error('Error rendering favorites page:', error);
        res.status(500).render('error', { message: 'Failed to load favorite products' });
    }
}



// Controller to render the add product part
async function addProductsPage(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        res.render('addProducts', {user}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addProducts)');
    }
}



// Manage customers / orders / product
async function adminUpdateCustomerDetails(req, res) {
    try {
        const customerId = req.params.customerId;
        const { name, email, birth_day, birth_month, birth_year, phone, street, number, city, role } = req.body;

        // Create a birthdate object from the day, month, and year
        const birthdate = new Date(`${birth_year}-${birth_month}-${birth_day}`);

        // Prepare the updated customer data
        const updatedCustomerData = {
            name,
            email,
            birthdate,
            phone,
            address: {
                city,
                street,
                number: Number(number)
            },
            role
        };
        // Call the service to update the customer in the database
        const updatedCustomer = await customerService.updateCustomerDetails(customerId, updatedCustomerData);

        if (updatedCustomer) {
            res.json({ success: true, message: 'Customer updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to update customer' });
        }
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}





module.exports = {
    renderAccountPage,
    updateCustomerDetails,
    getAllCustomers,
    renderAdminPage,
    getAllProducts,
    addProductsPage,
    getFavoriteProducts,
    adminUpdateCustomerDetails,
};
