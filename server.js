const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

mongoose.connect('mongodb://localhost:27017/candy_shop');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/products', productRoutes);




const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));



