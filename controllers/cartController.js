const productsService = require("../services/productsService.js");
const ordersService = require('../services/ordersService');
const cartService = require('../services/cartService');
const customerService = require('../services/customerService');


// Adds an item to the cart
function addToCart (req, res) {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity) || 1;

    if(req.session.cart){
        const cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);
        
        if (cartItemIndex > -1) {
            req.session.cart[cartItemIndex].quantity += quantity;
        } else {
            req.session.cart.push({ productId, quantity });
        }
    } else {
        req.session.cart = [{ productId, quantity }];
    }
    res.redirect('/products');
};

// Display the cart
async function showCart (req, res) {
    const currency = req.session.currency || 'ILS';
    const rates = req.session.rates || {};
    console.log(currency);
    let user = req.session.user;
    let cart = req.session.cart;
    let cartDetails = [];
    let totalPrice = 0;

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
};

// Remvoves item from cart
function removeFromCart (req, res) {
    const productId = req.body.productId;
    const cart = req.session.cart;

    // Find product's index in the cart
    const cartItemIndex = cart.findIndex(item => item.productId === productId);

    // If product is found in the cart, remove it
    if (cartItemIndex > -1) {
        cart.splice(cartItemIndex, 1);
    }

    // Save the updated cart in the session
    req.session.cart = cart;

    // Redirect to the cart page
    res.redirect('/cart');
}

// Updates item quantity in the cart
function updateCart(req, res) {
    const productId = req.body.productId;
    let newQuantity = parseInt(req.body.newQuantity) || 1;

    if (newQuantity < 1) newQuantity = 1; // Server-side validation
    if (newQuantity > 50) newQuantity = 50;

    if (req.session.cart) {
        const cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);

        if (cartItemIndex > -1) {
            // Update quantity of existing product in the cart
            req.session.cart[cartItemIndex].quantity = newQuantity;
        }
    }

    res.redirect('/cart');
}

// Checkout
async function checkout (req, res) {
    const user = req.session.user;
    const cart = req.session.cart;
    let orderProducts = [];
    let totalPrice = 0;

    if (cart) {
        for (let item of cart) {
            const product = await productsService.getProductById(item.productId);
            if (product) {
                orderProducts.push({ productId: item.productId, quantity: item.quantity });
                totalPrice += product.price * item.quantity;

                // Reduce product inventory by purchased quantity
                product.inventory -= item.quantity;
                await productsService.updateProductInventory(product.productId, product.inventory);
            }
        }
    }

    totalPrice = totalPrice.toFixed(2);
    
    let orderData = {
        orderId: Math.floor(Math.random() * 10000000),
        customerId: req.session.user.customerId,
        orderDate: new Date(),
        totalPrice: totalPrice,
        status: "Pending",
        products: orderProducts
    };
    console.log(orderData);
    try {
        console.log(user);
        const order = await ordersService.createOrder(orderData);
        req.session.cart = [];
        res.status(201).json({ success: true, message: 'Order placed successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
}

async function updateCartQuantity(req, res) {
    try {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity) {
            return res.status(400).json({ success: false, message: 'Product ID and quantity are required.' });
        }

        // Fetch the product price from productService (assuming you have this service)
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // Update the quantity in the session cart
        cartService.updateProductQuantity(req, productId, quantity);

        // Respond with success and the product price to update the frontend
        res.json({ success: true, price: product.price });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error updating cart: ${error.message}` });
    }
};



module.exports = {
    addToCart,
    showCart,
    removeFromCart,
    checkout,
    updateCart,
    updateCartQuantity
}