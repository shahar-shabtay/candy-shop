// Functio to show a success alert of actions.
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

// Functio to show a error alert of actions.
function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'jump-alert';
    alertDiv.innerHTML = `
        <span class="close-alert">&times;</span>
        ${message.replace(/\n/g, '<br>')}
    `;
    document.body.appendChild(alertDiv);
    const lineCount = message.split('\n').length;
    const displayDuration = lineCount * 1000; 
    const closeButton = alertDiv.querySelector('.close-alert');
    closeButton.addEventListener('click', () => {
        alertDiv.classList.add('fade-out');
    });

    setTimeout(() => {
        alertDiv.classList.add('fade-out');
    }, displayDuration);

    alertDiv.addEventListener('transitionend', () => {
        if (alertDiv.classList.contains('fade-out')) {
            alertDiv.remove();
        }
    });
}

// Event listener for recalc the total price of the cart in case of changing the wuantity.
document.addEventListener('DOMContentLoaded', () => {
    recalculateTotal();

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
            showSuccessAlert('update-cart-alert');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
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
        const priceElement = item.querySelector(".cart-product-price");
        const price = parseFloat(priceElement ? priceElement.textContent : 0);
        
        if (!isNaN(price) && !isNaN(quantity)) {
            totalPrice += price * quantity;
        }
    });

    const totalElement = document.getElementById("total-price");
    const selectedCurrency = document.getElementById('currency-selector') ? document.getElementById('currency-selector').value : 'ILS';

    let currencySymbol = '₪'; 
    if (selectedCurrency === 'USD') {
        currencySymbol = '$';
    } else if (selectedCurrency === 'EUR') {
        currencySymbol = '€';
    }

    if (totalElement) {
        totalElement.textContent = `${totalPrice.toFixed(2)}${currencySymbol}`; 
    }
}

// Checkout function
async function checkoutCart() {
    try {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalPrice = 0;
        const products = Array.from(cartItems).reduce((filteredProducts, item) => {
            const productId = item.getAttribute('data-product-id');
            const quantity = parseInt(item.querySelector('input[name="quantity"]').value);
            const inventory = parseInt(item.getAttribute('data-inventory'));
            const price = parseFloat(item.querySelector('.cart-product-price').textContent);

            if (inventory > 0 && quantity > 0) {
                if (quantity > inventory) {
                    showErrorAlert(`The quantity for product ID ${productId} exceeds available inventory. Please adjust the quantity.`);
                    throw new Error(`Insufficient inventory for product ID ${productId}`);
                }
                totalPrice += price * quantity;
                filteredProducts.push({ productId: productId, quantity: quantity });
            }
            return filteredProducts;
        }, []);

        if (totalPrice === 0 || products.length === 0) {
            showErrorAlert('No valid products in the cart to checkout. Please add items to the cart.');
            return;
        }

        const city = document.getElementById('shipping-city').value;
        const street = document.getElementById('shipping-street').value;
        const number = document.getElementById('shipping-number').value;

        if (!city || !street || !number) {
            alert('Please fill in all address fields.');
            return;
        }

        const checkoutData = {
            products: products,
            address: { city: city, street: street, number: number }
        };

        const response = await fetch('/cart/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkoutData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showSuccessAlert('checkout-alert');
            document.querySelector('.cart-container').innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('total-price').textContent = '0.00';
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred while placing the order. Please try again.');
    }
}


// Recalculate the total price every time the page is loaded
function recalculateTotal() {
    let totalPrice = 0;

    const cartItems = document.querySelectorAll('.cart-item:not(.sold-out)');

    cartItems.forEach(item => {
        const priceElement = item.querySelector('.cart-product-price');
        const price = parseFloat(priceElement ? priceElement.textContent : 0);
        const quantityElement = item.querySelector('input[name="quantity"]');
        const quantity = parseInt(quantityElement ? quantityElement.value : 0, 10);

        if (!isNaN(price) && !isNaN(quantity)) {
            totalPrice += price * quantity;
        }
    });

    const totalElement = document.getElementById("total-price");
    const selectedCurrency = document.getElementById('currency-selector') ? document.getElementById('currency-selector').value : 'ILS';

    let currencySymbol = '₪';
    if (selectedCurrency === 'USD') {
        currencySymbol = '$';
    } else if (selectedCurrency === 'EUR') {
        currencySymbol = '€';
    }

    if (totalElement) {
        totalElement.textContent = `${totalPrice.toFixed(2)}${currencySymbol}`;
    }
}