
function showContent(contentId, element) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.menu-option');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Hide all content sections
    const contents = document.querySelectorAll('.content-item');
    contents.forEach(content => content.classList.remove('active'));

    // Add active class to the clicked tab
    element.classList.add('active');

    // Show the corresponding content section
    document.getElementById(contentId).classList.add('active');
}

// Ensure the default tab (Option 1) is shown on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.menu-option.active');
    if (!activeTab) {
        document.querySelector('.menu-option').click();
    }
});

const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');
    if (togglePassword){
        togglePassword.addEventListener('click', function (e) {
            // Toggle the type attribute
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
    
            // Toggle the eye / eye-slash icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

async function showOrderDetails(orderId) {
    const response = await fetch(`/myAccount/orders/${orderId}`);
    const orderDetails = await response.json();

    const detailsContent = document.getElementById('orderDetailsContent');

    detailsContent.innerHTML = 
    `
        <p>Order ID: ${orderDetails.orderId}</p>
        <p>Order Date: ${orderDetails.orderDate}</p>
        <p>Total: ${orderDetails.totalPrice}</p>
        <ul>
            ${orderDetails.products.map(product =>
                `<li>${product.productId} - ${product.quantity}
                </li>`).join('')}
            )}
        </ul>
        `;
    
    document.getElementById('orderDetailsPopup').style.display = 'block';
}

function closeModel(){
    document.getElementById('orderDetailsPopup').style.display = 'none';
}

document.querySelectorAll('.remove-favorite').forEach(icon => {
    icon.addEventListener('click', async () => {
        const productId = icon.getAttribute('data-product-id');

        try {
            const response = await fetch('/personal/myAccount/favorite/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Show success message
                icon.closest('.product-card').remove(); // Remove the product card from the DOM
            } else {
                alert(result.error); // Show error message
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite product.');
        }
    });
});
