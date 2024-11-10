const axios = require('axios');

// Function that fetch the rate of the dolar and euro form api.
async function setCurrency(req, res) 
{
  const { currency } = req.body;
  req.session.currency = currency;

  try {
    const ratesResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/ILS');
    req.session.rates = ratesResponse.data.rates;
  } catch (error) {
    console.error('Error fetching currency rates', error);
  }
  res.sendStatus(200);
};

module.exports = {
  setCurrency
}