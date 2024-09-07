const productsService = require("../services/productsService.js");

async function getAllProducts (req, res) {
	try {
		const products = await productsService.getAllProducts();
		res.render('productsList', { products: products }); 
	} catch (err) {
		console.error('Error getting products:', err);
		res.status(500).send('Server Error (productsController - getAllProducts)');
	}
};

async function newProductForm (req, res) {
	try {
		res.render('newProduct');
	} catch (err){
		console.error('Error loading newProductForm:', err);
		res.status(500).send('Server Error (productsController - newProductForm)');
	}
};

async function saveProduct (req, res) {
	try {
		const products = await productsService.createProduct(req.body);
		res.redirect('/products');
	} catch (err) {
		console.error('Error saving new product:', err);
		res.status(500).send('Server Error (productsController - saveProduct)');
	}
};

module.exports = {
	getAllProducts,
	newProductForm,
	saveProduct
};