const storesService = require('../services/storesService');

async function getStores(req, res) {
    try {
        const user = req.session.user;  // Assume customerId is available in the session
        const stores = await storesService.getAllStores();
        res.render('allStores', { stores: stores , user});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

module.exports = {
    getStores,
};
