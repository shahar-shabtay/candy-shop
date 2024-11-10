
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
    event.stopPropagation();
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }
    const maxQuantity = parseInt(quantityInput.getAttribute('max'), 10);

    if (currentQuantity > maxQuantity) {
        currentQuantity = maxQuantity;
    }

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
            showSuccessAlert('add-cart-alert');
        } else if (data.message === 'Product is already in the cart') {
            showSuccessAlert('exe-cart-alert');
        }
    })
    .catch(error => console.error('Error:', error));
}