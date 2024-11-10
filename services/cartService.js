const updateProductQuantity = (req, productId, quantity) => {
    try {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        let productInCart = req.session.cart.find(item => item.productId === productId);

        if (!productInCart) {
            throw new Error('Product not found in cart.');
        }
        productInCart.quantity = quantity;
        return { success: true, cart: req.session.cart };
    } catch (error) {
        throw new Error(`Error updating product quantity: ${error.message}`);
    }
};
