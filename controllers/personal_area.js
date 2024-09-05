const customerService = require('../services/admin_page');

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
async function renderAdminPage(req, res) {
    try {
        const customerName = req.user.name;  // Assuming req.user contains the authenticated user's name
        const customer = await customerService.getCustomerByName(customerName);  // Fetch customer from the service
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Convert the address object to a string
        customer.addressString = formatAddress(customer.address);

        customer.birthString = formatDateToString(customer.birthdate);

        // Render the view with the customer data, including the formatted address string
        res.render('account_details', { customer });
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    renderAdminPage,
};
