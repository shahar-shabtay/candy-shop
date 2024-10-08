require('dotenv').config();
const axios = require('axios');

async function getConversionRates() {
    const apiKey = process.env.FIXER_API_KEY;
    const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&symbols=ILS,USD,EUR`;

    try {
        const response = await axios.get(url);
        return response.data.rates;
    } catch (error) {
        console.error('Error fetching conversion rates:', error);
        throw new Error('Could not fetch conversion rates');
    }
}

module.exports = { getConversionRates };
