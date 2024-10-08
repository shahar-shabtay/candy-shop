const fixerService = require('../services/fixerService');

async function getConversionRates (req, res){
    try {
        const rates = await fixerService.getConversionRates();
        res.json(rates);
    } catch (error) {
        res.status(500).send('Error fetching conversion rates');
    }
}

async function setCurrency(req, res){
    const { currency } = req.body;
    req.session.currency = currency; // Update session with the selected currency
    res.status(200).send('Currency preference saved');
}

async function getCurrency(req,res){
    const currency = req.session.currency; // Default to 'ILS' if not set
    res.json({ currency });
}

module.exports = { 
    getConversionRates,
    setCurrency,
    getCurrency
};
