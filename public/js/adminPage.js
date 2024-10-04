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

function showErrorAlert() {
    const alertBox = document.getElementById('error-alert');
    alertBox.classList.remove('hidden');
    alertBox.classList.add('visible');

    // Hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('visible');
        alertBox.classList.add('hidden');
    }, 3000);
}
// All customers
//---------------
function toggleEditMode(customerId) {
    const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
    const editButton = customerRow.querySelector('.edit-btn-cust');
    const saveButton = customerRow.querySelector('.save-btn-cust');

    // Toggle visibility: Hide edit button, show save button
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';

    // Enable inputs
    const inputs = customerRow.querySelectorAll('.customer-input');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.removeAttribute('disabled');
        } else {
            input.removeAttribute('readonly');
        }
        input.classList.add('editable');
    });

    // Add background color to row in edit mode
    customerRow.classList.add('edit-mode');
}

function saveCustomer(customerId) {
    const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
    const editButton = customerRow.querySelector('.edit-btn-cust');
    const saveButton = customerRow.querySelector('.save-btn-cust');

    // Toggle visibility: Show edit button, hide save button
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';

    // Collect data and disable inputs
    const inputs = customerRow.querySelectorAll('.customer-input');
    const customerData = {};
    inputs.forEach(input => {
        customerData[input.name] = input.value;
        if (input.tagName === 'SELECT') {
            input.setAttribute('disabled', 'true');
        } else {
            input.setAttribute('readonly', 'true');
        }
        input.classList.remove('editable');
    });

    // Log the data to check if the values are correct
    console.log("Saving customer data:", customerData);

    // Send the data to the server using fetch
    fetch(`/personal/admin/customers/update/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessAlert();

            // Remove background color when exiting edit mode
            customerRow.classList.remove('edit-mode');
        } else {
            console.error('Error updating customer:', data.message);
        }
    })
    .catch(error => {
        console.error('Error with the server request:', error);
    });
}

// All Orders
//-------------
document.querySelectorAll('.see-order-btn').forEach(button => {
    button.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      console.log('Redirecting to order details for order ID:', orderId);
  
      // Redirect the user to the order details page
      window.location.href = `/personal/admin/orders/${orderId}`;
    });
});

const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
if (statusBar && statusText) {
    const status = document.getElementById('status').innerText;
    let progress = 0;

// Remove any existing status classes before adding new ones
    statusBar.classList.remove('status-pending', 'status-processing', 'status-shipped', 'status-delivered', 'status-cancelled');

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
    case "Cancelled":
        progress = 100;
        statusBar.classList.add('status-cancelled');
        break;
    default:
        progress = 0;
    }

    // Set the width of the progress bar based on the progress percentage
    statusBar.style.width = progress + "%";
}

function enableStatusEdit(orderId) {
    const statusSelect = document.getElementById(`orderStatus-${orderId}`);
    const saveButton = document.getElementById(`saveStatusButton-${orderId}`);
    const editButton = document.getElementById(`editStatusButton-${orderId}`);

    // Enable the <select> dropdown
    statusSelect.disabled = false;

    // Show the Save button, hide the Edit button
    saveButton.style.display = 'inline-block';
    editButton.style.display = 'none';
}

function updateOrderStatus(orderId) {
    const selectedStatus = document.getElementById(`orderStatus-${orderId}`).value;
    console.log('Updating status to:', selectedStatus, 'for order ID:', orderId);
    // Make a PUT request to update the order status
    fetch(`/personal/admin/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus: selectedStatus }) // Send the updated status
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
            // Disable the <select> dropdown after saving
            const statusSelect = document.getElementById(`orderStatus-${orderId}`);
            statusSelect.disabled = true;

            // Reset the buttons: Hide Save, show Edit
            document.getElementById(`saveStatusButton-${orderId}`).style.display = 'none';
            document.getElementById(`editStatusButton-${orderId}`).style.display = 'inline-block';
            
        } else {
            alert('Failed to update status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating status');
    });
}

document.querySelectorAll('.remove').forEach(icon => {
    icon.addEventListener('click', async () => {
        const orderId = icon.getAttribute('data-order-id');

        try {
            const response = await fetch('/personal/admin/orders/remove', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId })
            });

            const result = await response.json();
            if (response.ok) {
                window.location.href = `/personal/admin/orders`;
            } else {
                alert(result.error); // Show error message
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite product.');
        }
    });
});


// All Products
// -------------

