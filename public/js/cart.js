document.addEventListener('DOMContentLoaded', () => {
    recalculateTotal();

    // Bind update button click events to updateCart function
    const updateButtons = document.querySelectorAll('.update-button');
    updateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const form = button.closest('form');
            const productId = form.querySelector('input[name="productId"]').value;
            const quantityInput = form.querySelector('input[name="quantity"]');
            const quantity = parseInt(quantityInput.value);
            updateCart(productId, quantity);
        });
    });
});

// Function to update the quantity of a specific item and recalculate the total price
function updateCart(itemId, newQuantity) {
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
            // Successfully updated cart on server, now update the total price and refresh
            window.location.reload();
        } else {
            alert('Failed to update cart. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating cart:', error);
        alert('An error occurred while updating the cart.');
    });
}

// Function to update the total price of all items in the cart
function updateTotalPrice() {
    let totalPrice = 0;
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector("input[name='quantity']").value);
        const price = parseFloat(item.querySelector(".product-price").textContent.replace('₪', ''));
        totalPrice += price * quantity;
    });

    document.getElementById("total-price").textContent = `₪${totalPrice.toFixed(2)}`;
}

// Checkout function
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

// Recalculate the total price every time the page is loaded
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
