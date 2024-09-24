
// Function to save customer details
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

// Dunction to dfetch and save customer details
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
            console.log("Customer updated successfully");

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

// Function to see order details
document.querySelectorAll('.see-order-btn').forEach(button => {
    button.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      console.log('Redirecting to order details for order ID:', orderId);
  
      // Redirect the user to the order details page
      window.location.href = `/personal/admin/orders/${orderId}`;
    });
});

// Dynamic status bar logic
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

// Enable the status dropdown for editing
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

// Function to save the updated status
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

// function to delete order from db
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
                alert(result.message); // Show success message
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

// fetch product id to remove product
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


// Function to enable editing of a product
function editProduct(productId) {

    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId); // Error if no product card is found
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


function saveProduct(productId) {
    console.log('Saving product with ID:', productId); // Debug

    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        return;
    }

    // Get values from the inputs
    const name = productCard.querySelector('.product-input-name') ? productCard.querySelector('.product-input-name').value : null;
    const price = productCard.querySelector('.product-input[name="price"]') ? productCard.querySelector('.product-input[name="price"]').value : null;
    const description = productCard.querySelector('.product-input[name="description"]') ? productCard.querySelector('.product-input[name="description"]').value : null;
    const inventory = productCard.querySelector('.product-input[name="inventory"]') ? productCard.querySelector('.product-input[name="inventory"]').value : null;

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
            alert('Product updated successfully');

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
        } else {
            alert('Failed to update product');
        }
    })
    .catch(error => {
        console.error('Error updating product:', error);
    });
}


// add new product
async function submitProduct() {
    console.log('submitProduct function triggered'); // Debug point 1

    const form = document.getElementById('productForm');
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();

    // Get file from the input
    const file = fileInput.files[0];

    if (!file) {
        console.error('No file selected'); // Debug point 2
        alert('Please select a file');
        return;
    }

    console.log('File selected:', file.name); // Debug point 3

    // Append the file to formData
    formData.append('image', file);

    // Get other product details
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const inventory = document.getElementById('inventory').value;

    console.log('Adding form data fields...'); // Debug point 4

    // Add other form fields to formData
    formData.append('name', name);
    formData.append('price', price);
    formData.append('inventory', inventory);

    // Log form data content
    console.log('Form data content before submission:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);  // Log each key-value pair in FormData
    }

    try {
        // Send formData to the server for both file upload and form submission
        const response = await fetch('/personal/admin/addProducts', {
            method: 'POST',
            body: formData
        });

        console.log('Server response status:', response.status); // Debug point 5

        if (!response.ok) {
            console.error('Error:', response.statusText);
            return;
        }

        const data = await response.json();

        console.log('Server response data:', data); // Debug point 6

        if (data.success) {
            alert('Product created successfully');
        } else {
            alert('Error creating product: ' + data.message);
        }
    } catch (error) {
        console.error('Error uploading file or submitting product:', error); // Debug point 7
    }
}

