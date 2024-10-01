const Products = require("../models/products.js");

async function getAllProducts () {
    try {
        return await Products.find();
    }
    catch (err) {
        console.error('Error getting all products:', err);
    }
};

async function deleteProduct (productId) {
    console.log('service: ',productId);
    const productToDelete = await Products.findOneAndDelete({ productId: productId });
    return productToDelete.deletedCount > 0; };

async function getProductById(productId) {
    try {
        const product = await Products.findOne({productId: productId});
        return product;
    } catch(err) {
        console.error('error fetching product', err);
    }
}

async function getLastProduct() {
    return await Products.findOne().sort({ productId: -1 }); // Sort by productId in descending order
}

async function createProduct(productData) {
    try {
        // Create a new product using the Products model and the provided product data
        const product = new Products(productData);
        return await product.save(); // Save the product to the database
    } catch (err) {
        console.error('Error creating product:', err);
        throw err; // Rethrow the error to be handled in the controller
    }
}


async function saveProduct(productId, updateData) {
    try {
        const updateProduct = await Products.findOneAndUpdate(
            {productId : productId},
                updateData,
            { new: true, runValidators: true }
        );
        if (!updateProduct) {
            throw new Error('product not found');
        }
        return updateProduct;
    } catch(err) {
        console.error('Error while update product ', err);
    }
}
async function updateProductInventory (productId, inventory) {
    try {
        return await Products.findOneAndUpdate({ productId: productId }, { $set: { inventory: inventory }}, {new: true}).exec();
    } catch (error) {
        throw Error("Error while updating product inventory");
    }
};
module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct,
    getProductById,
    saveProduct,
    getLastProduct,
    updateProductInventory
}