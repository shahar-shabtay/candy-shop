// for the sub menu
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

// make the password readable and ubreadable
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

// fetch product id fro remove favorite
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


// fetch order id for details
document.querySelectorAll('.see-order-btn').forEach(button => {
    button.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      console.log('Redirecting to order details for order ID:', orderId);
  
      // Redirect the user to the order details page
      window.location.href = `/personal/myAccount/orders/${orderId}`;
    });
});
  

// Dynamic status bar logic
const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const status = document.getElementById('status').innerText;
let progress = 0;

// Remove any existing status classes before adding new ones
statusBar.classList.remove('status-pending', 'status-processing', 'status-shipped', 'status-delivered');

switch (status) {
    case "Pending":
        progress = 25;
        statusBar.classList.add('status-pending');
        break;
    case "Processing":
        progress = 50;
        statusBar.classList.add('status-processing');
        break;
    case "Shipped":
        progress = 75;
        statusBar.classList.add('status-shipped');
        break;
    case "Delivered":
        progress = 100;
        statusBar.classList.add('status-delivered');
        break;
    default:
        progress = 0;
}


// Set the width of the progress bar based on the progress percentage
statusBar.style.width = progress + "%";

// update user details
document.getElementById('submitButton').addEventListener('click', function() {
    document.getElementById('updateForm').submit();  // Submit the form
});

// change order status
// Enable the status dropdown for editing




