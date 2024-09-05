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
        const customerName = req.user.name;  // Assuming req.user contains the authenticated user's name
        const customer = await customerService.getCustomerByName(customerName);  // Fetch customer from the service
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Convert the address object to a string
        customer.addressString = formatAddress(customer.address);

        customer.birthString = formatDateToString(customer.birthdate);

        // Render the view with the customer data, including the formatted address string
        res.render('accountDetails', { customer });
    } catch (err) {
        console.error('Error rendering account page:', err);
        res.status(500).send('Server Error');
    }
}

// Function to handle form submission and update customer details
async function updateCustomerDetails(req, res) {
    try {
        const customerName = req.body.name;
        const birthDay = parseInt(req.body.birth_day, 10);
        const birthMonth = parseInt(req.body.birth_month, 10) -1;
        const birthYear = parseInt(req.body.birth_year, 10);
        const birthdate = new Date(birthYear, birthMonth, birthDay);
        const password = req.body.password;

        // Create an object with the updated data from the form
        const updatedData = {
            email: req.body.email,
            phone: req.body.phone,
            birthdate: birthdate,
            address: {
                city: req.body.address_city,
                street: req.body.address_street,
                number: req.body.address_number,
            },
            password: password,
        };

        // Call the service to update customer details by name
        const result = await customerService.updateCustomerByName(customerName, updatedData);

        if (result.modifiedCount > 0) {
            res.redirect('/myAccount');  // Redirect to the admin page after successful update
        } else {
            res.status(404).send('Customer not found');
        }
    } catch (err) {
        console.error('Error updating customer details:', err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    renderAccountPage,
    updateCustomerDetails
};
