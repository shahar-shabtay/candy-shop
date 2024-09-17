const Favorite = require('../models/favorite');
const productsService = require('../services/productsService');


// Function to get customer favorite products
async function getFavoriteProductsByCustomerId(customerId) {
    try {
        // Find all favorites for the customer
        const favorites = await Favorite.find({ customerId: customerId });
        // Fetch product details for each favorite
        const productDetailsPromises = favorites.map(async (favorite) => {
            const productDetails = await productsService.getProductById(favorite.productId); // Fetch product by productId
            return {
                product: productDetails,
                productId: favorite.productId
            };
        });

        // Resolve all promises and return the product details
        const favoriteProducts = await Promise.all(productDetailsPromises);
        return favoriteProducts;
    } catch (err) {
        console.error('Error fetching favorite products:', err);
        throw err; // Rethrow to handle in the controller
    }
}

// Function to add favorite product to user
async function addNewFavorite(customerId, productId) {
    try {
        const existingFavorite = await Favorite.findOne({ 
            customerId: customerId,
            productId: productId 
        });

        if (existingFavorite) {
            // Return a message or a specific value indicating the product is already a favorite
            return { success: false, message: 'Product is already a favorite' };
        }

        // Create a new favorite entry
        const favorite = new Favorite({
            productId: productId,
            customerId: customerId,
        });
        console.log(favorite);

        // Save to the database
        await favorite.save();
        return { success: true, favorite };
    } catch (err) {
        console.error('Error adding favorite product:', err);
        throw err;
    }
}

//Function to remove from favorties
async function removeFavoriteProduct(customerId, productId) {
    try {
        // Remove the favorite entry
        const result = await Favorite.deleteOne({ 
            customerId: customerId,
            productId: productId 
        });

        // Check if a favorite was removed
        return result.deletedCount > 0; // Return true if a product was removed
    } catch (err) {
        console.error('Error removing favorite product:', err);
        throw err; // Rethrow to handle in the controller
    }
}


module.exports = {
    getFavoriteProductsByCustomerId,
    addNewFavorite,
    removeFavoriteProduct
  };
  