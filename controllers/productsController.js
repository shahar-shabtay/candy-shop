const productsService = require("../services/productsService.js");
const customerService = require("../services/customerService.js");
const favoriteService = require('../services/favoriteService');

async function getAllProducts (req, res) {
	const user = req.session.user;
	if (!user){
		return res.redirect('/');
	}
	try {
		const email = user.email;
		const customer = await customerService.getCustomerByEmail(email);
		const products = await productsService.getAllProducts();
		res.render('productsList', { products,user, customer}); 
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

async function showDeleteProductForm (req, res) {
    res.render('deleteProduct', { error: null, productId: '' });
};

async function deleteProduct (req, res) {
	const productId = req.body.productId;
    try {
        await productsService.deleteProduct(productId);
        res.redirect('/products');
    } catch (error) {
        res.render('deleteProduct', { error: error.message });
    }
};

async function addNewFavorite (req,res) {
	try {
		const customerId = req.session.user.customerId;
		const user = req.session.user;
		const productId = req.body.productId;
		const result = await favoriteService.addNewFavorite(customerId, productId);
		console.log(result);
		if (result.success) {
            // Optionally, you can add a message to the session to display after rendering
            req.flash('success', 'Product added to favorites'); // If you're using connect-flash or a similar library
        } else {
            req.flash('error', result.message); // Flash error message
        }
		res.redirect('/products')
	} catch(err) {
		console.error('error add new product as favorite',err);
	}
}

async function removeFavoriteProduct (req,res) {
	try {
		const customerId = req.session.user.customerId; // Get the customer's ID from the session
		const productId = req.body.productId; // Get product number from the request body

		const wasRemoved = await favoriteService.removeFavoriteProduct(customerId, productId);

		if (wasRemoved) {
			res.status(200).json({ message: 'Product removed from favorites' }); // Respond with success
		} else {
			res.status(404).json({ error: 'Product not found in favorites' }); // Handle case where product was not found
		}
	} catch (err) {
		console.error('Error removing favorite product:', err);
		res.status(500).json({ error: 'Failed to remove favorite product' }); // Handle other errors
	}
}

module.exports = {
	getAllProducts,
	newProductForm,
	saveProduct,
	showDeleteProductForm,
	deleteProduct,
	addNewFavorite,
	removeFavoriteProduct
};