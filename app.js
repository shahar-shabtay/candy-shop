const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Routes
const productsRoutes = require('./routes/productsRoutes.js');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/candyShop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/register', registerRoutes); 
app.use('/login', loginRoutes);
app.use('/products', productsRoutes);


mongoose.connect('mongodb://localhost:27017/sweetly');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));


// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


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
