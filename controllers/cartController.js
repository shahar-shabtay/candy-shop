const productsService = require("../services/productsService.js");
const ordersService = require('../services/ordersService');
const cartService = require('../services/cartService');
const customerService = require('../services/customerService');

// Functio to add new product to user cart
async function addToCart(req, res) {
    const productId = req.body.productId.toString();
    const quantity = parseInt(req.body.quantity) || 1;
    const user = req.session.user;

    try {
        let cart = await customerService.getCustomerCart(user.customerId);
        cart = cart || [];

        const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            return res.status(200).json({ message: 'Product is already in the cart' });
        } else {
            cart.push({ productId, quantity });
            await customerService.updateCustomerCart(user.customerId, cart);
            return res.status(200).json({ message: 'Product added to cart' });
        }
    } catch (err) {
        console.error("Failed to update cart:", err);
        res.status(500).json({ message: "An error occurred while updating the cart." });
    }
}

// Render the user cart.
async function showCart (req, res) {
    try {
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};
        const user = req.session.user;
        let cartDetails = [];
        let totalPrice = 0;

        const cart = await customerService.getCustomerCart(user.customerId);

        if (cart) {
            for (let item of cart) {
                const product = await productsService.getProductById(item.productId);
                if (product) {
                    product.quantity = item.quantity;
                    cartDetails.push(product);
                    totalPrice += product.price * item.quantity;
                }
            }
        }
    
        totalPrice = totalPrice.toFixed(2);
        res.render("cart", { cart: cartDetails, total: totalPrice, user, currency, rates });
    } catch(err) {
        console.error(err);
    }
};

// Function to remove product from user cart.
async function removeFromCart(req, res) {
    const productId = req.body.productId;
    const user = req.session.user;

    try {
        let cart = await customerService.getCustomerCart(user.customerId);
        cart = cart || [];
        const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);
        if (cartItemIndex > -1) {
            cart.splice(cartItemIndex, 1);
            await customerService.updateCustomerCart(user.customerId, cart);
        }

        res.redirect('/cart');
    } catch (err) {
        console.error("Failed to update cart:", err);
        res.status(500).send("An error occurred while updating the cart.");
    }
}

// Functio to update the choosen quantity of the products in the cart.
async function updateCart(req, res) {
    try {
        const productId = req.body.productId;
        let newQuantity = parseInt(req.body.newQuantity);
        if (!productId || isNaN(newQuantity)) {
            return res.status(400).json({ success: false, message: 'Product ID and valid quantity are required.' });
        }
        newQuantity = Math.max(1, Math.min(newQuantity, 50));
        const user = req.session.user;
        let cart = await customerService.getCustomerCart(user.customerId);
        cart = cart || [];
        const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            cart[cartItemIndex].quantity = newQuantity;
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in the cart.' });
        }

        await customerService.updateCustomerCart(user.customerId, cart);
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found in database.' });
        }
        res.json({ success: true, price: product.price });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: `Error updating cart: ${error.message}` });
    }
}

// Functio to place new order.
async function checkout(req, res) {
    const user = req.session.user;
    let orderProducts = [];
    let totalPrice = 0;
    let skippedProducts = [];

    try {
        const cart = await customerService.getCustomerCart(user.customerId);

        if (!cart || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty.' });
        }
        for (let item of cart) {
            const product = await productsService.getProductById(item.productId);

            if (product) {
                if (product.inventory === 0) {
                    skippedProducts.push(product.name);
                    continue;
                }

                if (product.inventory >= item.quantity) {
                    orderProducts.push({ productId: item.productId, quantity: item.quantity });
                    totalPrice += product.price * item.quantity;

                    product.inventory -= item.quantity;
                    await productsService.updateProductInventory(product.productId, product.inventory);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient inventory for ${product.name}. Please adjust quantities and try again.`
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Product with ID ${item.productId} not found.`
                });
            }
        }

        // If no valid products to order, return an error response
        if (orderProducts.length === 0) {
            return res.status(400).json({ success: false, message: 'No products with sufficient inventory to complete the order.' });
        }

        // Format total price to two decimal places
        totalPrice = totalPrice.toFixed(2);

        const address = req.body.address;
        const orderData = {
            orderId: new Date().getTime().toString(),
            customerId: user.customerId,
            orderDate: new Date(),
            totalPrice: totalPrice,
            status: "Pending",
            products: orderProducts,
            address: address,
        };

        // Create the order
        const order = await ordersService.createOrder(orderData);

        // Clear the cart in the database
        await customerService.updateCustomerCart(user.customerId, []);

        // Prepare the success message with details of skipped products, if any
        const successMessage = skippedProducts.length > 0
            ? `Order placed successfully. Note: The following products were not added due to insufficient inventory: ${skippedProducts.join(', ')}.`
            : 'Order placed successfully.';

        res.status(201).json({ success: true, message: successMessage });
    } catch (error) {
        console.error("Failed to place order:", error);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
}

module.exports = {
    addToCart,
    showCart,
    removeFromCart,
    checkout,
    updateCart
}