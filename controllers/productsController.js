const productsService = require("../services/productsService.js");
const customerService = require("../services/customerService.js");
const favoriteService = require('../services/favoriteService');
const multer = require('multer');
const path = require('path');


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

// Configure multer to store files in the /public/images folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/images')); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname; // Append a timestamp to avoid conflicts
        cb(null, fileName); // Save the file with a unique name
    }
});

const upload = multer({ storage: storage });

async function newProduct (req, res) {
	console.log('Controller: addProduct called');

	upload.single('image'), // Use multer to upload the file

    async (req, res) => {
		console.log('Controller: addProduct called');
        try {
			console.log('controller - try')
            const { name, price, inventory } = req.body;
			console.log('Received form data:', { name, price, inventory });

            // File path for the image
            const filePath = `/public/images/${req.file.filename}`;
			console.log('Uploaded file path:', filePath);

            // Pass the data to the service to insert into the database
            const newProduct = await productService.createProduct({
                name,
                price,
                inventory,
                image: filePath // Save the file path as a string in the database
            });
			console.log('Product created successfully:', newProduct);
            return res.json({ success: true, product: newProduct });
        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({ success: false, message: 'Error creating product' });
        }
    }
};

async function showDeleteProductForm (req, res) {
    res.render('deleteProduct', { error: null, productId: '' });
};

async function deleteProduct (req, res) {
	const productId = req.body.productId;
	console.log('controller: ', productId);
    try {
        await productsService.deleteProduct(productId);
        return res.json({ success: true });
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

async function editProducts (req,res) {
	const { productId } = req.params; // Get product ID from URL
    const { name, price, description, inventory } = req.body; // Get updated data from the request body

    try {
        // Call the service to update the product
        const updatedProduct = await productsService.saveProduct(productId, { name, price, description, inventory });
        
        // Respond with success
        return res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.json({ success: false, message: 'Error updating product' });
    }
}
module.exports = {
	getAllProducts,
	newProduct,
	showDeleteProductForm,
	deleteProduct,
	addNewFavorite,
	removeFavoriteProduct,
	editProducts
};