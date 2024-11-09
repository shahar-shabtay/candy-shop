const productsService = require("../services/productsService.js");
const ordersService = require('../services/ordersService');
const cartService = require('../services/cartService');
const customerService = require('../services/customerService');

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

// Remvoves item from cart
async function removeFromCart(req, res) {
    const productId = req.body.productId;
    const user = req.session.user;

    try {
        // שליפת העגלה מהדאטהבייס
        let cart = await customerService.getCustomerCart(user.customerId);
        cart = cart || [];

        // מציאת המוצר בעגלה לפי ה־productId
        const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);

        // אם המוצר נמצא בעגלה, מסירים אותו
        if (cartItemIndex > -1) {
            cart.splice(cartItemIndex, 1);

            // עדכון העגלה בדאטהבייס לאחר ההסרה
            await customerService.updateCustomerCart(user.customerId, cart);
        }

        // הפניה לדף העגלה לאחר העדכון
        res.redirect('/cart');
    } catch (err) {
        console.error("Failed to update cart:", err);
        res.status(500).send("An error occurred while updating the cart.");
    }
}

// Updates item quantity in the cart
async function updateCart(req, res) {
    try {
        const productId = req.body.productId;
        let newQuantity = parseInt(req.body.newQuantity);

        // ולידציה בסיסית על הקלט
        if (!productId || isNaN(newQuantity)) {
            return res.status(400).json({ success: false, message: 'Product ID and valid quantity are required.' });
        }

        // הגבלת הכמות בין 1 ל-50
        newQuantity = Math.max(1, Math.min(newQuantity, 50));

        // שליפת העגלה מהדאטהבייס
        const user = req.session.user;
        let cart = await customerService.getCustomerCart(user.customerId);
        cart = cart || [];

        // בדיקה אם המוצר קיים בעגלה
        const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            // עדכון הכמות של המוצר בעגלה
            cart[cartItemIndex].quantity = newQuantity;
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in the cart.' });
        }

        // שמירת העגלה המעודכנת בדאטהבייס
        await customerService.updateCustomerCart(user.customerId, cart);

        // שליפת המחיר מהמוצר
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found in database.' });
        }

        // תגובת JSON מוצלחת עם המחיר
        res.json({ success: true, price: product.price });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: `Error updating cart: ${error.message}` });
    }
}


// Checkout
async function checkout(req, res) {
    const user = req.session.user;
    let orderProducts = [];
    let totalPrice = 0;

    try {
        // שליפת העגלה מהדאטהבייס באמצעות ה-service
        const cart = await customerService.getCustomerCart(user.customerId);

        if (cart && cart.length > 0) {
            for (let item of cart) {
                const product = await productsService.getProductById(item.productId);
                if (product) {
                    orderProducts.push({ productId: item.productId, quantity: item.quantity });
                    totalPrice += product.price * item.quantity;

                    // הפחתת המלאי של המוצר בהתאם לכמות שנרכשה
                    product.inventory -= item.quantity;
                    await productsService.updateProductInventory(product.productId, product.inventory);
                }
            }
        }

        totalPrice = totalPrice.toFixed(2);
        const address = req.body.address;
        let orderData = {
            orderId: new Date().getTime().toString(),
            customerId: user.customerId,
            orderDate: new Date(),
            totalPrice: totalPrice,
            status: "Pending",
            products: orderProducts,
            address: address,
        };

        // יצירת ההזמנה
        const order = await ordersService.createOrder(orderData);

        // איפוס העגלה בדאטהבייס
        await customerService.updateCustomerCart(user.customerId, []);

        res.status(201).json({ success: true, message: 'Order placed successfully.' });
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