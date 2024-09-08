const adminService = require('../services/adminService');

// Helper function to convert address object to a string
function formatAddress(address) {
    if (!address || typeof address !== 'object') return '';
    return `${address.street} ${address.number}, ${address.city}`;
}

// Helper function to format the date as 'YYYY-MM-DD'
function formatDateToString(date) {
    if (!date || !(date instanceof Date)) return '';  // Check if the date is valid
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed, so +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to render the account page 
async function renderAccountPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await adminService.getCustomerById(customerId);  // Search by customerId
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

// Function to render the admin page with customer details
async function renderAdminPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await adminService.getCustomerById(customerId);  // Search by customerId
        const customers = await adminService.getAllCustomers();  // Search by customerId
        const role = await adminService.getUserRoleByCustomerId(customerId);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        customer.formattedAddress = formatAddress(customer.address);
        if(role === 'admin')
        {
            res.render('allCustomers', {customer, customers});
        } else {
            res.render('accessDenied', {customer, customers});
        }
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
    }
}

// Controller to check the user's role and redirect to the correct page
async function redirectBasedOnRole(req, res) {
    try {
        const customerId = req.user.customerId; // Assuming req.user contains the authenticated user's customerId
        const role = await adminService.getUserRoleByCustomerId(customerId); // Fetch the role using the service

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
        return res.status(500).send('Server Error');
    }
}

// Controller to update customer details
async function updateCustomerDetails(req, res) {
    try {
        const customerId = req.user.customerId.trim();  // Trim to remove any whitespace

        // Create the birthdate from the separate fields
        const { day, month, year } = req.body;
        const birthdate = new Date(`${year}-${month}-${day}`);

        if (isNaN(birthdate.getTime())) {
            return res.status(400).send('Invalid birthdate');
        }

        // Prepare updated data, including the password and birthdate
        const updatedData = {
            password: req.body.password,  // Update password
            birthdate: birthdate,         // Update birthdate
            address: {
                city: req.body.address_city,
                street: req.body.address_street,
                number: req.body.address_number
            }
        };

        // Call the service to update customer details by customerId
        const result = await customerService.updateCustomerById(customerId, updatedData);

        if (result.modifiedCount > 0) {
            res.redirect('/myAccount');  // Redirect after successful update
        } else {
            res.status(404).send('Customer not found');
        }
    } catch (err) {
        console.error('Error updating customer details:', err);
        res.status(500).send('Server Error');
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
        const orders = await adminService.getOrdersByCustomerId(customerId);  // Fetch orders
        const customer = await adminService.getCustomerById(customerId); // Fetch Custoer

        if (!orders || orders.length === 0) {
            console.log('No orders found for this user');
            return res.render('customerOrders', { orders: [], customer });  // Render an empty order list
        }

        res.render('customerOrders', { orders, customer });;  // Render the orders EJS view
    } catch (err) {
        console.error('Error in getOrders controller:', err);  // Log the error in detail
        res.status(500).send('Server Error');
    }
}

// Controller to render the all customer part
async function getAllCustomers(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customers = await adminService.getAllCustomers(); // Fetch all customers from service
        const customer = await adminService.getCustomerById(customerId);  // Search by customerId
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
        const customer = await adminService.getCustomerById(customerId);  // Search by customerId
        const orders = await adminService.getAllOrders();
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
        const customer = await adminService.getCustomerById(customerId);
        const customers = await adminService.getAllCustomers();
        const products = await adminService.getAllProducts();
        res.render('allProducts', {customers, customer, products});
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
    }
}

// Controller to render the add product part
async function addProducts(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await adminService.getCustomerById(customerId);  // Search by customerId
        const orders = await adminService.getAllOrders();
        res.render('addProducts', {customer}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addProducts)');
    }
}

// Controller to update customer
async function updateCustomer(req, res) {
    const customerId = req.params.id;
    const updatedData = req.body;

    try {
        // Call the service to handle the update
        const updatedCustomer = await adminService.updateCustomer(customerId, updatedData);

        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Send success response to client
        res.json({ success: true, customer: updatedCustomer });
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ success: false, message: `Error updating customer: ${error.message}` });
    }
}

// Controller to get all favoritwe products
async function getAllFavorite (req, res) {
    try {
        const customerId = req.user.customerId;
        const customer = await adminService.getCustomerById(customerId);
        const products = await adminService.getFavorite(customerId);
        res.render('favoriteProducts', {customer, products});
    } catch (err) {
        console.error('Error fetching favorite: ', err);
        res.status(500).send('Server Error (adminController - getAllFavorite');
    }
}

// Controller to remove product from favorite


module.exports = {
    renderAccountPage,
    updateCustomerDetails,
    getOrdersByCustomerId,
    getAllCustomers,
    redirectBasedOnRole,
    renderAdminPage,
    getAllOrders,
    getAllProducts,
    addProducts,
    updateCustomer,
    getAllFavorite
};
