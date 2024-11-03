
function showSuccessAlert(id) {
    const successAlert = document.getElementById(id);
    if (successAlert) {
        successAlert.classList.remove('hidden');
        successAlert.classList.add('visible');
    
        
        setTimeout(() => {
            successAlert.classList.remove('visible');
            successAlert.classList.add('hidden');
        }, 3000);
    }
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
        if (data.message === 'Product added to cart') {
            showSuccessAlert('prod-add-cart-alert');
        } else if (data.message === 'Product is already in the cart') {
            showSuccessAlert('prod-exe-cart-alert');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Add Product To Favorite
function addToFavorites(productId) {
    fetch('/products/addFav', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId }),
    })
    .then(response =>{
        if(response.ok) {
            showSuccessAlert('prod-add-favorite-alert');
            if(document.querySelector(`#favorite-icon-${productId}`)){
                document.querySelector(`#favorite-icon-${productId}`).classList.add('favorited');
            }
        }
    })
}

