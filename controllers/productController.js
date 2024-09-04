const Product = require("../models/products.js");
const mongoose = require("mongoose");


exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.render('productList', { products: products }); // Render productList.ejs passing in the products
};

exports.newProductForm = (req, res) => {
  res.render('newProduct');
};

exports.saveProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
      await product.save();
      res.redirect('/products');
  } catch (err) {
      res.render('newProduct', { error: err.message });
  }
};
