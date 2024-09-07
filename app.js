const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/candy-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/register', registerRoutes);  // Ensure this is correctly set
app.use('/login', loginRoutes);

// Static public dir 
app.use('/public', express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
