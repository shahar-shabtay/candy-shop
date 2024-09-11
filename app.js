const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productsRoutes = require('./routes/productsRoutes.js');

mongoose.connect('mongodb://localhost:27017/candyShop');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/products', productsRoutes);


const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));



