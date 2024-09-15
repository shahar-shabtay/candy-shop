require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Routes
const productsRoutes = require('./routes/productsRoutes.js');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const nearMeRoutes = require('./routes/nearMeRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/candyShop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/register', registerRoutes); 
app.use('/login', loginRoutes);
app.use('/products', productsRoutes);
app.use('/nearMe', nearMeRoutes)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});