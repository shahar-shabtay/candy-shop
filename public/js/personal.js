function showSuccessAlert(id) {
    const successAlert = document.getElementById(id);
    if (successAlert) {
        successAlert.classList.remove('hidden');
        successAlert.classList.add('visible');
    
        setTimeout(() => {
            successAlert.classList.remove('visible');
            successAlert.classList.add('hidden');
        }, 1000);
    }
}

// *****************
// My Account      *
// *****************   

//--------------
// My Deatails  |
//--------------

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

// update user details
if(document.getElementById('submitButton')){
    document.getElementById('submitButton').addEventListener('click', function() {
        showSuccessAlert('save-cust-alert');
        if(document.getElementById('updateForm')){
            document.getElementById('updateForm').submit();
        }  // Submit the form
    })
};

//--------------
// My Favorite  |
//--------------

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
            if(document.querySelector(`#favorite-icon-${productId}`)){
                document.querySelector(`#favorite-icon-${productId}`).classList.add('favorited');
            }
            showSuccessAlert('favorite-alert');
        }
    })
}

// Remove Product From Favorite
async function removeFavorite(productId) {
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
            // Find the closest product card element and remove it
            const productCard = document.querySelector(`[data-product-id="${productId}"]`).closest('.product-card');
            productCard.remove();
            showSuccessAlert('favorite-alert');
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

//--------------
// My Orders    |
//--------------

// fetch order id for details
document.querySelectorAll('.see-order2-btn').forEach(button => {
    button.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
  
      // Redirect the user to the order details page
      window.location.href = `/personal/myAccount/orders/${orderId}`;
    });
});
  

// Dynamic status bar logic
const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const status = document.getElementById('status');
if(status) {
    status = status.innerText;
}
let progress = 0;

// Remove any existing status classes before adding new ones
if(statusBar) {
    statusBar.classList.remove('status-pending', 'status-processing', 'status-shipped', 'status-delivered');
}

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
if(statusBar) {
    statusBar.style.width = progress + "%";
}


// *****************
// *    Admin      *
// *****************

//---------------
// All Customers |
//---------------

// Make all inputs editable
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

// Save new customer details
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
            showSuccessAlert('save-alert');

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


//---------------
// All Orders    |
//---------------

// make the order status editable
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

// Save the new order status
function updateOrderStatus(orderId) {
    const selectedStatus = document.getElementById(`orderStatus-${orderId}`).value;
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
            showSuccessAlert('order-status-alert');
        } else {
            alert('Failed to update status');
        }
    })
}

// Delete the order
document.querySelectorAll('.remove').forEach(icon => {
    icon.addEventListener('click', async () => {
        const orderId = icon.getAttribute('data-order-id');

        try {
            const response = await fetch(`/personal/admin/orders/${orderId}/remove`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId })
            });

            const result = await response.json();
            if (response.ok) {
                showSuccessAlert('delete-alert');
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

document.querySelectorAll('.see-order1-btn').forEach(button => {
    button.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
  
      // Redirect the user to the order details page
      window.location.href = `/personal/admin/orders/${orderId}`;
    });
});

//---------------
// All Products  |
//---------------


// delete product
function deleteProduct(productId) {
    const imagePath = `/public/images/product_${productId}.svg`;
    
    fetch(`/personal/admin/products/${productId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imagePath })
    })
    .then(response => {
        if (response.ok) {
            document.querySelector(`[data-product-id="${productId}"]`).remove(); // Remove product card from view
            showSuccessAlert('delete-alert');
        } else {
            return response.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message);
                } catch {
                    throw new Error('Unexpected response: ' + text);
                }
            });
        }
    })
    .catch(error => {
        alert('Error deleting product: ' + error.message);
    });
}

// edit product
function editProduct(productId) {
    // Select the correct product card using the provided productId
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        return;
    }

    // Find all input fields within the product card
    const inputs = productCard.querySelectorAll('input');

    // Check if the inputs exist and make them editable
    if (inputs.length === 0) {
        console.error('No input fields found in product card for ID:', productId);
    } else {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.classList.add('editable');  // Add a class to indicate that the input is now editable
        });
    }

    // Change the edit button to a save button
    const editButton = productCard.querySelector('.edit-btn');
    if (editButton) {
        editButton.src = '/public/images/save.svg'; // Change icon to save
        editButton.onclick = () => saveProduct(productId); // Assign save function to the button
    } else {
        console.error('Edit button not found in product card for ID:', productId);
    }
}

// save product
function saveProduct(productId) {

    // Select the correct product card using the productId
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        return;
    }

    // Get values from the inputs using the correct class selectors
    const name = productCard.querySelector('.product-name')?.value;
    const price = productCard.querySelector('.product-price')?.value;
    const description = productCard.querySelector('.product-description')?.value;
    const inventory = productCard.querySelector('.product-inventory')?.value;


    // Check if any of the values are null or undefined
    if ([name, price, description, inventory].some(value => value === undefined || value === null || value === '')) {
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
                showSuccessAlert('save-alert');
                const inputs = productCard.querySelectorAll('input');
                inputs.forEach(input => {
                    input.setAttribute('readonly', 'readonly');
                    input.classList.remove('editable');
                });

                // Change the save button back to an edit button
                const editButton = productCard.querySelector('.edit-btn');
                if (editButton) {
                    editButton.src = '/public/images/edit.svg'; // Change icon back to edit
                    editButton.onclick = () => editProduct(productId); // Reassign the edit function
                } else {
                    console.error('Edit button not found in product card for ID:', productId);
                }

            } else {
                alert('Failed to update product');
            }
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('An error occurred while updating the product. Please try again.');
        });
}


//---------------
// Add Products  |
//---------------
// JavaScript function to update the live preview of the product details

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const inventoryInput = document.getElementById('inventory');
    const descriptionInput = document.getElementById('description');
    const categoryInput = document.getElementById('category');
    const fileInput = document.getElementById('fileInput');

    const previewName = document.getElementById('previewName');
    const previewPrice = document.getElementById('previewPrice');
    const previewInventory = document.getElementById('previewInventory');
    const previewDescription = document.getElementById('previewDescription');
    const previewCategory = document.getElementById('previewCategory');
    const previewImage = document.getElementById('previewImage');

    // Update the name in the preview card
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            previewName.textContent = nameInput.value || 'Product Name';
        });
    }

    // Update the price in the preview card
    if (priceInput) {
        priceInput.addEventListener('input', () => {
            previewPrice.textContent = priceInput.value ? `${priceInput.value}₪` : 'Price: $0';
        });
    }

    // Update the inventory in the preview card
    if (inventoryInput) {
        inventoryInput.addEventListener('input', () => {
            previewInventory.textContent = inventoryInput.value ? `${inventoryInput.value} items` : 'Inventory: 0 items';
        });
    }

    // Update the description in the preview card
    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
            previewDescription.textContent = descriptionInput.value || 'Description';
        });
    }

    // Update the category in the preview card
    if (categoryInput) {
        categoryInput.addEventListener('input', () => {
            previewCategory.textContent = categoryInput.value || 'Category';
        });
    }

    // Update the image in the preview card
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file && file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '/public/images/upload.svg';
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
                showSuccessAlert('success-alert'); // Show success alert
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



