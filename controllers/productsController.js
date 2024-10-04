const productsService = require("../services/productsService.js");
const customerService = require("../services/customerService.js");
const favoriteService = require('../services/favoriteService');
const facebookPostService = require('../services/facebookPostService.js');
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


async function addProduct(req, res) {
    const productId = Math.floor(Math.random() * 10000000);
    console.log('Controller: addProduct called');

    try {
        // Get the next product ID
        const lastProduct = await productsService.getLastProduct();

        // Multer setup inside the handler
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../public/images')); // Adjust the path
            },
            filename: function (req, file, cb) {
                const fileName = `product_${productId}.svg`;
                console.log('Filename generated:', fileName); // Debug: Check filename
                cb(null, fileName); // Save the file with the generated productId filename
            }
        });

        const upload = multer({ storage: storage }).single('image');

        // Call multer to handle file upload
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading image:', err);
                return res.status(500).json({ success: false, message: 'Error uploading image' });
            }

            
            // Proceed with product creation after file is uploaded
            const { name, price, inventory, description, category, postToFacebook} = req.body;
            console.log('Received form data:', { name, price, inventory });

            // Use 'imageUrl' instead of 'image' to match the Mongoose schema
            const imageUrl = `/public/images/product_${productId}.svg`;
            console.log('Uploaded file path:', imageUrl);

            // Create product data object
            const productData = {
                productId:productId,  // Set the new product ID
                name,                    // Product name from form data
                price,                   // Product price from form data
                inventory,             // Product inventory from form data
                description,
                category,
                imageUrl                 // Save the file path to the imageUrl field
            };

            // Check if postToFacebook is checked and post to Facebook
            if (postToFacebook === 'on') { // Checkbox value is 'on' when checked
                const productUrl = `www.${name}`; // Use the product name as part of the URL
                try {
                    await facebookPostService.postMessageToFacebook(`Check out our new product: ${name} for just $${price}!`, productUrl);
                    console.log('Posted to Facebook successfully.');
                } catch (error) {
                    console.error('Error posting to Facebook:', error);
                }
            }
            // Pass the data to the service to insert into the database
            const newProduct = await productsService.createProduct(productData);
            console.log('Product created successfully:', newProduct);
            return res.json({ success: true, product: newProduct });
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ success: false, message: 'Error creating product' });
    }
}


async function showDeleteProductForm (req, res) {
    res.render('deleteProduct', { error: null, productId: '' });
};

async function deleteProduct(req, res) {
    const productId = req.body.productId;
    console.log('controller: ', productId);
    
    try {
        await productsService.deleteProduct(productId);
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Return error as JSON
    }
};

async function addNewFavorite(req, res) {
    try {
        const customerId = req.session.user.customerId; // Assuming customerId is stored in session
        const productId = req.body.productId; // Get the productId from the request body

        await favoriteService.addFavorite(customerId, productId);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error adding product to favorites:', error);
        return res.status(500).json({ success: false, message: error.message });
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
	console.log('edit button called');
	const { productId } = req.params; // Get product ID from URL
    const { name, price, description, inventory } = req.body; // Get updated data from the request body

    try {
        // Call the service to update the product
		console.log(name, price, description, inventory);
		
        const updateData = { productId, name, price, description, inventory };
		const updatedProduct = await productsService.saveProduct(productId, updateData);
        
        // Respond with success
        return res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.json({ success: false, message: 'Error updating product' });
    }
}


module.exports = {
	getAllProducts,
	editProducts,
	showDeleteProductForm,
	deleteProduct,
	addNewFavorite,
	removeFavoriteProduct,
	addProduct
};