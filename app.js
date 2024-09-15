const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/sweetly');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));


// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock user authentication middleware (if required)
app.use((req, res, next) => {
    req.user = {customerId: '111111111' };  // here i need to get from the login page data.
    next();
});

// Import the admin routes
const accountRoute = require('./routes/adminRoute');
app.use('/', accountRoute);

// Import home routes
const homeRoutes = require('./routes/homeRoute');
app.use('/', homeRoutes);  // Use the home routes


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
