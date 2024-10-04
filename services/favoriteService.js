const Favorite = require('../models/favorite');
const productsService = require('../services/productsService');


// Function to get customer favorite products
async function getFavoritesByUser(customerId) {
    try {
        // Fetch all favorites for the customer
        const favorites = await Favorite.find({ customerId: customerId });

        if (!favorites || favorites.length === 0) {
            throw new Error('No favorite products found');
        }

        // Fetch product details for each favorite product
        const favoriteProducts = await Promise.all(favorites.map(async (favorite) => {
            const product = await Product.findOne({ productId: favorite.productId });
            if (!product) {
                throw new Error('Product not found');
            }

            return {
                productId: product.productId,
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
            };
        }));

        return favoriteProducts;
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        throw new Error('Failed to retrieve favorite products');
    }
}

// Function to add favorite product to user
async function addNewFavorite(customerId, productId) {
    try {
        // Check if the product is already in the favorites list
        const favoriteExists = await Favorite.findOne({ customerId: customerId, productId: productId });
        
        if (favoriteExists) {
            throw new Error('Product already in favorites');
        }

        // Add the product to the favorites collection
        const favorite = new Favorite({ customerId: customerId, productId: productId });
        await favorite.save();

        return favorite;
    } catch (error) {
        console.error('Error in adding favorite product:', error);
        throw new Error('Failed to add product to favorites');
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
    getFavoritesByUser,
    addNewFavorite,
    removeFavoriteProduct
  };
  