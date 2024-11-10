// Raise Error alerts.
function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'jump-alert';
    alertDiv.innerHTML = `
        <span class="close-alert">&times;</span>
        ${message.replace(/\n/g, '<br>')}
    `;

    // Append the alert div to the body
    document.body.appendChild(alertDiv);

    // Calculate the duration based on the number of lines (1 second per line)
    const lineCount = message.split('\n').length;
    const displayDuration = lineCount * 1000; // Duration in milliseconds

    // Close button functionality
    const closeButton = alertDiv.querySelector('.close-alert');
    closeButton.addEventListener('click', () => {
        alertDiv.classList.add('fade-out');
    });

    // Automatically remove the alert after the calculated display duration
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
    }, displayDuration);

    // Remove the alert after fade-out transition
    alertDiv.addEventListener('transitionend', () => {
        if (alertDiv.classList.contains('fade-out')) {
            alertDiv.remove();
        }
    });
}

// Validate the register form
async function register(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const customerId = document.getElementById('customerId').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;

    let errorMessage = '';
    let isValid = true;
    
    if(!name || !email || !customerId || !phone || !password || !birthdate || !city || !street || !number) {
        isValid = false;
        errorMessage += "All field are required!\n";
    }

    if (name && !isNaN(name)) {
        isValid = false;
        errorMessage += "Name should contain only letters.\n";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailPattern.test(email)) {
        isValid = false;
        errorMessage += "Invalid email format.\n";
    }

    if (customerId && !/^\d{9}$/.test(customerId)) {
        isValid = false;
        errorMessage += 'ID must  be exactly 9 digits.\n';
    }

    const phonePattern = /^(050|055|054|058|053|052)\d{7}$/;
    if (phone && !phonePattern.test(phone)) {
        isValid = false;
        errorMessage += "Phone number must be 10 digits and start with 0.\n";
    }

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (password && !passwordPattern.test(password)) {
        isValid = false;
        errorMessage += "Password must be at least 6 characters long and include at least one letter and one number.\n";
    }

    const birthYear = new Date(birthdate).getFullYear();
    if (birthdate && birthYear > 2014) {
        isValid = false;
        errorMessage += "You are too young. You need to be 10 years old!\n";
    }

    if (city && !/^[a-zA-Z\s]+$/.test(city)) {
        isValid =false;
        errorMessage += "City should contain only letters.\n";
    }

    if (street && !/^[a-zA-Z\s]+$/.test(street)) {
        isValid =false;
        errorMessage += "Street should contain only letters.\n";
    }

    if (number && !/^\d+$/.test(number)) {
        isValid = false;
        errorMessage += "Home number should be a valid number.\n";
    }

    if(isValid) {
        const data = {
            name,
            email,
            customerId,
            phone,
            password,
            birthdate,
            city,
            street,
            number
        }

        // Submit form data with fetch
        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href='/';
            } else {
                const result = await response.json();
                showErrorAlert(result.message || "Registration failed.");
            }
        } catch (error) {
            showErrorAlert("An error occurred: " + error.message);
        }
    } else {
        showErrorAlert(errorMessage);
    }
}