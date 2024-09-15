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
// Ensure the default tab (Option 1) is shown on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.menu-option.active');
    if (!activeTab) {
        document.querySelector('.menu-option').click();
    }

    // Check if togglePassword and password elements exist
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (togglePassword && password) { // Only add event listener if both elements exist
        togglePassword.addEventListener('click', function (e) {
            // Toggle the type attribute
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            // Toggle the eye / eye-slash icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});


// Function to toggle between edit and save mode
function toggleEditMode(customerId) {
    const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
    const inputs = customerRow.querySelectorAll('.customer-input');
    console.log("Toggle Edit Mode for Customer ID:", customerId);

    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editable')
    });
    const editButton = customerRow.querySelector('.edit-btn-cust');
    const saveButton = customerRow.querySelector('.save-btn-cust');

    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    
}

function saveCustomer(customerId) {
    const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
    const inputs = customerRow.querySelectorAll('.customer-input'); // Get all inputs in the customer row

    console.log("Save Mode for Customer ID:", customerId); // Debugging

    const customerData = {};
    inputs.forEach(input => {
        customerData[input.name] = input.value; // Create a dynamic object with field names as keys and input values
        input.setAttribute('readonly', 'true'); // החזרת readonly לשדות לאחר השמירה
        input.classList.remove('editable'); // הסרת מחלקת עיצוב לשדות
    });
    console.log('Customer Data to Save:', customerData);

    // Send the data to the server using fetch
    fetch(`/admin/customers/update/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData), // Send the customer data as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Customer updated successfully:', data.customer);
            const editButton = customerRow.querySelector('.edit-btn-cust');
            const saveButton = customerRow.querySelector('.save-btn-cust');

            editButton.style.display = 'block';  
            saveButton.style.display = 'none';

        } else {
            console.error('Error updating customer:', data.message);
        }
    })
    .catch(error => {
        console.error('Error with the server request:', error);
    });
}