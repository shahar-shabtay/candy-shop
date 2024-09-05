const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock user authentication middleware (if required)
app.use((req, res, next) => {
    req.user = { _id: '66d730a7e30f7747e7ad1d65', name: 'Ziv Klein' };  // Example mock data
    next();
});

// Import the admin routes
const adminRoutes = require('./routes/adminPage');
app.use('/', adminRoutes);

// Import home routes
const homeRoutes = require('./routes/home');
app.use('/', homeRoutes);  // Use the home routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
