function showSuccessAlert(id) {
    const alertBox = document.getElementById(id);
    alertBox.classList.remove('hidden');
    alertBox.classList.add('visible');

    // Hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('visible');
        alertBox.classList.add('hidden');
    }, 3000);
}

function addToFavorites(productId) {
    fetch('/products/addFav', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added to favorites!');
            // Optionally, you can change the heart icon to indicate it's favorited
            document.querySelector(`#favorite-icon-${productId}`).classList.add('favorited');
        } else {
            alert('Failed to add product to favorites: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error adding product to favorites:', error);
        alert('Error adding product to favorites.');
    });
}




function updateQuantity(productId, change, event) {
    // Prevent event from bubbling
    event.stopPropagation();

    // Get the quantity input field
    const quantityInput = document.getElementById(`quantity-${productId}`);
    
    // Parse the current value and update it based on the change
    let currentQuantity = parseInt(quantityInput.value);

    // Update the quantity by 1
    currentQuantity += change;

    // Ensure the quantity does not go below 1
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    // Update the input field with the new value
    quantityInput.value = currentQuantity;
}



function addToCart(button) {
    const productId = button.getAttribute('data-product-id');
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput.value;

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessAlert('cart-alert');
            // Optionally show a confirmation or update the cart UI
        }
    })
    .catch(error => console.error('Error:', error));
}

