function showSuccessAlert(id) {
    console.log(id);
    const alertBox = document.getElementById(id);
    alertBox.classList.remove('hidden');
    alertBox.classList.add('visible');

    // Hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('visible');
        alertBox.classList.add('hidden');
    }, 3000);
}


// cart.js

async function placeOrder() {
    // Assuming customerId is provided from the session (rendered in the page)
    const customerId = '<%= user._id %>'; // You need to dynamically inject this in your view

    // Get shipping details
    const city = document.getElementById('shipping-city').value;
    const street = document.getElementById('shipping-address').value;
    const number = document.getElementById('shipping-number').value;
    

    // Validate shipping details
    if (!city || !street || !number) {
        alert('Please fill in all address fields.');
        return;
    }

    // Collect cart products and their quantities
    const products = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.getAttribute('data-product-id');
        const quantity = item.querySelector('input[name="quantity"]').value;

        if (quantity < 1) {
            alert('Quantity cannot be less than 1.');
            return;
        }

        products.push({ productId: Number(productId), quantity: Number(quantity) });
    });

    if (products.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Prepare order data
    const orderData = {
        products,
        address: {
            city,
            street,
            number        }
    };

    try {
        const response = await fetch('/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showSuccessAlert();
        } else {
            alert(result.error || 'Failed to place order.');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order.');
    }
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
