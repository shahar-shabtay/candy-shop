const session = require("express-session");

function showSuccessAlert(id) {
    const alertBox = document.getElementById(id);
    alertBox.classList.remove('hidden');
    alertBox.classList.add('visible');

    setTimeout(() => {
        alertBox.classList.remove('visible');
        alertBox.classList.add('hidden');
    }, 1000);
}

// Function to update the quantity of a specific item and recalculate the total price
function updateQuantity(itemId, change) {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    let currentQuantity = parseInt(quantityInput.value);

    // Update the quantity
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
        quantityInput.value = newQuantity;
    }

    // Update the total price
    updateTotalPrice();
}

// Function to update the total price of all items in the cart
function updateTotalPrice() {
    let totalPrice = 0;
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector("input[name='quantity']").value);
        const price = parseFloat(item.querySelector(".price span").dataset.unitPrice);
        totalPrice += price * quantity;
    });

    document.getElementById("total-price").textContent = `₪${totalPrice.toFixed(2)}`;
}

// Function to handle updating the cart when the 'Update' button is clicked (client-server communication)
function updateCart(itemId) {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const newQuantity = parseInt(quantityInput.value);

    // Send an AJAX request to the server to update the cart session
    fetch('/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: itemId,
            newQuantity: newQuantity,
        }),
    })
    .then(response => {
        if (response.ok) {
            // Successfully updated cart on server, now update the total price
            updateTotalPrice();
        } else {
            alert('Failed to update cart. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating cart:', error);
        alert('An error occurred while updating the cart.');
    });
}

// Checkout
async function checkoutCart() {
    try {
        // Collect product information from the cart
        const cartItems = document.querySelectorAll('.cart-item');
        const products = Array.from(cartItems).map(item => {
            return {
                productId: item.getAttribute('data-product-id'),
                quantity: parseInt(item.querySelector('input[name="quantity"]').value)
            };
        });

        // Gather address information from the form (if required)
        const city = document.getElementById('shipping-city').value;
        const street = document.getElementById('shipping-address').value;
        const number = document.getElementById('shipping-number').value;

        // Create the checkout data object
        const checkoutData = {
            products: products,
            address: {
                city: city,
                street: street,
                number: number
            }
        };

        // Send a POST request to the server to checkout
        const response = await fetch('/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showSuccessAlert('order-alert');
            // Update cart UI to indicate the cart is now empty
            document.querySelector('.cart-container').innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('total-price').textContent = '₪0.00';
        } else {
            alert('Failed to place order: ' + data.message);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred while placing the order. Please try again.');
    }
}

// Calc total every enter to cart
function recalculateTotal() {
    let totalPrice = 0;

    // Select only cart items that do not have the 'sold-out' class
    const cartItems = document.querySelectorAll('.cart-item:not(.sold-out)');

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.product-price').textContent.replace('₪', ''));
        const quantity = parseInt(item.querySelector('input[name="quantity"]').value, 10);

        totalPrice += price * quantity;
    });

    // Update the total price in the UI
    document.getElementById('total-price').textContent = `₪${totalPrice.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    recalculateTotal();
});

