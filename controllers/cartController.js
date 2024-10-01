const productsService = require("../services/productsService.js");
const ordersService = require('../services/ordersService');

// Adds an item to the cart
function addToCart (req, res, next) {
    
    const productId = req.body.productId;
    console.log(productId);
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
    res.render("cart", { cart: cartDetails, total: totalPrice });
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
        customerId: "YOUR_CUSTOMER_ID",
        orderDate: new Date(),
        totalPrice: totalPrice,
        status: "completed",
        products: orderProducts
    };

    try {
        const order = await ordersService.createOrder(orderData);
        req.session.cart = [];
        res.redirect('/cart/complete');
    } catch (error) {
        console.log(error);
        res.redirect('/cart');
    }
}


function completePurchase (req, res) {
    res.redirect('/products');
}

module.exports = {
    addToCart,
    showCart,
    removeFromCart,
    checkout,
    completePurchase,
    updateCart
}