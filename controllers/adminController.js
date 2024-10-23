const customerService = require('../services/customerService');
const productService = require('../services/productsService');
const favoriteService = require('../services/favoriteService');
const facebookInfoService = require('../services/facebookInfoService');
const facebookPostService = require('../services/facebookPostService');



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
        } else if(role == 'user') {
            res.render('accessDenied', {user});
        }
    } catch (err) {
        res.render('notLogin');
        console.error('Error rendering admin page:', err);
    }
}

async function getFacebookPageInfo(req, res) {
    try {
        const user = req.session.user;  // Get the user from the session
        const facebookData = await facebookInfoService.getFacebookPageInfo(); // Fetch Facebook stats
        const role = user.role;
        // Render the facebookInfo.ejs view and pass the facebookData and user
        if(role === 'admin')
        {
            res.render('facebookInfo', { facebookData, user });
        } else if(role == 'user') {
            res.render('accessDenied', {user});
        }
        
    } catch (err) {
        console.error('Error fetching Facebook page info:', err);
        res.status(500).send('Server Error - fetching Facebook page info');
    }
}

async function renderAccountPage(req, res) {
    try {
        const user = req.session.user;
        if(user){
            res.render('customerDetails', {user});
        } else {
            res.render('notLogin');
        }
        
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
        const user = req.session.user; 
        if(user) {
             // Assume customerId is available in the session
            const customers = await customerService.getAllCustomers(); // Fetch all customers from service
            const customer = await customerService.getCustomerById(user.customerId);  // Search by customerId
            if(user.role == 'admin') {
                res.render('allCustomers', { customers, customer, user}); // Render the view and pass customers
            } else if(user.role == 'user') {
            res.render('accessDenied', {user});
        } else {
            res.render('notLogin');
        }
    }
        
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllCustomers)');
    }
}

// For specific customer - orders / details / favorit

async function getAllProducts(req, res) {
    try {
        const user = req.session.user;
        const customers = await customerService.getAllCustomers();
        const products = await productService.getAllProducts();
        const currency = req.session.currency;
        const rates = req.session.rates;
        if(user.role == 'admin') {
            res.render('allProducts', {customers, products, user, currency, rates});
        } else if(user.role == 'user') {
            res.render('accessDenied', {user});
        }
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
    }
}

// For specific customer - orders / details / favorite
async function getFavoriteProducts (req, res) {
    const user = req.session.user;
    const currency = req.session.currency;
    const rates = req.session.rates;

    try {
        if(user){
            const favoriteProducts = await favoriteService.getFavoriteProductsByCustomerId(user.customerId);
            res.render('favoriteProducts', {favoriteProducts, user, currency, rates});
        } else {
            res.render('notLogin');
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to render the add product part
async function addProductsPage(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
         // Render the view and pass customers
        if(user.role == 'admin') {
            res.render('addProducts', {user});
        } else if(user.role == 'user') {
            res.render('accessDenied', {user});
        }
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addProducts)');
    }
}

async function postToFacebook(name, price) {
    const message = `Wow! Check out our new product: ${name}, only for ${price}!`;
    const url = `http://localhost:3000/products/${name.replace(/\s+/g, '').toLowerCase()}`; // Create URL based on the product name

    try {
        // Use your existing Facebook service to post the message
        await facebookPostService.postMessageToFacebook(message, url);
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        throw error; // Handle errors here if needed
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
    getFacebookPageInfo,
    getFavoriteProducts,
    getAllProducts,
    addProductsPage,
    postToFacebook,
    adminUpdateCustomerDetails,
};
