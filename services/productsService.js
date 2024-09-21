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


async function saveProduct(productId, updatedData) {
    try {
        console.log('Service: createProduct called');
        const lastProduct = await Products.findOne().sort({ productId: -1 });
        console.log('Last product fetched:', lastProduct);
        const newProductId = lastProduct ? lastProduct.productId + 1 : 1;
        console.log('New productId calculated:', newProductId);
        const product = new Product({
            ...productData,
            productId: newProductId // Assign the incremented productId
        });
        await product.save();
        console.log('Product saved to database:', product);
        return product;
    } catch (error) {
        throw new Error('Unable to update product');
    }
}
module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct,
    getProductById,
    saveProduct
}