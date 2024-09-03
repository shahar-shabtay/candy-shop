const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/candy_shop');

app.listen(3000, () => console.log('App listening on port 3000!'));

const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    location : String,
    price : Number,
    category : String,
    supplier : String,
    calories : String,
    image: String
});

const Product = mongoose.model('products', productSchema);

app.get('/products', (req, res) => {
    Product.find({}).then(function(products) {
        res.json(products)
    }).catch(function(err) {
        console.log(err)
    }) 
})


app.use(express.static('public'));
app.use(express.static('views'));


