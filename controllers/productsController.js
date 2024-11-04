const productsService = require("../services/productsService.js");
const customerService = require("../services/customerService.js");
const favoriteService = require('../services/favoriteService');
const facebookPostService = require('../services/facebookPostService.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

async function getAllProducts (req, res) {
	const user = req.session.user;
	if (!user){
		return res.redirect('/');
	}
	try {
		const email = user.email;
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};
		const products = await productsService.getAllProducts();
		res.render('productsList', { products,user,currency,rates}); 
	} catch (err) {
		console.error('Error getting products:', err);
		res.status(500).send('Server Error (productsController - getAllProducts)');
	}
};


async function addProduct(req, res) {
    const productId = new Date().getTime().toString();

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
            const { name, price, inventory, description, category, postToFacebook, sweetType, kosher} = req.body;
            const flavorsData = req.body.flavors || '[]'; // Default to an empty array if flavors are missing
            let flavors = [];

            const allergansData = req.body.allergans || '[]'; // Default to an empty array if allergans are missing
            let allergans = [];

            //flavors array
            try {
                flavors = JSON.parse(flavorsData); // Convert the JSON string back to an array
            } catch (error) {
                console.error('Failed to parse flavors:', error);
                return res.status(400).json({ error: 'Invalid flavors data' });
            }

            //allergans array
            try {
                allergans = JSON.parse(allergansData); // Convert the JSON string back to an array
            } catch (error) {
                console.error('Failed to parse allergans:', error);
                return res.status(400).json({ error: 'Invalid allergans data' });
            }

            // Use 'imageUrl' instead of 'image' to match the Mongoose schema
            const imageUrl = `/public/images/product_${productId}.svg`;

            // Create product data object
            const productData = {
                productId:productId,  // Set the new product ID
                name,                    // Product name from form data
                price,                   // Product price from form data
                inventory,             // Product inventory from form data
                description,
                flavors,
                allergans,
                sweetType,
                kosher,
                imageUrl                 // Save the file path to the imageUrl field
            };

            // Check if postToFacebook is checked and post to Facebook
            if (postToFacebook === 'on') { // Checkbox value is 'on' when checked
                const productUrl = `localhost:3000/products/${productId}`; // Use the product name as part of the URL
                try {
                    await facebookPostService.postMessageToFacebook(`Wow! New Product! ✨ \n\n` + 
                    `🍭 ${name.toUpperCase()} 🍭\n` +
                    `💸 Only ${price}\n\n` +
                    `🔥Copy the link below to get yours!\n\n`+
                    `${productUrl}`);
                } catch (error) {
                    console.error('Error posting to Facebook:', error);
                }
            }
            // Pass the data to the service to insert into the database
            const newProduct = await productsService.createProduct(productData);
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
    try {
        const { productId } = req.params;

        // Fetch the product details to get the image name/path
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Construct the path to the product image
        const imagePath = path.join(__dirname, '../public/images', `product_${productId}.svg`);

        // Log the image path for debugging

        // Check if the image file exists
        if (fs.existsSync(imagePath)) {
            // Delete the product image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting product image:', err);
                } else {
                    console.log('Product image deleted successfully.');
                }
            });
        } else {
            console.warn('Product image not found at path:', imagePath);
        }

        // Delete the product from the database
        await productsService.deleteProduct(productId);

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product.', error: error.message });
    }
}

async function addNewFavorite(req, res) {
    try {
        const customerId = req.session.user.customerId; // Assuming customerId is stored in session
        const productId = req.body.productId; // Get the productId from the request body

        await favoriteService.addNewFavorite(customerId, productId);

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
	const { productId } = req.params; // Get product ID from URL
    const { name, price, description, inventory } = req.body; // Get updated data from the request body

    try {
        // Call the service to update the product
		
        const updateData = { productId, name, price, description, inventory };
		const updatedProduct = await productsService.saveProduct(productId, updateData);
        
        // Respond with success
        return res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.json({ success: false, message: 'Error updating product' });
    }
}

async function getProductDetail (req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.rates || {};
        const product = await productsService.getProductById(req.params.productId);
        res.render('productDetail', { product: product, user:user, currency:currency, rates:rates});
    } catch (error) {
        console.log(error);
        res.redirect('/products');
    }
};

module.exports = {
	getAllProducts,
	editProducts,
	showDeleteProductForm,
	deleteProduct,
	addNewFavorite,
	removeFavoriteProduct,
	addProduct,
    getProductDetail
};