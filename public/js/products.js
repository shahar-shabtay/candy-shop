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

