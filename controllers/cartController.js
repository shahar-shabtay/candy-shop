const productsService = require("../services/productsService.js");

// Adds an item to the cart
function addToCart (req, res, next) {
    const productId = req.body.productId;
    if(req.session.cart){
        req.session.cart.push(productId);
    } else {
        req.session.cart = [productId];
    }
    res.redirect('/products');
};

// Displays the cart
async function showCart (req, res) {
    let cart = req.session.cart;
    let cartDetails = [];

    if (cart) {
        for (let id of cart) {
            const product = await productsService.getProductById(id);
            if (product) {
                cartDetails.push(product);
            }
        }
    }

    res.render("cart", { cart: cartDetails });
};

function removeFromCart (req, res) {
    const productId = req.body.productId;
    const cart = req.session.cart;

    // Find product's index in the cart
    const index = cart.findIndex(id => id.toString() === productId);

    // If product is found in the cart, remove it
    if (index > -1) {
        cart.splice(index, 1);
    }

    // Save the updated cart in the session
    req.session.cart = cart;

    // Redirect to the cart page
    res.redirect('/cart');
}

function checkout (req, res) {
    // Logic to handle checkout (process payment, create order, etc.)

    // Clear the cart in the session after a successful checkout
    req.session.cart = [];

    // Redirect to 'purchase complete' page
    res.redirect('/cart/complete'); 
}

function completePurchase (req, res) {
    res.render('complete');
}

module.exports = {
    addToCart,
    showCart,
    removeFromCart,
    checkout,
    completePurchase
}