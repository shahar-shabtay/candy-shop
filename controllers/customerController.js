const customerService = require('../services/accountService');

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

// Function to render the admin page with customer details
async function renderAccountPage(req, res) {
    try {
        const customerId = req.user.customerId;  // Assume customerId is available in the session
        const customer = await customerService.getCustomerById(customerId);  // Search by customerId
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        customer.formattedAddress = formatAddress(customer.address);
        res.render('customerDetails', { customer });
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
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

// Constroller to get account orders
async function getOrders(req, res) {
    try {
        const customerId = req.user.customerId;
        if (!customerId) {
            console.error('No user ID found in request');
            return res.status(400).send('User not authenticated');
        }

        console.log('Fetching orders for user ID:', customerId);

        const orders = await customerService.getOrdersByCustomerId(customerId);  // Fetch orders
        const customer = await customerService.getCustomerById(customerId); // Fetch Custoer

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


module.exports = {
    renderAccountPage,
    updateCustomerDetails,
    getOrders
};