// delete product
document.querySelectorAll('.remove-product').forEach(icon => {
    icon.addEventListener('click', async () => {
        const productId = icon.getAttribute('data-product-id');

        try {
            const response = await fetch('/personal/admin/products/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
            });

            const result = await response.json();

            console.log(response); // Debug the response here

            if (response.ok && result.success) {
                
                icon.closest('.card').remove(); // Remove the product card from the DOM
                showSuccessAlert('delete-alert');
            } else {
                alert(result.error); // Show error message
            }
        } catch (error) {
            console.error('Error removing product:', error);
            alert('Failed to remove product.');
        }
    });
});

// edit product
function editProduct(productId) {
    // Use the correct class name for the card
    const productCard = document.querySelector(`.card[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        return;
    }

    const inputs = productCard.querySelectorAll('input');

    // Change all inputs to be editable
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editable');
    });

    // Change the edit button to a save button
    const editButton = productCard.querySelector('.edit-btn');
    editButton.src = '/public/images/save.svg'; // Change icon to save
    editButton.onclick = () => saveProduct(productId); // Assign save function to the button
}

// save product
function saveProduct(productId) {
    console.log('Saving product with ID:', productId); // Debug

    const productCard = document.querySelector(`.card[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        return;
    }

    // Get values from the inputs using correct class selectors
    const name = productCard.querySelector('input[name="name"]') ? productCard.querySelector('input[name="name"]').value : null;
    const price = productCard.querySelector('input[name="price"]') ? productCard.querySelector('input[name="price"]').value : null;
    const description = productCard.querySelector('input[name="description"]') ? productCard.querySelector('input[name="description"]').value : null;
    const inventory = productCard.querySelector('input[name="inventory"]') ? productCard.querySelector('input[name="inventory"]').value : null;

    console.log('Product data to save:', { name, price, description, inventory }); // Debug

    // If any value is null, log an error and return
    if (!name || !price || !description || !inventory) {
        console.error('Missing product details:', { name, price, description, inventory });
        return;
    }

    // Send updated product data to the server
    fetch(`/personal/admin/products/${productId}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, description, inventory }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Make inputs readonly again after saving
            const inputs = productCard.querySelectorAll('input');
            inputs.forEach(input => {
                input.setAttribute('readonly', 'readonly');
                input.classList.remove('editable');
            });

            // Change the save button back to an edit button
            const editButton = productCard.querySelector('.edit-btn');
            editButton.src = '/public/images/edit.svg'; // Change icon back to edit
            editButton.onclick = () => editProduct(productId); // Reassign the edit function
            showSuccessAlert('success-alert');
        } else {
            alert('Failed to update product');
        }
    })
    .catch(error => {
        console.error('Error updating product:', error);
    });
}




// Add Product
// ------------
// Function to handle live preview updates
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const previewName = document.getElementById('previewName');
    const previewPrice = document.getElementById('previewPrice');
    const previewInventory = document.getElementById('previewInventory');
    const previewImage = document.getElementById('previewImage');
    const fileInput = document.getElementById('fileInput');

    if (productForm && previewPrice && previewName) {
    // Update name, price, and inventory in live preview
        productForm.name.addEventListener('input', function () {
            previewName.textContent = this.value || 'Product Name';
        });

        productForm.price.addEventListener('input', function () {
            previewPrice.textContent = this.value ? `Price: $${this.value}` : 'Price: $0';
        });

        productForm.inventory.addEventListener('input', function () {
            previewInventory.textContent = this.value ? `Inventory: ${this.value} items` : 'Inventory: 0 items';
        });

        // Handle live image preview for SVG files
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file && file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '/public/images/upload.svg'; // Default image if no valid SVG
            }
        });
    }
});

async function submitProduct(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const form = document.getElementById('productForm');
    const formData = new FormData(form); // Get form data, including the file

    // Disable the submit button to prevent multiple submissions
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;

    try {
        const response = await fetch('/personal/admin/addProducts', {
            method: 'POST',
            body: formData, // Send the form data
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                showSuccessAlert(); // Show success alert
                setTimeout(() => {
                    window.location.href = '/personal/admin/products'; // Redirect after 2 seconds
                }, 2000);
            } else {
                showErrorAlert();
                submitButton.disabled = false; // Re-enable submit button if there's an error
            }
        } else {
            throw new Error('Error submitting the product');
        }
    } catch (error) {
        console.error('Error submitting product:', error);
        alert('Error: ' + error.message);
        submitButton.disabled = false; // Re-enable the submit button on error
    }
}

// Attach submit event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', submitProduct);
    }
});

