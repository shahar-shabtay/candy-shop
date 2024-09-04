const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

router.get('/', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    const { name, email, password, birtdate, address } = req.body;

    try {
        // Create a new customer instance
        const newCustomer = new Customer({
            name,
            email,
            password,
            birtdate,
            address: {
                town: address.town,
                street: address.street,
                homeNumber: address.homeNumber
            }
        });

        // Save the customer to the database
        await newCustomer.save();
        
        // Redirect to login or any other page on success
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error); // Log the error for debugging
        // Render the register page with an error message
        res.render('register', { error: 'Registration failed. Please check your input and try again.' });
    }
});

module.exports = router;
