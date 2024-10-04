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




// Function to update quantity in the cart and update the total price
function updateQuantity(inputElement) {
    const productId = inputElement.getAttribute('data-item-id');
    const newQuantity = parseInt(inputElement.value);
    
    if (newQuantity < 1) {
        inputElement.value = 1; // Ensure the quantity doesn't go below 1
        return;
    }

    // Send AJAX request to update quantity on the server
    fetch(`/cart/updateQuantity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
            quantity: newQuantity,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // Update the total price for the product
            const itemTotalElement = document.querySelector(`#cart-item-${productId} .total`);
            const newTotal = (data.price * newQuantity).toFixed(2);
            itemTotalElement.innerHTML = `₪${newTotal}`;

            // Update the overall total price in the summary
            updateTotalPrice();
        } else {
            alert('Failed to update the quantity. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error updating quantity:', error);
    });
}

// Function to update the total price in the summary
function updateTotalPrice() {
    let totalPrice = 0;

    document.querySelectorAll('.cart-item').forEach((item) => {
        const itemTotal = parseFloat(item.querySelector('.total').textContent.replace('₪', ''));
        totalPrice += itemTotal;
    });

    // Update the total price in the summary
    document.querySelector('.summary-total span:nth-child(2)').innerHTML = `₪${totalPrice.toFixed(2)}`;
}
