document.querySelectorAll('.favorite').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-product-id');

        try {
            const response = await fetch('/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
            });

            const result = await response.json();
            if (response.ok) {
                button.textContent = 'Added to Favorites'; // Change button text
                button.disabled = true; // Disable button if needed
            } else {
                alert(result.error); // Show error message if the product is already a favorite
            }
        } catch (error) {
            console.error('Error adding favorite:', error);
            alert('Failed to add favorite product.');
        }
    });
});



document.querySelectorAll('.card').forEach(card => {
    const quantityInput = card.querySelector('.quantity');
    const increaseButton = card.querySelector('.increase');
    const decreaseButton = card.querySelector('.decrease');

    // Event listener for increasing quantity
    increaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Event listener for decreasing quantity
    decreaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
});