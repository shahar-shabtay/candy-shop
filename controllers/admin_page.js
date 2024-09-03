const customerService = require('../services/customerService');

async function renderAdminPage(req, res) {
    try {
        const customerId = req.user.name;  // Assuming req.user contains authenticated user info
        const customer = await customerService.getCustomerById(customerId);
        res.render('aadmin_page', { customer });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    renderAdminPage
};