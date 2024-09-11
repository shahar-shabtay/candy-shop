const Products = require("../models/products.js");

async function getAllProducts () {
    try {
        return await Products.find();
    }
    catch (err) {
        console.error('Error getting all products:', err);
    }
};

async function createProduct (productsData) {
    try {
        const product = new Products(productsData);
        return await product.save();
    } catch (err) {
        console.error('Error creating product:', err);
    }
};

async function deleteProduct (productId) {
    const productToDelete = await Products.findOne({ productId: productId });
    if (!productToDelete) {
        throw new Error('No product found with the given productId');
    }
    await Products.deleteOne({ productId: productId });
    return productToDelete;
};

module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct
}